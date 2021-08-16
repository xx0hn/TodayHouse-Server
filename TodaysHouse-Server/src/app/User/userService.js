const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
// const regexURL = /(https)\:[/][/]+([\w\-])+$/;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

//유저 생성
exports.createUser = async function (email, passWord, passWordCheck, nickName) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(passWord)
            .digest("hex");
        //확인 비밀번호 암호화
        const hashedPasswordCheck = await crypto
            .createHash("sha512")
            .update(passWordCheck)
            .digest("hex");
        //비밀번호 확인
        if(hashedPassword!=hashedPasswordCheck){
            return errResponse(baseResponse.SIGNUP_PASSWORD_CHECK_NOT_MATCH);
        }
        //닉네임 중복 확인
        const nickNameRows = await userProvider.nickNameCheck(nickName);
        if(nickNameRows.length>0){
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }

        const insertUserInfoParams = [email, hashedPassword, nickName];

        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
// 로그인
exports.postSignIn = async function (email, passWord) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(passWord)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
        if (passwordRows.length < 1){
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);

        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].id) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};



//카카오 소셜 회원 가입
exports.createSocialUser = async function (name, email, loginStatus) {
    try {
        // email 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0) return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);
        const nickNameRows = await userProvider.nickNameCheck(name);
        if(nickNameRows.length>0){
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        }

        const insertSocialUserInfoParams = [name, email, loginStatus];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertSocialUserInfo(
            connection,
            insertSocialUserInfoParams,
        );
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === 'INACTIVE') {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === 'DELETED') {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//프로필 이미지 수정
exports.patchProfileImage = async function(editInfo, userId) {
    try {
            const connection = await pool.getConnection(async (conn) => conn);
            const patchProfileImage = await userDao.patchProfileImage(connection, editInfo, userId);
            connection.release();
            return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchProfileImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//배경 이미지 수정
exports.patchBackgroundImage = async function(editInfo, userId) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchBackgroundImage = await userDao.patchBackgroundImage(connection, editInfo, userId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - patchBackgroundImage Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//닉네임 수정
exports.patchNickName = async function(editInfo, userId) {
    try {
        const nickNameCheck = await userProvider.nickNameCheck(editInfo);
        if (nickNameCheck.length > 0) {
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);
        } else {
            const connection = await pool.getConnection(async (conn) => conn);
            const patchNickName = await userDao.patchNickName(connection, editInfo, userId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch (err) {
        logger.error(`App - patchNickName Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//MyURL 수정
exports.patchMyUrl = async function(editInfo, userId) {
    try {
        // if (!regexURL.test(editInfo))
        //     return errResponse(baseResponse.USER_MY_URL_TYPE_ERROR);
         {
            const connection = await pool.getConnection(async (conn) => conn);
            const patchMyUrl = await userDao.patchMyUrl(connection, editInfo, userId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch (err) {
        logger.error(`App - patchMyUrl Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//한줄소개 수정
exports.patchIntro = async function(editInfo, userId){
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const patchIntro = await userDao.patchIntro(connection, editInfo, userId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchIntroduce Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 유저 수정
exports.editUser = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
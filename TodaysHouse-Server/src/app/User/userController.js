const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const regexPW = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 숫자 + 영문
const {emit} = require("nodemon");

const axios = require('axios');
const secret_config = require('../../../config/secret');
const jwt = require('jsonwebtoken');
const { logger } = require('../../../config/winston');
const baseResponseStatus = require('../../../config/baseResponseStatus');



/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/sign-up
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, passwordCheck, nickname
     */
    const {email, passWord, passWordCheck, nickName} = req.body;
    // var num=passWord.search(/[0-9]/g);
    // var eng=passWord.search(/[a-z]/gi);
    // 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));
    // 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    //빈 값 체크
    if (!passWord)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if(passWord.length<8)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    else if (!regexPW.test(passWord)) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_VAL));
    }
    if(!passWordCheck)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));
    if(!nickName)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if(nickName.length>10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));


    const signUpResponse = await userService.createUser(
        email,
        passWord,
        passWordCheck,
        nickName
    );

    return res.send(signUpResponse);
};

// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsWord
 */
exports.login = async function (req, res) {

    const {email, passWord} = req.body;

    if(!email) return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if(email.length>30) return res.send(response(baseResponse.SIGNIN_EMAIL_LENGTH));
    if(!regexEmail.test(email)) return res.send(response(baseResponse.SIGNIN_EMAIL_ERROR_TYPE));

    if(!passWord) return res.send(response(baseResponse.SIGNIN_PASSWORD_EMPTY));
    if(passWord.length<8) return res.send(response(baseResponse.SIGNIN_PASSWORD_LENGTH))

    const signInResponse = await userService.postSignIn(email, passWord);

    return res.send(signInResponse);
};

/**
 * API No. 3
 * API Name : 유저 마이페이지 조회 API
 * [GET] /app/users/:userId/mypages
 */
exports.getMyPages = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const result=[];
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId){
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    }
    else{
        const getMyPages = await userProvider.getMyPages(userId);
        const getPictures = await userProvider.getPictures(userId);
        for(let i=0; i<8; i++){
            const getUserPictures = await userProvider.getUserPictures(userId, i+1);
            getPictures.push(getUserPictures);
        }
        const getScrapBook = await userProvider.getScrapBook(userId);
        const countScrapBook = await userProvider.countScrapBook(userId);
        countScrapBook.push(getScrapBook);
        const getHouseWarm = await userProvider.getHouseWarm(userId);
        const countHouseWarm = await userProvider.countHouseWarm(userId);
        countHouseWarm.push(getHouseWarm);
        const getKnowHow = await userProvider.getKnowHow(userId);
        const countKnowHow = await userProvider.countKnowHow(userId);
        countKnowHow.push(getKnowHow)
        result.push({MyPageInfo: getMyPages, Pictures: getPictures
                , AmountScrapBook: countScrapBook
                , AmountHouseWarm: countHouseWarm
                , AmountKnowHow: countKnowHow});
        return res.send(response(baseResponse.SUCCESS, result));
    }
}

/**
 * API No. 4
 * API Name : 다른 유저 페이지 조회 API
 * [GET] /app/users/:userId/profiles
 */
exports.getOtherProfiles = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {usersId} = req.body;
    const result =[];
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!usersId) return res.send(response(baseResponse.TARGET_USER_USERID_EMPTY));

    const userPageInfo = await userProvider.userPageInfo(usersId);
    const countPictures = await userProvider.countPictures(usersId);
    const getPictures = await userProvider.getPictures(usersId);
    for(let i=0; i<8; i++){
        const getUserPictures = await userProvider.getUserPictures(usersId, i+1);
        getPictures.push(getUserPictures);
    }
    countPictures.push(getPictures);
    const countHouseWarm = await userProvider.countHouseWarm(usersId);
    const getHouseWarm = await userProvider.getHouseWarm(usersId);
    countHouseWarm.push(getHouseWarm);
    const countKnowHows = await userProvider.countKnowHow(usersId);
    const getKnowHows = await userProvider.getKnowHow(usersId);
    countKnowHows.push(getKnowHows);
    const getScrapBook = await userProvider.getScrapBook(usersId);
    const countScrapBook = await userProvider.countScrapBook(usersId);
    countScrapBook.push(getScrapBook);
    result.push({UsersInfo: userPageInfo, Pictures: countPictures, HouseWarms: countHouseWarm, KnowHows: countKnowHows, ScrapBook: countScrapBook});
    return res.send(response(baseResponse.SUCCESS, result));
}



/**
 * API No.
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No.
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};




/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickName;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};




/** API No.35
 * API Name : 카카오 로그인 API
 * [POST] /app/login/kakao
 */
exports.loginKakao = async function (req, res) {
    const {accessToken} = req.body;
    try {
        let kakao_profile;
        try {
            kakao_profile = await axios.get('https://kapi.kakao.com/v2/user/me', {
                headers: {
                    Authorization: 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                },
            });
        } catch (err) {
            logger.error(`Can't get kakao profile\n: ${JSON.stringify(err)}`);
            return res.send(errResponse(baseResponse.USER_ACCESS_TOKEN_WRONG));
        }
        const name = kakao_profile.data.kakao_account.profile.nickname;
        const email = kakao_profile.data.kakao_account.email;
        const emailRows = await userProvider.emailCheck(email);
        // 이미 존재하는 이메일인 경우 = 회원가입 되어 있는 경우 -> 로그인 처리
        if (emailRows.length > 0) {
            const userInfoRows = await userProvider.accountCheck(email);
            const token = await jwt.sign(
                {
                    userId: userInfoRows[0].id,
                },
                secret_config.jwtsecret,
                {
                    expiresIn: '365d',
                    subject: 'userId',
                },
            );

            const result = { userId: userInfoRows[0].id, jwt: token };
            return res.send(response(baseResponse.SUCCESS, result));
            // 그렇지 않은 경우 -> 회원가입 처리
        } else {
            const result = {
                name: name,
                email: email,
                loginStatus: 'KAKAO',
            };

            const signUpResponse = await userService.createSocialUser(
                // name,
                name,
                email,
                result.loginStatus,
            );
            return res.send(response(baseResponse.SUCCESS, result));
        }
    } catch (err) {
        logger.error(`App - logInKakao Query error\n: ${JSON.stringify(err)}`);
        return res.send(errResponse(baseResponse.USER_INFO_EMPTY));
    }
};







/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

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

//스크랩 폴더 생성
exports.postScrapFolders = async function (userId, folderName, folderInfo){
    try{
        const folderNameRows = await userProvider.checkFolderNames(userId,folderName);
        if(folderNameRows.length>0)
            return errResponse(baseResponse.REDUNDANT_FOLDER_NAME);
        const connection = await pool.getConnection(async(conn)=>conn);
        const postScrapFolders = await userDao.postScrapFolders(connection, userId, folderName, folderInfo);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postScrapFolders Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//스크랩 폴더 삭제
exports.deleteFolder = async function (userId, folderId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const deleteFolder = await userDao.deleteFolder(connection, userId, folderId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - deleteScrapFolders Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//스크랩 폴더 수정
exports.editFolder = async function (folderName, folderInfo, folderId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const editFolder = await userDao.editFolder(connection, folderName, folderInfo, folderId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - editScrapFolders Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//집들이 스크랩
exports.scrapHouseWarm = async function (userId, id, folderId){
    try{
        const houseWarmRows = await userProvider.checkHouseWarm(userId, id);
        if(houseWarmRows.length>0){
            const houseWarmCheck = await userProvider.reCheckHouseWarm(userId, id);
            if(houseWarmCheck.length>0){
                const connection = await pool.getConnection(async(conn)=>conn);
                const cancelScrap = await userDao.cancelScrap(connection, userId, id);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
            else {
                const connection = await pool.getConnection(async (conn) => conn);
                const editScrapStatus = await userDao.editScrapStatus(connection, userId, id);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
        }
        else{
            const connection = await pool.getConnection(async(conn)=>conn);
            const addScrap = await userDao.postScrap(connection, userId, id, folderId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    }catch(err){
        logger.error(`App - Scrap Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//상품 스크랩
exports.scrapProduct = async function (userId, id, folderId){
    try{
        const productRows = await userProvider.checkProduct(userId, id);
        if(productRows.length>0){
            const productCheck = await userProvider.reCheckProduct(userId, id);
            if(productCheck.length>0){
                const connection = await pool.getConnection(async (conn) => conn);
                const cancelProductScrap = await userDao.cancelProductScrap(connection, userId, id);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
            else {
                const connection = await pool.getConnection(async (conn) => conn);
                const editScrapStatus = await userDao.editProductScrapStatus(connection, userId, id);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
        }
        else{
            const connection = await pool.getConnection(async(conn)=>conn);
            const addScrap = await userDao.postProductScrap(connection, userId, id, folderId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    }catch(err){
        logger.error(`App - Scrap Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//좋아요
exports.postLike = async function (userId, houseWarmId){
    try{
        const likeRows = await userProvider.likeCheck(userId, houseWarmId);
        if(likeRows.length>0){
            const checkLikeRows = await userProvider.likeReCheck(userId, houseWarmId);
            if(checkLikeRows.length>0){
                const connection = await pool.getConnection(async (conn) => conn);
                const cancelLike = await userDao.cancelLike(connection, userId, houseWarmId);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
            else {
                const connection = await pool.getConnection(async (conn) => conn);
                const patchLike = await userDao.patchLike(connection, userId, houseWarmId);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
        }
        else{
            const connection = await pool.getConnection(async (conn) => conn);
            const postLike = await userDao.postLike(connection, userId, houseWarmId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    }catch(err) {
        logger.error(`App - likeService error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}


//팔로우
exports.postFollow = async function (userId, usersId){
    try{
        const followRows = await userProvider.followCheck(userId, usersId);
        if(followRows.length>0){
            const checkFollowRows = await userProvider.followReCheck(userId, usersId);
            if(checkFollowRows.length>0){
                const connection = await pool.getConnection(async (conn) => conn);
                const cancelFollow = await userDao.cancelFollow(connection, userId, usersId);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
            else{
                const connection = await pool.getConnection(async(conn)=>conn);
                const patchFollow = await userDao.patchFollow(connection, userId, usersId);
                connection.release();
                return response(baseResponse.SUCCESS);
            }
        }
        else{
            const connection = await pool.getConnection(async(conn)=>conn);
            const postFollow = await userDao.postFollow(connection, userId, usersId);
            connection.release();
            return response(baseResponse.SUCCESS);
        }
    } catch(err){
        logger.error(`App - postFollow Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//댓글 달기
exports.postComment = async function(userId, id, contents){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postComment = await userDao.postComment(connection, userId, id, contents);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err){
        logger.error(`App - postComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//대댓글 달기
exports.postReply = async function (userId, id, contents){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postReply = await userDao.postReply(connection, userId, id, contents);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postReplyComment Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//댓글 수정(삭제)
exports.patchComment = async function (userId, id){
    const connection = await pool.getConnection(async(conn)=>conn);
    try{
        await connection.beginTransaction();
        const replyRows = await userProvider.checkReply(id);
        if(replyRows.length>0){
            const patchCommentReply = await userDao.patchCommentReply(connection, id);
        }
        const patchComment = await userDao.patchComment(connection, userId, id);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - patchComment Transaction Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
}

//대댓글 수정(삭제)}
exports.patchReply = async function (userId, id){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const patchReply = await userDao.patchReply(connection, userId, id);
        connection.release();
        return response(baseResponse.SUCCESS);
    }catch(err){
        logger.error(`App - patchCommentReply Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//문의 생성
exports.postInquiry = async function(userId, productId, categoryId, contents){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postInquiry = await userDao.postInquiry(connection, userId, productId, categoryId, contents);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postInquiry Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//주문 생성
exports.postOrder = async function (orderInfoParams, point, userId){
    const connection = await pool.getConnection(async(conn)=>conn);
    try{
        await connection.beginTransaction();
        const postOrder = await userDao.postOrder(connection, orderInfoParams);
        const decreasePoint = await userDao.decreasePoint(connection,point, userId);
        await connection.commit();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postOrder Transaction Service error\n: ${err.message}`);
        await connection.rollback();
        return errResponse(baseResponse.DB_ERROR);
    }
    finally {
        connection.release();
    }
}

//비밀번호 변경
exports.patchPassword = async function (userId, passWord, passWordCheck){
    try{
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
        const connection = await pool.getConnection(async(conn)=>conn);
        const patchPassword = await userDao.patchPassword(connection, hashedPassword, userId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchPassword Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//주문 안한 리뷰 작성
exports.postNoOrderReview = async function(reviewParams){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postNoOrderReview = await userDao.postNoOrderReview(connection,reviewParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postNoOrderReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//주문한 리뷰 작성
exports.postOrderReview = async function (orderedReviewParams){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postOrderReview = await userDao.postOrderReview(connection, orderedReviewParams);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postOrderReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//리뷰 도움 취소
exports.cancelHelpReview = async function (userId, reviewId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const cancelHelpReview = await userDao.cancelHelpReview(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - cancelHelpReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//리뷰 도움 수정(눌린 상태로)
exports.patchHelpReview = async function (userId, reviewId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const patchHelpReview = await userDao.patchHelpReview(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - patchHelpReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

//리뷰 도움 생성
exports.postHelpReview = async function(userId, reviewId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const postHelpReview = await userDao.postHelpReview(connection, userId, reviewId);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch(err){
        logger.error(`App - postHelpReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
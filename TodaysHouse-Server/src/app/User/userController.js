const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const regexURL = /https[:][/][/]+([\w\-]+\.)+([\w]{2,10})+$/;
const regexPW = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 숫자 + 영문
const {emit} = require("nodemon");

const axios = require('axios');
const secret_config = require('../../../config/secret');
const crypto = require("crypto");
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
        const spaceTotal = await userProvider.spaceTotal(userId);
        const getPictures = await userProvider.getPictures(userId);
        const pictures = [];
        spaceTotal.push(getPictures);
        pictures.push(spaceTotal);
        for(let i=0; i<8; i++){
            const getPicturesSpace = await userProvider.getPicturesSpace(i+1);
            const getUserPictures = await userProvider.getUserPictures(userId, i+1);
            getPicturesSpace.push(getUserPictures);
            pictures.push(getPicturesSpace);
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
        result.push({MyPageInfo: getMyPages, Pictures: pictures
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
    const spaceTotal = await userProvider.spaceTotal(userId);
    const getPictures = await userProvider.getPictures(usersId);
    const pictures = [];
    spaceTotal.push(getPictures);
    pictures.push(spaceTotal);
    for(let i=0; i<8; i++){
        const getPicturesSpace = await userProvider.getPicturesSpace(i+1);
        const getUserPictures = await userProvider.getUserPictures(usersId, i+1);
        getPicturesSpace.push(getUserPictures);
        pictures.push(getPicturesSpace);
    }
    countPictures.push(pictures);
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

/** API No.5
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

/**
 * API No. 6
 * API Name : 프로필 수정 API
 * [PATCH] /app/users/:userId/profiles
 */
exports.patchProfiles = async function(req, res) {
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type} = req.query;
    const {editInfo} = req.body;
    if (!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if (userIdFromJWT != userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if (!type) return res.send(response(baseResponse.USER_EDIT_TYPE_EMPTY));
    if (type === 'PROFILE_IMAGE') {
        if (!editInfo) return res.send(response(baseResponse.USER_EDIT_INFO_EMPTY));
        const patchProfileImage = await userService.patchProfileImage(editInfo, userId);
        return res.send(response(patchProfileImage));
    } else if (type === 'BACKGROUND_IMAGE') {
        if (!editInfo) return res.send(response(baseResponse.USER_EDIT_INFO_EMPTY));
        const patchBackgroundImage = await userService.patchBackgroundImage(editInfo, userId);
        return res.send(response(patchBackgroundImage));
    } else if (type === 'NICKNAME') {
        if (!editInfo) return res.send(response(baseResponse.USER_EDIT_INFO_EMPTY));
        const patchNickName = await userService.patchNickName(editInfo, userId);
        return res.send(response(patchNickName));
    } else if (type === 'MY_URL') {
        if (!editInfo) return res.send(response(baseResponse.USER_EDIT_INFO_EMPTY));
        const patchMyUrl = await userService.patchMyUrl(editInfo, userId);
        return res.send(response(patchMyUrl));
    } else if (type === 'INTRO') {
        if (!editInfo) return res.send(response(baseResponse.USER_EDIT_INFO_EMPTY));
        const patchIntro = await userService.patchIntro(editInfo, userId);
        return res.send(response(patchIntro));
    }
    return res.send(errResponse(baseResponse.USER_EDIT_TYPE_ERROR));
}


/**
 * API No. 7
 * API Name : 스크랩 폴더 생성 API
 * [POST] /app/users/:userId/scrap-folders
 */
exports.postScrapFolders = async function(req,res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {folderName, folderInfo} = req.body;

    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!folderName) return res.send(response(baseResponse.SCRAP_FOLDER_NAME_EMPTY));
    const postScrapFolders = await userService.postScrapFolders(userId, folderName, folderInfo);
    return res.send(response(postScrapFolders));
}

/**
 * API No. 8
 * API Name : 스크랩 폴더 수정 API
 * [PATCH] /app/users/:userId/scrap-folders
 */
exports.patchScrapFolders = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.USER_EDIT_FOLDER_TYPE_EMPTY));
    if(type==='DELETE'){
        const {folderId} = req.body;
        if(!folderId) return res.send(response(baseResponse.SCRAP_FOLDER_ID_EMPTY));
        const deleteFolder = await userService.deleteFolder(userId, folderId);
        return res.send(response(deleteFolder));
    }
    if(type==='EDIT'){
        const {folderId, folderName, folderInfo} = req.body;
        if(!folderId) return res.send(response(baseResponse.SCRAP_FOLDER_ID_EMPTY));
        if(!folderName) return res.send(response(baseResponse.SCRAP_FOLDER_NAME_EMPTY));
        const editFolder = await userService.editFolder(folderName, folderInfo, folderId);
        return res.send(response(editFolder));
    }
    else{
        return res.send(response(baseResponse.USER_EDIT_FOLDER_TYPE_ERROR));
    }
}

/**
 * API No. 9
 * API Name : 스크랩 폴더 생성 API
 * [POST] /app/users/:userId/scrap-folders
 */
exports.postScrap = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type} = req.query;
    const {id, folderId} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.SCRAP_TYPE_EMPTY));
    if(!id) return res.send(response(baseResponse.SCRAP_ID_EMPTY));
    if(type==='HOUSEWARM'){
        const scrapHouseWarm = await userService.scrapHouseWarm(userId, id, folderId);
        return res.send(response(scrapHouseWarm));
    }
    else if(type==='PRODUCT'){
        const scrapProduct = await userService.scrapProduct(userId, id, folderId);
        return res.send(response(scrapProduct));
    }
    return res.send(response(baseResponse.SCRAP_TYPE_ERROR));
}



/**
 * API No. 10
 * API Name : 스크랩 조회 API
 * [GET] /app/users/:userId/scraps
 */
exports.getScrap = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.SCRAP_BOOK_TYPE_EMPTY));
    if(type==='TOTAL'){
        const getTotalScrap = await userProvider.getTotalScrap(userId);
        return res.send(response(baseResponse.SUCCESS, getTotalScrap));
    }
    else if(type==='FOLDER'){
        const getFolder = await userProvider.getFolder(userId);
        const folders = [];
        for(let i=0; i<getFolder.length; i++){
            const getFolderImage = await userProvider.getFolderImage(userId, getFolder[i].id);
            folders.push(getFolder[i],getFolderImage);
        }
        return res.send(response(baseResponse.SUCCESS, folders));
    }
    else if(type==='PRODUCT'){
        const {categoryId} = req.body;
        const products = [];
        if(!categoryId){
            const getProduct = await userProvider.getTotalProduct(userId);
            for(let i=0; i<getProduct.length; i++){
                const getProductImage = await userProvider.getProductImage(getProduct[i].id);
                products.push(getProduct[i], getProductImage);
            }
            return res.send(response(baseResponse.SUCCESS, products));
        }
        else{
            const getProduct = await userProvider.getProduct(userId, categoryId);
            const products = [];
            for(let i=0; i<getProduct.length; i++){
                const getProductImage = await userProvider.getProductImage(getProduct[i].id);
                products.push(getProduct[i], getProductImage);
            }
            return res.send(response(baseResponse.SUCCESS, products));
        }
    }
    else if(type==='HOUSEWARM'){
        const getHouseWarm = await userProvider.getScrapHouseWarm(userId);
        return res.send(response(baseResponse.SUCCESS, getHouseWarm));
    }
    return res.send(response(baseResponse.SCRAP_BOOK_TYPE_ERROR));
}


/**
 * API No. 11
 * API Name : 좋아요 API
 * [POST] /app/users/:userId/likes
 */
exports.postLike = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {houseWarmId} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const postLike = await userService.postLike(userId, houseWarmId);
    return res.send(response(postLike));

}


/**
 * API No. 12
 * API Name : 좋아요 조회 API
 * [GET] /app/users/:userId/likes
 */
exports.getLike = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.LIKE_TYPE_EMPTY));
    if(type==='TOTAL'){
        const getTotalLike = await userProvider.getTotalLike(userId);
        return res.send(response(baseResponse.SUCCESS, getTotalLike));
    }
    else if(type==='HOUSEWARM'){
        const getHouseWarmLike = await userProvider.getHouseWarmLike(userId);
        return res.send(response(baseResponse.SUCCESS, getHouseWarmLike));
    }
    return res.send(errResponse(baseResponse.LIKE_TYPE_ERROR));
}

/**
 * API No. 13
 * API Name : 팔로우 API
 * [POST] /app/users/:userId/follows
 */
exports.postFollow = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {usersId} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!usersId) return res.send(response(baseResponse.FOLLOW_USER_ID_EMPTY));
    const postFollow = await userService.postFollow(userId, usersId);
    return res.send(response(postFollow));
}


/**
 * API No. 14
 * API Name : 팔로우 조회 API
 * [GET] /app/users/:userId/follows
 */
exports.getFollow = async function(req, res){
    const userId = req.params.userId;
    const {type} = req.query;
    if(!userId)  return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(!type)  return res.send(response(baseResponse.FOLLOW_TYPE_EMPTY));
    if(type==='FOLLOWER'){
        const getFollower = await userProvider.getFollower(userId);
        return res.send(response(baseResponse.SUCCESS, getFollower));
    }
    else if(type==='FOLLOWING'){
        const getFollowing = await userProvider.getFollowing(userId);
        return res.send(response(baseResponse.SUCCESS, getFollowing));
    }
    return res.send(errResponse(baseResponse.FOLLOW_TYPE_ERROR));
}

/**
 * API No. 15
 * API Name : 댓글 달기 API
 * [POST] /app/users/:userId/comments
 */
exports.postComment = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type, id} = req.query;
    const {contents} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.COMMENT_TYPE_EMPTY));
    if(!contents) return res.send(response(baseResponse.COMMENT_CONTENT_EMPTY));
    if(type===`COMMENT`){
        if(!id) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
        const postComment = await userService.postComment(userId, id, contents);
        return res.send(response(postComment));
    }
    else if(type==='REPLY'){
        if(!id) return res.send(response(baseResponse.COMMENT_ID_EMPTY));
        const postReply = await userService.postReply(userId, id, contents);
        return res.send(response(postReply));
    }
    return res.send(errResponse(baseResponse.COMMENT_TYPE_ERROR));
}

/**
 * API No. 16
 * API Name : 댓글 수정 API
 * [PATCH] /app/users/:userId/comments
 */
exports.patchComment = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {type, id} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!type) return res.send(response(baseResponse.COMMENT_TYPE_EMPTY));
    if(type==='COMMENT'){
        if(!id) return res.send(response(baseResponse.COMMENT_ID_EMPTY));
        const patchComment = await userService.patchComment(userId, id);
        return res.send(response(patchComment));
    }
    else if(type==='REPLY'){
        if(!id) return res.send(response(baseResponse.COMMENT_REPLY_ID_EMPTY));
        const patchReply = await userService.patchReply(userId, id);
        return res.send(response(patchReply));
    }
    return res.send(errResponse(baseResponse.COMMENT_TYPE_ERROR));
}

/**
 * API No. 21
 * API Name : 스토어 홈 조회 API
 * [GET] /app/users/:userId/store-home
 */
exports.getStoreHome = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    const getStoreCategory = await userProvider.getStoreCategory();
    const getRecentProduct = await userProvider.getRecentProduct(userId);
    const getRecentSimilarProduct = await userProvider.getRecentSimilarProduct(getRecentProduct[0].CategoryId);
    const getPopularKeyword = await userProvider.getPopularKeyword();
    const getPopularProduct = await userProvider.getPopularProduct();
    const result = [];
    result.push({ProductCategories: getStoreCategory, RecentViewedProduct: getRecentProduct
        , RecentViewedSimilarProduct: getRecentSimilarProduct, PopularKeyword: getPopularKeyword
        , PopularProduct: getPopularProduct});
    return res.send(response(baseResponse.SUCCESS, result));
}
/**
 * API No. 25
 * API Name : 문의 생성 API
 * [POST] /app/users/:userId/Inquiry
 */
exports.postInquiry = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {productId} = req.query;
    const {categoryId, contents} = req.body;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    if(!categoryId) return res.send(response(baseResponse.INQUIRY_CATEGORY_ID_EMPTY));
    if(!contents) return res.send(response(baseResponse.INQUIRY_CONTENTS_EMTPY));
    const postInquiry = await userService.postInquiry(userId, productId, categoryId, contents);
    return res.send(response(postInquiry));
}

/**
 * API No. 28
 * API Name : 주문 생성 API
 * [POST] /app/users/:userId/orders
 */
exports.postOrder = async function (req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {productId, productOptionId, addOptionId, count, couponId, senderName, frontEmail, backEmailId, backEmail, senderPhoneNum, receiverName, receiverPhoneNum, roadAddress, detailAddress, requestId, requestContents, point} = req.body;
    let total;
    const getDelCost = await userProvider.getDelCost(productId);
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!productId || !productOptionId || !count) return res.send(response(baseResponse.PRODUCT_INFO_EMPTY));
    if(!senderName || !frontEmail || !backEmailId || !senderPhoneNum)
        return res.send(response(baseResponse.ORDERER_INFO_EMPTY));
    if(backEmailId === '10') {
        if (!backEmail) return res.send(response(baseResponse.BACKEMAIL_EMPTY));
    }
    if(!receiverName || !receiverPhoneNum || !roadAddress || !detailAddress)
        return res.send(response(baseResponse.DESTINATION_INFO_EMPTY));
    if(requestId === '5'){
        if(!requestContents) return res.send(response(baseResponse.ORDER_REQUEST_CONTENTS_EMPTY));
    }
    if(couponId===null){
        if(addOptionId===null) {
            const getTotalCost = await userProvider.getNoCouponCost(productId, productOptionId);
            total = ((getTotalCost[0].totalCost)*count)+getDelCost[0].delCost-point;
        }
        else if(addOptionId){
            const getTotalCost = await userProvider.getNoCouponAddCost(productId, productOptionId, addOptionId);
            total = ((getTotalCost[0].totalCost)*count)+getDelCost[0].delCost-point;
        }
    }
    else if(couponId){
        if(addOptionId===null) {
            const getTotalCost = await userProvider.getTotalCost(productId, productOptionId, couponId);
            total = ((getTotalCost[0].totalCost)*count)+getDelCost[0].delCost-point;
        }
        else if(addOptionId){
            const getTotalCost = await userProvider.getTotalAddCost(productId, productOptionId, addOptionId, couponId);
            total = ((getTotalCost[0].totalCost)*count)+getDelCost[0].delCost-point;
        }
    }
    const orderInfoParams = [userId, productId, productOptionId, addOptionId, count, couponId, senderName, frontEmail, backEmailId, backEmail, senderPhoneNum, receiverName, receiverPhoneNum, roadAddress, detailAddress, requestId, requestContents, point, total];
    const postOrder = await userService.postOrder(orderInfoParams, point, userId);
    return res.send(response(postOrder));
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


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.jwtCheck = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};


/**
 * API No. 32
 * API Name : 이메일 중복 체크 API
 * [GET] /app/emails
 */
exports.emailCheck = async function(req, res){
    const {email} = req.query;
    if(!email) return res.send(response(baseResponse.SIGNIN_EMAIL_EMPTY));
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));
    // 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));
    const checkEmail = await userProvider.emailCheck(email);
    if(checkEmail.length>0){
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL));
    }
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 33
 * API Name : 닉네임 중복 체크 API
 * [GET] /app/nicknames
 */
exports.nicknameCheck = async function (req, res){
    const {nickName} = req.query;
    if(!nickName) return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));
    if(nickName.length>10)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));
    const nickNameRows = await userProvider.nickNameCheck(nickName);
    if(nickNameRows.length>0){
        return res.send(errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME));
    }
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 34
 * API Name : 비밀번호 확인 API
 * [GET] /app/passwords
 */
exports.passwordCheck = async function(req, res){
    const {passWord, passWordCheck} = req.query;
    if (!passWord)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));
    if(passWord.length<8)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));
    else if (!regexPW.test(passWord)) {
        return res.send(response(baseResponse.SIGNUP_PASSWORD_ERROR_TYPE_VAL));
    }
    if(!passWordCheck)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_CHECK_EMPTY));
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
        return res.send(errResponse(baseResponse.SIGNUP_PASSWORD_CHECK_NOT_MATCH));
    }
    return res.send(response(baseResponse.SUCCESS));
}



/**
 * API No. 39
 * API Name : 사용 가능 쿠폰 조회 API
 * [GET] /app/users/:userId/coupons
 */
exports.getCoupons = async function (req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {productId} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    const getCoupons = await userProvider.getAbleCoupons(userId, productId);
    return res.send(response(baseResponse.SUCCESS, getCoupons));
}


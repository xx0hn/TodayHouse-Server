const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const regexPW = /^.*(?=.*[0-9])(?=.*[a-zA-Z]).*$/; // 숫자 + 영문
const {emit} = require("nodemon");



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











/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

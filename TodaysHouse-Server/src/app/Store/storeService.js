const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storeProvider = require("./storeProvider");
const storeDao = require("./storeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
// const regexURL = /(https)\:[/][/]+([\w\-])+$/;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");


//상품 조회 수 증가
exports.addProductViewCount = async function (productId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const addViewCount = await storeDao.addViewCount(connection, productId);
        connection.release();
        return response(baseResponse.INCREASED_VIEW_COUNT);
    } catch(err){
        logger.error(`App - increaseViewCount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

// 최근 본 상품 추가
exports.addRecentProduct = async function (userId, productId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const addRecentProduct = await storeDao.addRecentProduct(connection, userId, productId);
        connection.release();
        return response(baseResponse.ADD_RECENT_VIEW);
    } catch(err){
        logger.error(`App - addRecentProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
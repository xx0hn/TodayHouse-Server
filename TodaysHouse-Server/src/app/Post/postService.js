const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const postProvider = require("./postProvider");
const postDao = require("./postDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
// const regexURL = /(https)\:[/][/]+([\w\-])+$/;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//조회수 증가
exports.patchViewCount = async function (houseWarmId){
    try{
        const connection = await pool.getConnection(async(conn)=>conn);
        const patchViewCount = await postDao.patchViewCount(connection, houseWarmId);
        connection.release();
        return response(baseResponse.INCREASED_VIEW_COUNT);
    }catch(err){
        logger.error(`App - increaseViewCount Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
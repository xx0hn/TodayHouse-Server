const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const postDao = require("./postDao");

//오늘의 스토리 조회
exports.getTodayStory = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTodayStory = await postDao.selectTodayStory(connection);
    connection.release();
    return getTodayStory;
}

//상품 카테고리 전체 조회
exports.getCategory = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCategory = await postDao.selectTotalCategory(connection);
    connection.release();
    return getCategory;
}

//카테고리명 조회
exports.getCategoryName = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCategoryName = await postDao.selectCategoryName(connection, categoryId);
    connection.release();
    return getCategoryName;
}

//전체 출력
exports.getPrintTotal = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPrintTotal = await postDao.selectPrintTotal(connection);
    connection.release();
    return getPrintTotal;
}

//전체 카테고리 베스트 상품
exports.getBestProduct = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getBestProduct = await postDao.selectBestProduct(connection);
    connection.release();
    return getBestProduct;
}

//카테고리 베스트 상품
exports.getCategoryBest = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCategoryBest = await postDao.selectCategoryBest(connection, categoryId);
    connection.release();
    return getCategoryBest;
}
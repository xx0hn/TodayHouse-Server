const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");


//중간 카테고리명 조회
exports.getMiddleCategory = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getMiddleCategory = await storeDao.selectMiddleCategory(connection, categoryId);
    connection.release();
    return getMiddleCategory;
}

//작은 카테고리명 조회
exports.getSmallCategory = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSmallCategory = await storeDao.selectSmallCategory(connection, categoryId);
    connection.release();
    return getSmallCategory;
}

//세부 카테고리명 조회
exports.getDetailCategory = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getDetailCategory = await storeDao.selectDetailCategory(connection, categoryId);
    connection.release();
    return getDetailCategory;
}

//큰 카테고리 판매량순 조회
exports.orderLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.orderLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 판매량순 조회
exports.orderMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.orderMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 판매량순 조회
exports.orderSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.orderSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 인기순 조회
exports.popularLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.popularLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 인기순 조회
exports.popularMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.popularMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 인기순 조회
exports.popularSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.popularSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 낮은가격순 조회
exports.lowLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.lowLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 낮은가격순 조회
exports.lowMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.lowMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 낮은가격순 조회
exports.lowSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.lowSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 높은가격순 조회
exports.highLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.highLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 높은가격순 조회
exports.highMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.highMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 높은가격순 조회
exports.highSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.highSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 리뷰많은순 조회
exports.reviewLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.reviewLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 리뷰많은순 조회
exports.reviewMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.reviewMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 리뷰많은순 조회
exports.reviewSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.reviewSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 유저사진순 조회
exports.photoLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.photoLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 유저사진순 조회
exports.photoMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.photoMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 유저사진순 조회
exports.photoSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.photoSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}

//큰 카테고리 최신순 조회
exports.newLCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const LCategoryProduct = await storeDao.newLCategoryProduct(connection, categoryId);
    connection.release();
    return LCategoryProduct;
}
//중간 카테고리 최신순 조회
exports.newMCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const MCategoryProduct = await storeDao.newMCategoryProduct(connection, categoryId);
    connection.release();
    return MCategoryProduct;
}
//작은 카테고리 최신순 조회
exports.newSCategoryProduct = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const SCategoryProduct = await storeDao.newSCategoryProduct(connection, categoryId);
    connection.release();
    return SCategoryProduct;
}



//문의 갯수 조회
exports.countInquiry = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const countInquiry = await storeDao.countInquiry(connection, productId);
    connection.release();
    return countInquiry;
}

//문의 조회
exports.getInquiry = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getInquiry = await storeDao.selectInquiry(connection, productId);
    connection.release();
    return getInquiry;
}

//배송 정보 조회
exports.getDeliveryInfo = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getDeliveryInfo = await storeDao.selectDeliveryInfo(connection, productId);
    connection.release();
    return getDeliveryInfo;
}

//교환환불 정보 조회
exports.getExchangeInfo = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getExchangeInfo = await storeDao.selectExchangeInfo(connection, productId);
    connection.release();
    return getExchangeInfo;
}

//환불 정보 조회
exports.getRefundInfo = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getRefundInfo = await storeDao.selectRefundInfo(connection, productId);
    connection.release();
    return getRefundInfo;
}

//판매자 정보 조회
exports.getBrandInfo = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getBrandInfo = await storeDao.selectBrandInfo(connection, productId);
    connection.release();
    return getBrandInfo;
}
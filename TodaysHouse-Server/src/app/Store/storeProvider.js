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

//이메일 뒷자리 조회
exports.getBackEmail = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getBackEmail = await storeDao.selectBackEmail(connection);
    connection.release();
    return getBackEmail;
}

//배송 요청사항 조회
exports.getRequests = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getRequests = await storeDao.selectRequests(connection);
    connection.release();
    return getRequests;
}

//상품 이미지 조회
exports.getProductImage = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getProductImage = await storeDao.selectProductImage(connection, productId);
    connection.release();
    return getProductImage;
}

//상품 정보 조회
exports.getProductInfo = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getProductInfo = await storeDao.selectProductInfo(connection, productId);
    connection.release();
    return getProductInfo;
}

//스타일링 샷 조회
exports.getStylingShot = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getStylingShot= await storeDao.selectStylingShot(connection, productId);
    connection.release();
    return getStylingShot;
}

//상품 소개 조회
exports.getProductIntro = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getProductIntro = await storeDao.selectProductIntro(connection, productId);
    connection.release();
    return getProductIntro;
}

//상품 리뷰 점수 정리
exports.getReviewTotal = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getReviewTotal = await storeDao.selectReviewTotal(connection, productId);
    connection.release();
    return getReviewTotal;
}


//상품 리뷰 조회
exports.getProductReview = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getProductReview = await storeDao.selectProductReview(connection, productId);
    connection.release();
    return getProductReview;
}

//리뷰 사진만 조회
exports.getReviewPhoto = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getReviewPhoto = await storeDao.selectReviewPhoto(connection, productId);
    connection.release();
    return getReviewPhoto;
}

//상품 문의 수 조회
exports.getProductInquiryCount = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getProductInquiryCount = await storeDao.selectProductInquiryCount(connection, productId);
    connection.release();
    return getProductInquiryCount;
}

//비슷한 상품 조회
exports.getSimilarProduct = async function(largeCategoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSimilarProduct = await storeDao.selectSimilarProduct(connection, largeCategoryId);
    connection.release();
    return getSimilarProduct;
}

//상품 카테고리 전체 조회
exports.getCategory = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCategory = await storeDao.selectTotalCategory(connection);
    connection.release();
    return getCategory;
}

//실시간 베스트 상품 조회
exports.getNowBestProduct = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNowBestProduct = await storeDao.selectNowBestProduct(connection);
    connection.release();
    return getNowBestProduct;
}

//전체 카테고리 역대 베스트 상품 조회
exports.getHistoryBestProduct = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getBestProduct = await storeDao.selectBestProduct(connection);
    connection.release();
    return getBestProduct;
}

//카테고리 별 역대 베스트 상품 조회
exports.getCategoryBest = async function(categoryId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCategoryBest = await storeDao.selectCategoryBest(connection, categoryId);
    connection.release();
    return getCategoryBest;
}

//현재 시간 불러오기
exports.getCurrentTimestamp = async function(){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getCurrentTimestamp = await storeDao.selectCurrentTimestamp(connection);
    connection.release();
    return getCurrentTimestamp;
}

//리뷰 분석
exports.reviewAnalysis = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const reviewAnalysis = await storeDao.selectReviewAnalysis(connection, productId);
    connection.release();
    return reviewAnalysis;
}

//베스트순, 노필터 사진 리뷰 조회
exports.getPhotoReview = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPhotoReview = await storeDao.selectPhotoReview(connection, productId);
    connection.release();
    return getPhotoReview;
}

//베스트순, 상품 옵션 필터 사진 리뷰 조회
exports.getPhotoOptionReview = async function(productId, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPhotoOptionReview = await storeDao.selectPhotoOptionReview(connection, productId, optionId);
    connection.release();
    return getPhotoOptionReview;
}

//베스트순, 별점 필터 사진 리뷰 조회
exports.getPhotoPointReview = async function(productId, pointType,pointTypes){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPhotoPointReview = await storeDao.selectPhotoPointReview(connection, productId, pointType, pointTypes);
    connection.release();
    return getPhotoPointReview;
}

//베스트순, 별점, 상품 옵션 필터 사진 리뷰 조회
exports.getPhotoPointOptionReview = async function(productId, pointType, pointTypes, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPhotoPointOptionReview = await storeDao.selectPhotoPointOptionReview(connection, productId, pointType, pointTypes, optionId);
    connection.release();
    return getPhotoPointOptionReview;
}

//베스트순, 전체 리뷰 조회
exports.getTotalReview = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalReview = await storeDao.selectTotalReview(connection, productId);
    connection.release();
    return getTotalReview;
}

//베스트순, 상품 옵션 필터 전체 리뷰 조회
exports.getTotalOptionReview = async function(productId, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalOptionReview = await storeDao.selectTotalOptionReview(connection, productId, optionId);
    connection.release();
    return getTotalOptionReview;
}

//베스트순, 별점 필터 전체 리뷰 조회
exports.getTotalPointReview = async function(productId, pointType, pointTypes){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalPointReview = await storeDao.selectTotalPointReview(connection, productId, pointType, pointTypes);
    connection.release();
    return getTotalPointReview;
}

//베스트순, 별점, 상품 옵션 필터 전체 리뷰 조회
exports.getTotalPointOptionReview = async function(productId, pointType, pointTypes, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalPointOptionReview = await storeDao.selectTotalPointOptionReview(connection, productId, pointType, pointTypes, optionId);
    connection.release();
    return getTotalPointOptionReview;
}

//최신순, 노필터 사진 리뷰 조회
exports.getNewPhotoReview = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewPhotoReview = await storeDao.selectNewPhotoReview(connection, productId);
    connection.release();
    return getNewPhotoReview;
}

//최신순, 상품 옵션 필터 사진 리뷰 조회
exports.getNewPhotoOptionReview = async function(productId, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewPhotoOptionReview = await storeDao.selectNewPhotoOptionReview(connection, productId, optionId);
    connection.release();
    return getNewPhotoOptionReview;
}

//최신순, 별점 필터 사진 리뷰 조회
exports.getNewPhotoPointReview = async function(productId, pointType, pointTypes){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewPhotoPointReview = await storeDao.selectNewPhotoPointReview(connection, productId, pointType, pointTypes);
    connection.release();
    return getNewPhotoPointReview;
}

//최신순, 별점, 상품 옵션 필터 사진 리뷰 조회
exports.getNewPhotoPointOptionReview = async function(productId, pointType, pointTypes, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewPhotoPointOptionReview = await storeDao.selectNewPhotoPointOptionReview(connection, productId, pointType, pointTypes, optionId);
    connection.release();
    return getNewPhotoPointOptionReview;
}

//최신순, 전체 리뷰 조회
exports.getNewTotalReview = async function(productId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewTotalReview = await storeDao.selectNewTotalReview(connection, productId);
    connection.release();
    return getNewTotalReview;
}

//최신순, 상품 옵션 필터 전체 리뷰 조회
exports.getNewTotalOptionReview = async function(productId, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewTotalOptionReview = await storeDao.selectNewTotalOptionReview(connection, productId, optionId);
    connection.release();
    return getNewTotalOptionReview;
}

//최신순, 별점 필터 전체 리뷰 조회
exports.getNewTotalPointReview = async function(productId, pointType, pointTypes){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewTotalPointReview = await storeDao.selectNewTotalPointReview(connection, productId, pointType, pointTypes);
    connection.release();
    return getNewTotalPointReview;
}

//최신순, 별점, 상품 옵션 필터 전체 리뷰 조회
exports.getNewTotalPointOptionReview = async function(productId, pointType, pointTypes, optionId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewTotalPointOptionReview = await storeDao.selectNewTotalPointOptionReview(connection, productId, pointType, pointTypes, optionId);
    connection.release();
    return getNewTotalPointOptionReview;
}
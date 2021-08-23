const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
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
 * API No. 22
 * API Name : 카테고리로 상품 조회 조회 API
 * [GET] /app/products/categories
 */
exports.getCategoryProduct = async function(req, res){
    const {largeCategoryId, middleCategoryId, smallCategoryId, sortType} = req.query;
    const result=[];
    if(!sortType) return res.send(response(baseResponse.SORT_TYPE_EMPTY));
    if(!largeCategoryId) return res.send(response(baseResponse.PRODUCT_CATEGORY_ID_EMPTY));
    else {
        let categoryId = 0;
        if (largeCategoryId && !middleCategoryId && !smallCategoryId) {
            categoryId = largeCategoryId;
            const getCategory = await storeProvider.getMiddleCategory(categoryId);
            if (sortType === 'ORDER') {
                const orderCategoryProduct = await storeProvider.orderLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: orderCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === `POPULAR`) {
                const popularCategoryProduct = await storeProvider.popularLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: popularCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else  if (sortType === 'LOWPRICE') {
                const lowCategoryProduct = await storeProvider.lowLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: lowCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'HIGHPRICE') {
                const highCategoryProduct = await storeProvider.highLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: highCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'REVIEW') {
                const reviewCategoryProduct = await storeProvider.reviewLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory, Product: reviewCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'USERPHOTO') {
                const photoCategoryProduct = await storeProvider.photoLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: photoCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'NEW') {
                const newCategoryProduct = await storeProvider.newLCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: newCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else{
                return res.send(errResponse(baseResponse.SORT_TYPE_ERROR));
            }
        } else if (largeCategoryId && middleCategoryId && !smallCategoryId) {
            categoryId = middleCategoryId;
            const getCategory = await storeProvider.getSmallCategory(categoryId);
            if (sortType === 'ORDER') {
                const orderCategoryProduct = await storeProvider.orderMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: orderCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === `POPULAR`) {
                const popularCategoryProduct = await storeProvider.popularMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: popularCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'LOWPRICE') {
                const lowCategoryProduct = await storeProvider.lowMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: lowCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'HIGHPRICE') {
                const highCategoryProduct = await storeProvider.highMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: highCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'REVIEW') {
                const reviewCategoryProduct = await storeProvider.reviewMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory, Product: reviewCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'USERPHOTO') {
                const photoCategoryProduct = await storeProvider.photoMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: photoCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'NEW') {
                const newCategoryProduct = await storeProvider.newMCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: newCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else{
                return res.send(errResponse(baseResponse.SORT_TYPE_ERROR));
            }
        } else if (largeCategoryId && middleCategoryId && smallCategoryId) {
            categoryId = smallCategoryId;
            const getCategory = await storeProvider.getDetailCategory(categoryId);
            if (sortType === 'ORDER') {
                const orderCategoryProduct = await storeProvider.orderSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: orderCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === `POPULAR`) {
                const popularCategoryProduct = await storeProvider.popularSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: popularCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'LOWPRICE') {
                const lowCategoryProduct = await storeProvider.lowSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: lowCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'HIGHPRICE') {
                const highCategoryProduct = await storeProvider.highSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: highCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'REVIEW') {
                const reviewCategoryProduct = await storeProvider.reviewSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory, Product: reviewCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'USERPHOTO') {
                const photoCategoryProduct = await storeProvider.photoSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: photoCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else if (sortType === 'NEW') {
                const newCategoryProduct = await storeProvider.newSCategoryProduct(categoryId);
                result.push({DetailCategory: getCategory,Product: newCategoryProduct});
                return res.send(response(baseResponse.SUCCESS, result));
            }
            else{
                return res.send(errResponse(baseResponse.SORT_TYPE_ERROR));
            }
        }
    }
}

/**
 * API No. 23
 * API Name : 상품 조회 API
 * [GET] /app/products/:productId
 */
exports.getProduct = async function(req, res){
    const userIdFromJWT = req.verifiedToken.userId;
    const userId = req.params.userId;
    const {productId} = req.query;
    if(!userId) return res.send(response(baseResponse.USER_USERID_EMPTY));
    if(userIdFromJWT!=userId)
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    const getProductImage = await storeProvider.getProductImage(productId);
    const getProductInfo = await storeProvider.getProductInfo(productId);
    const getStylingShot = await storeProvider.getStylingShot(productId);
    const getProductIntro = await storeProvider.getProductIntro(productId);
    const getProductReview = await storeProvider.getProductReview(productId);
    const getReviewTotal = await storeProvider.getReviewTotal(productId);
    const getReviewPhoto = await storeProvider.getReviewPhoto(productId);
    const getProductInquiryCount = await storeProvider.getProductInquiryCount(productId);
    const getSimilarProduct = await storeProvider.getSimilarProduct(getProductInfo[0].largeCategoryId);
    const addProductViewCount = await storeService.addProductViewCount(productId);
    const addRecentProduct = await storeService.addRecentProduct(userId, productId);
    const result=[];
    result.push({ProductImage: getProductImage, ProductInfo: getProductInfo, ProductStylingShot: getStylingShot,
                ProductIntro: getProductIntro,TotalReview: getReviewTotal, ReviewPhoto:getReviewPhoto, ProductReview: getProductReview, ProductInquiryCount: getProductInquiryCount,
                SimilarProduct: getSimilarProduct});
    return res.send(response(baseResponse.SUCCESS, result));
}

/**
 * API No. 24
 * API Name : 베스트 상품 조회 API
 * [GET] /app/products/best
 */
exports.getBestProduct = async function(req, res){
    const {bestType, categoryId} = req.query;
    const getCategory = await storeProvider.getCategory();
    const getCurrentTimestamp = await storeProvider.getCurrentTimestamp();
    const result =[];
    if(!bestType) return res.send(response(baseResponse.BEST_TYPE_EMPTY));
    if(bestType==='NOW'){
        const getNowBestProduct = await storeProvider.getNowBestProduct();
        result.push({CurrentTime: getCurrentTimestamp, BestProducts: getNowBestProduct});
    }
    else if(bestType==='HISTORY'){
        if(!categoryId) return res.send(response(baseResponse.PRODUCT_CATEGORY_ID_EMPTY));
        if(categoryId==='0'){
            const getBestProduct = await storeProvider.getHistoryBestProduct();
            result.push({CurrentTime: getCurrentTimestamp, BestProducts: getBestProduct});
        }
        else if(!(categoryId<=getCategory.length)){
            return res.send(errResponse(baseResponse.PRODUCT_CATEGORY_ID_ERROR));
        }
        else{
            const getCategoryBest = await storeProvider.getCategoryBest(categoryId);
            result.push({CurrentTime: getCurrentTimestamp, BestProducts: getCategoryBest});
        }
    }
    else{
        return res.send(errResponse(baseResponse.BEST_TYPE_ERROR));
    }
    return res.send(response(baseResponse.SUCCESS, result));
}

/**
 * API No. 26
 * API Name : 문의 조회 API
 * [GET] /app/products/productId/inquiry
 */
exports.getInquiry = async function(req, res){
    const productId = req.params.productId;
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    const countInquiry = await storeProvider.countInquiry(productId);
    const getInquiry = await storeProvider.getInquiry(productId);
    const result = [];
    result.push({InquiryCount: countInquiry, InquiryRows: getInquiry});
    return res.send(response(baseResponse.SUCCESS, result));
}


/**
 * API No. 27
 * API Name : 배송/교환/환불 조회 API
 * [GET] /app/products/:productId/info
 */
exports.getInfo = async function(req, res){
    const productId = req.params.productId;
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    const getDeliveryInfo = await storeProvider.getDeliveryInfo(productId);
    const getExchangeInfo = await storeProvider.getExchangeInfo(productId);
    const getRefundInfo = await storeProvider.getRefundInfo(productId);
    const getBrandInfo = await storeProvider.getBrandInfo(productId);
    const result=[];
    result.push({DeliveryInfo: getDeliveryInfo, ExchangeInfo: getExchangeInfo, RefundInfo: getRefundInfo, BrandInfo: getBrandInfo});
    return res.send(response(baseResponse.SUCCESS, result));
}


/**
 * API No. 30
 * API Name : 상품 리뷰 조회 API
 * [GET] /app/products/:productId/reviews
 */
exports.getReviews = async function(req, res){
    const productId = req.params.productId;
    const {sortType, photoType, pointType, optionId} = req.query;
    if(!productId) return res.send(response(baseResponse.PRODUCT_ID_EMPTY));
    if(!sortType) return res.send(response(baseResponse.SORT_TYPE_EMPTY));
    if(!photoType) return res.send(response(baseResponse.PHOTO_TYPE_EMPTY));
    if(!pointType) return res.send(response(baseResponse.POINT_TYPE_EMPTY));
    if(!optionId) return res.send(response(baseResponse.OPTION_EMPTY));
    const reviewAnalysis = await storeProvider.reviewAnalysis(productId);
    const result=[];
    if(sortType === 'BEST'){
        if(photoType === 'PHOTO'){
            if(pointType === '0'){
                if(optionId === '0'){
                    const getReviews = await storeProvider.getPhotoReview(productId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const getReviews = await storeProvider.getPhotoOptionReview(productId, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else if (pointType <= '5'){
                if(optionId === '0'){
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getPhotoPointReview(productId, pointType, pointTypes);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getPhotoPointOptionReview(productId, pointType, pointTypes, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else{
                return res.send(errResponse(baseResponse.POINT_TYPE_ERROR));
            }
        }
        else if(photoType === 'TOTAL'){
            if(pointType === '0'){
                if(optionId === '0'){
                    const getReviews = await storeProvider.getTotalReview(productId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const getReviews = await storeProvider.getTotalOptionReview(productId, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else if(pointType <= '5'){
                if(optionId === '0'){
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getTotalPointReview(productId, pointType, pointTypes);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getTotalPointOptionReview(productId, pointType, pointTypes, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else{
                return res.send(errResponse(baseResponse.POINT_TYPE_ERROR));
            }
        }
        else{
            return res.send(errResponse(baseResponse.PHOTO_TYPE_ERROR));
        }
    }
    else if(sortType === 'NEW'){
        if(photoType === 'PHOTO'){
            if(pointType === '0'){
                if(optionId === '0'){
                    const getReviews = await storeProvider.getNewPhotoReview(productId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const getReviews = await storeProvider.getNewPhotoOptionReview(productId, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else if (pointType <= '5'){
                if(optionId === '0'){
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getNewPhotoPointReview(productId, pointType, pointTypes);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                }
                else{
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getNewPhotoPointOptionReview(productId, pointType, pointTypes, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                }
            }
            else{
                return res.send(errResponse(baseResponse.POINT_TYPE_ERROR));
            }
        }
        else if(photoType === 'TOTAL'){
            if(pointType === '0'){
                if(optionId === '0'){
                    const getReviews = await storeProvider.getNewTotalReview(productId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const getReviews = await storeProvider.getNewTotalOptionReview(productId, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else if(pointType <= '5'){
                if(optionId === '0'){
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getNewTotalPointReview(productId, pointType, pointTypes);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
                else{
                    const pointTypes = pointType;
                    const getReviews = await storeProvider.getNewTotalPointOptionReview(productId, pointType, pointTypes, optionId);
                    result.push({AnalysisReview: reviewAnalysis, Reviews: getReviews});
                    return res.send(response(baseResponse.SUCCESS, result));
                }
            }
            else{
                return res.send(errResponse(baseResponse.POINT_TYPE_ERROR));
            }
        }
        else{
            return res.send(errResponse(baseResponse.PHOTO_TYPE_ERROR));
        }
    }
    else{
        return res.send(errResponse(baseResponse.REVIEW_SORT_TYPE_ERROR));
    }
}

/**
 * API No. 38
 * API Name : 이메일 뒷자리 조회 API
 * [GET] /app/backemails
 */
exports.getBackEmail = async function(req, res){
    const getBackEmail = await storeProvider.getBackEmail();
    return res.send(response(baseResponse.SUCCESS, getBackEmail));
}

/**
 * API No. 40
 * API Name : 배송 요청 사항 조회 API
 * [GET] /app/requests
 */
exports.getRequests = async function(req, res){
    const getRequests = await storeProvider.getRequests();
    return res.send(response(baseResponse.SUCCESS, getRequests));
}
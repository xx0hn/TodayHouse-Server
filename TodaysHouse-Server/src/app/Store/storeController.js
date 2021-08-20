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
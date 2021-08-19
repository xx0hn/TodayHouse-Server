const jwtMiddleware = require("../../../config/jwtMiddleware");
const postProvider = require("../../app/Post/postProvider");
const postService = require("../../app/Post/postService");
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

// 인기탭 조회
exports.getPopular = async function(req, res){
    const {categoryId} = req.query;
    const getTodayStory = await postProvider.getTodayStory();
    const getCategory = await postProvider.getCategory();
    const getBest =[];
    const result=[];
    const getCategoryName = await postProvider.getCategoryName(categoryId);
    const getPrintTotal = await postProvider.getPrintTotal();
    if(!categoryId) {
        const getBestProduct = await postProvider.getBestProduct();
        getBest.push(getPrintTotal, getBestProduct);
    }
    else if(!(categoryId<=getCategory.length)){
        return res.send(errResponse(baseResponse.PRODUCT_CATEGORY_ID_ERROR));
    }
    else {
        const getCategoryBest = await postProvider.getCategoryBest(categoryId);
        getBest.push(getCategoryName, getCategoryBest);
    }
    result.push({TodayStory: getTodayStory, ProductCategories: getCategory, BestProduct: getBest});
    return res.send(response(baseResponse.SUCCESS, result));
}
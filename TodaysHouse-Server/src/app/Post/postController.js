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


/**
 * API No. 17
 * API Name : 인기탭 조회 API
 * [GET] /app/posts/polular
 */
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

// 집들이 전체 조회


/**
 * API No. 19
 * API Name : 집들이 게시글 조회 API
 * [GET] /app/housewarms/:houseWarmId
 */
exports.getHouseWarm = async function (req, res){
    const houseWarmId = req.params.houseWarmId;
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const getHouseWarm = await postProvider.getHouseWarm(houseWarmId);
    const getContentsTitle = await postProvider.getContentsTitle(houseWarmId); //소제목 출력
    const userImageNickname = await postProvider.getUserImageNickname(houseWarmId); //작성자 프로필사진, 닉네임
    const getIncludeTotalProduct = await postProvider.getIncludeTotalProduct(houseWarmId); //포함된 상품 전체 조회
    const patchViewCount = await postService.patchViewCount(houseWarmId);
    const getTotalCount = await postProvider.getTotalCount(houseWarmId); //좋아요, 스크랩, 댓글, 조회수 출력
    const getComment = await postProvider.getComment(houseWarmId); //댓글
    const getHouseWarmStyleId = await postProvider.getHouseWarmStyleId(houseWarmId);
    const getSimilarHouseWarm = await postProvider.getSimilarHouseWarm(getHouseWarmStyleId[0].id); //비슷한 집들이 조회
    const houseWarmContents = [];
    const houseWarmTitle =[];
    const comments = [];
    const result = [];
    // for(let i=0; i<getContentsTitle.length; i++) {
    //     const getHouseWarmContents = await postProvider.getHouseWarmContents(houseWarmId, getContentsTitle[i].title);
    //     houseWarmTitle.push({Title: getContentsTitle[i], Contents: getHouseWarmContents});
    // }
    const houseWarmContent = await postProvider.houseWarmContent(houseWarmId);
    for (let i=0; i<houseWarmContent.length; i++) {
        const getHouseWarmContentsProduct = await postProvider.getHouseWarmContentsProduct(houseWarmContent[i].id);
        houseWarmContents.push(houseWarmContent[i], getHouseWarmContentsProduct);
    }

    for(let i=0; i<getComment.length; i++){
        const getReply = await postProvider.getReply(getComment[i].id);
        comments.push(getComment[i], getReply);
    }
    result.push({HouseWarmInfo: getHouseWarm, HouseWarmContents: houseWarmContents, WrittenBy: userImageNickname
                , IncludeTotalProduct: getIncludeTotalProduct, Count: getTotalCount, Comments: comments
                , SimilarHouseWarm: getSimilarHouseWarm});
    return res.send(response(baseResponse.SUCCESS, result));
}
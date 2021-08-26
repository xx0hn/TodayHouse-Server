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
    if(!categoryId) return res.send(response(baseResponse.PRODUCT_CATEGORY_ID_EMPTY));
    if(categoryId==='0') {
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

/**
 * API No. 18
 * API Name : 집들이 전체 조회 API
 * [GET] /app/posts/housewarms
 */
exports.getTotalHouseWarm = async function(req, res){
    var {sortType, buildingTypeId, minWidth, maxWidth, minBudget, maxBudget, familyTypeId, styleId, wallColorId, floorColorId, detailWorkId, areaId, workerId} = req.query;
    const result =[];
    if(!sortType) return res.send(response(baseResponse.SORT_TYPE_EMPTY));
    if(!minWidth) minWidth=0;
    if(!maxWidth) maxWidth=9999;
    if(!minBudget) minBudget=0;
    if(!maxBudget) maxBudget=9999;
    const buildingTypeIdForSearch = '%' + buildingTypeId + '%';
    const familyTypeIdForSearch = '%' + familyTypeId + '%';
    const styleIdForSearch = '%' + styleId + '%';
    const wallColorIdForSearch = '%' + wallColorId + '%';
    const floorColorIdForSearch = '%' + floorColorId + '%';
    const detailWorkIdForSearch = '%' + detailWorkId + '%';
    const areaIdForSearch = '%' + areaId + '%';
    const workerIdForSearch = '%' + workerId + '%';
    const houseWarmParams = [buildingTypeIdForSearch, minWidth, maxWidth, minBudget, maxBudget, familyTypeIdForSearch, styleIdForSearch, wallColorIdForSearch, floorColorIdForSearch, detailWorkIdForSearch, areaIdForSearch, workerIdForSearch];
    if(sortType==='NEW'){
        const getNewHouseWarm = await postProvider.getNewHouseWarms(houseWarmParams);
        const houseWarmCount = getNewHouseWarm.length
        result.push({HouseWarmCount: houseWarmCount, HouseWarms: getNewHouseWarm});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(sortType==='POPULAR'){
        const getPopularHouseWarm = await postProvider.getPopularHouseWarms(houseWarmParams);
        const houseWarmCount = getPopularHouseWarm.length;
        result.push({HouseWarmCount: houseWarmCount, HouseWarms: getPopularHouseWarm});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(sortType==='OLD'){
        const getOldHouseWarm = await postProvider.getOldHouseWarms(houseWarmParams);
        const houseWarmCount = getOldHouseWarm.length;
        result.push({HouseWarmCount: houseWarmCount, HouseWarms: getOldHouseWarm});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    return res.send(errResponse(baseResponse.HOUSEWARM_SORT_TYPE_ERROR));
}

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
    const patchViewCount = await postService.patchViewCount(houseWarmId);
    const result=[];
    const houseWarmContents = [];
    const houseWarmContent = await postProvider.houseWarmContent(houseWarmId);
    for (let i=0; i<houseWarmContent.length; i++) {
        const getHouseWarmContentsProduct = await postProvider.getHouseWarmContentsProduct(houseWarmContent[i].id);
        houseWarmContents.push({HouseWarmContents: houseWarmContent[i], Products: getHouseWarmContentsProduct});
    }
    result.push({HouseWarmInfo: getHouseWarm, HouseWarmContents: houseWarmContents, WrittenBy: userImageNickname});
    return res.send(response(baseResponse.SUCCESS, result));
}


/**
 * API No. 20
 * API Name : 통합 검색 API
 * [GET] /app/posts
 */
exports.getSearch = async function (req, res){
    const {type, keyword} = req.query;
    if(!type) return res.send(response(baseResponse.SEARCH_TYPE_EMPTY));
    if(!keyword) return res.send(response(baseResponse.SEARCH_KEYWORD_EMPTY));
    const keywords = keyword;
    const keywordss = keyword;
    const keywordsss = keyword;
    const keywordssss = keyword;
    const result =[];
    const getSearchStore = await postProvider.getSearchStore(keyword, keywords, keywordss, keywordsss, keywordssss);
    let storeCount = getSearchStore.length;
    const getStoreCounts = await postProvider.getStoreCounts(storeCount);
    const getSearchHouseWarm = await postProvider.getSearchHouseWarm(keyword, keywords, keywordss, keywordsss, keywordssss);
    let houseWarmCount = getSearchHouseWarm.length;
    const getHouseWarmCounts = await postProvider.getHouseWarmCounts(houseWarmCount);
    const getSearchUser = await postProvider.getSearchUser(keyword);
    let userCount = getSearchUser.length;
    const getUserCounts = await postProvider.getUserCounts(userCount);
    if(type==='TOTAL'){
        result.push({StoreCount: getStoreCounts, Stores: getSearchStore, HouseWarmCount: getHouseWarmCounts, HouseWarms: getSearchHouseWarm, UserCount: getUserCounts, Users: getSearchUser});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(type==='STORE'){
        const getSearchStore = await postProvider.getSearchProducts(keyword, keywords, keywordss, keywordsss, keywordssss);
        const count = await postProvider.getStoreCounts(getSearchStore.length);
        result.push({StoreCount: count, Stores: getSearchStore});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(type==='HOUSEWARM'){
        const getSearchHouseWarm = await postProvider.getSearchHouseWarms(keyword, keywords, keywordss, keywordsss, keywordssss);
        const count = await postProvider.getHouseWarmCounts(getSearchHouseWarm.length);
        result.push({HouseWarmCount: count, HouseWarms: getSearchHouseWarm});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    else if(type==='USER') {
        const getSearchUser = await postProvider.getSearchUsers(keyword);
        const count = await postProvider.getUserCounts(getSearchUser.length);
        result.push({UserCount: count, Users: getSearchUser});
        return res.send(response(baseResponse.SUCCESS, result));
    }
    return res.send(errResponse(baseResponse.SEARCH_TYPE_ERROR));
}

/**
 * API No. 42
 * API Name : 집들이 댓글 API
 * [GET] /app/housewarms/:houseWarmId/comments
 */
exports.getComment = async function(req, res){
    const houseWarmId = req.params.houseWarmId;
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const comments = [];
    const getComment = await postProvider.getComment(houseWarmId); //댓글
    for(let i=0; i<getComment.length; i++){
        const getReply = await postProvider.getReply(getComment[i].id);
        comments.push(getComment[i], getReply);
    }
    return res.send(response(baseResponse.SUCCESS, comments));
}

/**
 * API No. 43
 * API Name : 집들이 좋아요, 스크랩, 댓글, 조회수 조회 API
 * [GET] /app/housewarms/:houseWarmId/status
 */
exports.getStatus = async function(req, res){
    const houseWarmId = req.params.houseWarmId;
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const getTotalCount = await postProvider.getTotalCount(houseWarmId); //좋아요, 스크랩, 댓글, 조회수 출력
    return res.send(response(baseResponse.SUCCESS, getTotalCount));
}

/**
 * API No. 44
 * API Name : 비슷한 집들이 조회 API
 * [GET] /app/housewarms/:houseWarmId/similar
 */
exports.getSimilar = async function(req, res){
    const houseWarmId = req.params.houseWarmId;
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const getHouseWarmStyleId = await postProvider.getHouseWarmStyleId(houseWarmId);
    const getSimilarHouseWarm = await postProvider.getSimilarHouseWarm(getHouseWarmStyleId[0].id); //비슷한 집들이 조회
    return res.send(response(baseResponse.SUCCESS, getSimilarHouseWarm));
}

/**
 * API No. 61
 * API Name : 집들이 게시글에 포함된 모든 상품 조회 API
 * [GET] /app/housewarms/products
 */
exports.getProducts = async function(req, res){
    const houseWarmId = req.params.houseWarmId;
    if(!houseWarmId) return res.send(response(baseResponse.HOUSE_WARM_ID_EMPTY));
    const getIncludeTotalProduct = await postProvider.getIncludeTotalProduct(houseWarmId); //포함된 상품 전체 조회
    return res.send(response(baseResponse.SUCCESS, getIncludeTotalProduct));
}
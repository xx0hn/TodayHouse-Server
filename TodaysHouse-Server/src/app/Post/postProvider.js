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

//집들이 하나 조회
exports.getHouseWarm = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getHouseWarm = await postDao.selectHouseWarm(connection, houseWarmId);
    connection.release();
    return getHouseWarm;
}

//집들이 소제목 조회
exports.getContentsTitle = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getContentsTitle = await postDao.selectContentsTitle(connection, houseWarmId);
    connection.release();
    return getContentsTitle;
}

//작성자 프로필 사진, 닉네임 조회
exports.getUserImageNickname = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getUser = await postDao.selectUser(connection, houseWarmId);
    connection.release();
    return getUser;
}

//포함된 전체 상품 조회
exports.getIncludeTotalProduct = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalProduct = await postDao.selectTotalProduct(connection, houseWarmId);
    connection.release();
    return getTotalProduct;
}

//좋아요, 스크랩, 댓글, 조회수 출력
exports.getTotalCount = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getTotalCount = await postDao.selectTotalCount(connection, houseWarmId);
    connection.release();
    return getTotalCount;
}

//댓글 조회
exports.getComment = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getComment = await postDao.selectComment(connection, houseWarmId);
    connection.release();
    return getComment;
}

//집들이 스타일id 조회
exports.getHouseWarmStyleId = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getStyleId = await postDao.selectStyle(connection, houseWarmId);
    connection.release();
    return getStyleId;
}

//비슷한 집들이 조회
exports.getSimilarHouseWarm = async function(styleId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSimilarHouseWarm = await postDao.selectSimilarHouseWarm(connection, styleId);
    connection.release();
    return getSimilarHouseWarm;
}

//집들이 내용 조회
exports.getHouseWarmContents = async function(houseWarmId, title){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getHouseWarmContents = await postDao.selectHouseWarmContents(connection, houseWarmId, title);
    connection.release();
    return getHouseWarmContents;
}

exports.houseWarmContent = async function(houseWarmId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getHouseWarmContent = await postDao.houseWarmContent(connection, houseWarmId);
    connection.release();
    return getHouseWarmContent;
}

//집들이 사진에 들어가는 상품 조회
exports.getHouseWarmContentsProduct = async function(houseWarmContentsId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getHouseWarmContentsProduct = await postDao.selectHouseWarmContentsProduct(connection, houseWarmContentsId);
    connection.release();
    return getHouseWarmContentsProduct;
}

//대댓글 조회
exports.getReply = async function(commentId){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getReply = await postDao.selectReply(connection, commentId);
    connection.release();
    return getReply;
}

//전체 검색 스토어
exports.getSearchStore = async function(keyword, keywords, keywordss, keywordsss, keywordssss){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchStore = await postDao.selectSearchStore(connection, keyword, keywords, keywordss, keywordsss, keywordssss);
    connection.release();
    return getSearchStore;
}

//전체 검색 집들이
exports.getSearchHouseWarm = async function(keyword, keywords, keywordss, keywordsss, keywordssss){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchHouseWarm = await postDao.selectSearchHouseWarm(connection, keyword, keywords, keywordss, keywordsss, keywordssss);
    connection.release();
    return getSearchHouseWarm;
}

//전체 검색 유저
exports.getSearchUser = async function(keyword){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchUser = await postDao.selectSearchUser(connection, keyword);
    connection.release();
    return getSearchUser;
}

//검색 스토어
exports.getSearchProducts = async function(keyword, keywords, keywordss, keywordsss, keywordssss){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchProducts = await postDao.selectSearchProducts(connection, keyword, keywords, keywordss, keywordsss, keywordssss);
    connection.release();
    return getSearchProducts;
}

//검색 집들이
exports.getSearchHouseWarms = async function(keyword, keywords, keywordss, keywordsss, keywordssss){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchHouseWarms = await postDao.selectSearchHouseWarms(connection, keyword, keywords, keywordss, keywordsss, keywordssss);
    connection.release();
    return getSearchHouseWarms;
}

//검색 유저
exports.getSearchUsers = async function(keyword){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getSearchUsers = await postDao.selectSearchUsers(connection, keyword);
    connection.release();
    return getSearchUsers;
}

//스토어 수
exports.getStoreCounts = async function(storeCount){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getStoreCount = await postDao.selectStoreCounts(connection, storeCount);
    connection.release();
    return getStoreCount;
}



//집들이 수
exports.getHouseWarmCounts = async function(houseWarmCount){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getHouseWarmCount = await postDao.selectHouseWarmCounts(connection, houseWarmCount);
    connection.release();
    return getHouseWarmCount;
}

//유저 수
exports.getUserCount = async function(keyword){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getUserCount = await postDao.selectUserCounts(connection, keyword);
    connection.release();
    return getUserCount;
}

//유저 수
exports.getUserCounts = async function(userCount){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getUserCount = await postDao.selectUserCounts(connection, userCount);
    connection.release();
    return getUserCount;
}

//집들이 신규 순 조회
exports.getNewHouseWarms = async function(houseWarmParams){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getNewHouseWarms = await postDao.selectNewHouseWarms(connection, houseWarmParams);
    connection.release();
    return getNewHouseWarms;
}

//집들이 인기 순 조회
exports.getPopularHouseWarms = async function(houseWarmParams){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getPopularHouseWarms = await postDao.selectPopularHouseWarms(connection, houseWarmParams);
    connection.release();
    return getPopularHouseWarms;
}

//집들이 오래된 순 조회
exports.getOldHouseWarms = async function(houseWarmParams){
    const connection = await pool.getConnection(async(conn)=>conn);
    const getOldHouseWarms = await postDao.selectOldHouseWarms(connection, houseWarmParams);
    connection.release();
    return getOldHouseWarms;
}
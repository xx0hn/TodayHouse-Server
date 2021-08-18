const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);

  connection.release();

  return userResult[0];
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult;
};

//유저 상태 체크
exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();

  return userAccountResult;
};

//닉네임으로 유저 조회
exports.nickNameCheck = async function(nickName){
  const connection = await pool.getConnection(async(conn)=>conn);
  const nickNameUser = await userDao.selectUserNickName(connection, nickName);
  connection.release();

  return nickNameUser;
}

//유저 마이 페이지 조회
exports.getMyPages = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectMyPages = await userDao.selectUserMyPages(connection, userId);
  connection.release();
  return selectMyPages;
}

//마이페이지 공간 이름 전체
exports.spaceTotal = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const printTotal = await userDao.printTotal(connection, userId);
  connection.release();
  return printTotal;
}

//마이페이지 유저 사진 조회
exports.getPictures = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectPictures = await userDao.selectUserPictures(connection, userId);
  connection.release();
  return selectPictures;
}

//마이페이지 공간 이름 조회
exports.getPicturesSpace = async function(spaceId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectPicturesSpace = await userDao.selectPicturesSpace(connection, spaceId);
  connection.release();
  return selectPicturesSpace;
}

//마이페이지 유저 사진 조회 (공간 별)
exports.getUserPictures = async function(userId, spaceId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectUserPictures = await userDao.selectSpacePictures(connection,userId, spaceId);
  connection.release();
  return selectUserPictures;
}

//마이페이지 스크랩북 조회
exports.getScrapBook = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectScrapBook = await userDao.selectScrapBook(connection, userId);
  connection.release();
  return selectScrapBook;
}

//마이페이지 집들이 조회
exports.getHouseWarm = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectHouseWarm = await userDao.selectHouseWarm(connection, userId);
  connection.release();
  return selectHouseWarm;
}

//마이페이지 노하우 조회
exports.getKnowHow = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectKnowHow = await userDao.selectKnowHow(connection, userId);
  connection.release();
  return selectKnowHow;
}

//마이페이지 스크랩북 갯수
exports.countScrapBook = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const countScrapBook = await userDao.countScrapBook(connection, userId);
  connection.release();
  return countScrapBook;
}

//마이페이지 집들이 갯수
exports.countHouseWarm = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const countHouseWarm = await userDao.countHouseWarm(connection, userId);
  connection.release();
  return countHouseWarm;
}

//마이페이지 집들이 갯수
exports.countKnowHow = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const countKnowHow = await userDao.countKnowHow(connection, userId);
  connection.release();
  return countKnowHow;
}

//다른 유저 페이지 정보
exports.userPageInfo = async function(usersId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const userPageInfo = await userDao.selectUserPageInfo(connection, usersId);
  connection.release();
  return userPageInfo;
}

//다른 유저 사진 갯수
exports.countPictures = async function(usersId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const countPictures = await userDao.countPictures(connection, usersId);
  connection.release();
  return countPictures;
}

//폴더명 중복 확인
exports.checkFolderNames = async function(userId, folderName){
  const connection = await pool.getConnection(async(conn)=>conn);
  const checkFolderNames = await userDao.selectUserByFolderName(connection, userId, folderName);
  connection.release();
  return checkFolderNames;
}

//집들이 스크랩 확인
exports.checkHouseWarm = async function(userId, id){
  const connection = await pool.getConnection(async(conn)=>conn);
  const checkHouseWarm = await userDao.selectHouseWarmById(connection, userId, id);
  connection.release();
  return checkHouseWarm;
}

//집들이 스크랩 재확인
exports.reCheckHouseWarm = async function(userId, id){
  const connection = await pool.getConnection(async(conn)=>conn);
  const checkHouseWarm = await userDao.selectHouseWarmCheck(connection, userId, id);
  connection.release();
  return checkHouseWarm;
}

//상품 스크랩 확인
exports.checkProduct = async function(userId, id){
  const connection = await pool.getConnection(async(conn)=>conn);
  const checkProduct = await userDao.selectProductById(connection, userId, id);
  connection.release();
  return checkProduct;
}

//상품 스크랩 재확인
exports.reCheckProduct = async function(userId, id){
  const connection = await pool.getConnection(async(conn)=>conn);
  const checkProduct = await userDao.selectProductCheck(connection, userId, id);
  connection.release();
  return checkProduct;
}

//스크랩 전체 조회
exports.getTotalScrap = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getTotalScrap = await userDao.selectTotalScrap(connection, userId);
  connection.release();
  return getTotalScrap;
}

//스크랩 폴더 조회
exports.getFolder = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getFolder = await userDao.selectFolder(connection, userId);
  connection.release();
  return getFolder;
}

//스크랩 폴더 이미지 조회
exports.getFolderImage = async function(userId, folderId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getFolderImage = await userDao.selectFolderImage(connection, userId, folderId);
  connection.release();
  return getFolderImage;
}

//스크랩 상품 전체 조회
exports.getTotalProduct = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getTotalProduct = await userDao.selectTotalProduct(connection, userId);
  connection.release();
  return getTotalProduct;
}

//스크랩 상품 카테고리별 조회
exports.getProduct = async function(userId, categoryId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getProduct = await userDao.selectProduct(connection, userId, categoryId);
  connection.release();
  return getProduct;
}

//상품 대표이미지 조회
exports.getProductImage = async function(productId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getProductImage = await userDao.selectProductImage(connection, productId);
  connection.release();
  return getProductImage;
}

//스크랩 집들이 조회
exports.getScrapHouseWarm = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getHouseWarm = await userDao.selectScrapHouseWarm(connection, userId);
  connection.release();
  return getHouseWarm;
}

//좋아요 체크 (전에 눌렀다가 취소한 경우)
exports.likeCheck = async function (userId, houseWarmId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const likeCheck = await userDao.selectLike(connection, userId, houseWarmId);
  connection.release();
  return likeCheck;
}

//좋아요 체크 (이미 좋아요중인 경우)
exports.likeReCheck = async function(userId, houseWarmId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const likeReCheck = await userDao.selectLikeCheck(connection, userId, houseWarmId);
  connection.release();
  return likeReCheck;
}

//전체 좋아요 조회
exports.getTotalLike = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getTotalLike = await userDao.selectTotalLike(connection, userId);
  connection.release();
  return getTotalLike;
}

//집들이 좋아요 조회
exports.getHouseWarmLike = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getHouseWarmLike = await userDao.selectHouseWarmLike(connection, userId);
  connection.release();
  return getHouseWarmLike;
}

//이전 팔로우 조회
exports.followCheck = async function(userId, usersId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getFollowCheck = await userDao.selectFollow(connection, userId, usersId);
  connection.release();
  return getFollowCheck;
}

//이전 팔로우 유효한지 조회
exports.followReCheck = async function(userId, usersId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const getFollowReCheck = await userDao.selectFollowCheck(connection, userId, usersId);
  connection.release();
  return getFollowReCheck;
}
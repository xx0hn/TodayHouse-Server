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

//마이페이지 유저 사진 조회
exports.getPictures = async function(userId){
  const connection = await pool.getConnection(async(conn)=>conn);
  const selectPictures = await userDao.selectUserPictures(connection, userId);
  connection.release();
  return selectPictures;
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
  return checkFolderNames;
}
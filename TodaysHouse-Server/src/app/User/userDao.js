// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickName 
                FROM User
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT id, email, nickName 
                 FROM User
                 WHERE id = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(email, passWord, nickName)
        VALUES (?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(
    insertUserInfoQuery,
    insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT passWord
        FROM User
        WHERE email = ? AND passWord = ?;`;
  const [selectUserPasswordRow] = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );

  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, id
        FROM User
        WHERE email = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow[0];
}


//닉네임으로 유저 조회
async function selectUserNickName(connection, nickName){
  const selectUserNickNameQuery=`
    select id
    from User
    where nickName = ?;
 `;
  const [nickNameResult] = await connection.query(selectUserNickNameQuery, nickName);
  return nickNameResult;
}

//유저 마이페이지 조회
async function selectUserMyPages(connection, userId){
  const selectUserMypageQuery=`
  select a.id as userId
        , a.nickName as NickName
        , a.profileImageUrl as ProfileImage
        , follower as Follower
        , following as Following
        , countScrap as ScrapBook
        , case when countLike is null then 0 else countLike end as Likes
from User a
left join ( select id
                    , fromUserId
                    , toUserId
                    , status
                    , count(case when status = 'ACTIVE'  and toUserId then 1 end) as follower
                from Follow
                group by toUserId ) as b
                on a.id = b.toUserId
left join ( select id
                    , fromUserId
                    , toUserId
                    , count(case when status = 'ACTIVE' and fromUserId then 1 end) as following
                from Follow
                group by fromUserId) as c
                on a.id = c.fromUserId
left join ( select id
                    , userId
                    , status
                    , count(case when status = 'ACTIVE' and userId then 1 end) as countScrap
                from Scrap 
                group by userId) as d
                on a.id = d.userId
left join ( select id
                    , userId
                    , status
                    , count(case when status = 'ACTIVE' and userId  then 1 end) as countLike
                from Likes 
                group by userId) as e
                on a.id = e.userId
left join ( select id
                    , userId
                from Picture ) as f
                on a.id = f.userId
where a.id = 1
group by a.id;`;
  const [myPageRows] = await connection.query(selectUserMypageQuery, userId);
  return myPageRows;
}

//유저 사진 조회
async function selectUserPictures(connection, userId){
  const selectUserPicturesQuery=`
  select imageUrl
from PictureContents a
left join ( select id
                    , userId
                from Picture ) as b
                on a.pictureId = b.id
where b.userId = ?
order by createdAt desc limit 1;`;
  const [pictureRows] = await connection.query(selectUserPicturesQuery, userId);
  return pictureRows;
}

//유저 사진 조회(공간 별)
async function selectSpacePictures(connection, userId, spaceId){
  const selectSpacePicturesQuery=`
  select d.name as SpaceName
        , imageUrl as Image 
from PictureContents a
left join ( select id
                    , userId
                from Picture ) as b
                on a.pictureId = b.id
left join ( select pictureContentsId
                    , spaceId
                from SpaceMapping ) as c
                on a.id = c.pictureContentsId
left join ( select id
                    , name
                from Space ) as d
                on c.spaceId = d.id
where b.userId =? and d.id=?
order by createdAt desc limit 1;`;
  const [spacePictureRows] = await connection.query(selectSpacePicturesQuery, [userId, spaceId]);
  return spacePictureRows;
}

//마이페이지 스크랩북 조회
async function selectScrapBook (connection, userId){
  const selectScrapBookQuery=`
  select case when a.houseWarmId is not null or a.proHouseWarmId is not null then '집들이'  when a.pictureId is not null then '사진' when a.knowHowId is not null then '노하우' end as Type
        , case when a.houseWarmId is not null then b.imageUrl when a.proHouseWarmId is not null then e.imageUrl when a.pictureId is not null then d.imageUrl when a.knowHowId is not null then f.imageUrl end as Image
from Scrap a
left join ( select id
                , imageUrl
                from HouseWarm ) as b
                on a.houseWarmId = b.id
left join ( select id
                from Picture ) as c
                on a.pictureId = c.id
left join ( select id
                    , pictureId
                    , imageUrl
                from PictureContents ) as d
                on c.id = d.pictureId
left join ( select id
                    , imageUrl
                from ProHouseWarming ) as e
                on a.proHouseWarmId = e.id
left join ( select id
                    , imageUrl
                from KnowHow ) as f
                on a.knowHowId = f.id
where userId = ?
order by createdAt desc limit 9;`;
  const [scrapBookRows] = await connection.query(selectScrapBookQuery, userId);
  return scrapBookRows;
}

//마이페이지 집들이 조회
async function selectHouseWarm(connection, userId){
  const selectHouseWarmQuery=`
  select imageUrl as Image
        , case when id is not null then '온라인 집들이' end as Type 
        , title as Title
from HouseWarm
where userId = 1
order by createdAt desc;`;
  const [houseWarmRows] = await connection.query(selectHouseWarmQuery, userId);
  return houseWarmRows;
}

//마이페이지 노하우 조회
async function selectKnowHow(connection, userId){
  const selectKnowHowQuery=`
  select a.imageUrl as Image
        , b.name as ThemaName
        , a.title as Title
  from KnowHow a
  left join ( select id
                    , name 
                from KnowHowThema ) as b
                on a.themaId = b.id
  where userId = ?
  order by createdAt desc;`;
  const [knowHowRows] = await connection.query(selectKnowHowQuery, userId);
  return knowHowRows;
}

//마이페이지 스크랩 갯수
async function countScrapBook(connection ,userId){
  const countScrapBookQuery=`
  select count(case when status = 'ACTIVE' and userId then 1 end) as ScrapBookCount
  from Scrap
  where userId = ?;`;
  const [countScrapRows] = await connection.query(countScrapBookQuery, userId);
  return countScrapRows;
}

//마이페이지 집들이 갯수
async function countHouseWarm(connection, userId){
  const countHouseWarmQuery=`
  select count(case when status = 'ACTIVE' and userId then 1 end) as HouseWarmCount
  from HouseWarm
  where userId = ?;`;
  const [countHouseWarmRows] = await connection.query(countHouseWarmQuery, userId);
  return countHouseWarmRows;
}

//마이페이지 노하우 갯수
async function countKnowHow(connection, userId){
  const countKnowHowQuery=`
  select count(case when status = 'ACTIVE' and userId then 1 end) as KnowHowCount
  from KnowHow
  where userId = ?;`;
  const [countKnowHowRows] = await connection.query(countKnowHowQuery, userId);
  return countKnowHowRows;
}

//다른 유저 페이지 조회
async function selectUserPageInfo(connection, usersId){
  const selectUserPageInfoQuery=`
  select a.nickName as NickName
        , a.profileImageUrl as ProfileImage
        , case when follower is null then 0 else follower end as Follower
        , case when following is null then 0 else following end as Following
from User a
left join ( select id
                    , fromUserId
                    , toUserId
                    , status
                    , count(case when status = 'ACTIVE'  and toUserId then 1 end) as follower
                from Follow
                group by toUserId ) as b
                on a.id = b.toUserId
left join ( select id
                    , fromUserId
                    , toUserId
                    , count(case when status = 'ACTIVE' and fromUserId then 1 end) as following
                from Follow
                group by fromUserId) as c
                on a.id = c.fromUserId
where a.id = ?;`;
  const [otherUserInfoRows] = await connection.query(selectUserPageInfoQuery, usersId);
  return otherUserInfoRows;
}

//다른 유저 사진 갯수
async function countPictures(connection, usersId){
  const countPicturesQuery=`
  select count(case when a.status = 'ACTIVE' and b.userId then 1 end) as PictureCount
from PictureContents a
left join ( select id
                , userId
                from Picture ) as b
                on a.pictureId = b.id
where b.userId =?;` ;
  const [pictureCountRows] = await connection.query(countPicturesQuery, usersId);
  return pictureCountRows;
}

//소셜 로그인 유저 생성
async function insertSocialUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO User(nickName, email, type)
        VALUES ( ?, ?, ?);
    `;
  const insertUserInfoRow = await connection.query(insertUserInfoQuery, insertUserInfoParams);
  return insertUserInfoRow;
}

//프로필 이미지 변경
async function patchProfileImage(connection, editInfo, userId){
  const patchProfileImageQuery=`
  update User
  set profileImageUrl = ? , updatedAt = current_timestamp
  where id = ?;`;
  const [patchProfileImageRows] = await connection.query(patchProfileImageQuery, [editInfo, userId]);
  return patchProfileImageRows;
}

//배경 이미지 변경
async function patchBackgroundImage(connection, editInfo, userId){
  const patchBackgroundImageQuery=`
  update User
  set backgroundImageUrl=? , updatedAt = current_timestamp
  where id = ?;`;
  const [patchBackgroundImageRows] = await connection.query(patchBackgroundImageQuery, [editInfo, userId]);
  return patchBackgroundImageRows;
}

//닉네임 변경
async function patchNickName(connection, editInfo, userId){
  const patchNickNameQuery=`
  update User
  set nickName = ?, updatedAt = current_timestamp
  where id = ?;`;
  const [patchNickNameRows] = await connection.query(patchNickNameQuery, [editInfo, userId]);
  return patchNickNameRows;
}

//My URL 변경
async function patchMyUrl(connection, editInfo, userId){
  const patchMyUrlQuery=`
  update User
  set myUrl = ?, updatedAt = current_timestamp
  where id = ?;`;
  const [patchMyUrlRows] = await connection.query(patchMyUrlQuery, [editInfo, userId]);
  return patchMyUrlRows;
}

//한줄 소개 변경
async function patchIntro(connection, editInfo, userId){
  const patchIntroQuery=`
  update User
  set introduce = ?, updatedAt = current_timestamp
  where id = ?;`;
  const [patchIntroRows] = await connection.query(patchIntroQuery, [editInfo, userId]);
  return patchIntroRows;
}

//폴더명 중복 확인
async function selectUserByFolderName(connection, userId, folderName){
  const selectUserByFolderNameQuery=`
  select userId
  from Folder
  where userId = ? and name = ?;`;
  const [userByFolderRows] = await connection.query(selectUserByFolderNameQuery, [userId, folderName]);
  return userByFolderRows;
}

//스크랩 폴더 생성
async function postScrapFolders(connection, userId, folderName, folderInfo){
  const postScrapFoldersQuery=`
  insert into Folder(userId, name, info)
  values(?, ?, ?);`;
  const [scrapFoldersRows] = await connection.query(postScrapFoldersQuery, [userId, folderName, folderInfo]);
  return scrapFoldersRows;
}

//스크랩 폴더 삭제
async function deleteFolder(connection, userId, folderId){
  const deleteFolderQuery=`
  update Folder
  set status = 'DELETED', updatedAt = current_timestamp
  where userId = ? and id = ?;`;
  const [deleteFolderRows] = await connection.query(deleteFolderQuery, [userId, folderId]);
  return deleteFolderRows;
}

//스크랩 폴더 수정
async function editFolder(connection, folderName, folderInfo, folderId){
  const editFolderQuery=`
  update Folder
  set name = ? , info = ?, updatedAt = current_timestamp
  where id = ?;`;
  const [editFolderRows] = await connection.query(editFolderQuery, [folderName, folderInfo, folderId]);
  return editFolderRows;
}

//집들이 스크랩 확인
async function selectHouseWarmById(connection, userId, id){
  const selectHouseWarmByIdQuery=`
    select a.id
    from Scrap a
           left join (select id
                      from HouseWarm) as b
                     on a.houseWarmId = b.id
    where a.userId = ?
      and a.houseWarmId = ?
      and (a.status = 'INACTIVE' or a.status = 'DELETED');`;
  const [houseWarmRows] = await connection.query(selectHouseWarmByIdQuery, [userId, id]);
  return houseWarmRows;
}

//집들이 스크랩 상태 변경
async function editScrapStatus (connection, userId, id){
  const editScrapStatusQuery=`
  update Scrap
  set status = 'ACTIVE'
  where userId = ? and houseWarmId = ?;`;
  const [scrapRows] = await connection.query(editScrapStatusQuery, [userId, id]);
  return scrapRows;
}

//집들이 스크랩 생성
async function postScrap(connection, userId, id, folderId){
  const postScrapQuery=`
  insert into Scrap(userId, houseWarmId, folderId)
  values(?,?,?);`;
  const [postScrapRows] = await connection.query(postScrapQuery, [userId, id, folderId]);
  return postScrapRows;
}

//상품 스크랩 확인
async function selectProductById(connection, userId, id){
  const selectProductByIdQuery=`select a.id
from Scrap a
left join ( select id
                from Product ) as b
                on a.productId = b.id
where a.userId = ? and a.productId = ? and (a.status = 'INACTIVE' or a.status = 'DELETED');`;
  const [productRows] = await connection.query(selectProductByIdQuery, [userId, id]);
  return productRows;
}

//상품 스크랩 상태 수정
async function editProductScrapStatus(connection, userId, id){
  const editProductionScrapStatusQuery=`
  update Scrap
  set status ='ACTIVE'
  where userId = ? and productId = ?;`;
  const [editProductScrapStatusRows] = await connection.query(editProductionScrapStatusQuery, [userId, id]);
  return editProductScrapStatusRows;
}

//상품 스크랩 생성
async function postProductScrap(connection, userId, id, folderId){
  const postProductScrapQuery=`
  insert into Scrap(userId, productId, folderId)
  values(?,?,?);`;
  const [postProductScrapRows] = await connection.query(postProductScrapQuery, [userId, id, folderId]);
  return postProductScrapRows;
}

//스크랩 취소
async function patchScrap(connection, userId, scrapId){
  const patchScrapQuery=`
  update Scrap
  set status = 'DELETED'
  where userId = ? and id = ?;`;
  const [patchScrapRows] = await connection.query(patchScrapQuery, [userId, scrapId]);
  return patchScrapRows;
}

module.exports = {
  selectUser,
  selectUserEmail,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  selectUserNickName,
  selectUserMyPages,
  selectUserPictures,
  selectSpacePictures,
  selectScrapBook,
  selectHouseWarm,
  selectKnowHow,
  countScrapBook,
  countHouseWarm,
  countKnowHow,
  selectUserPageInfo,
  countPictures,
  insertSocialUserInfo,
  patchProfileImage,
  patchBackgroundImage,
  patchNickName,
  patchMyUrl,
  patchIntro,
  selectUserByFolderName,
  postScrapFolders,
  deleteFolder,
  editFolder,
  selectHouseWarmById,
  editScrapStatus,
  postScrap,
  selectProductById,
  editProductScrapStatus,
  postProductScrap,
  patchScrap,
};

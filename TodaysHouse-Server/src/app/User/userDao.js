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
        , case when countScrap is null then 0 else countScrap end as ScrapBook
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
                    , count(userId) as couponCount
                from Coupon
                group by userId) as g
                on a.id = g.userId
where a.id = ?
group by a.id;`;
  const [myPageRows] = await connection.query(selectUserMypageQuery, userId);
  return myPageRows;
}

//전체 출력
async function printTotal(connection, userId){
  const printTotalQuery=`
  select case when id is not null then '전체' end as SpaceName
  from User 
  where id = ?;`;
  const [totalRows] = await connection.query(printTotalQuery, userId);
  return totalRows;
}

//유저 사진 조회
async function selectUserPictures(connection, userId){
  const selectUserPicturesQuery=`
  select imageUrl as Image
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

//사진 공간
async function selectPicturesSpace(connection, spaceId){
  const selectPicturesSpaceQuery=`
  select name as SpaceName
  from Space
  where id = ?;`;
  const [picturesSpaceRows] = await connection.query(selectPicturesSpaceQuery, spaceId);
  return picturesSpaceRows;
}

//유저 사진 조회(공간 별)
async function selectSpacePictures(connection, userId, spaceId){
  const selectSpacePicturesQuery=`
  select imageUrl as Image 
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
  select case when a.houseWarmId is not null then a.houseWarmId when a.productId is not null then a.productId end as Id
         , case when a.houseWarmId is not null then '집들이' when a.productId is not null then '상품' end as Type
        , case when a.houseWarmId is not null then b.imageUrl when a.productId is not null then h.imageUrl end as Image
from Scrap a
left join ( select id
                , imageUrl
                from HouseWarm 
                group by id ) as b
                on a.houseWarmId = b.id
left join ( select id
                    , imageUrl
                from ProHouseWarming 
                group by id ) as e
                on a.proHouseWarmId = e.id
left join ( select id
                from Product ) as g
                on a.productId = g.id
left join ( select id
                    , productId
                    , imageUrl
                from ProductImageUrl
            group by productId
                order by createdAt
                ) as h
                on g.id = h.productId
where userId = ? and a.id is not null and a.status = 'ACTIVE'
order by createdAt desc limit 9;`;
  const [scrapBookRows] = await connection.query(selectScrapBookQuery, userId);
  return scrapBookRows;
}

//마이페이지 집들이 조회
async function selectHouseWarm(connection, userId){
  const selectHouseWarmQuery=`
  select id as HouseWarmId
        , imageUrl as Image
        , case when id is not null then '온라인 집들이' end as Type 
        , title as Title
from HouseWarm
where userId = ?
order by createdAt desc;`;
  const [houseWarmRows] = await connection.query(selectHouseWarmQuery, userId);
  return houseWarmRows;
}



//마이페이지 스크랩 갯수
async function countScrapBook(connection ,userId){
  const countScrapBookQuery=`
  select userId as UserId
         , count(case when status = 'ACTIVE' and userId then 1 end) as ScrapBookCount
  from Scrap
  where userId = ?;`;
  const [countScrapRows] = await connection.query(countScrapBookQuery, userId);
  return countScrapRows;
}

//마이페이지 집들이 갯수
async function countHouseWarm(connection, userId){
  const countHouseWarmQuery=`
  select userId as UserId
         , count(case when status = 'ACTIVE' and userId then 1 end) as HouseWarmCount
  from HouseWarm
  where userId = ?;`;
  const [countHouseWarmRows] = await connection.query(countHouseWarmQuery, userId);
  return countHouseWarmRows;
}

//다른 유저 페이지 조회
async function selectUserPageInfo(connection, usersId){
  const selectUserPageInfoQuery=`
  select a.id as UserId
        , a.nickName as NickName
        , a.profileImageUrl as ProfileImage
        , a.myUrl as MyURL
        , a.introduce as UserIntro
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
      and a.houseWarmId = ?;`;
  const [houseWarmRows] = await connection.query(selectHouseWarmByIdQuery, [userId, id]);
  return houseWarmRows;
}

//집들이 스크랩 재확인
async function selectHouseWarmCheck(connection, userId, id){
  const selectHouseWarmByIdQuery=`
    select a.id
    from Scrap a
           left join (select id
                      from HouseWarm) as b
                     on a.houseWarmId = b.id
    where a.userId = ?
      and a.houseWarmId = ?
      and a.status ='ACTIVE';`;
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
where a.userId = ? and a.productId = ?`;
  const [productRows] = await connection.query(selectProductByIdQuery, [userId, id]);
  return productRows;
}

//상품 스크랩 재확인
async function selectProductCheck(connection, userId, id){
  const selectProductByIdQuery=`select a.id
from Scrap a
left join ( select id
                from Product ) as b
                on a.productId = b.id
where a.userId = ? and a.productId = ? and status = 'ACTIVE';`;
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


//집들이 스크랩 취소
async function cancelScrap(connection, userId, id){
  const patchScrapQuery=`
  update Scrap
  set status = 'DELETED'
  where userId = ? and houseWarmId = ?;`;
  const [patchScrapRows] = await connection.query(patchScrapQuery, [userId, id]);
  return patchScrapRows;
}

//상품 스크랩 취소
async function cancelProductScrap(connection, userId, id){
  const patchScrapQuery=`
  update Scrap
  set status = 'DELETED'
  where userId = ? and productId = ?;`;
  const [patchScrapRows] = await connection.query(patchScrapQuery, [userId, id]);
  return patchScrapRows;
}

//스크랩 전체 조회
async function selectTotalScrap(connection, userId){
  const selectTotalScrapQuery=`
  select case when a.houseWarmId is not null then '집들이' when a.productId is not null then '상품' when a.pictureId is not null then '사진' end as Type
\t\t, case when a.houseWarmId is not null then b.imageUrl when a.productId is not null then d.imageUrl when a.pictureId is not null then f.imageUrl end as Image
from Scrap a
left join ( select id
                    , imageUrl
                from HouseWarm ) as b
                on a.houseWarmId = b.id
left join ( select id
                from Product ) as c
                on a.productId = c.id
left join ( select id
                , productId
                , imageUrl
                from ProductImageUrl 
                group by productId ) as d
                on c.id = d.productId
left join ( select id
                from Picture ) as e
                on a.pictureId = e.id
left join ( select id
                , imageUrl
                , pictureId
                from PictureContents 
                group by pictureId) as f
                on e.id = f.pictureId
where a.userId = ? and a.status = 'ACTIVE';`;
  const [totalScrapRows] = await connection.query(selectTotalScrapQuery, userId);
  return totalScrapRows;
}

//스크랩 폴더 조회
async function selectFolder(connection, userId){
  const selectFolderQuery=`
  select a.id as id
        , a.name as FolderName
        , case when countScrap is null then 0 else countScrap end as ScrapCount
from Folder a
left join ( select id
                    , userId
                    , folderId
                    , houseWarmId
                    , productId
                    , pictureId
                    , count(folderId) as countScrap
            from Scrap
            group by folderId ) as b
            on a.id = b.folderId
where a.userId = ? and a.status = 'ACTIVE';`;
  const [folderRows] = await connection.query(selectFolderQuery, userId);
  return folderRows;
}

//스크랩 폴더 이미지 조회
async function selectFolderImage(connection, userId, folderId){
  const selectFolderImageQuery=`
  select case when a.houseWarmId is not null then c.imageUrl when a.productId is not null then e.imageUrl when a.pictureId is not null then g.imageUrl end as Image
from Scrap a
left join ( select id
            from Folder ) as b
            on a.folderId = b.id
left join ( select id
                , imageUrl
            from HouseWarm ) as c
            on a.houseWarmId = c.id
left join ( select id
            from Product ) as d
            on a.productId = d.id
left join ( select id
                , productId
                , imageUrl
            from ProductImageUrl 
            group by productId ) as e
            on d.id = e.productId
left join ( select id
                from Picture ) as f
                on a.pictureId = f.id
left join ( select id
                , imageUrl
                , pictureId
                from PictureContents 
                group by pictureId) as g
                on f.id = g.pictureId
where a.userId = ? and a.folderId = ? and a.status = 'ACTIVE'
order by a.createdAt desc limit 1;`;
  const [folderImageRows] = await connection.query(selectFolderImageQuery, [userId, folderId]);
  return folderImageRows;
}

//스크랩 상품 전체 조회
async function selectTotalProduct(connection, userId){
  const selectTotalProductQuery=`
  select a.productId as id
        , c.name as BrandName
        , b.name as ProductName
        , case when b.discount is not null then concat(b.discount, '%') end as Discount
        , format(b.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when countReview is null then 0 else countReview end as ReviewCount
        , case when e.delCost = 0 then '무료배송' end as DeliveryCost
        , case when b.discount is not null then '특가' end as CostType
from Scrap a
left join ( select id
                , name
                , brandId
                , largeCategoryId
                , delInfoId
                , cost
                , saleCost
                , discount
            from Product ) as b
            on a.productId = b.id
left join ( select id
                , name
            from Brand ) as c
            on b.brandId = c.id
left join ( select id
                , productId
                , starPoint
                , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                , count(productId) as 'countReview'
            from ProductReview 
            group by productId) as d
            on a.productId = d.productId
left join ( select id
                , delCost
            from DeliveryInfo ) as e
            on b.delInfoId = e.id 
where a.userId = ? and a.productId is not null and a.status = 'ACTIVE'`;
  const [totalProductRows] = await connection.query(selectTotalProductQuery, userId);
  return totalProductRows;
}

//스크랩 상품 카테고리별 조회
async function selectProduct(connection, userId, categoryId){
  const selectProductQuery=`
  select a.productId as id
        , c.name as BrandName
        , b.name as ProductName
        , case when b.discount is not null then concat(b.discount, '%') end as Discount
        , format(b.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when countReview is null then 0 else countReview end as ReviewCount
        , case when e.delCost = 0 then '무료배송' end as DeliveryCost
        , case when b.discount is not null then '특가' end as CostType
from Scrap a
left join ( select id
                , name
                , brandId
                , largeCategoryId
                , delInfoId
                , cost
                , saleCost
                , discount
            from Product ) as b
            on a.productId = b.id
left join ( select id
                , name
            from Brand ) as c
            on b.brandId = c.id
left join ( select id
                , productId
                , starPoint
                , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                , count(productId) as 'countReview'
            from ProductReview 
            group by productId) as d
            on a.productId = d.productId
left join ( select id
                , delCost
            from DeliveryInfo ) as e
            on b.delInfoId = e.id 
where a.userId = ? and b.largeCategoryId = ? and a.productId is not null and a.status = 'ACTIVE'`;
  const [scrapProductRows] = await connection.query(selectProductQuery, [userId, categoryId]);
  return scrapProductRows;
}

//상품 대표 이미지 조회
async function selectProductImage(connection, productId){
  const selectProductImageQuery=`
  select imageUrl
  from ProductImageUrl
  where productId = ?
  order by createdAt desc limit 1;`;
  const [productImageRows] = await connection.query(selectProductImageQuery, productId);
  return productImageRows;
}

//스크랩 집들이 조회
async function selectScrapHouseWarm(connection, userId){
  const selectScrapHouseWarmQuery=`
  select b.id as id
        , b.imageUrl as Image
        , case when a.houseWarmId is not null then '온라인 집들이' end as Type
        , b.title as Title
        , c.nickName as UserNickName
from Scrap a
left join ( select id
                    , title
                    , userId
                    , imageUrl
            from HouseWarm ) as b
            on a.houseWarmId = b.id
left join ( select id
                    , nickName
            from User ) as c
            on b.userId = c.id
where a.userId = ? and b.id is not null and a.status = 'ACTIVE';`;
  const [houseWarmRows] = await connection.query(selectScrapHouseWarmQuery, userId);
  return houseWarmRows;
}

//좋아요 체크 (전에 눌렀다가 취소한 경우)
async function selectLike(connection, userId, houseWarmId){
  const selectLikeQuery=`
  select id
  from Likes
  where userId = ? and houseWarmId = ? ;`;
  const [likeRows] = await connection.query(selectLikeQuery, [userId, houseWarmId]);
  return likeRows;
}

//좋아요 체크 (이미 좋아요중인 경우)
async function selectLikeCheck(connection, userId, houseWarmId){
  const selectLikeCheckQuery=`
  select id
  from Likes
  where userId = ? and houseWarmId = ? and status = 'ACTIVE';`;
  const [likeCheckRows] = await connection.query(selectLikeCheckQuery, [userId, houseWarmId]);
  return likeCheckRows;
}

//좋아요 (전에 눌렀다가 취소한 경우)
async function patchLike(connection, userId, houseWarmId){
  const patchLikeQuery=`
  update Likes
  set status = 'ACTIVE'
  where userId = ? and houseWarmId = ?;`;
  const [patchLikeRows] = await connection.query(patchLikeQuery, [userId, houseWarmId]);
  return patchLikeRows;
}

//좋아요 (처음인 경우)
async function postLike(connection, userId, houseWarmId){
  const postLikeQuery=`
  insert into Likes(userId, houseWarmId)
  values(?, ?);`;
  const [postLikeRows] = await connection.query(postLikeQuery, [userId, houseWarmId]);
  return postLikeRows;
}

//좋아요 취소
async function cancelLike(connection, userId, houseWarmId){
  const cancelLikeQuery=`
  update Likes
  set status = 'DELETED'
  where userId = ? and houseWarmId = ?;`;
  const [cancelLikeRows] = await connection.query(cancelLikeQuery, [userId, houseWarmId]);
  return cancelLikeRows;
}

//전체 좋아요 조회
async function selectTotalLike(connection, userId){
  const selectTotalLikeQuery=`
  select case when a.houseWarmId is not null then '집들이' end as Type
        , b.imageUrl as Image
from Likes a
left join ( select id
                , imageUrl
            from HouseWarm ) as b
            on a.houseWarmId = b.id
where a.userId = ? and a.status = 'ACTIVE';`;
  const [likeTotalRows] = await connection.query(selectTotalLikeQuery, userId);
  return likeTotalRows;
}

//집들이 좋아요 조회
async function selectHouseWarmLike(connection, userId){
  const selectHouseWarmLikeQuery=`
  select case when a.houseWarmId is not null then '온라인 집들이' end as Type
            , b.imageUrl as Image
            , b.title as Title
            , c.nickName as UserNickName
            , c.profileImageUrl as UserProfileImage
from Likes a
left join ( select id
                    , imageUrl
                    , title
                    , userId
            from HouseWarm) as b
            on a.houseWarmId = b.id
left join ( select id
                    , profileImageUrl
                    , nickName
            from User ) as c
            on b.userId = c.id
where a.userId = ? and a.status = 'ACTIVE';`;
  const [houseWarmLikeRows] = await connection.query(selectHouseWarmLikeQuery, userId);
  return houseWarmLikeRows;
}

//이전 팔로우 조회
async function selectFollow(connection, userId, usersId){
  const selectFollowQuery=`
  select id
from Follow
where fromUserId = ? and toUserId = ?;`;
  const [followRows] = await connection.query(selectFollowQuery, [userId, usersId]);
  return followRows;
}

//이전 팔로우 유효 조회
async function selectFollowCheck(connection, userId, usersId){
  const selectFollowCheckQuery=`
    select id
from Follow
where fromUserId = ? and toUserId = ? and status = 'ACTIVE';`;
  const [followCheckRows] = await connection.query(selectFollowCheckQuery, [userId, usersId]);
  return followCheckRows;
}

//취소된 팔로우 상태 수정
async function patchFollow(connection, userId, usersId){
  const patchFollowQuery=`
  update Follow
  set status = 'ACTIVE'
  where fromUserId = ? and toUserId = ?;`;
  const [patchFollowRows] = await connection.query(patchFollowQuery, [userId, usersId]);
  return patchFollowRows;
}

//팔로우 처음 생성
async function postFollow(connection, userId, usersId){
  const postFollowQuery=`
  insert into Follow(fromUserId, toUserId)
  values(?,?);`;
  const [postFollowRows] = await connection.query(postFollowQuery, [userId, usersId]);
  return postFollowRows;
}

//팔로우 취소
async function cancelFollow(connection, userId, usersId){
  const cancelFollowQuery=`
  update Follow
  set status = 'DELETED'
  where fromUserId = ? and toUserId = ?;`;
  const [cancelFollowRows] = await connection.query(cancelFollowQuery, [userId, usersId]);
  return cancelFollowRows;
}

//팔로워 조회
async function selectFollower(connection, userId){
  const selectFollowerQuery=`
  select b.id as UserId
        , b.nickName as UserNickName
        , b.profileImageUrl as ProfileImage
from Follow a
left join ( select id
                    , nickName
                    , profileImageUrl
            from User ) as b
            on a.fromUserId = b.id
where a.toUserId = ? and a.status = 'ACTIVE';`;
  const [followerRows] = await connection.query(selectFollowerQuery, userId);
  return followerRows;
}

//팔로잉 조회
async function selectFollowing(connection, userId){
  const selectFollowingQuery=`
    select b.id              as UserId
         , b.nickName        as UserNickName
         , b.profileImageUrl as ProfileImage
    from Follow a
           left join (select id
                           , nickName
                           , profileImageUrl
                      from User) as b
                     on a.toUserId = b.id
    where a.fromUserId = ?
      and a.status = 'ACTIVE';`;
  const [followingRows] = await connection.query(selectFollowingQuery, userId);
  return followingRows;
}

//댓글 달기
async function postComment (connection, userId, id, contents){
  const postCommentQuery=`
  insert into Comment(userId, houseWarmId, contents)
  values(?,?,?);`;
  const [commentRows] = await connection.query(postCommentQuery, [userId, id, contents]);
  return commentRows;
}

//대댓글 달기
async function postReply(connection, userId, id, contents){
  const postReplyQuery=`
  insert into CommentReply(userId, commentId, contents)
  values(?,?,?);`;
  const [replyRows] = await connection.query(postReplyQuery, [userId, id, contents]);
  return replyRows;
}

//댓글의 대댓글 조회
async function selectReply(connection, id){
  const getReplyQuery=`
  select id
        , commentId
  from CommentReply
  where commentId = ?;`;
  const [replyRows] = await connection.query(getReplyQuery, id);
  return replyRows;
}

//댓글의 대댓글 수정(삭제)
async function patchCommentReply(connection, id){
  const patchCommentReplyQuery=`
  update CommentReply
  set status = 'DELETED'
  where commentId = ?;`;
  const [patchReplyRows] = await connection.query(patchCommentReplyQuery, id);
  return patchReplyRows;
}

//댓글 수정(삭제)
async function patchComment(connection, userId, id){
  const patchCommentQuery=`
  update Comment
  set status = 'DELETED'
  where userId= ? and id = ?;`;
  const [commentRows] = await connection.query(patchCommentQuery, [userId, id]);
  return commentRows;
}

//대댓글 수정(삭제)
async function patchReply(connection, userId, id){
  const patchReplyQuery=`
  update CommentReply
  set status = 'DELETED'
  where userId = ? and id = ?;`;
  const [replyRows] = await connection.query(patchReplyQuery, [userId, id]);
  return replyRows;
}

//전체 카테고리 조회(7ea)
async function selectStoreCategory(connection){
  const selectStoreCategoryQuery=`
  select id as LargeCategoryId
        ,name as CategoryName
  from LargeCategory
  order by id asc limit 7;`;
  const [categoryRows] = await connection.query(selectStoreCategoryQuery);
  return categoryRows;
}

//최근에 본 상품 조회
async function selectRecentProduct(connection, userId){
  const selectRecentProdcutQuery=`
  select a.id as ProductId
        , a.largeCategoryId as CategoryId
        , c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , concat(format(a.saleCost,0),'원') as SaleCost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when f.delCost = 0 then '무료배송' end as DelCostType
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , userId
                    , productId
                    , createdAt
                from RecentProduct ) as b
                on a.id = b.productId
left join ( select id
                    , productId
                    , imageUrl
                from ProductImageUrl ) as c
                on a.id = c.productId
left join ( select id
                    , productId
                    , starPoint
                    , round(sum(starPoint) / count(productId), 1) as 'starGrade'
                    , count(productId) as 'reviewCount'
                from ProductReview 
                group by productId) as d
                on a.id = c.productId
left join ( select id
                    , name
                from Brand) as e
                on a.brandId = e.id
left join  ( select id
                    , delCost
                from DeliveryInfo ) as f
                on a.delInfoId = f.id
where b.userId = ? and a.status = 'ACTIVE' and  timestampdiff(day, current_timestamp(), b.createdAt) < 7
group by a.id
order by b.createdAt desc;`;
  const [recentRows] = await connection.query(selectRecentProdcutQuery, userId);
  return recentRows;
}

//최근에 본 상품과 비슷한 상품
async function selectRecentSimilarProduct (connection, largeCategoryId){
  const selectRecentSimilarProductQuery=`
    select a.id as ProductId
        , a.largeCategoryId as CategoryId
        , c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , concat(format(a.saleCost,0),'원') as SaleCost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when f.delCost = 0 then '무료배송' end as DelCostType
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , productId
                    , imageUrl
                from ProductImageUrl ) as c
                on a.id = c.productId
left join ( select id
                    , productId
                    , starPoint
                    , round(sum(starPoint) / count(productId), 1) as 'starGrade'
                    , count(productId) as 'reviewCount'
                from ProductReview 
                group by productId) as d
                on a.id = c.productId
left join ( select id
                    , name
                from Brand) as e
                on a.brandId = e.id
left join  ( select id
                    , delCost
                from DeliveryInfo ) as f
                on a.delInfoId = f.id
where a.largeCategoryId = ? and a.status = 'ACTIVE' 
group by a.id ;`;
  const [similarRows] = await connection.query(selectRecentSimilarProductQuery, largeCategoryId);
  return similarRows;
}

//인기 키워드 조회
async function selectPopularKeyword(connection){
  const selectPopularKeywordQuery=`
  select id as KeywordId
        , name as KeywordName
        , imageUrl as Image
from Keyword
order by count desc limit 4;`;
  const [keywordRows] = await connection.query(selectPopularKeywordQuery);
  return keywordRows;
}

//인기 상품 조회
async function selectPopularProduct(connection){
  const selectPopularProductQuery=`
  select a.id as ProductId
        , c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , concat(format(a.saleCost,0),'원') as SaleCost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when f.delCost = 0 then '무료배송' end as DelCostType
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , productId
                    , count(productId) as countOrders
                from Orders
                group by productId) as b
                on a.id = b.productId
left join ( select id
                    , productId
                    , imageUrl
                from ProductImageUrl ) as c
                on a.id = c.productId
left join ( select id
                    , productId
                    , starPoint
                    , round(sum(starPoint) / count(productId), 1) as 'starGrade'
                    , count(productId) as 'reviewCount'
                from ProductReview 
                group by productId) as d
                on a.id = c.productId
left join ( select id
                    , name
                from Brand) as e
                on a.brandId = e.id
left join  ( select id
                    , delCost
                from DeliveryInfo ) as f
                on a.delInfoId = f.id
where a.status = 'ACTIVE' 
group by a.id 
order by countOrders desc;`;
  const [popularRows] = await connection.query(selectPopularProductQuery);
  return popularRows;
}

//문의 생성
async function postInquiry(connection, userId, productId, categoryId, contents){
  const postInquiryQuery=`
  insert into Inquiry(userId, productId, categoryId, contents)
  values(?,?,?,?);`;
  const [postInquiryRows] = await connection.query(postInquiryQuery, [userId, productId, categoryId, contents]);
  return postInquiryRows;
}

//전체 가격 조회
async function selectTotalCost(connection, productId, productOptionId, couponId){
  const selectTotalCostQuery=`
  select case when c.discount is not null then (d.cost+b.delCost-c.discount) when c.discountPercent is not null then (d.cost+e.cost)*((100-c.discountPercent)/100) end as totalCost
from Product a
left join ( select id
                    , delCost
                from DeliveryInfo ) as b
                on a.delInfoId = b.id
left join ( select id
                        , productId
                        , discount
                        , discountPercent
                from Coupon ) as c
                on a.id = c.productId
left join ( select id
                        , productId
                        , cost
                from ProductOption ) as d
                on a.id = d.productId
where a.id = ? and d.id = ? and c.id = ?;`;
  const [totalCostRows] = await connection.query(selectTotalCostQuery, [productId, productOptionId, couponId]);
  return totalCostRows;
}

//전체 추가 옵션, 쿠폰 가격 조회
async function selectTotalAddCost(connection, productId, productOptionId, addOptionId, couponId){
  const selectTotalCostQuery=`
  select case when c.discount is not null then (d.cost++e.const-c.discount) when c.discountPercent is not null then (d.cost+e.cost)*((100-c.discountPercent)/100) end as totalCost
from Product a
left join ( select id
                    , delCost
                from DeliveryInfo ) as b
                on a.delInfoId = b.id
left join ( select id
                        , productId
                        , discount
                        , discountPercent
                from Coupon ) as c
                on a.id = c.productId
left join ( select id
                        , productId
                        , cost
                from ProductOption ) as d
                on a.id = d.productId
left join ( select id
                        , productId
                        , cost
                from AddOption ) as e
                on a.id = e.productId
where a.id = ? and d.id = ? and e.id = ? and c.id = ?;`;
  const [totalCostRows] = await connection.query(selectTotalCostQuery, [productId, productOptionId, addOptionId, couponId]);
  return totalCostRows;
}

//쿠폰 없는 가격 조회
async function selectNoCouponCost(connection, productId, productOptionId){
  const selectNoCouponCostQuery=`
  select (d.cost) as totalCost
from Product a
left join ( select id
                , delCost
                from DeliveryInfo ) as b
                on a.delInfoId = b.id
left join ( select id
                 , productId
                 , cost
            from ProductOption ) as d
          on a.id = d.productId
where a.id = ? and d.id = ?;`;
  const [totalCostRows] = await connection.query(selectNoCouponCostQuery, [productId, productOptionId]);
  return totalCostRows;
}

//쿠폰 없는 추가옵션 있는 가격 조회
async function selectNoCouponAddCost(connection, productId, productOptionId, addOptionId){
  const selectNoCouponCostQuery=`
  select (d.cost+e.cost) as totalCost
from Product a
left join ( select id
                , delCost
                from DeliveryInfo ) as b
                on a.delInfoId = b.id
left join ( select id
                 , productId
                 , cost
            from ProductOption ) as d
          on a.id = d.productId
left join ( select id
                , productId
                , cost
            from AddOption ) as e
            on a.id = e.productId
where a.id = ? and d.id = ? and e.id = ?;`;
  const [totalCostRows] = await connection.query(selectNoCouponCostQuery, [productId, productOptionId, addOptionId]);
  return totalCostRows;
}

//주문 생성
async function postOrder(connection, orderInfoParams){
  const postOrderQuery=`
  insert into Orders(userId, productId, productOptionId, addOptionId, count, couponId, senderName, frontEmail, backEmailId, backEmail, senderPhoneNum, receiverName, receiverPhoneNum, roadAddress, detailAddress, requestId, requestContents, point, totalCost)
  values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
  const [orderRows] = await connection.query(postOrderQuery, orderInfoParams);
  return orderRows;
}

//포인트 차감
async function decreasePoint(connection, point, userId){
  const decreasePointQuery=`
  update User
  set point = point - ?
  where id = ?;`;
  const [pointRows] = await connection.query(decreasePointQuery, [point, userId]);
  return pointRows;
}

//배송비 조회
async function selectDelCost(connection, productId){
  const selectDelCostQuery=`
  select case when a.payMethod = '착불' then 0 else a.delCost end as delCost
  from DeliveryInfo a
  left join ( select id
                    , delInfoId
                from Product ) as b
                on a.id = b.delInfoId
  where b.id = ?;`;
  const [delCostRows] = await connection.query(selectDelCostQuery, productId);
  return delCostRows;
}

//사용 가능 쿠폰 조회
async function selectAbleCoupons (connection, userId, productId){
  const selectAbleCouponsQuery=`
  select a.id as CouponId, a.name as CouponName
  from Coupon a
  left join ( select id
                    , brandId
                from Product ) as b
                on a.brandId = b.brandId
  left join ( select id
                from Brand ) as c
                on a.brandId = c.id
  where a.userId = ? and b.id = ? and a.status = 'ACTIVE';`;
  const [ableCouponRows] = await connection.query(selectAbleCouponsQuery, [userId, productId]);
  return ableCouponRows;

}


//비밀번호 변경
async function patchPassword (connection, hashedPassword, userId){
  const patchPasswordQuery=`
  update User
  set passWord = ?
  where id = ?;`;
  const [patchPasswordRows] = await connection.query(patchPasswordQuery, [hashedPassword, userId]);
  return patchPasswordRows;
}

//전체 기간, 상태 주문 조회
async function selectTotalOrders(connection, userId){
  const selectTotalOrdersQuery=`
  select a.id as OrderId
        , date_format(a.createdAt, "%Y-%m-%d") as OrderDate
        , b.name as ProductName
        , c.name as BrandName
        , format((a.totalCost-a.point),0) as TotalCost
        , a.count as ProductCount
        , e.delMethod as DeliveryType
        , case when a.status = 'COMPLETE' then '구매확정' when a.status ='CANCEL' then '취소' when a.status ='EXCHANGE' then '교환' when a.status='RETURN' then '환불' end as Status
from Orders a
left join ( select id
                        , brandId
                        , name
                        , delInfoId
                from Product ) as b
                on a.productId = b.id
left join (select id
                    , name
                from Brand) as c
                on b.brandId = c.id
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl) as d
                on b.id = d.productId
left join ( select id
                 , delMethod
            from DeliveryInfo ) as e
          on b.delInfoId = e.id
where a.userId = ?
group by a.id
order by a.createdAt desc;`;
  const [totalOrderRows] = await connection.query(selectTotalOrdersQuery, userId);
  return totalOrderRows;
}

//전체기간, 상태 구분 조회
async function selectOrders(connection, userId, status){
  const selectOrdersQuery=`
    select a.id as OrderId
        , date_format(a.createdAt, "%Y-%m-%d") as OrderDate
        , b.name as ProductName
        , c.name as BrandName
        , format((a.totalCost-a.point),0) as TotalCost
        , a.count as ProductCount
        , e.delMethod as DeliveryType
        , case when a.status = 'COMPLETE' then '구매확정' when a.status ='CANCEL' then '취소' when a.status ='EXCHANGE' then '교환' when a.status='RETURN' then '환불' end as Status
from Orders a
left join ( select id
                        , brandId
                        , name
                        , delInfoId
                from Product ) as b
                on a.productId = b.id
left join (select id
                    , name
                from Brand) as c
                on b.brandId = c.id
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl) as d
                on b.id = d.productId
left join ( select id
                    , delMethod
            from DeliveryInfo ) as e
            on b.delInfoId = e.id
where a.userId = ? and a.status = ?
group by a.id
order by a.createdAt desc;`;
  const [orderRows] = await connection.query(selectOrdersQuery, [userId, status]);
  return orderRows;
}

//기간 구분, 전체상태 조회
async function totalOrders(connection, userId, period){
  const totalOrdersQuery=`
    select a.id as OrderId
        , date_format(a.createdAt, "%Y-%m-%d") as OrderDate
        , b.name as ProductName
        , c.name as BrandName
        , format((a.totalCost-a.point),0) as TotalCost
        , a.count as ProductCount
        , e.delMethod as DeliveryType
        , case when a.status = 'COMPLETE' then '구매확정' when a.status ='CANCEL' then '취소' when a.status ='EXCHANGE' then '교환' when a.status='RETURN' then '환불' end as Status
from Orders a
left join ( select id
                        , brandId
                        , name
                        , delInfoId
                from Product ) as b
                on a.productId = b.id
left join (select id
                    , name
                from Brand) as c
                on b.brandId = c.id
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl) as d
                on b.id = d.productId
left join ( select id
                 , delMethod
            from DeliveryInfo ) as e
          on b.delInfoId = e.id
where a.userId = ? and timestampdiff(day, current_timestamp, a.createdAt) <= ?
group by a.id
order by a.createdAt desc;`;
  const [orderRows] = await connection.query(totalOrdersQuery, [userId, period]);
  return orderRows;
}

//기간, 상태 구분 주문 조회
async function selectFiltOrders(connection, userId, period, status){
  const selectFiltOrdersQuery=`
    select a.id as OrderId
        , date_format(a.createdAt, "%Y-%m-%d") as OrderDate
        , b.name as ProductName
        , c.name as BrandName
        , format((a.totalCost-a.point),0) as TotalCost
        , a.count as ProductCount
        , e.delMethod as DeliveryType
        , case when a.status = 'COMPLETE' then '구매확정' when a.status ='CANCEL' then '취소' when a.status ='EXCHANGE' then '교환' when a.status='RETURN' then '환불' end as Status
from Orders a
left join ( select id
                        , brandId
                        , name
                        , delInfoId
                from Product ) as b
                on a.productId = b.id
left join (select id
                    , name
                from Brand) as c
                on b.brandId = c.id
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl) as d
                on b.id = d.productId
left join ( select id
                 , delMethod
            from DeliveryInfo ) as e
          on b.delInfoId = e.id
where a.userId = ? and timestampdiff(day, current_timestamp, a.createdAt) <= ? and a.status = ?
group by a.id
order by a.createdAt desc;`;
  const [orderRows] = await connection.query(selectFiltOrdersQuery, [userId, period, status]);
  return orderRows;
}

//나의쇼핑정보 조회
async function selectMyInfo (connection, userId){
  const selectMyInfoQuery=`
  select a.id as UserId
        , case when couponCount is null then 0 else couponCount end as CouponCount
        , format(a.point, 0) as Point
        , a.level as Level
from User a
left join ( select id
                        , userId
                        , count(userId) as 'couponCount'
                        , status
                from Coupon 
                where status = 'ACTIVE'
                group by userId) as b
                on a.id = b.userId
where a.id = ?;`;
  const [myRows] = await connection.query(selectMyInfoQuery, userId);
  return myRows;
}

//진행중인 주문 조회
async function selectIngOrders(connection, userId){
  const selectIngOrdersQuery=`
  select a.userId as UserId
        , case when count(case when status='WAIT' and a.userId then 1 end) is null then 0 else count(case when status='WAIT' and a.userId then 1 end) end as Waits
        , case when count(case when status='PAYCOMPLETE' and a.userId then 1 end) is null then 0 else count(case when status='PAYCOMPLETE' and a.userId then 1 end) end as PaymentComplete
        , case when count(case when status='DELREADY' and a.userId then 1 end) is null then 0 else count(case when status='DELREADY' and a.userId then 1 end) end as DeliveryReady
        , case when count(case when status='DELIVERY' and a.userId then 1 end) is null then 0 else count(case when status='DELIVERY' and a.userId then 1 end) end as Delivery
        , case when count(case when status='COMPLETE' and a.userId then 1 end) is null then 0 else count(case when status='COMPLETE' and a.userId then 1 end) end as Complete
        , case when reviewCount is null then 0 else reviewCount end as Review
from Orders a
left join ( select id
                        , userId
                        , count(userId) as 'reviewCount'
                from ProductReview
                where status = 'ACTIVE'
                group by userId) as b
                on a.userId = b.userId
where a.userId =? and timestampdiff(month, current_timestamp, a.createdAt) < 3
group by a.userId;`;
  const [ingRows] = await connection.query(selectIngOrdersQuery, userId);
  return ingRows;
}

//상품스크랩북, 문의내역, 리뷰 수 조회
async function selectCount(connection, userId){
  const selectCountQuery=`
  select a.id as UserId
        , case when inquiryCount is null then 0 else inquiryCount end as InquiryCount
        , case when scrapCount is null then 0 else scrapCount end as ScrapCount
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
from User a
left join ( select id
                        , userId
                        , count(userId) as 'inquiryCount'
                from Inquiry
                where status = 'ACTIVE'
                group by userId) as b
                on a.id = b.userId
left join ( select id
                        , userId
                        , productId
                        , count(userId) as 'scrapCount'
                from Scrap
                where productId is not null and status ='ACTIVE'
                group by userId) as c
                on a.id = c.userId
left join ( select id
                        , userId
                        , count(userId) as 'reviewCount'
                from ProductReview
                where status ='ACTIVE'
                group by userId) as d
                on a.id = d.id
where a.id = ?;`;
  const [countRows] = await connection.query(selectCountQuery, userId);
  return countRows;
}

//주문안한 리뷰 생성
async function postNoOrderReview (connection, reviewParams){
  const postNoOrderReviewQuery=`
  insert into ProductReview(userId, productId, imageUrl, starPoint, contents)
  values(?,?,?,?,?);`;
  const [postReviewRows] = await connection.query(postNoOrderReviewQuery, reviewParams);
  return postReviewRows;
}

//주문한 리뷰 작성
async function postOrderReview(connection, orderedReviewParams){
  const postOrderReviewQuery=`
  insert into ProductReview(userId, productId, ordersId, productOptionId, addOptionId, imageUrl, strengthPoint, designPoint, costPoint, delPoint, starPoint, contents)
  values(?,?,?,?,?,?,?,?,?,?,round((strengthPoint+designPoint+costPoint+delPoint)/4,1),?);`;
  const [postReviewRows] = await connection.query(postOrderReviewQuery, orderedReviewParams);
  return postReviewRows;
}

//옵션 조회
async function selectOption(connection, ordersId){
  const selectOptionQuery=`
  select productOptionId as optionId
        , addOptionId as addOptionId
  from Orders
  where id = ? and status = 'COMPLETE';`;
  const [optionsRows] = await connection.query(selectOptionQuery, ordersId);
  return optionsRows;
}

//리뷰 도움되요 누른 기록 조회
async function selectReviewHelpCheck(connection, userId, reviewId){
  const selectReviewHelpCheckQuery=`
  select id
  from ReviewHelp
  where userId = ? and reviewId = ?;`;
  const [reviewRows] = await connection.query(selectReviewHelpCheckQuery, [userId, reviewId]);
  return reviewRows;
}

//리뷰 도움되요 눌려있는지 조회
async function selectReviewHelpReCheck(connection, userId, reviewId){
  const selectReviewHelpReCheckQuery=`
  select id
  from ReviewHelp
  where userId = ? and reviewId = ? and status ='ACTIVE';`;
  const [reviewRows] = await connection.query(selectReviewHelpReCheckQuery, [userId, reviewId]);
  return reviewRows;
}

//리뷰 도움 취소
async function cancelHelpReview(connection, userId, reviewId){
  const cancelHelpReviewQuery=`
  update ReviewHelp
  set status = 'DELETED'
  where userId = ? and reviewId = ?;`;
  const [helpRows] = await connection.query(cancelHelpReviewQuery, [userId, reviewId]);
  return helpRows;
}

//리뷰 도움 수정
async function patchHelpReview(connection, userId, reviewId){
  const patchHelpReviewQuery=`
  update ReviewHelp
  set status = 'ACTIVE'
  where userId = ? and reviewId = ?;`;
  const [helpRows] = await connection.query(patchHelpReviewQuery, [userId, reviewId]);
  return helpRows;
}

//리뷰 도움 생성
async function postHelpReview(connection ,userId, reviewId){
  const postHelpReviewQuery=`
  insert into ReviewHelp(userId, reviewId)
  values(?,?);`;
  const [helpRows] = await connection.query(postHelpReviewQuery, [userId, reviewId]);
  return helpRows;
}

//마이페이지 나의 쇼핑 조회
async function selectMyPageShopping(connection, userId){
  const selectMyPageShoppingQuery=`
    select a.id as userId
         , case when orderingCount is null then 0 else orderingCount end as Orders
        , case when couponCount is null then 0 else couponCount end as Coupon
        , a.point as Point 
from User a
left join ( select id
                    , userId
                    , count(userId) as couponCount
                    , status
                from Coupon
                where status = 'ACTIVE'
                group by userId) as g
                on a.id = g.userId
left join ( select id
                , userId
                , status
                , count(userId) as orderingCount
            from Orders
            where status = 'WAIT' or status = 'PAYCOMPLETE' or status = 'DELREADY' or status ='DELIVERY'
            group by userId) as b
            on a.id = b.userId
  where a.id = ?;`;
  const [Rows] = await connection.query(selectMyPageShoppingQuery, userId);
  return Rows;
}

//마이페이지 리뷰수 조회
async function selectMyPageReviewCount(connection, userId){
  const selectMyPageReviewCountQuery=`
  select userId as UserId
        , count(userId) as ReviewCount
  from ProductReview 
  where userId =? and status = 'ACTIVE'
  group by userId;`;
  const [Rows] = await connection.query(selectMyPageReviewCountQuery, userId);
  return Rows;
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
  countScrapBook,
  countHouseWarm,
  printTotal,
  selectUserPageInfo,
  selectPicturesSpace,
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
  selectHouseWarmCheck,
  editScrapStatus,
  postScrap,
  selectProductById,
  selectProductCheck,
  editProductScrapStatus,
  postProductScrap,
  cancelScrap,
  cancelProductScrap,
  selectTotalScrap,
  selectFolder,
  selectFolderImage,
  selectTotalProduct,
  selectProduct,
  selectProductImage,
  selectScrapHouseWarm,
  selectLike,
  selectLikeCheck,
  patchLike,
  postLike,
  cancelLike,
  selectTotalLike,
  selectHouseWarmLike,
  selectFollow,
  selectFollowCheck,
  patchFollow,
  postFollow,
  cancelFollow,
  selectFollower,
  selectFollowing,
  postComment,
  postReply,
  patchComment,
  patchReply,
  selectReply,
  patchCommentReply,
  selectStoreCategory,
  selectRecentProduct,
  selectRecentSimilarProduct,
  selectPopularProduct,
  selectPopularKeyword,
  postInquiry,
  selectTotalCost,
  selectNoCouponCost,
  selectNoCouponAddCost,
  selectTotalAddCost,
  postOrder,
  decreasePoint,
  selectDelCost,
  selectAbleCoupons,
  patchPassword,
  selectTotalOrders,
  selectOrders,
  totalOrders,
  selectFiltOrders,
  selectMyInfo,
  selectIngOrders,
  selectCount,
  postNoOrderReview,
  postOrderReview,
  selectOption,
  selectReviewHelpCheck,
  selectReviewHelpReCheck,
  cancelHelpReview,
  patchHelpReview,
  postHelpReview,
  selectMyPageShopping,
  selectMyPageReviewCount,
};

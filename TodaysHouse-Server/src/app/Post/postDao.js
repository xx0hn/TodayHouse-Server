//오늘의 스토리 조회
async function selectTodayStory(connection){
    const selectTodayStoryQuery=`
    select id as HouseWarmId
        , title as HouseWarmTitle
        , imageUrl as MainImage
from HouseWarm 
order by viewCount desc limit 10;`;
    const [todayStoryRows] = await connection.query(selectTodayStoryQuery);
    return todayStoryRows;
}

//전체 카테고리 조회
async function selectTotalCategory(connection){
    const selectTotalCategoryQuery=`
    select name as CategoryName
        , imageUrl as CategoryImage
from LargeCategory
order by id asc;`;
    const [categoryRows] = await connection.query(selectTotalCategoryQuery);
    return categoryRows;
}

//카테고리명 조회
async function selectCategoryName(connection, categoryId){
    const selectCategoryNameQuery=`
    select case when b.id is null then '전체' else b.name end as CategoryName
from Product a
left join ( select id
                , name
            from LargeCategory ) as b
            on a.largeCategoryId = b.id
where b.id = ?;`;
    const [categoryNameRows] = await connection.query(selectCategoryNameQuery, categoryId);
    return categoryNameRows;
}

//전체 출력
async function selectPrintTotal(connection){
    const selectPrintTotalQuery=`
    select case when id is not null then '전체' end as CategoryName
    from Product
    order by createdAt desc limit 1;`;
    const [totalRows] = await connection.query(selectPrintTotalQuery);
    return totalRows;
}

//전체 베스트 상품 조회
async function selectBestProduct(connection){
    const selectBestProductQuery=`
    select row_number() over(order by orderCount desc) as Ranking
        , b.imageUrl as ProductImage
        , a.name as ProductName
        , case when discount is not null then concat(discount, '%') end as DiscountPercent
        , format(a.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
from Product a
left join ( select id
                , productId
                , imageUrl
            from ProductImageUrl
            group by productId ) as b
            on a.id = b.productId
left join ( select id
                , productId
                , count(productId) as 'orderCount'
            from Orders
            group by productId) as c
            on a.id = c.productId
left join ( select id
                , starPoint
                , productId
                , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                , count(productId) as 'reviewCount'
            from ProductReview 
            group by productId ) as d
            on a.id = d.productId
where a.status = 'ACTIVE'
order by orderCount desc limit 3;`;
    const [bestProductRows] = await connection.query(selectBestProductQuery);
    return bestProductRows;
}

//카테고리 별 베스트 상품 조회
async function selectCategoryBest(connection, categoryId){
    const selectCategoryBestQuery=`
    select row_number() over(order by orderCount desc) as Ranking
        , b.imageUrl as ProductImage
        , a.name as ProductName
        , case when discount is not null then concat(discount, '%') end as DiscountPercent
        , format(a.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
from Product a
left join ( select id
                , productId
                , imageUrl
            from ProductImageUrl
            group by productId ) as b
            on a.id = b.productId
left join ( select id
                , productId
                , count(productId) as 'orderCount'
            from Orders
            group by productId) as c
            on a.id = c.productId
left join ( select id
                , starPoint
                , productId
                , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                , count(productId) as 'reviewCount'
            from ProductReview 
            group by productId ) as d
            on a.id = d.productId
where a.largeCategoryId = ? and a.status = 'ACTIVE'
order by orderCount desc limit 3;`;
    const [categoryBestRows] = await connection.query(selectCategoryBestQuery, categoryId);
    return categoryBestRows;
}

//조회수 증가
async function patchViewCount(connection, houseWarmId){
    const patchViewCountQuery=`
    update HouseWarm
    set viewCount = viewCount + 1
    where id = ?;`;
    const [viewCountRows] = await connection.query(patchViewCountQuery, houseWarmId);
    return viewCountRows;
}

//집들이 상단 정보
async function selectHouseWarm(connection, houseWarmId){
    const selectHouseWarmQuery=`
    select imageUrl as Image
        , case when a.id is not null then '온라인 집들이' end as Type
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , b.createdAt as UserCreatedAt
        , case when c.name is not null then c.name end as BuildingType
        , case when a.width is not null then concat(width, '평') end as Width
        , case when d.name is not null then d.name end as Worker
        , case when e.name is not null then e.name end as Area
        , case when a.budget is not null then concat(format(a.budget, 0), '만원') end as Budget 
        , case when f.name is not null then f.name end as FamilyType
        , case when g.name is not null then g.name end as DetailWork
        , case when h.name is not null then h.name end as Style
        , case when a.location is not null then a.location end as Location
from HouseWarm a
left join (select id
                , profileImageUrl
                , nickName
                , createdAt
            from User ) as b
            on a.userId = b.id
left join ( select id
                , name
            from BuildingType ) as c
            on a.buildingTypeId = c.id
left join ( select id
                , name
            from Worker ) as d
            on a.workerId = d.id
left join ( select id
                , name
            from Area ) as e
            on a.areaId = e.id
left join ( select id
               , name
            from FamilyType ) as f
            on a.familyTypeId = f.id
left join ( select id
                , name
            from DetailWork ) as g
            on a.detailWorkId = g.id
left join ( select id
                , name
            from Style ) as h
            on a.styleId = h.id
where a.id = ?;`;
    const [houseWarmRows] = await connection.query(selectHouseWarmQuery, houseWarmId);
    return houseWarmRows;
}

//집들이 사진 소제목
async function selectContentsTitle(connection, houseWarmId){
    const selectContentsTitleQuery=`
    select distinct b.title as title
from HouseWarm a
left join ( select id
                , houseWarmId
                , title
            from HouseWarmContents ) as b
            on a.id = b.houseWarmId
where a.id = ?;`;
    const [titleRows] = await connection.query(selectContentsTitleQuery, houseWarmId);
    return titleRows;
}

//작성자 프로필 사진, 닉네임
async function selectUser(connection, houseWarmId){
    const selectUserQuery=`
    select b.profileImageUrl as ProfileImage
        , b.nickName as NickName
from HouseWarm a
left join ( select id
                , profileImageUrl
                , nickName
                from User ) as b
                on a.userId = b.id
where a.id = ?;`;
    const [userRows] = await connection.query(selectUserQuery, houseWarmId);
    return userRows;
}

//포함된 전체 상품 조회
async function selectTotalProduct (connection, houseWarmId){
    const selectTotalProductQuery=`
        select c.id       as ProductId
             , d.imageUrl as Image
             , e.name     as BrandName
             , c.name     as ProductName
             , format(c.saleCost, 0) as Cost
        from HouseWarmContents a
                 left join (select id
                                 , houseWarmContentsId
                                 , productId
                            from HouseWarmContentsProductMapping) as b
                           on a.id = b.houseWarmContentsId
                 left join (select id
                                 , brandId
                                 , name
                                 , saleCost
                            from Product) as c
                           on b.productid = c.id
                 left join (select id
                                 , productId
                                 , imageUrl
                            from ProductImageUrl
                            group by productId) as d
                           on c.id = d.productId
                 left join (select id
                                 , name
                            from Brand) as e
                           on c.brandId = e.id
        where a.houseWarmId = ?
          and c.id is not null;`;
    const [includeProductRows] = await connection.query(selectTotalProductQuery, houseWarmId);
    return includeProductRows;
}

//좋아요, 댓글, 스크랩, 조회수 조회
async function selectTotalCount (connection, houseWarmId){
    const selectTotalCountQuery=`
    select case when countLike is null then 0 else countLike end as LikeCount
        , case when countScrap is null then 0 else countScrap end as ScrapCount
        , case when (countComment+countReply) is null then 0 else (countComment+countReply) end as CommentCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , houseWarmId
                    , count(houseWarmId) as countLike
                from Likes 
                where status = 'ACTIVE'
                group by houseWarmid) as b
                on a.id = b.houseWarmId
left join ( select id
                    , houseWarmId
                    , count(houseWarmId ) as countScrap
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as e
                on a.id = e.houseWarmId
left join ( select id
                    , houseWarmid
                    , count(houseWarmId) as countComment
                from Comment
                where status = 'ACTIVE'
                group by houseWarmId ) as f
                on a.id = f.houseWarmId
left join ( select id
                    , commentId
                    , count(commentId ) as countReply
                from CommentReply
                where status = 'ACTIVE'
                group by commentId) as g
                on f.id = g.commentId
where a.id = ?;`;
    const [totalCountRows] = await connection.query(selectTotalCountQuery, houseWarmId);
    return totalCountRows;
}

//댓글 조회
async function selectComment(connection, houseWarmId){
    const selectCommentQuery=`
        select b.id as id 
            , c.profileImageUrl                                               as UserProfileImage
             , c.nickName                                                      as UserNickName
             , b.contents                                                      as Comments
             , concat(timestampdiff(day, current_timestamp, b.createdAt), '일') as CommentCreatedAt
        from HouseWarm a
                 left join (select id
                                 , houseWarmId
                                 , userId
                                 , contents
                                 , createdAt
                                 , status
                            from Comment) as b
                           on a.id = b.houseWarmId
                 left join (select id
                                 , profileImageUrl
                                 , nickName
                            from User) as c
                           on b.userId = c.id
        where a.id = 1
          and b.status = 'ACTIVE';`;
    const [commentRows] = await connection.query(selectCommentQuery, houseWarmId);
    return commentRows;
}

//집들이 스타일 아이디 조회
async function selectStyle(connection, houseWarmId){
    const selectStyleQuery=`
    select styleId as id
    from HouseWarm
    where id = ?;`;
    const [styleIdRows] = await connection.query(selectStyleQuery, houseWarmId);
    return styleIdRows;
}

//비슷한 집들이 조회
async function selectSimilarHouseWarm(connection, styleId){
    const selectSimilarHouseWarmQuery=`
    select a.imageUrl as Image
        , a.title as Title
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , case when scrapCount is null then 0 else scrapCount end as ScrapCount
        , case when a.viewCount is null then 0 else a.viewCount end as ViewCount
from HouseWarm a
left join ( select id
                    , profileImageUrl
                    , nickName
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , houseWarmId
                    , count(houseWarmId) as scrapCount
                    , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
where a.styleId = ? and a.status = 'ACTIVE';`;
    const [similarRows] = await connection.query(selectSimilarHouseWarmQuery, styleId);
    return similarRows;
}

//집들이 내용 조회
async function selectHouseWarmContents (connection, houseWarmId, title){
    const selectHouseWarmContentsQuery=`
    select id as id
        , case when imageUrl is not null then imageUrl end as Image
        , case when contents is not null then contents end as Contents
from HouseWarmContents
where houseWarmId = ? and title = ?;`;
    const [contentsRows] = await connection.query(selectHouseWarmContentsQuery, [houseWarmId, title]);
    return contentsRows;
}

async function houseWarmContent(connection, houseWarmId){
    const houseQuery=`
     select id as id
          , title as Title
        , case when imageUrl is not null then imageUrl end as Image
        , case when contents is not null then contents end as Contents
from HouseWarmContents
where houseWarmId = ?;`;
    const [rows] = await connection.query(houseQuery, houseWarmId);
    return rows
}

//집들이 사진에 들어간 상품 조회
async function selectHouseWarmContentsProduct(connection, houseWarmContentsId){
    const selectHouseWarmContentsProductQuery=`
    select d.imageUrl as ProductImage
from HouseWarmContents a
left join ( select id
                        , houseWarmContentsId
                        , productId
                from HouseWarmContentsProductMapping ) as b
                on a.id = b.houseWarmContentsId
left join ( select id
                from Product ) as c
                on b.productId = c.id
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl
                group by productId) as d
                on c.id = d.productId
where a.id = ?;`;
    const [imageRows] = await connection.query(selectHouseWarmContentsProductQuery, houseWarmContentsId);
    return imageRows;
}

//대댓글 조회
async function selectReply(connection, commentId){
    const selectReplyQuery=`
    select b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , a.contents as ReplyComments
        , concat(timestampdiff(day, current_timestamp, a.createdAt), '일') as ReplyCreatedAt
from CommentReply a
left join ( select id
                        , profileImageUrl
                        , nickName
                from User ) as b
                on a.userId = b.id
where a.commentId = ? and a.status = 'ACTIVE';`;
    const [replyRows] = await connection.query(selectReplyQuery, commentId);
    return replyRows;
}

module.exports = {
    selectTodayStory,
    selectTotalCategory,
    selectCategoryName,
    selectPrintTotal,
    selectBestProduct,
    selectCategoryBest,
    patchViewCount,
    selectHouseWarm,
    selectContentsTitle,
    selectUser,
    selectTotalProduct,
    selectTotalCount,
    selectComment,
    selectStyle,
    selectSimilarHouseWarm,
    selectHouseWarmContents,
    selectHouseWarmContentsProduct,
    selectReply,
    houseWarmContent,
}
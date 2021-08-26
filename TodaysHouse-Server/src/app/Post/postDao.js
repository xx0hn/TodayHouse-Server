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
    select id as LargeCategoryId
            , name as CategoryName
from LargeCategory
order by id asc;`;
    const [categoryRows] = await connection.query(selectTotalCategoryQuery);
    return categoryRows;
}

//카테고리명 조회
async function selectCategoryName(connection, categoryId){
    const selectCategoryNameQuery=`
    select b.id as LargeCategoryId
           , case when b.id is null then '전체' else b.name end as CategoryName
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
    select a.id as ProductId
        , row_number() over(order by orderCount desc) as Ranking
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
    select a.id as ProductId
        , row_number() over(order by orderCount desc) as Ranking
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
    select a.id as HouseWarmId
        , imageUrl as Image
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
        select distinct c.id       as ProductId
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
    select distinct a.id as HouseWarmId
        , case when countLike is null then 0 else countLike end as LikeCount
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
             , concat(timestampdiff(day, b.createdAt, current_timestamp), '일') as CommentCreatedAt
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
        where a.id = ?
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
    select a.id as HouseWarmId
        , a.imageUrl as Image
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
    select c.id as ProductId
           , d.imageUrl as ProductImage
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
    select a.id as CommentReplyId
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , a.contents as ReplyComments
        , concat(timestampdiff(day, a.createdAt, current_timestamp), '일') as ReplyCreatedAt
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

//전체 검색 스토어
async function selectSearchStore(connection, keyword, keywords, keywordss, keywordsss, keywordssss){
    const selectSearchStoreQuery=`
        select a.id                                                              as ProductId
             , d.imageUrl                                                        as ProductImage
             , b.name                                                            as BrandName
             , a.name                                                            as ProductName
             , case when a.discount is not null then concat(a.discount, '%') end as DiscountPercent
             , format(a.saleCost, 0)                                             as Cost
             , case when starGrade is null then 0 else starGrade end             as StarGrade
             , case when reviewCount is null then 0 else reviewCount end         as ReviewCount
             , case when e.delCost = 0 then '무료배송' end                           as DeliveryCost
             , case when a.discount is not null then '특가' end                    as SpecialPrice
        from Product a
                 left join (select id
                                 , name
                            from Brand) as b
                           on a.brandId = b.id
                 left join (select id
                                 , productId
                                 , starPoint
                                 , round(sum(starPoint) / count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , status
                            from ProductReview
                            where status = 'ACTIVE'
                            group by productId) as c
                           on a.id = c.productId
                 left join (select id
                                 , productId
                                 , imageUrl
                            from ProductImageUrl) as d
                           on a.id = d.id
                 left join (select id
                                 , delCost
                            from DeliveryInfo) as e
                           on a.delInfoId = e.id
                 left join (select id
                                 , productId
                                 , keywordId
                            from KeywordMapping) as g
                           on a.id = g.productId
                 left join (select id
                                 , name
                            from Keyword) as h
                           on g.keywordId = h.id
                 left join (select id
                                 , name
                            from LargeCategory) as i
                           on a.largeCategoryId = i.id
                 left join (select id
                                 , name
                            from MiddleCategory) as j
                           on a.middleCategoryId = j.id
                 left join (select id
                                 , name
                            from SmallCategory) as k
                           on a.smallCategoryId = k.id
        where a.status = 'ACTIVE'
          and (h.name regexp ? or i.name regexp ? or j.name regexp ? or k.name regexp ? or a.name regexp ?)
        group by a.id
        order by a.viewCount desc limit 8;`;
    const [searchRows] = await connection.query(selectSearchStoreQuery, [keyword, keywords, keywordss, keywordsss, keywordssss]);
    return searchRows;
}

//전체 검색 집들이
async function selectSearchHouseWarm(connection, keyword, keywords, keywordss, keywordsss, keywordssss){
    const selectSearchHouseWarmQuery=`
    select a.id as HouseWarmId
        , a.imageUrl as Image
        , a.title as HouseWarmTitle
        , b.nickName as UserNickName
        , case when houseWarmCount is null then 0 else houseWarmCount end as ScrapCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , nickName
                from User) as b
                on a.userId = b.id
left join ( select id
                    , houseWarmId
                    , count(houseWarmId) as 'houseWarmCount'
                    , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
left join ( select id
                , name
                from BuildingType) as d
                on a.buildingTypeId = d.id
left join ( select id
                , name
                from FamilyType) as e
                on a.familyTypeId = e.id
left join ( select id
                , name
            from Style) as f
            on a.styleId = f.id
left join (select id
                , name
            from Area) as g
            on a.areaId = g.id
where d.name regexp ? or e.name regexp ? or f.name regexp ? or g.name regexp ? or a.title regexp ?
order by a.viewCount desc limit 6;`;
    const [searchRows] = await connection.query(selectSearchHouseWarmQuery, [keyword, keywords, keywordss, keywordsss, keywordssss]);
    return searchRows;
}

//전체 검색 유저
async function selectSearchUser(connection, keyword){
    const selectSearchUserQuery=`
    select id as UserId
        , nickName as UserNickName
        , profileImageUrl as UserProfileImage
from User
where nickName regexp ?
order by nickName asc limit 10 ;`;
    const [searchRows] = await connection.query(selectSearchUserQuery, keyword);
    return searchRows;
}

//검색 스토어
async function selectSearchProducts(connection, keyword, keywords, keywordss, keywordsss, keywordssss){
    const selectSearchProductsQuery=`
            select a.id                                                              as ProductId
             , d.imageUrl                                                        as ProductImage
             , b.name                                                            as BrandName
             , a.name                                                            as ProductName
             , case when a.discount is not null then concat(a.discount, '%') end as DiscountPercent
             , format(a.saleCost, 0)                                             as Cost
             , case when starGrade is null then 0 else starGrade end             as StarGrade
             , case when reviewCount is null then 0 else reviewCount end         as ReviewCount
             , case when e.delCost = 0 then '무료배송' end                           as DeliveryCost
             , case when a.discount is not null then '특가' end                    as SpecialPrice
        from Product a
                 left join (select id
                                 , name
                            from Brand) as b
                           on a.brandId = b.id
                 left join (select id
                                 , productId
                                 , starPoint
                                 , round(sum(starPoint) / count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , status
                            from ProductReview
                            where status = 'ACTIVE'
                            group by productId) as c
                           on a.id = c.productId
                 left join (select id
                                 , productId
                                 , imageUrl
                            from ProductImageUrl) as d
                           on a.id = d.id
                 left join (select id
                                 , delCost
                            from DeliveryInfo) as e
                           on a.delInfoId = e.id
                 left join (select id
                                 , productId
                                 , keywordId
                            from KeywordMapping) as g
                           on a.id = g.productId
                 left join (select id
                                 , name
                            from Keyword) as h
                           on g.keywordId = h.id
                 left join (select id
                                 , name
                            from LargeCategory) as i
                           on a.largeCategoryId = i.id
                 left join (select id
                                 , name
                            from MiddleCategory) as j
                           on a.middleCategoryId = j.id
                 left join (select id
                                 , name
                            from SmallCategory) as k
                           on a.smallCategoryId = k.id
        where a.status = 'ACTIVE'
          and (h.name regexp ? or i.name regexp ? or j.name regexp ? or k.name regexp ? or a.name regexp ?)
        group by a.id
        order by a.viewCount desc;`
    const [searchRows] = await connection.query(selectSearchProductsQuery, [keyword, keywords, keywordss, keywordsss, keywordssss]);
    return searchRows;
}

//검색 집들이
async function selectSearchHouseWarms(connection, keyword, keywords, keywordss, keywordsss, keywordssss){
    const selectSearchHouseWarmsQuery=`
        select a.id as HouseWarmId
        , a.imageUrl as Image
        , a.title as HouseWarmTitle
        , b.nickName as UserNickName
        , case when houseWarmCount is null then 0 else houseWarmCount end as ScrapCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , nickName
                from User) as b
                on a.userId = b.id
left join ( select id
                    , houseWarmId
                    , count(houseWarmId) as 'houseWarmCount'
                    , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
left join ( select id
                , name
                from BuildingType) as d
                on a.buildingTypeId = d.id
left join ( select id
                , name
                from FamilyType) as e
                on a.familyTypeId = e.id
left join ( select id
                , name
            from Style) as f
            on a.styleId = f.id
left join (select id
                , name
            from Area) as g
            on a.areaId = g.id
where d.name regexp ? or e.name regexp ? or f.name regexp ? or g.name regexp ? or a.title regexp ?
order by a.viewCount desc;`;
    const [searchRows] = await connection.query(selectSearchHouseWarmsQuery, [keyword, keywords, keywordss, keywordsss, keywordssss]);
    return searchRows;
}

//검색 유저
async function selectSearchUsers(connection, keyword, keywords, keywordss, keywordsss, keywordssss){
    const selectSearchUsersQuery=`
        select id as UserId
        , nickName as UserNickName
        , profileImageUrl as UserProfileImage
from User
where nickName regexp ?
order by nickName asc;`;
    const [searchRows] = await connection.query(selectSearchUsersQuery, [keyword, keywords, keywordss, keywordsss, keywordssss]);
    return searchRows;
}


//스토어 수
async function selectStoreCounts(connection,storeCount){
    const selectStoreCountQuery=`
            select ? as StoreCount;`;
    const [countRows] = await connection.query(selectStoreCountQuery, storeCount);
    return countRows;
}


//집들이 수
async function selectHouseWarmCounts(connection, houseWarmCount){
    const selectHouseWarmCountQuery=`
            select ? as HouseWarmCount`;
    const [countRows] = await connection.query(selectHouseWarmCountQuery, houseWarmCount);
    return countRows;
}


//유저 수
async function selectUserCounts(connection, userCount){
    const selectUserCountQuery=`
            select ? as UserCount`;
    const [countRows] = await connection.query(selectUserCountQuery, userCount);
    return countRows;
}

//집들이 최신 순 조회
async function selectNewHouseWarms(connection, houseWarmParams){
    const selectNewHouseWarmsQuery=`
    select a.id as HouseWarmId
        , a.imageUrl as Image
        , a.title as HouseWarmTitle
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , case when scrapCount is null then 0 else scrapCount end as ScrapCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , nickName
                    , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                        , houseWarmId
                        , count(houseWarmId) as 'scrapCount'
                        , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
   where a.buildingTypeId like ? and (a.width between ? and ?) and (a.budget between ? and ?)
  and a.familyTypeId like ? and a.styleId like ? and a.wallColorId like ? and a.floorColorId like ? and a.detailWorkId like ? and a.areaId like ? and a.workerId like ? 
order by a.createdAt desc;`;
    const [houseWarmRows] = await connection.query(selectNewHouseWarmsQuery, houseWarmParams);
    return houseWarmRows;
}

//집들이 인기순 조회
async function selectPopularHouseWarms(connection, houseWarmParams){
    const selectPopularHouseWarmsQuery=`
        select a.id as HouseWarmId
        , a.imageUrl as Image
        , a.title as HouseWarmTitle
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , case when scrapCount is null then 0 else scrapCount end as ScrapCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , nickName
                    , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                        , houseWarmId
                        , count(houseWarmId) as 'scrapCount'
                        , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
where a.buildingTypeId like ? and (a.width between ? and ?) and (a.budget between ? and ?)
  and a.familyTypeId like ? and a.styleId like ? and a.wallColorId like ? and a.floorColorId like ? and a.detailWorkId like ? and a.areaId like ? and a.workerId like ? 
order by a.viewCount desc;`;
    const [houseWarmsRows] = await connection.query(selectPopularHouseWarmsQuery, houseWarmParams);
    return houseWarmsRows;
}

//집들이 오랜된 순 조회
async function selectOldHouseWarms(connection, houseWarmParams){
    const selectOldHouseWarmsQuery=`
        select a.id as HouseWarmId
        , a.imageUrl as Image
        , a.title as HouseWarmTitle
        , b.profileImageUrl as UserProfileImage
        , b.nickName as UserNickName
        , case when scrapCount is null then 0 else scrapCount end as ScrapCount
        , a.viewCount as ViewCount
from HouseWarm a
left join ( select id
                    , nickName
                    , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                        , houseWarmId
                        , count(houseWarmId) as 'scrapCount'
                        , status
                from Scrap
                where status = 'ACTIVE'
                group by houseWarmId) as c
                on a.id = c.houseWarmId
where a.buildingTypeId like ? and (a.width between ? and ?)  and (a.budget between ? and ?) and a.familyTypeId like ? and a.styleId like ? and a.wallColorId like ? and a.floorColorId like ? and detailWorkId like ? and areaId like ? and workerId like ? 
order by a.createdAt asc;`;
    const [houseWarmRows] = await connection.query(selectOldHouseWarmsQuery, houseWarmParams);
    return houseWarmRows;
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
    selectSearchHouseWarm,
    selectSearchStore,
    selectSearchUser,
    selectSearchProducts,
    selectSearchHouseWarms,
    selectSearchUsers,
    selectStoreCounts,
    selectHouseWarmCounts,
    selectUserCounts,
    selectNewHouseWarms,
    selectPopularHouseWarms,
    selectOldHouseWarms,
}
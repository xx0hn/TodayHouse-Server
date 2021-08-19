//오늘의 스토리 조회
async function selectTodayStory(connection){
    const selectTodayStoryQuery=`
    select title as HouseWarmTitle
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

module.exports = {
    selectTodayStory,
    selectTotalCategory,
    selectCategoryName,
    selectPrintTotal,
    selectBestProduct,
    selectCategoryBest,
}
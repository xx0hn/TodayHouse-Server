//중간 카테고리명 조회
async function selectMiddleCategory(connection, categoryId){
    const selectMiddleCategoryQuery=`
    select name
            , imageUrl
from MiddleCategory
where largeCategoryId = ?;`;
    const [categoryRows] = await connection.query(selectMiddleCategoryQuery, categoryId);
    return categoryRows;
}

//작은 카테고리명 조회
async function selectSmallCategory(connection, categoryId){
    const selectSmallCategoryQuery=`
    select name
           , imageUrl
    from SmallCategory
    where middleCategoryId = ?;`;
    const [categoryRows] = await connection.query(selectSmallCategoryQuery, categoryId);
    return categoryRows;
}

//세부 카테고리명 조회
async function selectDetailCategory(connection, categoryId){
    const selectDetailCategoryQuery=`
    select name
    from DetailCategory
    where smallCategoryId =?;`;
    const [categoryRows] = await connection.query(selectDetailCategoryQuery, categoryId);
    return categoryRows;
}

//큰 카테고리 판매량순 조회
async function orderLCategoryProduct(connection, categoryId){
    const orderLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by countOrders desc;`;
    const [productRows] = await connection.query(orderLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 판매량순 조회
async function orderMCategoryProduct(connection, categoryId){
    const orderMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by countOrders desc;`;
    const [productRows] = await connection.query(orderMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 판매량순 조회
async function orderSCategoryProduct(connection, categoryId){
    const orderSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by countOrders desc;`;
    const [productRows] = await connection.query(orderSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 인기순 조회
async function popularLCategoryProduct(connection, categoryId){
    const popularLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by a.viewCount desc;`;
    const [productRows] = await connection.query(popularLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 인기순 조회
async function popularMCategoryProduct(connection, categoryId){
    const popularMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by a.viewCount desc;`;
    const [productRows] = await connection.query(popularMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 인기순 조회
async function popularSCategoryProduct(connection, categoryId){
    const popularSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by a.viewCount desc;`;
    const [productRows] = await connection.query(popularSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 낮은 가격순 조회
async function lowLCategoryProduct (connection, categoryId){
    const lowLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by a.saleCost asc;`;
    const [productRows] = await connection.query(lowLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 낮은 가격순 조회
async function lowMCategoryProduct (connection, categoryId){
    const lowMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by a.saleCost asc;`;
    const [productRows] = await connection.query(lowMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 낮은 가격순 조회
async function lowSCategoryProduct (connection, categoryId){
    const lowSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by a.saleCost asc;`;
    const [productRows] = await connection.query(lowSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 높은 가격순 조회
async function highLCategoryProduct (connection, categoryId){
    const highLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by a.saleCost desc;`;
    const [productRows] = await connection.query(highLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 높은 가격순 조회
async function highMCategoryProduct (connection, categoryId){
    const highMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by a.saleCost desc;`;
    const [productRows] = await connection.query(highMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 높은 가격순 조회
async function highSCategoryProduct (connection, categoryId){
    const highSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by a.saleCost desc;`;
    const [productRows] = await connection.query(highSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 리뷰 많은순 조회
async function reviewLCategoryProduct (connection, categoryId){
    const reviewLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by reviewCount desc;`;
    const [productRows] = await connection.query(reviewLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 리뷰 많은순 조회
async function reviewMCategoryProduct (connection, categoryId){
    const reviewMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by reviewCount desc;`;
    const [productRows] = await connection.query(reviewMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 리뷰 많은순 조회
async function reviewSCategoryProduct (connection, categoryId){
    const reviewSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by reviewCount desc;`;
    const [productRows] = await connection.query(reviewSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 유저사진 많은순 조회
async function photoLCategoryProduct (connection, categoryId){
    const photoLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
left join ( select id
                    , productId
                    , houseWarmContentsId
                    , count(houseWarmContentsId) as 'photoCount'
            from HouseWarmContentsProductMapping
            group by houseWarmContentsId) as g
            on g.productId = a.id
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by photoCount desc;`;
    const [productRows] = await connection.query(photoLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 유저사진 많은순 조회
async function photoMCategoryProduct (connection, categoryId){
    const photoMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
left join ( select id
                    , productId
                    , houseWarmContentsId
                    , count(houseWarmContentsId) as 'photoCount'
            from HouseWarmContentsProductMapping
            group by houseWarmContentsId) as g
            on g.productId = a.id
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by photoCount desc;`;
    const [productRows] = await connection.query(photoMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 유저사진 많은순 조회
async function photoSCategoryProduct (connection, categoryId){
    const photoSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
left join ( select id
                    , productId
                    , houseWarmContentsId
                    , count(houseWarmContentsId) as 'photoCount'
            from HouseWarmContentsProductMapping
            group by houseWarmContentsId) as g
            on g.productId = a.id
where a.status = 'ACTIVE' and a.smallgeCategoryId = ?
group by a.id 
order by photoCount desc;`;
    const [productRows] = await connection.query(photoSCategoryProductQuery, categoryId);
    return productRows;
}

//큰 카테고리 최신순 조회
async function newLCategoryProduct (connection, categoryId){
    const newLCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.largeCategoryId = ?
group by a.id 
order by a.createdAt desc;`;
    const [productRows] = await connection.query(newLCategoryProductQuery, categoryId);
    return productRows;
}

//중간 카테고리 최신순 조회
async function newMCategoryProduct (connection, categoryId){
    const newMCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.middleCategoryId = ?
group by a.id 
order by a.createdAt desc;`;
    const [productRows] = await connection.query(newMCategoryProductQuery, categoryId);
    return productRows;
}

//작은 카테고리 최신순 조회
async function newSCategoryProduct (connection, categoryId){
    const newSCategoryProductQuery=`
    select c.imageUrl as Image
        , e.name as BrandName
        , a.name as ProductName
        , concat(a.discount, '%') as Discount
        , format(a.saleCost,0) as SaleCost
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
where a.status = 'ACTIVE' and a.smallCategoryId = ?
group by a.id 
order by a.createdAt desc;`;
    const [productRows] = await connection.query(newSCategoryProductQuery, categoryId);
    return productRows;
}


//문의 갯수 조회
async function countInquiry (connection, productId){
    const countInquiryQuery=`
    select case when count(productId) is null then 0 else count(productId) end as InquiryCount
    from Inquiry
    where productId = ? and status = 'ACTIVE'
    group by productId;`;
    const [countInquiryRows] = await connection.query(countInquiryQuery, productId);
    return countInquiryRows
}

//문의 조회
async function selectInquiry (connection, productId){
    const selectInquiryQuery=`
    select case when countAnswer is not null then '답변완료' else '답변미완료'  end as Answer
        , concat(f.name, '관련') as Category
        , replace(c.nickName,right(c.nickName,length(c.nickName)/3*2),'**') as UserNickName
        , date_format(a.createdAt, '%Y-%m-%d') as QuestionCreatedAt
        , a.contents as Q
        , b.answer as A
        , case when countAnswer is not null then e.name end as BrandName
        , date_format(b.createdAt, '%Y-%m-%d') as AnswerCreatedAt
from Inquiry a
left join ( select id
                        , inquiryId
                        , status
                        , count(inquiryId) as 'countAnswer'
                        , answer
                        , createdAt
                from AnswerInquiry
                where status = 'ACTIVE'
                group by inquiryId ) as b
                on a.id = b.inquiryId
left join ( select id
                    , nickName
                from User ) as c
                on a.userId = c.id
left join ( select id
                    , brandId
                from Product ) as d
                on a.productId = d.id
left join ( select id
                    , name
                from Brand ) as e
                on d.brandId = e.id
left join ( select id
                    , name
                from InquiryCategory ) as f
                on a.categoryId = f.id
where a.productId = ? and a.status = 'ACTIVE';`;
    const [inquiryRows] = await connection.query(selectInquiryQuery, productId);
    return inquiryRows;
}

//배송 정보 조회
async function selectDeliveryInfo (connection, productId){
    const selectDeliveryInfoQuery=`
    select a.delMethod as DeliveryMethod
        , case when a.delCost = 0 then '무료배송' else concat(format(a.delCost, 0), '원') end as DeliveryCost
        , a.payMethod as PaymentMethod
        , case when a.extraDelCost is null then '무료' else concat(format(a.extraDelCost, 0), '원') end as ExtraCost
        , a.disableLocation as DisableLocation
from DeliveryInfo a
left join ( select id
                , delInfoId
                from Product ) as b
                on a.id = b.delInfoId
where b.id = ?;`;
    const [deliveryRows] = await connection.query(selectDeliveryInfoQuery, productId);
    return deliveryRows;
}

//교환환불 정보 조회
async function selectExchangeInfo(connection, productId){
    const selectExchangeInfoQuery=`
    select concat(format(a.returnDelCost, 0), '원', '(최초 배송비가 무료인 경우', concat(format(a.returnDelCost*2, 0),'원 부과)')) as ReturnDeliveryCost
        , concat(format(a.exchangeDelCost,0),'원') as ExchangeDeliveryCost
        , a.destination as Destination
from ExchangeInfo a
left join ( select id
                , exchangeInfoId
                from Product ) as b
                on a.id = b.exchangeInfoId
where b.id = ?;`;
    const [exchangeRows] = await connection.query(selectExchangeInfoQuery, productId);
    return exchangeRows;
}

//환불 정보 조회
async function selectRefundInfo(connection, productId){
    const selectRefundInfoQuery=`
    select a.availablePeriod as AvailablePeriod
        , a.unavailableInfo as DisableInfo
from ExchangeInfo a
left join ( select id
                , exchangeInfoId
                from Product ) as b
                on a.id = b.exchangeInfoId
where b.id = ?;`;
    const [refundRows] = await connection.query(selectRefundInfoQuery, productId);
    return refundRows;
}

//판매자 정보 조회
async function selectBrandInfo(connection, productId){
    const selectBrandInfoQuery=`
    select a.companyName as CompanyName
        , a.ownerName as CEOName
        , a.location as Location
        , a.phoneNum as CenterPhoneNumber
        , a.email as Email
        , a.businessNum as BusinessNumber
from Brand a
left join ( select id
                , brandId
                from Product) as b
                on a.id = b.brandId
where b.id = ? ;`;
    const [brandRows] = await connection.query(selectBrandInfoQuery, productId);
    return brandRows;
}

module.exports = {
    selectMiddleCategory,
    selectSmallCategory,
    selectDetailCategory,
    orderLCategoryProduct,
    orderMCategoryProduct,
    orderSCategoryProduct,
    popularLCategoryProduct,
    popularMCategoryProduct,
    popularSCategoryProduct,
    lowLCategoryProduct,
    lowMCategoryProduct,
    lowSCategoryProduct,
    highLCategoryProduct,
    highMCategoryProduct,
    highSCategoryProduct,
    reviewLCategoryProduct,
    reviewMCategoryProduct,
    reviewSCategoryProduct,
    photoLCategoryProduct,
    photoMCategoryProduct,
    photoSCategoryProduct,
    newLCategoryProduct,
    newMCategoryProduct,
    newSCategoryProduct,
    countInquiry,
    selectInquiry,
    selectDeliveryInfo,
    selectExchangeInfo,
    selectRefundInfo,
    selectBrandInfo,
}
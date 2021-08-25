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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as ProductId
        , c.imageUrl as Image
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
    select a.id as InquiryId
        , case when countAnswer is not null then '답변완료' else '답변미완료'  end as Answer
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
    select a.id as BrandId
        , a.companyName as CompanyName
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

//이메일 뒷자리 조회
async function selectBackEmail(connection){
    const selectBackEmailQuery=`
    select id, contents
    from BackEmail
    where status = 'ACTIVE'
    order by id asc`;
    const [backRows] = await connection.query(selectBackEmailQuery);
    return backRows;
}

//배송 요청사항 조회
async function selectRequests(connection){
    const selectRequestQuery=`
    select id, contents
    from Request
    where status = 'ACTIVE'
    order by id asc;`;
    const [requestsRows] = await connection.query(selectRequestQuery);
    return requestsRows;
}

//상품 이미지 조회
async function selectProductImage(connection, productId){
    const selectProductImageQuery=`
    select imageUrl
from ProductImageUrl 
where productId = ?;`;
    const [imageRows] = await connection.query(selectProductImageQuery, productId);
    return imageRows;
}

//상품 정보 조회
async function selectProductInfo(connection, productId){
    const selectProductInfoQuery=`
    select a.id as ProductId
        , d.name as BrandName
        , a.name as ProductName
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , concat(a.discount, '%') as Discount
        , format(a.cost, 0) as Cost
        , format(a.saleCost, 0) as SaleCost
        , a.benefit as Benefit
        , concat(format(b.delCost, 0), '원') as DeliveryCost
        , b.delMethod as DeliveryType
        , a.largeCategoryId as largeCategoryId
from Product a
left join ( select id
                    , delCost
                        , delMethod
                from DeliveryInfo) as b
                on a.delInfoId = b.id
left join ( select id
                        , productId
                        , starPoint
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                from ProductReview 
                group by productId) as c
                on a.id = c.productId
left join ( select id
                    , name
                from Brand ) as d
                on a.brandId = d.id
where a.id = ?;`;
    const [infoRows] = await connection.query(selectProductInfoQuery, productId);
    return infoRows;
}

//스타일링샷 조회
async function selectStylingShot(connection, productId){
    const selectStylingShotQuery=`
    select c.id as HouseWarmContentsId
         , a.id as ProductId
        , c.imageUrl as Image
        , e.nickName as UserNickName
        , e.profileImageUrl as ProfileImage
from Product a
left join ( select id
                        , productId
                        , houseWarmContentsId
                        , status
                from HouseWarmContentsProductMapping ) as b
                on a.id = b.productId
left join ( select id
                        , imageUrl
                        ,houseWarmId
            from HouseWarmContents ) as c
            on b.houseWarmContentsId = c.id
left join ( select id
                    , userId
                from HouseWarm) as d
                on c. houseWarmId = d.id
left join ( select id
                    , nickName
                    , profileImageUrl
                from User ) as e
                on d.userId = e.id
where a.id = ? and b.status = 'ACTIVE';`;
    const [stylingShotRows] = await connection.query(selectStylingShotQuery, productId);
    return stylingShotRows;
}

//상품 소개 조회
async function selectProductIntro(connection, productId){
    const selectProductIntroQuery=`
    select imageUrl
from ProductInfo 
where productId = ?;`;
    const [infoRows] = await connection.query(selectProductIntroQuery, productId);
    return infoRows;
}

//리뷰 정리
async function selectReviewTotal(connection, productId){
    const selectReviewTotalQuery=`
    select a.id as ProductId
        , 5count
        , 4count
        , 3count
        , 2count
        ,1count
from Product a
left join ( select id
                        , productId
                        , imageUrl
                        , contents
                        , starPoint
                        , createdAt
                        , status
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , count(case when starPoint = 5 then 1 end) as '5count'
                        , count(case when starPoint >= 4 and starPoint < 5 then 1 end) as '4count'
                        , count(case when starPoint >= 3 and starPoint < 4 then 1 end) as '3count'
                        , count(case when starPoint >= 2 and starPoint < 3 then 1 end) as '2count'
                        , count(case when starPoint >= 1 and starPoint < 2 then 1 end) as '1count'
                from ProductReview
                group by productId) as b
                on a.id = b.productId
where a.id = ? and b.status = 'ACTIVE';`;
    const [totalRows] = await connection.query(selectReviewTotalQuery, productId);
    return totalRows;
}

//상품 리뷰 사진만 조회
async function selectReviewPhoto(connection, productId){
    const selectReviewPhotoQuery=`
    select id as ReviewId  
        , imageUrl as Image
    from ProductReview
    where productId = ? and status = 'ACTIVE'
    order by createdAt desc;`;
    const [photoRows] = await connection.query(selectReviewPhotoQuery, productId);
    return photoRows;
}

//상품 리뷰 조회
async function selectProductReview(connection, productId){
    const selectProductReviewQuery=`
        select b.id as ReviewId
            , c.nickName as UserNickName
             , c.profileImageUrl as ProfileImage
             , b.starPoint as StarPoint
             , date_format(b.createdAt, "%Y-%m-%d") as CreatedAt
             , b.imageUrl as Image
             , b.contents as Contents
        from Product a
                 left join ( select id
                                  , productId
                                  , imageUrl
                                  , contents
                                  , starPoint
                                  , createdAt
                                  , status
                                  , userId
                             from ProductReview) as b
                           on a.id = b.productId
                 left join ( select id
                                  , nickName
                                  , profileImageUrl
                             from User ) as c
                           on b.userId = c.id
        where a.id = ? and b.status = 'ACTIVE'
        order by createdAt desc limit 3;`;
    const [reviewRows] = await connection.query(selectProductReviewQuery, productId);
    return reviewRows;
}

//상품 문의수 조회
async function selectProductInquiryCount(connection, productId){
    const selectProductInquiryCountQuery=`
    select productId as ProductId
           , case when count(productId) is null then 0 else count(productId) end as InquiryCount
    from Inquiry
    where productId = ? and status ='ACTIVE'
    group by productId;`;
    const [inquiryRows] = await connection.query(selectProductInquiryCountQuery, productId);
    return inquiryRows;
}

//비슷한 상품 조회
async function selectSimilarProduct(connection, largeCategoryId){
    const selectSimilarProductQuery=`
    select a.id as ProductId
        , c.imageUrl as Image
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
group by a.id ;`;
    const [similarRows] = await connection.query(selectSimilarProductQuery, largeCategoryId);
    return similarRows;
}

//상품 조회수 증가
async function addViewCount(connection, productId){
    const addViewCountQuery=`
    update Product
    set viewCount = viewCount+1
    where id =?;`;
    const [viewCountRows] = await connection.query(addViewCountQuery, productId);
    return viewCountRows;
}

//최근 본 상품 추가
async function addRecentProduct(connection, userId, productId){
    const addRecentProductQuery=`
    insert into RecentProduct(userId, productId)
    values(?, ?);`;
    const [recentRows] = await connection.query(addRecentProductQuery, [userId, productId]);
    return recentRows;
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

//실시간 베스트 상품 조회
async function selectNowBestProduct(connection){
    const selectNowBestProductQuery=`
    select a.id as ProductId
        , row_number() over(order by orderCount desc) as Ranking
        , d.imageUrl as ProductImage
        , b.name as BrandName
        , a.name as ProductName
        , case when a.discount is not null then concat(a.discount, '%') end as DiscountPercent
        , format(a.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when e.delCost  = 0 then '무료배송' end as DeliveryCost
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , name
                from Brand) as b
                on a.brandId = b.id
left join ( select id
                        , productId
                        , starPoint
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , status
                from ProductReview 
                where status = 'ACTIVE'
                group by productId) as c
                on a.id = c.productId
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl ) as d
                on a.id = d.id
left join ( select id
                        , delCost
                from DeliveryInfo ) as e
                on a.delInfoId = e.id
left join ( select id
                        , productId
                        , count(productId) as 'orderCount'
                        , createdAt
                        , status
                from Orders
                where timestampdiff(day, current_timestamp, createdAt) < 7 and status = 'COMPLETE'
                group by productId) as f
                on a.id = f.productId
where a.status = 'ACTIVE'
order by orderCount desc;`;
    const [nowBestProductRows] = await connection.query(selectNowBestProductQuery);
    return nowBestProductRows;
}

//전체 카테고리 역대 베스트 상품 조회
async function selectBestProduct(connection){
    const selectBestProductQuery=`
        select a.id as ProductId
        , row_number() over(order by orderCount desc) as Ranking
        , d.imageUrl as ProductImage
        , b.name as BrandName
        , a.name as ProductName
        , case when a.discount is not null then concat(a.discount, '%') end as DiscountPercent
        , format(a.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when e.delCost  = 0 then '무료배송' end as DeliveryCost
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , name
                from Brand) as b
                on a.brandId = b.id
left join ( select id
                        , productId
                        , starPoint
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , status
                from ProductReview 
                where status = 'ACTIVE'
                group by productId) as c
                on a.id = c.productId
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl ) as d
                on a.id = d.id
left join ( select id
                        , delCost
                from DeliveryInfo ) as e
                on a.delInfoId = e.id
left join ( select id
                 , productId
                 , count(productId) as 'orderCount'
                , status
            from Orders
            where status = 'COMPLETE'
            group by productId) as f
          on a.id = f.productId
where a.status = 'ACTIVE'
order by orderCount desc;`;
    const [bestProductRows] = await connection.query(selectBestProductQuery);
    return bestProductRows;
}

//카테고리별 역대 베스트 상품 조회
async function selectCategoryBest(connection, categoryId){
    const selectCategoryBestQuery=`
        select a.id as ProductId
        , row_number() over(order by orderCount desc) as Ranking
        , d.imageUrl as ProductImage
        , b.name as BrandName
        , a.name as ProductName
        , case when a.discount is not null then concat(a.discount, '%') end as DiscountPercent
        , format(a.saleCost, 0) as Cost
        , case when starGrade is null then 0 else starGrade end as StarGrade
        , case when reviewCount is null then 0 else reviewCount end as ReviewCount
        , case when e.delCost  = 0 then '무료배송' end as DeliveryCost
        , case when a.discount is not null then '특가' end as SpecialPrice
from Product a
left join ( select id
                    , name
                from Brand) as b
                on a.brandId = b.id
left join ( select id
                        , productId
                        , starPoint
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , status
                from ProductReview 
                where status = 'ACTIVE'
                group by productId) as c
                on a.id = c.productId
left join ( select id
                        , productId
                        , imageUrl
                from ProductImageUrl ) as d
                on a.id = d.id
left join ( select id
                        , delCost
                from DeliveryInfo ) as e
                on a.delInfoId = e.id
left join ( select id
                 , productId
                 , count(productId) as 'orderCount'
                , status
            from Orders
            where status = 'COMPLETE'
            group by productId) as f
          on a.id = f.productId
where a.status = 'ACTIVE' and a.largeCategoryId = ?
order by orderCount desc;`;
    const [categoryBestRows] = await connection.query(selectCategoryBestQuery, categoryId);
    return categoryBestRows;
}

//현재시간 불러오기
async function selectCurrentTimestamp(connection){
    const selectCurrentTimestampQuery=`
    select concat(date_format(current_timestamp, "%Y-%m-%d %H:%m"), ' ', '기준') as CurrentTime;`;
    const [timeRows] = await connection.query(selectCurrentTimestampQuery);
    return timeRows;
}

//리뷰 분석
async function selectReviewAnalysis(connection, productId){
    const selectReviewAnalysisQuery=`
    select a.id as ProductId
         , case when reviewCount is null then 0 else reviewCount end as ReviewCount
         , case when starGrade is null then 0 else starGrade end as StarGrade
        , 5count
        , 4count
        , 3count
        , 2count
        ,1count
from Product a
left join ( select id
                        , productId
                        , imageUrl
                        , contents
                        , starPoint
                        , createdAt
                        , status
                        , round(sum(starPoint)/count(productId), 1) as 'starGrade'
                        , count(productId) as 'reviewCount'
                        , count(case when starPoint = 5 then 1 end) as '5count'
                        , count(case when starPoint >= 4 and starPoint < 5 then 1 end) as '4count'
                        , count(case when starPoint >= 3 and starPoint < 4 then 1 end) as '3count'
                        , count(case when starPoint >= 2 and starPoint < 3 then 1 end) as '2count'
                        , count(case when starPoint >= 1 and starPoint < 2 then 1 end) as '1count'
                from ProductReview
                group by productId) as b
                on a.id = b.productId
where a.id = ? and b.status = 'ACTIVE';`;
    const [totalRows] = await connection.query(selectReviewAnalysisQuery, productId);
    return totalRows;
}

//베스트순, 노필터 사진 리뷰 조회
async function selectPhotoReview(connection, productId){
    const selectPhotoReviewQuery=`
    select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
order by a.starPoint and a.createdAt desc ;`;
    const [Rows] = await connection.query(selectPhotoReviewQuery, productId)
    return Rows;
}

//베스트순, 상품 옵션 필터 사진 리뷰 조회
async function selectPhotoOptionReview(connection, productId, optionId){
    const selectPhotoOptionReviewQuery=`
        select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.productOptionId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
        group by a.id
        order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectPhotoOptionReviewQuery, [productId, optionId]);
    return Rows;
}

//베스트순, 별점 필터 사진 리뷰 조회
async function selectPhotoPointReview(connection, productId, pointType, pointTypes){
    const selectPhotoPointReviewQuery=`
            select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.imageUrl is not null and a.status = 'ACTIVE'
            group by a.id
            order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectPhotoPointReviewQuery, [productId, pointType, pointTypes]);
    return Rows;
}

//베스트순, 별점, 상품 옵션 필터 사진 리뷰 조회
async function selectPhotoPointOptionReview(connection, productId, pointType, pointTypes, optionId){
    const selectPhotoPointOptionReviewQuery=`
                select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? (and a.starPoint >= ? and a.starPoint <?+1)  and a.productOptionId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
                group by a.id
                order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectPhotoPointOptionReviewQuery, [productId, pointType, pointTypes, optionId]);
    return Rows;
}

//베스트순, 전체 리뷰 조회
async function selectTotalReview(connection, productId){
    const selectTotalReviewQuery=`
                    select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.status = 'ACTIVE'
                    group by a.id
                    order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectTotalReviewQuery, productId);
    return Rows;
}

//베스트순, 상품 옵션 필터 전체 리뷰 조회
async function selectTotalOptionReview(connection, productId, optionId){
    const selectTotalOptionReviewQuery=`
                    select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.productOptionId = ? and a.status = 'ACTIVE'
                    group by a.id
order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectTotalOptionReviewQuery, [productId, optionId]);
    return Rows;
}

//베스트순, 별점 필터 전체 리뷰 조회
async function selectTotalPointReview(connection, productId, pointType, pointTypes){
    const selectTotalPointReviewQuery=`
                select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.status = 'ACTIVE'
                group by a.id
order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectTotalPointReviewQuery, [productId, pointType, pointTypes]);
    return Rows;
}

//베스트순, 별점, 상품 옵션 필터 전체 리뷰 조회
async function selectTotalPointOptionReview(connection, productId, pointType, pointTypes, optionId){
    const selectTotalPointOptionReviewQuery=`
                    select a.id as ReviewIdt
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.productOptionId = ? and a.status = 'ACTIVE'
                    group by a.id
order by a.starPoint desc ;`;
    const [Rows] = await connection.query(selectTotalPointOptionReviewQuery, [productId, pointType, pointTypes, optionId]);
    return Rows;
}

//최신순, 노필터 사진 리뷰 조회
async function selectNewPhotoReview(connection, productId){
    const selectNewPhotoReviewQuery=`
        select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
        group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewPhotoReviewQuery, productId);
    return Rows;
}

//최신순, 상품 옵션 필터 사진 리뷰 조회
async function selectNewPhotoOptionReview(connection, productId, optionId){
    const selectNewPhotoOptionReviewQuery=`
            select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.productOptionId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
            group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewPhotoOptionReviewQuery, [productId, optionId]);
    return Rows;
}

//최신순, 별점 필터 사진 리뷰 조회
async function selectNewPhotoPointReview(connection, productId, pointType, pointTypes){
    const selectNewPhotoPointReviewQuery=`
                select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.imageUrl is not null and a.status = 'ACTIVE'
                group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewPhotoPointReviewQuery, [productId, pointType ,pointTypes]);
    return Rows;
}

//최신순, 별점, 상품 옵션 필터 사진 리뷰 조회
async function selectNewPhotoPointOptionReview(connection, productId, pointType, pointTypes, optionId){
    const selectNewPhotoPointOptionReviewQuery=`
                    select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.productOptionId = ? and a.imageUrl is not null and a.status = 'ACTIVE'
                    group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewPhotoPointOptionReviewQuery, [productId, pointType, pointTypes, optionId]);
    return Rows;
}

//최신순, 전체 리뷰 조회
async function selectNewTotalReview(connection, productId){
    const selectNewTotalReviewQuery=`
                        select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.status = 'ACTIVE'
                        group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewTotalReviewQuery, productId);
    return Rows;
}

//최신순, 상품 옵션 필터 전체 리뷰 조회
async function selectNewTotalOptionReview(connection, productId, optionId){
    const selectNewTotalOptionReviewQuery=`
                            select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and a.productOptionId = ? and a.status = 'ACTIVE'
                            group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewTotalOptionReviewQuery, [productId, optionId]);
    return Rows;
}

//최신순, 별점 필터 전체 리뷰 조회
async function selectNewTotalPointReview(connection, productId, pointType, pointTypes){
    const selectNewTotalPointReviewQuery=`
                                select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.status = 'ACTIVE'
                                group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewTotalPointReviewQuery, [productId, pointType, pointTypes]);
    return Rows;
}

//최신순, 별점, 상품 옵션 필터 전체 리뷰 조회
async function selectNewTotalPointOptionReview(connection, productId, pointType, pointTypes, optionId){
    const selectNewTotalPointOptionReviewQuery=`
                                    select a.id as ReviewId
        , a.starPoint as StarPoint
        , a.strengthPoint as StrengthPoint
        , a.designPoint as DesignPoint
        , a.costPoint as CostPoint
        , a.delPoint as DelPoint
        , date_format(createdAt, "%Y-%m-%d") as ReviewCreatedAt
        , case when a.ordersId is not null then '오늘의집 구매' else '다른 쇼핑몰 구매' end as OrderType
        , d.title as OptionType
        , d.name as OptionName
        , a.imageUrl as ReviewImage
        , a.contents as ReviewContents
        , case when helpCount is null then 0 else helpCount end as HelpCount
from ProductReview a
left join ( select id
                        , nickName
                        , profileImageUrl
                from User ) as b
                on a.userId = b.id
left join ( select id
                    , name
                from Product )as c
                on a.productId = c.id
left join ( select id
                        , productId
                        , title
                        , name
                from ProductOption ) as d
                on a.productId = d.productId
left join ( select id
                        , reviewId
                        , count(reviewId) as 'helpCount'
                        , status
                from ReviewHelp
                where status = 'ACTIVE'
                group by reviewId ) as e
                on a.id = e.reviewId
where a.productId = ? and (a.starPoint >= ? and a.starPoint<?+1) and a.productOptionId = ? and a.status = 'ACTIVE'
                                    group by a.id
order by a.createdAt desc ;`;
    const [Rows] = await connection.query(selectNewTotalPointOptionReviewQuery, [productId, pointType, pointTypes, optionId]);
    return Rows;
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
    selectBackEmail,
    selectRequests,
    selectProductImage,
    selectProductInfo,
    selectStylingShot,
    selectProductIntro,
    selectReviewTotal,
    selectProductReview,
    selectProductInquiryCount,
    selectSimilarProduct,
    addViewCount,
    selectReviewPhoto,
    addRecentProduct,
    selectTotalCategory,
    selectNowBestProduct,
    selectBestProduct,
    selectCategoryBest,
    selectCurrentTimestamp,
    selectReviewAnalysis,
    selectPhotoReview,
    selectPhotoOptionReview,
    selectPhotoPointReview,
    selectPhotoPointOptionReview,
    selectTotalReview,
    selectTotalOptionReview,
    selectTotalPointReview,
    selectTotalPointOptionReview,
    selectNewPhotoReview,
    selectNewPhotoOptionReview,
    selectNewPhotoPointReview,
    selectNewPhotoPointOptionReview,
    selectNewTotalReview,
    selectNewTotalOptionReview,
    selectNewTotalPointReview,
    selectNewTotalPointOptionReview,
}
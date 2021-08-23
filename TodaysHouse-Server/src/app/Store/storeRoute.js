module.exports = function(app) {
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    // 22. 스토어 카테고리로 조회 API
    app.get('/app/products/categories', store.getCategoryProduct);

    // 23. 스토어 특정 상품 조회 API
    app.get('/app/products/users/:userId',jwtMiddleware, store.getProduct);

    // 24. 베스트 상품 조회 API
    app.get('/app/products/best', store.getBestProduct);

    // 26. 문의 조회 API
    app.get('/app/products/:productId/inquiry', store.getInquiry);

    // 27. 배송/교환/환불 정보 조회 API
    app.get('/app/products/:productId/info', store.getInfo);

    // 30. 상품 리뷰 조회 API
    app.get('/app/products/:productId/reviews', store.getReviews);

    // 38. 이메일 뒷자리 조회 API
    app.get('/app/backemails', store.getBackEmail);

    // 40. 배송 요청사항 조회 API
    app.get('/app/requests', store.getRequests);
}
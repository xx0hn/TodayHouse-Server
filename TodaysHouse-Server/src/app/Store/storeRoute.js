module.exports = function(app) {
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    // 22. 스토어 카테고리로 조회 API
    app.get('/app/products/categories', store.getCategoryProduct);

    // 26. 문의 조회 API
    app.get('/app/products/:productId/inquiry', store.getInquiry);

    // 27. 배송/교환/환불 정보 조회 API
    app.get('/app/products/:productId/info', store.getInfo);
}
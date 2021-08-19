module.exports = function(app) {
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    // 17. 인기탭 조회 API
    app.get('/app/posts/popular', post.getPopular);

}

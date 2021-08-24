module.exports = function(app) {
    const post = require('./postController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    // 17. 인기탭 조회 API
    app.get('/app/posts/popular', post.getPopular);

    // 18. 전체 집들이 게시글 조회 API
    app.get('/app/posts/housewarms', post.getTotalHouseWarm);

    // 19. 집들이 게시글 조회 API
    app.get('/app/posts/housewarms/:houseWarmId', post.getHouseWarm);

    // 20. 통합 검색 API
    app.get('/app/posts', post.getSearch);

    // 42. 집들이 댓글 조회 API
    app.get('/app/housewarms/:houseWarmId/comments', post.getComment);

    // 43. 집들이 좋아요, 스크랩, 댓글, 조회수 조회 API
    app.get('/app/housewarms/:houseWarmId/status', post.getStatus);

    // 44. 비슷한 집들이 조회 API
    app.get('/app/housewarms/:houseWarmId/similar', post.getSimilar);
}

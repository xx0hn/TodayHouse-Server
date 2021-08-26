module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;


    app.use(session({secret: 'SECRET_CODE', resave: true, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(
        'kakao-login',
        new KakaoStrategy(
            {
                clientID: 'ddbe1ff5300971f37b81413e6e4c6364',
                clientSecret: 'VmduDQJHUTBuAAxVabxEtMMlWrjx4nvS',
                callbackURL: '/auth/kakao/callback',
            },
            function (accessToken, refreshToken, profile, done) {
                result = {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: profile,
                };
                console.log('KakaoStrategy', result);
                return done;
            },
        ),
    );
    passport.serializeUser((user, done) => {
        done(null, user); // user객체가 deserializeUser로 전달됨.
    });
    passport.deserializeUser((user, done) => {
        done(null, user); // 여기의 user가 req.user가 됨
    });


    // 1. 유저 생성 (회원가입) API
    app.post('/app/sign-up', user.postUsers);

    // 2. 로그인 (JWT 생성) API
    app.post('/app/login', user.login);

    // 3. 유저 마이페이지 조회 API
    app.get('/app/users/:userId/mypages', jwtMiddleware, user.getMyPages);

    // 4. 다른 유저 페이지 조회 API
    app.get('/app/users/:userId/profiles', jwtMiddleware, user.getOtherProfiles);

    // 5. 카카오 로그인 API
    app.post('/app/login/kakao', user.loginKakao);
    app.get('/auth/kakao/callback', passport.authenticate('kakao-login', { failureRedirect: '/auth', successRedirect: '/' }));

    // 6. 프로필 수정 API
    app.patch('/app/users/:userId/profiles', jwtMiddleware, user.patchProfiles);

    // 7. 스크랩 폴더 생성 API
    app.post('/app/users/:userId/scrap-folders', jwtMiddleware, user.postScrapFolders);

    // 8. 스크랩 폴더 수정 API
    app.patch('/app/users/:userId/scrap-folders', jwtMiddleware, user.patchScrapFolders);

    // 9. 스크랩 API
    app.post('/app/users/:userId/scraps', jwtMiddleware, user.postScrap);

    // 10. 스크랩 조회 API
    app.get('/app/users/:userId/scraps', jwtMiddleware, user.getScrap);

    // 11. 좋아요 API
    app.post('/app/users/:userId/likes', jwtMiddleware, user.postLike);

    // 12. 좋아요 조회 API
    app.get('/app/users/:userId/likes', jwtMiddleware, user.getLike);

    // 13. 팔로우 API
    app.post('/app/users/:userId/follows', jwtMiddleware, user.postFollow);

    // 14. 팔로우 조회 API
    app.get('/app/users/:userId/follows', user.getFollow);

    // 15. 댓글 달기 API
    app.post('/app/users/:userId/comments', jwtMiddleware, user.postComment);

    // 16. 댓글 수정 API
    app.patch('/app/users/:userId/comments', jwtMiddleware, user.patchComment);

    // 21. 스토어 홈 카테고리 조회 API
    app.get('/app/users/:userId/store-categories', jwtMiddleware, user.getStoreHome);

    // 25. 문의 생성 API
    app.post('/app/users/:userId/inquiry', jwtMiddleware, user.postInquiry);

    // 28. 주문 생성 API
    app.post('/app/users/:userId/orders', jwtMiddleware, user.postOrder);

    // 29. 리뷰 생성 API
    app.post('/app/users/:userId/reviews', jwtMiddleware, user.postReview);

    // 31. 자동 로그인 API
    app.get('/app/auto-login', jwtMiddleware, user.jwtCheck);

    // 32. 이메일 중복 체크 API
    app.get('/app/emails', user.emailCheck);

    // 33. 닉네임 중복 체크 API
    app.get('/app/nicknames', user.nicknameCheck);

    // 34. 확인 비밀번호 체크 API
    app.get('/app/passwords', user.passwordCheck);

    // 35. 나의 쇼핑 정보 조회 API
    app.get('/app/users/:userId/myshopping', jwtMiddleware, user.getMyShopping);

    // 36. 주문/배송 조회 API
    app.get('/app/users/:userId/orders',jwtMiddleware, user.getOrders);

    // 37. 비밀번호 변경 API
    app.patch('/app/users/:userId/password',jwtMiddleware, user.patchPassword);

    // 39. 사용 가능 쿠폰 조회 API
    app.get('/app/users/:userId/coupons', jwtMiddleware, user.getCoupons);

    // 41. 리뷰 도움 API
    app.post('/app/users/:userId/helped-reviews', jwtMiddleware, user.postHelp);

    // 45. 스토어 홈 최근 본 상품 조회 API
    app.get('/app/users/:userId/recent-products', jwtMiddleware, user.getRecentProducts);

    // 46. 스토어 홈 최근 본 상품과 비슷한 상품 조회 API
    app.get('/app/users/:userId/recent-similar', jwtMiddleware, user.getRecentSimilar);

    // 47. 스토어 홈 인기 키워드 조회 API
    app.get('/app/users/:userId/popular-keywords', jwtMiddleware, user.getPopularKeywords);

    // 48. 스토어 홈 인기 상품 조회 API
    app.get('/app/users/:userId/popular-products', jwtMiddleware, user.getPopularProducts);

    // 53. 나의 쇼핑 주문 현황 조회 API
    app.get('/app/users/:userId/current-orders', jwtMiddleware, user.getCurrentOrders);

    // 54. 나의 쇼핑 스크랩북, 문의, 리뷰 수 조회 API
    app.get('/app/users/:userId/shopping-status', jwtMiddleware, user.getShoppingStatus);

    // 55. 마이페이지 나의 쇼핑 조회 API
    app.get('/app/users/:userId/mypage-shopping', jwtMiddleware, user.getMyPageShopping);

    // 56. 마이페이지 스크랩 조회 API
    app.get('/app/users/:userId/mypage-scrap', jwtMiddleware, user.getMyPageScrap);

    // 57. 마이페이지 집들이 조회 API
    app.get('/app/users/:userId/mypage-housewarm', jwtMiddleware, user.getMyPageHouseWarm);

    // 58. 마이페이지 리뷰수 조회 API
    app.get('/app/users/:userId/mypage-reviewcount', jwtMiddleware, user.getMyPageReviewCount);

    // 59. 다른 유저 페이지 집들이 조회 API
    app.get('/app/users/:userId/otherpage-housewarm', jwtMiddleware, user.getOtherHouseWarm);

    // 60. 다른 유저 페이지 스크랩 조회 API
    app.get('/app/users/:userId/otherpage-scrap', jwtMiddleware, user.getOtherScrap);

    // **. 정시마다 푸시 알림 API
    app.get('/app/push', user.pushAlarms);

    // TODO: After 로그인 인증 방법 (JWT)


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API

// TODO: 탈퇴하기 API
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

    //  유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers); 

    //  특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);


    // TODO: After 로그인 인증 방법 (JWT)


};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API
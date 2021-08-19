module.exports = function(app) {
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    const passport = require('passport');
    const session = require('express-session');
    const KakaoStrategy = require('passport-kakao').Strategy;

}
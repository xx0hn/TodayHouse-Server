const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const postProvider = require("./postProvider");
const postDao = require("./postDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");
const regexEmail = require("regex-email");
// const regexURL = /(https)\:[/][/]+([\w\-])+$/;

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");
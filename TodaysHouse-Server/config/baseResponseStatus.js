module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    INCREASED_VIEW_COUNT:  { "isSuccess": true, "code": 1002, "message": "조회수가 증가했습니다. "},

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 8자리 이상 입력 해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_NICKNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 10자리를 입력해주세요." },
    SIGNUP_PASSWORD_ERROR_TYPE_VAL : { "isSuccess": false,"code": 2019,"message":"비밀번호 형식을 정확하게 입력해주세요. (영문 + 숫자)" },
    SIGNUP_PASSWORD_CHECK_EMPTY: { "isSuccess": false, "code": 2020, "message": "확인 비밀번호를 입력해주세요." },


    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력해주세요." },
    SIGNIN_PASSWORD_LENGTH: { "isSuccess": false, "code": 2021, "message": "비밀번호는 8자리 이상 입력해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요. " },
    USER_NICKNAME_EMPTY : { "isSuccess": false, "code": 2017, "message": "변경할 닉네임 값을 입력해주세요. " },

    USER_STATUS_EMPTY : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 입력해주세요. " },

    TARGET_USER_USERID_EMPTY: { "isSuccess": false, "code": 2022, "message": "대상 userId를 입력해주세요. " },

    USER_ACCESS_TOKEN_WRONG: { "isSuccess": false, "code": 2023, "message": "Access Token이 잘못되었습니다. " },
    USER_INFO_EMPTY: { "isSuccess": false, "code": 2024, "message": "유저 정보를 입력해주세요. " },

    USER_EDIT_TYPE_EMPTY: { "isSuccess": false, "code": 2025, "message": "수정할 유저 정보의 타입을 입력해주세요. " },
    USER_EDIT_INFO_EMPTY: { "isSuccess": false, "code": 2026, "message": "수정할 유저의 정보를 입력해주세요. " },

    SCRAP_FOLDER_NAME_EMPTY: { "isSuccess": false, "code": 2027, "message": "스크랩 폴더명을 입력해주세요. " },

    USER_EDIT_FOLDER_TYPE_EMPTY: { "isSuccess": false, "code": 2028, "message": "수정 유형을 입력해주세요. " },
    SCRAP_FOLDER_ID_EMPTY: { "isSuccess": false, "code": 2029, "message": "스크랩 폴더id를 입력해주세요. " },

    SCRAP_TYPE_EMPTY: { "isSuccess": false, "code": 2030, "message": "스크랩 타입을 입력해주세요. " },
    SCRAP_ID_EMPTY: { "isSuccess": false, "code": 2031, "message": "스크랩할 id를 입력해주세요. " },
    SCRAP_SCRAPID_EMPTY: { "isSuccess": false, "code": 2032, "message": "스크랩 id를 입력해주세요. " },

    SCRAP_BOOK_TYPE_EMPTY: { "isSuccess": false, "code": 2033, "message": "스크랩북 타입을 입력해주세요. " },

    HOUSE_WARM_ID_EMPTY: { "isSuccess": false, "code": 2034, "message": "집들이 id를 입력해주세요. " },

    LIKE_LIKEID_EMPTY: { "isSuccess": false, "code": 2035, "message": "좋아요 id를 입력해주세요. " },
    LIKE_TYPE_EMPTY:{ "isSuccess": false, "code": 2036, "message": "좋아요 타입를 입력해주세요. " },

    FOLLOW_USER_ID_EMPTY:{ "isSuccess": false, "code": 2037, "message": "팔로우할 유저id를 입력해주세요. " },
    FOLLOW_CANCEL_USER_ID_EMPTY:{ "isSuccess": false, "code": 2038, "message": "팔로우 취소할 유저id를 입력해주세요. " },
    FOLLOW_TYPE_EMPTY:{ "isSuccess": false, "code": 2039, "message": "팔로우 타입을 입력해주세요. " },

    COMMENT_TYPE_EMPTY:{ "isSuccess": false, "code": 2040, "message": "댓글 타입을 입력해주세요. " },

    COMMENT_ID_EMPTY:{ "isSuccess": false, "code": 2041, "message": "댓글id를 입력해주세요. " },
    COMMENT_CONTENT_EMPTY:{ "isSuccess": false, "code": 2042, "message": "댓글 내용을 입력해주세요. " },
    COMMENT_REPLY_ID_EMPTY:{ "isSuccess": false, "code": 2043, "message": "대댓글id를 입력해주세요. " },

    PRODUCT_CATEGORY_ID_EMPTY:{ "isSuccess": false, "code": 2044, "message": "상품 카테고리를 입력해주세요. " },

    PRODUCT_ID_EMPTY:{ "isSuccess": false, "code": 2045, "message": "상품 id를 입력해주세요. " },

    INQUIRY_CATEGORY_ID_EMPTY:{ "isSuccess": false, "code": 2046, "message": "문의 카테고리를 입력해주세요. " },
    INQUIRY_CONTENTS_EMTPY:{ "isSuccess": false, "code": 2047, "message": "문의 내용을 입력해주세요. " },

    SORT_TYPE_EMPTY:{ "isSuccess": false, "code": 2048, "message": "정렬 우선순위를 입력해주세요. " },

    PRODUCT_INFO_EMPTY:{ "isSuccess": false, "code": 2049, "message": "상품 정보를 입력해주세요. " },
    ORDERER_INFO_EMPTY:{ "isSuccess": false, "code": 2050, "message": "주문자 정보를 입력해주세요. " },
    DESTINATION_INFO_EMPTY:{ "isSuccess": false, "code": 2051, "message": "배송지 정보를 입력해주세요. " },
    BACKEMAIL_EMPTY:{ "isSuccess": false, "code": 2052, "message": "이메일 뒷자리를 입력해주세요. " },
    ORDER_REQUEST_CONTENTS_EMPTY:{ "isSuccess": false, "code": 2053, "message": "주문 요청사항을 입력해주세요. " },
    ORDER_PAY_METHOD_EMPTY:{ "isSuccess": false, "code": 2053, "message": "결제 수단을 입력해주세요. " },

    ORDER_ID_EMPTY:{ "isSuccess": false, "code": 2054, "message": "주문 id를 입력해주세요. " },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },
    SIGNUP_PASSWORD_CHECK_NOT_MATCH: { "isSuccess": false, "code": 3007, "message":"확인 비밀번호가 일치하지 않습니다. " },

    SIGNIN_EMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "이메일이 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },
    USER_EDIT_TYPE_ERROR: { "isSuccess": false, "code": 3008, "message": "수정할 유저 정보의 타입을 정확하게 입력해주세요. (PROFILE_IMAGE/BACKGROUND_IMAGE/NICKNAME/MY_URL/INTRO) " },
    USER_MY_URL_TYPE_ERROR: { "isSuccess": false, "code": 3009, "message": "URL 형식에 맞춰주세요. (https://~) "},

    REDUNDANT_FOLDER_NAME: { "isSuccess": false, "code": 3010, "message": "중복된 폴더명입니다. "},
    USER_EDIT_FOLDER_TYPE_ERROR: { "isSuccess": false, "code": 3011, "message": "수정 유형을 정확하게 입력해주세요. (DELETE, EDIT)"},

    SCRAP_TYPE_ERROR: { "isSuccess": false, "code": 3012, "message": "스크랩 타입을 정확하게 입력해주세요. (HOUSEWARM, PRODUCT)"},
    SCRAP_BOOK_TYPE_ERROR: { "isSuccess": false, "code": 3013, "message": "스크랩북 타입을 정확하게 입력해주세요. (TOTAL, FOLDER, PRODUCT, HOUSEWARM)"},

    ALREADY_SCRAP: { "isSuccess": false, "code": 3014, "message": "이미 스크랩 하셨습니다. "},

    ALREADY_LIKE: { "isSuccess": false, "code": 3015, "message": "이미 좋아요를 누르셨습니다. "},

    LIKE_TYPE_ERROR: { "isSuccess": false, "code": 3016, "message": "좋아요 타입을 정확하게 입력해주세요. (TOTAL, HOUSEWARM) "},
    ALREADY_FOLLOW: { "isSuccess": false, "code": 3017, "message": "이미 팔로우 중입니다. "},

    FOLLOW_TYPE_ERROR: { "isSuccess": false, "code": 3018, "message": "팔로우 타입을 정확하게 입력해주세요. (FOLLOWER, FOLLOWING) "},

    COMMENT_TYPE_ERROR: { "isSuccess": false, "code": 3019, "message": "댓글 타입을 정확하게 입력해주세요. (COMMENT, REPLY) "},
    PRODUCT_CATEGORY_ID_ERROR:  { "isSuccess": false, "code": 3020, "message": "카테고리 id를 정확하게 입력해주세요. "},

    SORT_TYPE_ERROR:  { "isSuccess": false, "code": 3021, "message": "정렬 우선순위를 정확하게 입력해주세요. (ORDER, POPULAR, LOWPRICE, HIGHPRICE, REVIEW, USERPHOTO, NEW"},

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}

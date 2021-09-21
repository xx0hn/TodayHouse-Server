# TodayHouse-Server
TodayHouse Clone Coding Project

## ERD
URL : https://aquerytool.com/aquerymain/index/?rurl=34abeb03-8674-4e46-b91f-f4b05dba67ab&
Password : z3cp7m

## URL
https://prod.xx0hn.site

## Server
- AWS EC2

## DataBase
- AWS RDS

## API list
01	POST	`/app/sign-up	유저 생성 API (회원가입)`

02	POST	/app/login	로그인 API
03	GET	/app/users/:userId/mypages	유저 마이페이지 정보 조회 API
04	GET	/app/users/:userId/profiles	다른 유저 페이지 정보 조회 API
05	POST	/app/login/kakao	카카오 소셜 로그인 API
06	PATCH	/app/users/:userId/profiles	프로필 수정 API
07	POST	/app/users/:userId/scrap-folders	스크랩 폴더 생성 API
08	PATCH	/app/users/:userId/scrap-folders	스크랩 폴더 수정 API (삭제/수정 querystring)
09  POST	/app/users/:userId/scraps	스크랩 API (집들이/상품 querystring)
10	GET	/app/users/:userId/scraps	스크랩 조회 API
11	POST	/app/users/:userId/likes	좋아요 API 
12	GET	/app/users/:userId/likes	좋아요 조회 API 
13	POST	/app/users/:userId/follows	팔로우 API 
14	GET	/app/users/:userId/follows	팔로우 조회 API(팔로워/팔로잉 querystring)
15	POST	/app/users/:userId/comments	댓글 달기 API 
16	PATCH	/app/users/:userId/comments	댓글 삭제 API 
17	GET	/app/posts/popular	인기탭 조회 API
18	GET	/app/posts/housewarms	전체 집들이 게시글 조회 API(querystring)
19	GET	/app/posts/housewarms/:houseWarmId	집들이 게시물 조회 API
20	GET	/app/posts	게시물 통합 검색 API(querystring)
21	GET	/app/users/:userId/store-categories	스토어홈 카테고리 조회 API
22	GET	/app/products/categories	카테고리 별 상품 조회 API (카테고리, 정렬우선순위 querystring)
23	GET	/app/products/users/:userId	 스토어 특정 상품 조회 API
24	GET	/app/products/best	베스트 상품 조회 API (실시간/역대(카테고리) querystring)
25	POST	/app/users/:userId/inquiry	문의 생성 API
26	GET	/app/products/:productId/inquiry	문의 조회 API
27	GET	/app/products/:productId/info	배송/교환/환불 정보 조회 API
28	POST	/app/users/:userId/orders	주문 생성 API
29	POST	/app/users/:userId/reviews	리뷰 작성 API
30	GET	/app/products/:productId/reviews	상품 리뷰 더보기 조회 API 
31	GET	/app/auto-login	자동 로그인 API
32	GET	/app/emails	이메일 중복 체크 API
33	GET	/app/nicknames	닉네임 중복 체크 API
34	GET	/app/passwords	비밀번호 확인 API
35	GET	/app/users/:userId/myshopping	나의 쇼핑 정보 조회 API
36	GET	/app/users/:userId/orders	주문/배송 조회 API
37	PATCH	/app/users/:userId/password	비밀번호 변경 API
38	GET	/app/backemails	이메일 뒷자리 조회 API
39	GET	/app/users/:userId/coupons	사용가능 쿠폰 조회 API
40	GET	/app/requests	배송 요청사항 조회 API
41	POST	/app/users/:userId/helped-reviews	리뷰 도움 API
42	GET	/app/housewarms/:houseWarmId/comments	집들이 댓글 조회 API
43	GET	/app/housewarms/:houseWarmId/status	집들이 좋아요, 스크랩, 댓글, 조회수 조회 API
44	GET	/app/housewarms/:houseWarmId/similar	비슷한 집들이 조회 API
45	GET	/app/users/:userId/recent-products	스토어 홈 최근에 본 상품 조회 API
46	GET	/app/users/:userId/recent-similar	스토어 홈 최근 본 상품과 비슷한 상품 조회 API
47	GET	/app/uses/:userId/popular-keywords	스토어 홈 인기 키워드 조회 API
48	GET	/app/users/:userId/popular-products	스토어 홈 인기 상품 조회 API
49	GET	/app/products/styling-shot	특정 상품 스타일링 샷 조회 API
50	GET	/app/products/reviews	특정 상품 리뷰 조회 API
51	GET	/app/products/inquiries	특정 상품 문의 갯수 조회 API
52	GET	/app/products/similars	특정 상품 비슷한 상품 조회 API
53	GET	/app/users/:userId/current-orders	나의 쇼핑 주문 현황 조회 API
54	GET	/app/users/:userId/shopping-status	나의 쇼핑 스크랩북, 문의, 조회 수 조회 API
55	GET	/app/users/:userId/mypage-shopping	마이페이지 나의 쇼핑 조회 API
56	GET	/app/users/:userId/mypage-scrap	마이페이지 스크랩 조회 API
57	GET	/app/usres/:userId/mypage-housewarm	마이페이지 집들이 조회 API
58	GET	/app/users/:userId/mypage-reviewcount	마이페이지 리뷰수 조회 API
59	GET	/app/users/:userId/otherpage-housewarm	다른 유저 페이지 집들이 조회 API
60	GET	/app/users/:userId/otherpage-scrap	다른 유저 페이지 스크랩 조회 API
61	GET	/app/posts/housewarms-products/:houseWarmId	 집들이 게시물 포함된 모든 상품 조회API
**  GET	/app/push	매 정시마다 푸시 알림 API

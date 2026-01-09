/*
DB PK: MENUKEY=104
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-01-19 16:49:50
수정일: 2019-10-17 09:12:08
*/

$(document).ready(function(){
	$(".policy_btn").click(function(){
		$(this).parents(".policy_box").toggleClass("on");
	});
});
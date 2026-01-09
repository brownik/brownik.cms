/*
DB PK: MENUKEY=103
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-01-19 16:46:35
수정일: 2019-10-17 09:12:05
*/

$(document).ready(function(){
	$(".policy_btn").click(function(){
		$(this).parents(".policy_box").toggleClass("on");
	});
});
/*
DB PK: MENUKEY=101
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2017-11-13 13:50:47
수정일: 2019-10-17 09:12:02
*/

$(document).ready(function(){
	$(".policy_btn").click(function(){
		$(this).parents(".policy_box").toggleClass("on");
	});
});

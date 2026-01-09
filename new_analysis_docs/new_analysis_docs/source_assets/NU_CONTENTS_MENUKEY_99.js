/*
DB PK: MENUKEY=99
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2017-10-24 21:08:37
수정일: 2018-02-22 11:04:57
*/

$(document).ready(function(){
  

	var statis_info = $("li.statis_info");
	var statis_info_list = $("div.statis_info_list h3");

	// 통계 마당 스크립트
	statis_info_list.click(function(e) {

		e.preventDefault();
		var index = statis_info_list.index(this);

		
		statis_info.eq(index).toggleClass("on");

	});

	$("div.statis_info_cont").find(".btn_close").click(function(e) {
		e.preventDefault();
		statis_info.removeClass("on");
	});
});
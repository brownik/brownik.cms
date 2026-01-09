/*
DB PK: MENUKEY=72
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2017-06-12 20:50:29
수정일: 2018-02-22 11:03:52
*/

$(document).ready(function(){
  

	/**
     *-------------------------------------------
     * 사진으로 보는 김해
     *-------------------------------------------
     */

    var timeBtn = $("div.timeBtn");
    var liDepth1 = $("li.liDepth1");
    var timeGallery = $(".timeGallery");
    var pic_control = $(".pic_control li");
    var pic_block = $(".pic_block li")

   // 상새 내용 보기

	timeBtn.click(function(e) { 

		var index = timeBtn.index(this);

		e.preventDefault();
		thumnailInit();

	 	var dpeth1 = $(liDepth1).eq(index).addClass("on");
	 	dpeth1.find(".timeGallery").addClass("on");

	    $('html,body').animate(200, function() {
	        dpeth1.focus();
	    });

	 });

	// 상세 내용 닫기
	$("span.btnClose a").click(function(e){

		e.preventDefault();
		thumnailInit();
	});

	function thumnailInit() {
		liDepth1.removeClass("on");
		timeGallery.removeClass("on");
	}

	// 썸네일 클릭
	pic_control.click(function(e){

		var index = pic_control.index(this);

		e.preventDefault();

		// 클릭 대상 활성화
		pic_control.removeClass("on");
		$(this).addClass("on");

		console.log(index);

		// 클릭 내용 활성화
		pic_block.removeClass("on");
		pic_block.eq(index).addClass("on");

	});
});
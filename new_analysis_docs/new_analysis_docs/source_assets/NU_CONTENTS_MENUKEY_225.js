/*
DB PK: MENUKEY=225
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-10-17 15:50:43
수정일: 2026-01-05 10:23:20
*/

$(document).ready(function(){
	var $window = $(window);
		// Function to handle changes to style classes based on window width
		function checkWidth() {
		if ($window.width() < 450) {
			$('.post-info-ctrl-wrap').removeClass('on');
			};

		if ($window.width() >= 450) {
			$('.post-info-ctrl-wrap').addClass('on');
		}
	}
	// Execute on load
    checkWidth();

    // Bind event listener
	$(window).resize(checkWidth);
  
     $(".site-back-button").click(function(){
  		history.back();
  	});
  
  	// 등록버튼 누를 때
	$('button.build-community.townlab').click(function(){
		$('button.main-search-button').css('display','none');
	});
});

$(document).ready(function(){

	// 관리자 버튼 컨트롤
	$('.info-ctrl.ctrl').click(function(){
		$('.post-info-ctrl-wrap').toggleClass('on');
	});
  
  	// Hide Header on on scroll down
	$('.community-post-wrap').scroll(function(e) {
		 var scroll = $('.community-post-wrap').scrollTop();
		 if (scroll >= 300) {
			 $(".post-main-menu").addClass("change");
           	 $(".post-main-menu.change .post-main-menu-back").css("display","block");
		 }
      	 if (scroll < 300) {
			 $(".post-main-menu").removeClass("change").css("overflow","hidden");
			 $(".post-main-menu.change").css("width","0");
             $(".post-main-menu.change .post-main-menu-back").css("display","none");
		 }
	});
  
});
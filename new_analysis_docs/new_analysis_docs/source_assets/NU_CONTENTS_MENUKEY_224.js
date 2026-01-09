/*
DB PK: MENUKEY=224
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-10-17 15:50:35
수정일: 2025-12-29 10:19:07
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
  	var kind = "";
	var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1) {
		kind = "android";
	} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
		kind = "ios";
	}
     $(".site-back-button").click(function(){
  		history.back();
        if(kind == "android") {
			android.closeWebView();
		}
       	
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
			 //console.log('a');
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
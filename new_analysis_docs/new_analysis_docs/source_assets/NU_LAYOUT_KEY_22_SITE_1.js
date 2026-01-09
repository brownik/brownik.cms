/*
DB PK: KEY=22, SITEKEY=1
용도: NU_LAYOUT 테이블의 JavaScript 소스
제목: WEB-마이페이지
생성일: 2019-11-26 20:36:07
수정일: 2026-01-05 10:21:16
*/

$(document).ready(function(){
  
  	// http으로 들어왔을때 https로 변호나
  	var urlLocation = $(location);
    if(urlLocation[0].protocol != "https:"){
      if(location.hostname != "localhost"){
    	location.href = "https://maeuli.com" + location.pathname + location.search;
      }
    } else if (urlLocation[0].protocol == "https:"){
    	if(location.hostname == "maeuli.net" || location.hostname == "woodonge.com"){
        	location.href = "https://maeuli.com" + location.pathname + location.search;
        }
    }
  
	// 로고 클릭시 메인화면으로 이동
  	$(".top-logo").click(function(){
    	location.href = "https://" + location.host + ":subdirectory:/home/content.do?menu=1";
    });
    
  	// 사이트맵(=햄버거 버튼) 컨트롤
	$('button.main-menu-button').click(function(){
		$('.sitemap-wrap').toggleClass('on');
	});
	$('button.sitemap-close').click(function(){
		$('.sitemap-wrap').toggleClass('on');
	});
  	$('ul.sitemap-menu-list > li > a').click(function(){	
		$('.sitemap-wrap').toggleClass('on');
	});
  	$('.sitemap-bottom > ul > li > a').click(function(){	
		$('.sitemap-wrap').toggleClass('on');
	});
  
  	// 로그인 페이지로 이동(웹)
	$(".login").click(function(){
		location.href="https://" + location.host + "/townE/home/content.do?menu=230";
	});
  	
  	// 로그인 페이지로 이동 (모바일)
	$(".main-menu-login.in").click(function(){
		location.href="https://" + location.host + "/townE/home/content.do?menu=230";
	});
  
    // 마이페이지로 이동
   	$(".mypage, .sitemap-mypage").click(function(){
		location.href="https://" + location.host + ":subdirectory:/home/programs/mypage/index?menu=234";
	});

  	// 로그아웃
	$(".logout, .main-menu-logout.out").click(function(){
      if(confirm('로그아웃 하시겠습니까?')){
		$.post( "https://" + location.host +':subdirectory:/home/programs/comap/login/logout', function(data) {
			if(data == true){
               if(kind == "android") {
                  window.android.logout();
                } else if(kind == "ios"){
                  window.webkit.messageHandlers.ios.postMessage("logout||");
                }
				alert("로그아웃되었습니다.");
				//location.reload();
              location.href =":subdirectory:"
			}
		});
      }else{
    	  return false;
      }
	});
  $(".site-back-button").click(function(){
  		history.back();
  	});
  
  	// footer 컨소시엄 슬라이드
	$(document).ready(function(){ 
		var main = $('.bxslider').bxSlider({ 
		mode: 'horizontal', 
		auto: true,	//자동으로 슬라이드 
		controls : true,	//좌우 화살표	
		autoControls: true,	//stop,play 
		pager:false,	//페이징 
		pause: 3000, 
		autoDelay: 0,	
		slideWidth: 'auto', //이미지 박스 크기설정
		speed: 500,
		stopAutoOnclick:true,
		infiniteLoop : true,
		moveSlides : 0,
		minSlides: 4,
	    maxSlides: 4,
		useCSS: false,
        touchEnabled : (navigator.maxTouchPoints > 0)
	});
	$(".bx-stop").click(function(){	// 중지버튼 눌렀을때 
		main.stopAuto();
		$(".bx-stop").hide();
		$(".bx-start").show();
		return false;
	}); 
	$(".bx-start").click(function(){	//시작버튼 눌렀을때 
		main.startAuto();
		$(".bx-start").hide();
		$(".bx-stop").show();
		return false;
	});
	$(".bx-start").hide();	//onload시 시작버튼 숨김. 
	});

});
var kind = "";
var userAgent = navigator.userAgent.toLowerCase();
if (userAgent.search("android") > -1) {
  kind = "android";
} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
  kind = "ios";
}
function goHomeClick(){
 // if(kind == "android") {
   // android.closeWebView();
  //}
    location.href="/townE/home/content.do?menu=1";
}
var closeDrawer = function(){
  $('.sitemap-wrap').removeClass('on');
}
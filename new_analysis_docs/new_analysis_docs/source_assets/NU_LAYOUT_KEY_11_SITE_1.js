/*
DB PK: KEY=11, SITEKEY=1
용도: NU_LAYOUT 테이블의 JavaScript 소스
제목: WEB-메인
생성일: 2018-04-10 10:03:14
수정일: 2026-01-05 10:21:00
*/

var kind = "";
$(document).ready(function(){
    var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1) {
		kind = "android";
	} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
		kind = "ios";
	}
  	
  	var html = "";
  	if (kind == "ios") {
	  html += '<li>';
	  html +=	'<a class="apple-login" href="javascript:void(0);"><img src="/townE/resources/images/townE/common/04_login_apple.png"></a>';
	  html += '</li>';
  
    }
  	$('.login-type-mobile ul').append(html);
  
  
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
  
	// 로고 클릭시 메인화면으로 이동
  	$(".top-logo").click(function(){
    	location.href = "https://" + location.host + ":subdirectory:/home/content.do?menu=1";
    });
  
 
  
  	// 로그인 페이지로 이동(웹)
	$(".login").click(function(){
	//	location.href="https://" + location.host + "/townE/home/content.do?menu=230";
      $('#loginModal').css("display","block");
	});
  	
  	// 로그인 페이지로 이동 (모바일)
	$(".main-menu-login.in").click(function(){
	//	location.href="https://" + location.host + "/townE/home/content.do?menu=230";
      $('#loginModal').css("display","block");
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
				location.reload();
			}
		});
      }else{
    	  return false;
      }
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
  /**로그인**/
  
  	// Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyAOWxt7I3JMyriiU3zyR8pIr6y4N_FWgrw",
        authDomain: "gurcc-towne.firebaseapp.com",
        databaseURL: "https://gurcc-towne.firebaseio.com",
        projectId: "gurcc-towne",
        storageBucket: "gurcc-towne.appspot.com",
        messagingSenderId: "423874536750",
        appId: "1:423874536750:web:42dbb0a1345841fffc46bf"
    };
  	
  	firebase.initializeApp(firebaseConfig);
  
	// 네이버로그인
	$('#naverLogin, #naverLogin2').click(function(e) {
     

      if(kind == "android") {
         android.loginNaver();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginNaver||");
       } else {
         e.preventDefault();
         // 로그인 창을 띄웁니다.
         window.open($(this).data('url'), 'naverLogin', 'width=372,height=466,toolbar=no,menubar=no,status=no,scrollbars=no,resizable=no');
       }
	});
	
	// 카카오 로그인
	$('#kakaoLogin, #kakaoLogin2').click(function(e) {
     
     
       if(kind == "android") {
         android.loginKakao();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginKakao||");
       } else {
       	e.preventDefault();
        // 로그인 창을 띄웁니다.
        Kakao.Auth.login({
          success: function(authObj) {
            $.post('../../townE/home/programs/comap/login/kakao', {accessToken:authObj.access_token}, function(data) {
              if(data.msg == "기존회원") {
            	  location.reload();
//                location.href = "../../../townE";
              } else if(data.msg == "신규회원") {
                // 추후에 마이페이지 수정쪽으로 이동되게 변경                      	
                location.href = "/townE/home/programs/comap/login/joinPage?name="+data.name+"&picture="+data.picture+"&snsType="+data.snsType+"&snsId="+data.snsId;
              }
            });
          },
          fail: function(err) {
            var data = {success:"false", msg:'로그인에 실패 하였습니다.'};
          }
        });
       }
	});
  	// 핸드폰 로그인
	$("#phoneLogin, #phoneLogin2").click(function(){
      
      if(kind == "android") {
         android.loginPhone();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginPhone||");
       } else {
       	var winHeight = document.body.clientHeight;
        var winWidth = document.body.clientWidth;
        var winX = window.screenLeft;
        var winY = window.screenTop;
        var popX = winX + (winWidth - 500)/2;
        var popY = winY + (winHeight - 340)/2;
        firebase.auth().signOut().then(function() {
          window.open("../../townE/home/programs/comap/login/phonePopup","popup","width="+500+"px,height="+340+"px,top="+popY+",left="+popX);
        }).catch(function(error) {
          alert(error);
        });
       }
	});
  
  	$(document).on("click", ".apple-login", function(){
    	 window.webkit.messageHandlers.ios.postMessage("loginApple||");
    });
  
    $(".site-back-button").click(function(){
  		history.back();
  	});
	
});

var closeDrawer = function(){
  $('.sitemap-wrap').removeClass('on');
}
function close_pop(flag) {
     $('#loginModal').hide();
};
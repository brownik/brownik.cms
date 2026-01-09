/*
DB PK: MENUKEY=230
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-10-18 07:06:49
수정일: 2025-12-29 10:19:54
*/

var kind = "";

$(document).ready(function(){

  (function() {
    var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1) {
		kind = "android";
	} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
		kind = "ios";
	}
    /*if (!(userAgent.indexOf('isapp') > -1)) {
      kind = 'web';
    } else if (userAgent.indexOf("android") > -1) { 
      kind = "android";
    } else if (userAgent.indexOf("iphone") > -1 || userAgent.indexOf("ipod") > -1 || userAgent.indexOf("ipad") > -1) {
      kind = "ios";
    }*/
  })();

 	var html = "";
  	if (kind == "ios") {
	  html += '<li>';
	  html +=	'<a class="apple-login" href="javascript:void(0);"><img src="/townE/resources/images/townE/common/04_login_apple.png"></a>';
	  html += '</li>';
  
    }
  	$('.login-type-mobile ul').append(html);
  
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
                            
                location.href = "../../../townE";
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
	
	// 구글 로그인
	$('#googleLogin').click(function(e) {
      if(kind == "android") {
         android.loginGoogle();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginGoogle||");
       } else {
          e.preventDefault();

          var provider = new firebase.auth.GoogleAuthProvider();
          provider.addScope('https://www.googleapis.com/auth/plus.login');
          firebase.auth().signInWithPopup(provider).then(function(result) {
              var	email = result.additionalUserInfo.profile.email;
              var uid = result.user.uid;
              var name = result.additionalUserInfo.profile.name;
              var picture = result.additionalUserInfo.profile.picture;
              console.log('google uid : ' + uid);
              $.post('../../townE/home/programs/comap/login/google', {userId:uid, name:name,  email:email,  picture : picture}, function(data) {

                  if(data.msg == "기존회원") {
                          location.href = "../../../townE";
                  } else if(data.msg == "신규회원") {
                    // 추후에 마이페이지 수정쪽으로 이동되게 변경
                    location.href = "/townE/home/programs/comap/login/joinPage?name="+data.name+"&picture="+data.picture+"&snsType="+data.snsType+"&snsId="+data.snsId;
                  }
              });
          }).catch(function(error) {
            console.log('error : ' + error);
              var data = {success:"false", msg:'로그인에 실패 하였습니다.'};
          });
       }
	});
	
	// 페이스북 로그인
	$('#facebookLogin').click(function(e) {
      if(kind == "android") {
         android.loginFacebook();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginFacebook||");
       } else {
          e.preventDefault();
          var provider = new firebase.auth.FacebookAuthProvider();
          provider.addScope('email');
          firebase.auth().signInWithPopup(provider).then(function(result) {
              var name = result.additionalUserInfo.profile.name;
              var	email = result.additionalUserInfo.profile.email;
              var uid = result.user.uid;
              console.log('facebook uid : ' + uid);
              $.post('../../townE/home/programs/comap/login/facebook', {userId:uid, email:email, name:name}, function(data) {
                  if(data.msg == "기존회원") {
                          location.href = "../../../townE";
                  } else if(data.msg == "신규회원") {
                    // 추후에 마이페이지 수정쪽으로 이동되게 변경
                    location.href = "/townE/home/programs/comap/login/joinPage?name="+data.name+"&picture="+data.picture+"&snsType="+data.snsType+"&snsId="+data.snsId;
                  }
              });
          }).catch(function(error) {
              var data = {success:"false", msg:'로그인에 실패 하였습니다.'};
          });
        }
	});
			
	// 트위터 로그인
	$('#twitterLogin').click(function(e) {
      if(kind == "android") {
         android.loginTwitter();
       } else if(kind == "ios"){
         window.webkit.messageHandlers.ios.postMessage("loginTwitter||");
       } else {
          e.preventDefault();
          var provider = new firebase.auth.TwitterAuthProvider();
          firebase.auth().signInWithPopup(provider).then(function(result) {
              var name = result.additionalUserInfo.profile.name;
              var	email = result.additionalUserInfo.profile.email;
              var uid = result.user.uid;
              console.log('twiitter uid : ' + uid);
              $.post('../../townE/home/programs/comap/login/twitter', {userId:uid, email:email, name:name}, function(data) {
                  if(data.msg == "기존회원") {
                          location.href = "../../../townE";
                  } else if(data.msg == "신규회원") {
                    // 추후에 마이페이지 수정쪽으로 이동되게 변경
                    location.href = "/townE/home/programs/comap/login/joinPage?name="+data.name+"&picture="+data.picture+"&snsType="+data.snsType+"&snsId="+data.snsId;
                  }
              });
          }).catch(function(error) {
              var data = {success:"false", msg:'로그인에 실패 하였습니다.'};
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


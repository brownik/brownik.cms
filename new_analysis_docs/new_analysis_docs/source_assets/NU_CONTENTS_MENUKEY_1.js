/*
DB PK: MENUKEY=1
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2016-09-26 13:28:19
수정일: 2026-01-05 10:23:17
*/

 	


$(document).ready(function(){
	$(".insertMapping").on("click",function()	{
		android.openMapping(141,76);
	});
    
	// 마을활동 더보기 클릭시
	$(".more-townlab-btn").click(function(){
		location.href = ":subdirectory:/home/programs/townlab/listByDefault?menu=225";
	});
	
	// 마을활동 탭 클릭시
	$(".main-townlab-tab ul li").click(function(){
  		// 탭 스타일 변경
		$(".main-townlab-tab ul li").removeClass("on");
		$(this).addClass("on");
		
		var labUid = $(this).attr("data-labUid");
		getLabInListByLabUid(labUid);
	});
		
  	// 모바일마을활동 탭 클릭시
	$(".main-townlab-mainList ul li").click(function(){
  		// 스크롤 이동
  		var pos = $(this).position().left;
		var currentscroll = $(".main-townlab-mainList ul").scrollLeft();
		var divwidth = $(".main-townlab-mainList ul").width();
		pos = (pos+currentscroll) - (divwidth/2) + 60;
		
		$(".main-townlab-mainList ul").animate({scrollLeft: pos});
  
		// 탭 스타일 변경
		$(".main-townlab-mainList ul li").removeClass("on");
		$(this).addClass("on");
		
		var labUid = $(this).attr("data-labUid");
		getMoblieLabInListByLabUid(labUid);
	});
  
 
	// 첫 로딩시에 마을활동 추가
	getLabInListByLabUid($(".main-townlab-tab ul li.on").attr("data-labUid"));
  	  
  	//마을활동 모바일
  	getMoblieLabInListByLabUid($(".main-townlab-tab ul li.on").attr("data-labUid"));
  
    var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1) {
		kind = "android";
	} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
		kind = "ios";
	}

  	if(kind == "android" || kind == "ios"){
    	if("${curretHomeMember.key}" == ""){
            location.href = ":subdirectory:/home/content.do?menu=230";
        }
    }
	
});

function getLabInListByLabUid(labUid) {
	$.post(":subdirectory:/home/programs/townlab/getLabInListByLabUid", {labUid : labUid}, function(data){
		$(".main-townlab-list-box").html(data);
	});
}

function getMoblieLabInListByLabUid(labUid) {
	$.post(":subdirectory:/home/programs/townlab/getMobileLabInListByLabUid", {labUid : labUid}, function(data){
		$(".main-townlab-box").html(data);
	});
}




$(document).ready(function(){
  
    	//팝업창 닫기
    $('.popup-wrap button').click(function(){
		   var index = $(".popup-wrap button").index(this);
		   $(".popup-wrap:eq(" + index + ")").css('display','none');
    });
   	//팝업창 닫기
    $('.popup-wrap button').click(function(){
		var index = $(".popup-wrap button").index(this);
		if($(this).attr("name")=="popupCloseBtn1") {
          if($("#24hour1:checked").length>0){
			setCookie("popup1","1",1);
          }
		}
		if($(this).attr("name")=="popupCloseBtn2") {
          if($("#24hour2:checked").length>0){
			setCookie("popup2","1",1);
          }
		}

		$(".popup-wrap:eq(" + index + ")").css('display','none');

    });

    if(getCookie("popup1")!="1" && !isMobile()){
		$(".popup-wrap.one").css('display','block');
	}
    if(getCookie("popup2")!="1" && !isMobile()){
		$(".popup-wrap.two").css('display','block');
	}  
      
});

/* 팝업1 */
$(window).ready(function() {
  if(!isMobile()){
	var inputChkbox = $(".popupWind").find("input[type=checkbox]");
	for(var i = 0 ; i < inputChkbox.length ; i++){
    	var itemKey = $(inputChkbox[i]).attr("data-itemKey");      
    	if(getCookie("notToday"+itemKey) != "Y"){
      		$(inputChkbox[i]).parents(".popupWind").css("display", "flex");
    	}   
  	}
  }
});


// 팝업2 START
    /*팝업창 쿠키만들기*/
    function setCookie(name, value, expiredays) {
        var today = new Date();
            today.setDate(today.getDate() + expiredays);
            document.cookie = name + '=' + escape(value) + '; path=/gtci; expires=' + today.toGMTString() + ';'
			document.cookie = name + '=' + escape(value) + '; path=/; expires=' + today.toGMTString() + ';'
    } 
    /*팝업창 쿠키 가져오기*/
    function getCookie(name) { 
        var cName = name + "="; 
        var x = 0; 
        while ( x <= document.cookie.length ) { 
            var y = (x+cName.length); 
            if ( document.cookie.substring( x, y ) == cName ) { 
                if ( (endOfCookie=document.cookie.indexOf( ";", y )) == -1 ) 
                    endOfCookie = document.cookie.length;
                return unescape( document.cookie.substring( y, endOfCookie ) ); 
            } 
            x = document.cookie.indexOf( " ", x ) + 1; 
            if ( x == 0 ) 
                break; 
        } 
        return ""; 
    } 
    /*팝업닫기*/
    function closePopup(tag){
        $(tag).parents(".popupWind").hide('fade');
    } 
    /*팝업오늘그만보기*/
    function closePopupNotToday(img){	          
        var itemKey = $(img).attr("data-itemKey");
            setCookie('notToday' + itemKey,'Y', 1);
        $(img).parents('.popupWind').hide('fade'); 
        var temp =  $(img).next().children('span');
        if(temp.hasClass('on')){
            temp.removeClass('on');
        }else{
            temp.addClass('on');
        }	
    } 

// 팝업2 END

function isMobile() {
  var kind = "";
    var userAgent = navigator.userAgent.toLowerCase();
	if (userAgent.search("android") > -1) {
		kind = "android";
	} else if ((userAgent.search("iphone") > -1) || (userAgent.search("ipod") > -1) || (userAgent.search("ipad") > -1)) {
		kind = "ios";
	}
  if(kind=="") return false;
  return true;
}
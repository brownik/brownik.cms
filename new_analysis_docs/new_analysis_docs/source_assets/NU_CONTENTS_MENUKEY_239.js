/*
DB PK: MENUKEY=239
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2024-09-03 10:35:24
수정일: 2025-12-29 10:19:21
*/

function showVideo(vname){
   $(".info-second-content").empty(); 
   $(".info-second-content").html('<video src=":subdirectory:/resources/video/'+vname+'#t=0.5" width="100%" height="100%" controls autoplay></video>');
   $(".info-second").css("display","flex");
}

function closeVideo(){
   $(".info-second-content").empty(); 
   $(".info-second-content").html('<video></video>');
   $(".info-second").css("display","none");
}
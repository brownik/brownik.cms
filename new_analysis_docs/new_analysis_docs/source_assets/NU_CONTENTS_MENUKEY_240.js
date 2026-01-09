/*
DB PK: MENUKEY=240
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2024-09-04 15:43:32
수정일: 2024-09-04 16:04:03
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
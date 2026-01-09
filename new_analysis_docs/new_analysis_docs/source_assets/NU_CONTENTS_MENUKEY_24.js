/*
DB PK: MENUKEY=24
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2016-09-26 14:05:58
수정일: 2017-04-03 11:51:06
*/

var oneLine;
var twoLine;
var threeLine;
var lineRevision = 45;

$(document).ready(function(){
  $("#aOneText").click(function(){
    $("#oneLine").attr("class", "on");
    oneLine = $("#oneLine").offset();
    $('html, body').animate({
      scrollTop: oneLine.top-lineRevision
    }, 300)
  });
  $("#aTwoText").click(function(){
    $("#twoLine").attr("class", "on");
    twoLine = $("#twoLine").offset();
    $('html, body').animate({
      scrollTop: twoLine.top-lineRevision
    }, 300)
  });
  $("#aThreeText").click(function(){
    $("#threeLine").attr("class", "on");
    threeLine = $("#threeLine").offset();
    $('html, body').animate({
      scrollTop: threeLine.top-lineRevision
    }, 300)
  });
  
  $(".location_depth2>li:first-child>a").css({"color":"#fff","font-size":"18px","text-shadow":"1px 1px 3px rgba(0,0,0,0.4)","background-color":"#666a79","padding":"6px 15px","border-radius":"5px","font-weight":"600"});

  
});

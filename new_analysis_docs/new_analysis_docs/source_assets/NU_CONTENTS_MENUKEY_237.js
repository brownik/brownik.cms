/*
DB PK: MENUKEY=237
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2023-12-15 17:56:13
수정일: 2026-01-05 16:40:07
*/

var scrollWin = null;

function getRandomColor(){
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ){
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

$(document).ready(function() {
  var LineRevision = 90;
  
  scrollWin = function (num) {
    if (num == 1) {
      var oneLine = $(".oneLine").offset();
      $('html, body').animate({scrollTop: oneLine.top-LineRevision}, 300);
    } else if (num == 2) {
      var twoLine = $(".twoLine").offset();
      $('html, body').animate({scrollTop: twoLine.top-LineRevision}, 300);
    } else if (num == 3) {
      var threeLine = $(".threeLine").offset();
      $('html, body').animate({scrollTop: threeLine.top-LineRevision}, 300);
    } else if (num == 4) {
      var fourLine = $(".fourLine").offset();
      $('html, body').animate({scrollTop: fourLine.top-LineRevision}, 300);
    } else if (num == 5) {
      var fiveLine = $(".fiveLine").offset();
      $('html, body').animate({scrollTop: fiveLine.top-LineRevision}, 300);
    } else if (num == 6) {
      var sixLine = $(".sixLine").offset();
      $('html, body').animate({scrollTop: sixLine.top-LineRevision}, 300);
    } else if (num == 7) {
      var sevenLine = $(".sevenLine").offset();
      $('html, body').animate({scrollTop: sevenLine.top-LineRevision}, 300);
    } else if (num == 8) {
      var eightLine = $(".eightLine").offset();
      $('html, body').animate({scrollTop: eightLine.top-LineRevision}, 300);
    } else if (num == 9) {
      var nineLine = $(".nineLine").offset();
      $('html, body').animate({scrollTop: nineLine.top-LineRevision}, 300);
    }
  }
  
    //db_tab_wrap a 태그에 on class 부여
	var url = document.location.href;
  	var menu = url.split("menu")[1];
  	
    $(".db_tab_wrap a").removeClass("on");
    $(".db_tab_wrap a").each(function(index,element){
    	if(element.getAttribute("href").split("menu")[1] == menu){
        	element.setAttribute("class","on");
        }
    });
 
  	window._townE_CHART = window._townE_CHART || {
  		instances: new Set(),
	};
  
	document.body.addEventListener("pointerup", (e) => {
			    window._townE_CHART.instances.forEach((instance) => {
			    	instance.handleOuterClick(e);
				});
			});
	
});



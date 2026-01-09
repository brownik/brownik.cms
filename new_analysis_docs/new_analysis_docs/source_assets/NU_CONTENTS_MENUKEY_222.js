/*
DB PK: MENUKEY=222
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-10-17 15:49:50
수정일: 2025-12-29 10:19:18
*/

$(document).ready(function(){
  	//메뉴화면 열고 닫기
	$('button.coma-main-menu-btn').click(function(){
		$('.commap-main-menu > ul').toggleClass('on');
	});
    $(".site-back-button").click(function(){
  		history.back();
  	});
  
  	//모바일 카테고리 선택 flow
  	$('.commap-category-btn.one-depth').click(function(){
      	$('.commap-map-footer-category.one-depth').toggleClass('open');
		$('.commap-map-footer-window-wrap.one-depth').toggleClass('on');
        $('.commap-map-footer-category.two-depth').removeClass('open');
      	$('.commap-map-footer-window-wrap.two-depth').removeClass('on');
	});
	$('.commap-category-btn.two-depth').click(function(){
      	$('.commap-map-footer-category.two-depth').toggleClass('open');
      	$('.commap-map-footer-window-wrap.one-depth').removeClass('on');
      	$('.commap-map-footer-category.one-depth').removeClass('open');
		$('.commap-map-footer-window-wrap.two-depth').toggleClass('on');
	});
  	$('.commap-map-footer-window-wrap > ul > li').click(function(){
      	$(this).addClass('on');
      	$(this).siblings('.commap-map-footer-window-wrap > ul > li').removeClass('on');
	});
});
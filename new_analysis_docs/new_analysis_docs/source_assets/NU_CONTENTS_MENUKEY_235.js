/*
DB PK: MENUKEY=235
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-12-18 14:05:36
수정일: 2025-12-29 10:19:50
*/

$(document).ready(function(){
	$('.using-text').click(function(){
		$('.use-tab1').toggle('');
		$('.use-tab2').toggle('');
	});
	$('.notice-text').click(function(){
		$('.use-tab1').toggle('');
		$('.use-tab2').toggle('');
	});
  $(".site-back-button").click(function(){
  		history.back();
  	});
});
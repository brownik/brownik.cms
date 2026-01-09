/*
DB PK: MENUKEY=129
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-07-10 18:39:50
수정일: 2018-08-14 12:26:36
*/

$(document).ready(function(){
	$('.searchBox1 > button').click(function(e) {
      $('.searchBox1 > button').hide();
      $('.searchBox2').show();		
	});
  
  	$('.searchBox2 > button#closeBtn').click(function(e) {
      $('.searchBox2').hide();
      $('.searchBox1 > button').show();		
	});

});

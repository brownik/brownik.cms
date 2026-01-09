/*
DB PK: MENUKEY=75
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2017-06-19 14:19:35
수정일: 2019-04-10 10:30:43
*/

$(function(){
	$(".icon li").click(function(){
      var categoryKey = null, themeType = null;
      if($.isNumeric($(this).data("categorykey"))){
       	categoryKey = $(this).data("categorykey"); 
      } else {
        themeType = $(this).data("categorykey");
      }
      
      	var params = {
          categoryKey : categoryKey,
          themeType : themeType,
        }
      
		$.post(":subdirectory:/home/programs/townmap/changeCategory", params, function(){
			location.href = ":subdirectory:/home/programs/townmap/list?menu=57";
		});
	});
});
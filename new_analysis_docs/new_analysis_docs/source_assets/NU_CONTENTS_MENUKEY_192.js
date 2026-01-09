/*
DB PK: MENUKEY=192
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-11-06 16:49:48
수정일: 2018-11-07 13:33:50
*/

$(document).ready(function(){
	$("#pageChange").change(function(){
		$(".sub_box").hide();
		$(".sub_box").eq($(this).children("option").index($(this).children("option:selected"))).show();
		console.log($(this));
	}).change();
});

$(document).ready(function(){
    $(".selectBox:first").change(function(){
        window.location.href=$(this).val();
    });
});
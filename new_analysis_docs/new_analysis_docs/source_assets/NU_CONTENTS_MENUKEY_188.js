/*
DB PK: MENUKEY=188
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-11-06 16:33:35
수정일: 2018-11-07 14:31:12
*/

$(document).ready(function(){
	$("#pageChange").change(function(){
		$(".sub_box").hide();
		$(".sub_box").eq($(this).children("option").index($(this).children("option:selected"))).show();
	}).change();
});

$(document).ready(function(){
    $(".selectBox:first").change(function(){
        window.location.href=$(this).val();
    });
});
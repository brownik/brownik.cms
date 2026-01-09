/*
DB PK: MENUKEY=185
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-11-06 16:31:49
수정일: 2018-11-07 14:05:10
*/

$(document).ready(function(){
	$("#pageChange").change(function(){
		var value = $(this).val();
		if(value == 1){
			$("#LayerDiv1").show();
			$("#LayerDiv2").hide();
		} else if (value == 2){
			$("#LayerDiv2").show();
			$("#LayerDiv1").hide();
		}
	});
});

$(document).ready(function(){
    $(".selectBox:first").change(function(){
        window.location.href=$(this).val();
    });
});
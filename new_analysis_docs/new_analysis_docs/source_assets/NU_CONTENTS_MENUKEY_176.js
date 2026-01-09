/*
DB PK: MENUKEY=176
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-11-06 15:45:02
수정일: 2018-11-06 17:40:58
*/

$(document).ready(function(){
	$("#pageChange").change(function(){
		var value = $(this).val();
		if(value == 1){
			$("#LayerDiv1").show();
			$("#LayerDiv2").hide();
			$("#LayerDiv3").hide();
			$("#vizContainer").hide();
		} else if (value == 2){
			$("#LayerDiv2").show();
			$("#LayerDiv1").hide();
			$("#LayerDiv3").hide();
			$("#vizContainer").hide();
		} else if (value == 3){
			$("#LayerDiv3").show();
			$("#LayerDiv1").hide();
			$("#LayerDiv2").hide();
			$("#vizContainer").show();
		}
	});
});



$(document).ready(function(){
    $(".selectBox:first").change(function(){
        window.location.href=$(this).val();
    });
});
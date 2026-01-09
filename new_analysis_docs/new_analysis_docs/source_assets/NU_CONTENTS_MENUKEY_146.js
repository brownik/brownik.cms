/*
DB PK: MENUKEY=146
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-10-08 13:55:09
수정일: 2019-04-11 16:25:20
*/

$(document).ready(function(){
	
	// 캔버스 사이즈를 구한뒤 이미지 사이즈를 지정한다.
	var canvasSize = $(".slide_board").css("width");
	var calcSize = canvasSize.split("px");
	$(".slider_image").css("width", canvasSize);

	// 슬라이드의 전체 개수를 구한다.
	var slideMax = $(".control_button").length;

	// 슬라이드 패널의 실제 이미지 크기를 구한다.
	// 이미지 사이즈 × 이미지의 갯수
	$(".slider_panel").css("width", calcSize[0] * slideMax);

	// 슬라이드 이미지 좌우 이동버튼
	function moveArrow(sum){
		var num = $(".active").index();
		var index = $(".active").index() + sum;
		if(index < 0){
			index = slideMax;
		}
		if(index >= slideMax){
			index = 0;
		}
		moveSlider(index);
	}

	// 슬라이드를 움직여주는 함수
	function moveSlider(index){
	
		// 슬라이드를 이동합니다.
		var willMoveLeft = -(index * calcSize[0]);
		$(".slider_panel").animate({ 
			left: willMoveLeft
		}, "slow");

		// control_button에 active클래스를 부여/제거합니다.
		$(".control_button[data-index=" + index + "]").addClass("active");
		$(".control_button[cata-index!=" + index + "]").removeClass("active");

	}

	// 컨트롤 버튼의 클릭 핸들러 지정 및 data-index 할당
	$(".control_button").each(function(index){
		$(this).attr("data-index", index);
	}).click(function(){
		var index = $(this).attr("data-index");
		moveSlider(index);
	});

	// 초기 슬라이드의 위치 지정
	var randomNumber = Math.floor(Math.random() * slideMax);
	moveSlider(randomNumber);
	var playAction = "";

	// 5초마다 한번씩 슬라이드를 자동으로 다음 페이지로 넘긴다.
	playAction = setInterval(function(){
		moveArrow(1);
	}, 5000);

});
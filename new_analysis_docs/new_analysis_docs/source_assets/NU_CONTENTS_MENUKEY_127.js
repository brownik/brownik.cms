/*
DB PK: MENUKEY=127
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-06-28 13:31:59
수정일: 2018-08-14 12:26:36
*/



	$(document).ready(function() {
				$('#fullpage').fullpage({
						anchors:['firstPage', 'secondPage', 'thirdPage']
				});

				//사업지도 view number
				$(".b-Map .map-list ul li").click(function(){
					$(".b-Map .viewNum .num").removeClass("on");
					var dataNum = $(this).attr("data-num");
					$("div[data-num=" + dataNum + "]").addClass("on");
				});
				$(".map-list ul li").click(function(){
					$(".b-Map .map-list ul li").removeClass("active");
					$(this).addClass("active");
				});
	});


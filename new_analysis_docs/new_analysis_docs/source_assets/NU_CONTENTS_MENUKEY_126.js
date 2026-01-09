/*
DB PK: MENUKEY=126
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-06-25 13:59:13
수정일: 2018-08-14 12:26:36
*/

$(documnet).ready(function(){

});

function moveMainSlider(idx){

	var sectionList = $(".mainSection");
	var selectSection = $(".mainSection.on");
	var currentIdx = sectionList.index(selectSection);
	
	var nextIdx = currentIdx + (idx);
	
	nextIdx = nextIdx < 0 ? sectionList.length - 1 : nextIdx;
	nextIdx = nextIdx >= sectionList.length ? 0 : nextIdx;
	sectionList.removeClass("on")
	sectionList.eq(nextIdx).addClass("on");
}

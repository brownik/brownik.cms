/*
DB PK: MENUKEY=106
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-03-05 13:06:29
수정일: 2018-03-15 10:24:54
*/

function clsCO(cls, clsName, idx){
	$("." + cls).removeClass(clsName);
	$("." + cls).eq(idx).addClass(clsName);
}
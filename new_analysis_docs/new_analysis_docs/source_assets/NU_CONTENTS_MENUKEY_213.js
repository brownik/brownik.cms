/*
DB PK: MENUKEY=213
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2019-03-08 14:39:28
수정일: 2019-04-10 10:30:43
*/


$(document).ready(function (){

   	/* 범례 메뉴탭 이벤트 */
  	$('.category-scary').on('click',function(){
      $('.category-scary').addClass('tabb');
      $('.category-badview').removeClass('tabb');
      $('.category-walkingdead').removeClass('tabb');
      $('.category-safezone').removeClass('tabb');
      $('.category-safelight').removeClass('tabb');
      $('.category-safefootprint').removeClass('tabb');
      $('.category-content.scary').css('display','block');
      $('.category-content.badview').css('display','none');
      $('.category-content.walkingdead').css('display','none');
      $('.category-content.safezone').css('display','none');
      $('.category-content.safelight').css('display','none');
      $('.category-content.safefootprint').css('display','none');
    });
  
  	$('.category-badview').on('click',function(){
      $('.category-scary').removeClass('tabb');
      $('.category-badview').addClass('tabb');
      $('.category-walkingdead').removeClass('tabb');
      $('.category-safezone').removeClass('tabb');
      $('.category-safelight').removeClass('tabb');
      $('.category-safefootprint').removeClass('tabb');
      $('.category-content.scary').css('display','none');
      $('.category-content.badview').css('display','block');
      $('.category-content.walkingdead').css('display','none');
      $('.category-content.safezone').css('display','none');
      $('.category-content.safelight').css('display','none');
      $('.category-content.safefootprint').css('display','none');
    });
  
  	$('.category-walkingdead').on('click',function(){
      $('.category-scary').removeClass('tabb');
      $('.category-badview').removeClass('tabb');
      $('.category-walkingdead').addClass('tabb');
      $('.category-safezone').removeClass('tabb');
      $('.category-safelight').removeClass('tabb');
      $('.category-safefootprint').removeClass('tabb');
      $('.category-content.scary').css('display','none');
      $('.category-content.badview').css('display','none');
      $('.category-content.walkingdead').css('display','block');
      $('.category-content.safezone').css('display','none');
      $('.category-content.safelight').css('display','none');
      $('.category-content.safefootprint').css('display','none');
    });
  
  	$('.category-safezone').on('click',function(){
      $('.category-scary').removeClass('tabb');
      $('.category-badview').removeClass('tabb');
      $('.category-walkingdead').removeClass('tabb');
      $('.category-safezone').addClass('tabb');
      $('.category-safelight').removeClass('tabb');
      $('.category-safefootprint').removeClass('tabb');
      $('.category-content.scary').css('display','none');
      $('.category-content.badview').css('display','none');
      $('.category-content.walkingdead').css('display','none');
      $('.category-content.safezone').css('display','block');
      $('.category-content.safelight').css('display','none');
      $('.category-content.safefootprint').css('display','none');
    });
  
  	$('.category-safelight').on('click',function(){
      $('.category-scary').removeClass('tabb');
      $('.category-badview').removeClass('tabb');
      $('.category-walkingdead').removeClass('tabb');
      $('.category-safezone').removeClass('tabb');
      $('.category-safelight').addClass('tabb');
      $('.category-safefootprint').removeClass('tabb');
      $('.category-content.scary').css('display','none');
      $('.category-content.badview').css('display','none');
      $('.category-content.walkingdead').css('display','none');
      $('.category-content.safezone').css('display','none');
      $('.category-content.safelight').css('display','block');
      $('.category-content.safefootprint').css('display','none');
    });
  
  	$('.category-safefootprint').on('click',function(){
      $('.category-scary').removeClass('tabb');
      $('.category-badview').removeClass('tabb');
      $('.category-walkingdead').removeClass('tabb');
      $('.category-safezone').removeClass('tabb');
      $('.category-safelight').removeClass('tabb');
      $('.category-safefootprint').addClass('tabb');
      $('.category-content.scary').css('display','none');
      $('.category-content.badview').css('display','none');
      $('.category-content.walkingdead').css('display','none');
      $('.category-content.safezone').css('display','none');
      $('.category-content.safelight').css('display','none');
      $('.category-content.safefootprint').css('display','block');
    });
  	/* 범례 메뉴탭 이벤트 */
  
  	/* 범례 버튼 클릭 이벤트 */
  	$('.index-wrap_category-button').on('click',function(){
      $('.index-wrap_category-button').addClass('on');
      $('.index-wrap_category-box').addClass('on');
    });
  
  	$('.index-wrap_category-button.on').on('click',function(){
      $('.index-wrap_category-button.on').removeClass('on');
      $('.index-wrap_category-box.on').removeClass('on');
    });
  	/* 범례 버튼 클릭 이벤트 */
  
});
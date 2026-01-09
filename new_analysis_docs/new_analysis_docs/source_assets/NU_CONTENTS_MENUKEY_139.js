/*
DB PK: MENUKEY=139
용도: NU_CONTENTS 테이블의 JavaScript 소스
생성일: 2018-09-06 08:45:18
수정일: 2018-09-06 10:15:52
*/

	$(document).ready(function(){
		$("li[name=categoryList]").click(function(){
			var ecno = $(this).attr("ecno");
			var searchType = $("#searchType option:selected").val();
			var searchText = $("#searchText").val();
			var search = "?ecno="+ecno
						+"&title="
						+"&searchContent="
						+"&pubStart="
						+"&pubEnd="
						+"&orderBy=reg_dt";
			location.href="./list"+search;
		});

		// 상세보기 조회수
		$("a[name=goView]").click(function(e){
			var search = "?id="+$(this).attr("no")
						+"&ecno="
						+"&page=1"
						+"&npage=0"
						+"&title="
						+"&searchContent="
						+"&pubStart="
						+"&pubEnd="
						+"&orderBy=reg_dt";
			location.href = "./view"+search;
			e.preventDefault();
		});
		
		// ebook보기 조회수 
		$("a[name=HitCountEbook]").click(function(e){
			var ebno = $(this).attr("ebno");
			$.post("./hitCount.json", {id:ebno}, function(data){
				if(data == true) {
					window.open('/ebook/'+ebno+'/pc/ebook.html','ebook-pc','width=1600,height=900,top='+(screen.height-1000)/2+',left='+(screen.width-1600)/2+'fullscreen');					
				}
			}, 'json');
			e.preventDefault();
		});
		
		$("#pubStart").change(function(e){			
			if($("#pubStart option").index($("#pubStart option:selected"))>0){
				var year = parseInt($(this).val());				
				$("#pubEnd>option").removeAttr("disabled");				
				$("#pubEnd>option").each(function(idx){
					if(idx>0 && year>parseInt($(this).attr("value")))
						$(this).attr("disabled","true");
					else
						$(this).removeAttr("disabled");
				});	
			}else
				$("#pubEnd>option").removeAttr("disabled");
			e.preventDefault();
		}).change();

		$("#pubEnd").change(function(e){
			if($("#pubEnd option").index($("#pubEnd option:selected"))>0){
				var year = parseInt($(this).val());
				$("#pubStart>option").removeAttr("disabled");
				
				$("#pubStart>option").each(function(idx){
					if(idx>0 && year<parseInt($(this).attr("value")))
						$(this).attr("disabled","true");
					else
						$(this).removeAttr("disabled");
				});
			}else
				$("#pubStart>option").removeAttr("disabled");
			e.preventDefault();
		}).change();
		
		$("#title, #searchContent").keypress(function (e) {
			if(e.which==13)
				onSubmit();
		});
	});

	$(function() {
		$("#startDt").datepicker({
			showOtherMonths : true,
			changeMonth: true,
			changeYear: true,
			dateFormat : 'yy-mm-dd',
			onClose: function( selectedDate ) {
				$( "#endDt" ).datepicker( "option", "minDate", selectedDate );
			}
		});
		$("#endDt").datepicker({
			showOtherMonths : true,
			dateFormat : 'yy-mm-dd',
			changeMonth: true,
			changeYear: true,
			minDate : new Date(),
			onClose: function( selectedDate ) {
				$( "#startDt" ).datepicker( "option", "maxDate", selectedDate );
			}
		});	
	});
	
	function onSubmit() {
		$("#search").submit();
	}

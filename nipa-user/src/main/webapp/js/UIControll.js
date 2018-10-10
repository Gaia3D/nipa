	// 화면 중앙 배치
	(function($){
	    $.fn.extend({
	        center: function () {
	            return this.each(function() {
	                var top = ($(window).height() - $(this).outerHeight()) / 2;
	                var left = ($(window).width() - $(this).outerWidth()) / 2;
                $(this).offset({top: (top > 0 ? top : 0), left: (left > 0 ? left : 0)});
	            });
	        }
	    }); 
	})(jQuery);

$(function() {
	// 레이어 창
	var distanceLayer = $('#distanceLayer');
	var areaLayer = $('#areaLayer');
	var settingLayer = $('#settingLayer');
	var mapnoteLayer = $('#mapnoteLayer');
	var mapnoteDetailLayer = $('#mapnoteDetailLayer');

	// 레이어 창 - 닫기 [X] 
	function layerClose(btnId) {
		// 어떤 레이어 창이 선택되었는지 확인
		var layerId = $(btnId);
		
		$(layerId).find('.layerHeader .layerClose').click(function() {
			$(btnId).hide();
		});
	}
	// 닫기 버튼
	function closeBtn(layer) {
		var layerId = $(layer);
		$(document).on('click', '#closeBtn', function() {
			$(layer).hide();
		});
	}
	// 레이어 창 마우스 드래그
	$('#settingLayer').draggable();
	
	// 페이지 이동 버튼
			
	function contentsResize()
	{
		var obj = $('#contentsWrap');
		var hgt = $(window).height() - (obj.outerHeight(true) - obj.height());
		
		obj.height(hgt);
		$('.contentsList').height(hgt - ($('.contentsList').outerHeight(true) - $('.contentsList').height()));
		$('.contents').height(hgt - ($('.contents').outerHeight(true) - $('.contents').height()));
		coordContentsResize();
		noteContentsResize();
	}
	function coordContentsResize()
	{
		$('.coordinateWrap').height($('.contents').height()-$('.coordinateWrap').offset().top);
	}
	function noteContentsResize()
	{
		$('.listNote').height($('.contents').height()-$('.listNote').offset().top);
	}

	window.onload = contentsResize();
	window.onresize = contentsResize();
	
	
/***** NAV WRAP: 메뉴 *****/	
	// 메뉴 on시 UI 확장됨
	// class="on"과 함께 #gnbWrap의 left 값 변경(40px<->110px)
	$('#menu').click(function() {
		var obj = $('#navWrap');
		obj.toggleClass('on');
		$('#gnbWrap').css("left", obj.width());	
	});
	
	// 상세 메뉴 클릭 시 기본 동작
	$("ul.nav li[data-nav]:not(:empty)").click(function() {
		var active = $(this).attr('data-nav');
		var display = $(this).toggleClass('on').hasClass('on');
				
		$("ul.nav li[data-nav]:not(:empty)").not($(this)).each(function() {
			$(this).removeClass('on');
			$('#' + $(this).attr('data-nav')).hide();
		});

		$('#'+ active).toggle(display);
		$('#contentsWrap').toggle(display);
	});
	
	// 상세 메뉴 닫기
	$('.contentsBtn > button').click(function() {
		$('#contentsWrap').hide();
	});

	
	
/***** NAV WRAP: 맵 컨트롤 *****/
	// 행정구역 검색
	$('div.district').hover(function() {
		$('div.districtWrap').css('display', 'block');
	}, function(){
		$('div.districtWrap').css('display', 'none');
	});

	$('div.districtWrap').hover(function() {
		$('div.districtWrap').css('display', 'block');
	}, function(){
		$('div.districtWrap').css('display', 'none');
	});
	
	
	
/***** NAV WRAP: 맵 컨트롤 *****/
	// 3D
	$('ul.mapCtrl .modeling').click(function() {
		$('ul.mapCtrl .modeling').toggleClass('on');
		$(this).trigger('afterClick');
	});
	
	// 거리 측정 버튼
	$('#mapCtrlDistance').click(function() {
		$(this).toggleClass('on'); // 버튼 색 변경
		distanceLayer.toggle('on') // 거리 측정 레이어창
		
		if($(this).hasClass('on') === true) {
			$(areaLayer).css({'margin-top': '100px'}); 
		} else {
			$(areaLayer).css({'margin-top': '0px'});
		}
		$(this).trigger('afterClick');
	});	
	// 거리 측정 옵션창 닫기
	$('#distanceLayer .layerHeader .layerClose').click(function() {
		distanceLayer.hide();
		if($(this).hasClass('on') === true) {
			$(areaLayer).css({'margin-top': '100px'}); 
		} else {
			$(areaLayer).css({'margin-top': '0px'});
		}
		$('#mapCtrlDistance').removeClass('on').trigger('afterClick');
	});
	
	// 면적 측정 버튼
	$('#mapCtrlArea').click(function() {
		$(this).toggleClass('on'); // 버튼 색 변경
		areaLayer.toggle('on') // 면적 측정 레이어창
		$(this).trigger('afterClick');
	});
	// 면적 측정 옵션창 닫기
	$('#areaLayer .layerHeader .layerClose').click(function() {
		areaLayer.hide();
		$('#mapCtrlArea').removeClass('on').trigger('afterClick');
	});

	// TODO 최초 클릭시에는 초기화 버튼이 disable 되어야 함.
	// TODO disable 상태에서는 조작이 되면 안됨.- function
	// 거리,면적 측정 시 초기화
	$('#distanceLayer button.focusA').click(function() {
		$('#distanceLayer div.measure > span').text("0");
	});
	$('#areaLayer button.focusA').click(function() {
		$('#areaLayer div.measure > span').text("0");
	});
	
	// 확대
	
	
	// 축소
	
	

/***** NAV WRAP: 검색 *****/
	// 검색 메뉴 클릭 시 추가 동작
	$('#searchMenu').on('click', function() { 
		console.log("검색 메뉴 클릭");
	});
	
	// 검색 테이블 클릭 시 기본 동작 클릭
	$('#distrirct p').click(function() {
		$('#distrirct').toggleClass('on');
	});
	$('#placeName p').click(function() {
		$('#placeName').toggleClass('on');
	});
	$('#aLotNumber p').click(function() {
		$('#aLotNumber').toggleClass('on');
		$('#aLotNumber div.pagerB').toggle('on');
	});
	$('#newAddress p').click(function() {
		$('#newAddress').toggleClass('on');
	});
	$('#nationPointNumber p').click(function() {
		$('#nationPointNumber').toggleClass('on');
	});
	
	
	
/***** NAV WRAP: 레이어 *****/
	// 레이어 메뉴 클릭 시 추가 동작
	$('#layerMenu').on('click', function() { 
		console.log("레이어 메뉴 클릭");
	});
	
	// 레이어 그룹 클릭 시
	$('ul.listLayer li > p').click(function() {
		var parentObj = $(this).parent()
		var index = parentObj.index();
		$('ul.listLayer > li:eq('+ index +')').toggleClass('on');
	});
	
	// TODO 리펙토링 - 레이어 목록이 늘어날 경우
	// 레이어 on / off
	$('ul.listLayer li.imageLayer ul li').click(function() {
		$(this).toggleClass('on');
		var index = $(this).index();
		console.log(index);
		if(!$(this).hasClass('on')) settingLayer.hide();
	});
	$('ul.listLayer li.mapLayer ul li').click(function() {
		$(this).toggleClass('on');
		var index = $(this).index();
		console.log(index);
		if(!$(this).hasClass('on')) settingLayer.hide();
	});
	
	// 레이어 이동
	// TODO 레이어 변경사항이 저장되어야 하는지
	$('ul.listLayer li ul').sortable();
    $('ul.listLayer li ul').disableSelection();
    
	// 전체 레이어의 인덱스
    var layerName;
	$('ul.listLayer li').find('li').each(function(index) {
		$(this).find('div').click(function() {
			 var liNum = index;
			layerName = $('ul.listLayer > li > ul li:eq('+liNum+') > span').text();
			$('#settingLayer h3').text("설정("+layerName+")");
			
			// 색상 변경이 필요 없는 경우 설정창에서 색상 변경 옵션이 보이지 않음
			if($(this).children().length == 1) {
				$('#settingLayer .picker').hide();
			} else {
				$('#settingLayer .picker').show();
			}
		});
	});

	// 레이어 on/off
	var settingsLayerParent;
	$('ul.listLayer li ul li > div').click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		settingsLayerParent = $(this).parent();
		var index = settingsLayerParent.index();
		
		// 옵션 창 초기 값 세팅
		var opacity = $(this).find('span.opacity').text();
		var color = $(this).find('span.color').css("background-color");
		
		$('#range-slider').val(parseInt(opacity));
		$('#range-value').val(parseInt(opacity) + "%");
		$('input[type="color"]').val(rgbaToHex(color));
		
		var display = settingsLayerParent.hasClass('on');
		settingLayer.toggle(display);
		$('#settingLayer').center(); // 옵션창을 화면 중앙에 배치
	});
	layerClose(settingLayer);
	closeBtn(settingLayer);
	
	// 레이어 옵션
	var range = $('#range-slider');
	var value = $('#range-value');
	var color = $('input[type="color"]');
	
	// 설정화면 투명도 값 변경 시 동작
	value.change(function(){
		var value = $(this).val();
		if(value < 0 ) value = 0;
		if(value > 100) value = 100;
		if(value.lastIndexOf("%") == 2) {
			range.val(parseInt(value));
		} else {
			$(this).val(parseInt(value) + "%");
			range.val(parseInt(value));
		}
	});
	// 설정화면 투명도 슬라이더 변경 시 동작
	range.change(function(){
		value.val($(this).val() + "%");
	});
	color.change(function() {
		selectedColor = $(this).val();
		$(this).css('fill',selectedColor);
	});
	// 적용 버튼 클릭 시
	$('#settingLayer button.focusA').click(function() {
		// 투명도 변경
		settingsLayerParent.find($('span.opacity')).text($('#range-slider').val()+'%');
		// 색상 변경
		settingsLayerParent.find($('span.color')).css("background-color", hex2rgb($('input[type="color"]').val()));
		// 선 스타일 변경
	});
	
	
/***** NAV WRAP: 분석 *****/	
	// 분석 메뉴 클릭 시 추가 동작
	$('#analysisMenu').on('click', function() { 
		console.log("분석 메뉴 클릭");
	});
	
	// 분석 그룹 클릭 시	
	$('#analysisContent ul.listDrop li > p').click(function() {
		var parentObj = $(this).parent();
		var index = parentObj.index();
		$('#analysisContent ul.listDrop > li:eq('+ index +')').toggleClass('on');
	});
		
	
/***** NAV WRAP: 좌표 *****/
	// 좌표 메뉴 클릭 시 추가 동작
	$('#coordinateMenu').on('click', function() { 
		console.log("좌표 메뉴 클릭");
		coordContentsResize();
	});
	
	// 화면중심 좌표독취
	$('#getScreen').click(function() {
		if($('#getPoint').hasClass('on') === false && $('#getSquare').hasClass('on') === false) {
			$(this).toggleClass('on');
			$(this).trigger('afterClick');
		} else {
			$(this).removeClass('on');
		}
	});
	
	// 포인트 좌표독취
	$('#getPoint').click(function() {
		if($('#getScreen').hasClass('on') === false && $('#getSquare').hasClass('on') === false) {
			$(this).toggleClass('on');
			$(this).trigger('afterClick');
		} else {
			$(this).removeClass('on');
		}
	});
	
	// 지정영역 중심 좌표독취
	$('#getSquare').click(function() {
		if($('#getScreen').hasClass('on') === false && $('#getPoint').hasClass('on') === false) {
			$(this).toggleClass('on');
			$(this).trigger('afterClick');
		} else {
			$(this).removeClass('on');
		}
	});
	
	// 지점 등록
	$('#addMapnote').click(function() {
		console.log("좌표 독취에서 지점등록 클릭");
		$('#noteTitle').val('');
		$('#description').val('');
		mapnoteLayer.css('display', 'block');
		
		if(mapnoteLayer.css('display') == 'block') {
			distanceLayer.hide();
			areaLayer.hide();
			$('#mapCtrlDistance').removeClass('on');
			$('#mapCtrlArea').removeClass('on');
		}
		layerClose(mapnoteLayer);
	});
	
/***** NAV WRAP: 맵노트 *****/	
	// 맵노트 메뉴 클릭 시 추가 동작
	$('#mapnoteMenu').on('click', function() {
		console.log("맵노트 메뉴 클릭");
		noteContentsResize();
	});
	
	// 지점등록
	//$(document).on('click', '#inputMapnote.focusA', function(e) {
	$('#inputMapnote.focusA').click(function() {
		console.log("지점등록 클릭");
		$('#mapnoteLayer h2').text("지점등록");
		$('#mapnoteBtn').text("등록");
		$('#noteTitle').val('');
		$('#noteLocation').val('');
		$('#description').val('');
		mapnoteLayer.css('display', 'block');
		
		if(mapnoteLayer.css('display') == 'block') {
			distanceLayer.hide();
			areaLayer.hide();
			$('#mapCtrlDistance').removeClass('on');
			$('#mapCtrlArea').removeClass('on');
		}
		layerClose(mapnoteLayer);
	});
	
	// 맵노트 상세
	var noteTitle;
	var mapnoteDetailLayerParent;
	$(document).on('afterClick', 'ul.listNote li > div', function(e) {	
		mapnoteDetailLayerParent = $(this).parent();
		var index = mapnoteDetailLayerParent.index();
		
		/* 설정 창의 Title
		noteTitle = $('ul.listNote > li:eq('+index+') > span.title').text();
		$('#mapnoteDetailLayer h2').text("상세보기("+noteTitle+")"); */
		
		mapnoteDetailLayer.toggle();
		mapnoteDetailLayer.center(); // 옵션창을 화면 중앙에 배치
		layerClose(mapnoteDetailLayer);
		closeBtn(mapnoteDetailLayer);
	});
	
	// 맵노트 수정
	$(document).on('click', '#updateBtn', function() {
		console.log("지점수정 클릭");
		$('#mapnoteLayer h2').text("지점수정");
		$('#mapnoteBtn').text("수정");
		mapnoteLayer.css('display', 'block');
		
		if(mapnoteLayer.css('display') == 'block') {
			distanceLayer.hide();
			areaLayer.hide();
			$('#mapCtrlDistance').removeClass('on');
			$('#mapCtrlArea').removeClass('on');
		}
		layerClose(mapnoteLayer);
	});
});

function rgbaToHex(color) {
    color = ""+ color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }

    if (color.charAt(0) == "#") {
        return color;
    }

    var nums = /(.*?)rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)/i.exec(color) ||
    			/(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color)
    
    var r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
}

// opacity range : 0~1
function hex2rgb(hex, opacity) {
    var h=hex.replace('#', '');
    h =  h.match(new RegExp('(.{'+h.length/3+'})', 'g'));

    for(var i=0; i<h.length; i++)
        h[i] = parseInt(h[i].length==1? h[i]+h[i]:h[i], 16);

    if (typeof opacity != 'undefined')  h.push(opacity);
    else h.push(1);

    return 'rgba('+h.join(',')+')';
}
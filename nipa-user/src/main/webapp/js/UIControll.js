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

//컨텐츠 리사이즈	
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
	var height = $('.contents').height() - ($('.contentsIn').outerHeight(true) - $('.contentsIn').height());
	var offsetTop = $('.coordinateWrap').offset().top - $('.coordinateBtns').offset().top;
	$('.coordinateWrap').height(height - offsetTop);
}

function noteContentsResize()
{
	var height = $('.contents').height() - ($('.contentsIn').outerHeight(true) - $('.contentsIn').height());
	var offsetTop = $('.listNote').offset().top - $('#inputMapnote').offset().top;
	$('.listNote').height(height - offsetTop);
}

window.onload = contentsResize;
window.onresize = contentsResize;

// 레이어 - 색상 변경
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

// 측정 - 단위 선택
function updateDistance(value)
{
    var unitFactor = parseFloat($('#distanceFactor option:selected').val());
    var unitName = $('#distanceFactor option:selected').text();
    $('#distanceLayer div.measure > span').text(Math.round(value / unitFactor * 100) / 100 + " " + unitName.substring(0, unitName.indexOf('(')));
}

var settingsLayerParent;

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

/*
//dropzone
(function($){
	var newDropzone = document.createElement('div');
	newDropzone.id = 'my-dropzone';
	newDropzone.className = 'dropzone yScroll';
	
	function createDropzone() {
		$('#uploadForm').append(newDropzone);
//		$('#my-dropzone').empty();
	}
	
	function removeDropzone() {
		newDropzone.remove();
	}
	
	// 지점등록
	$('#inputMapnote.focusA').click(function() {
		console.log("지점등록 클릭");
		
		$('#mapnoteLayer h2').text("지점등록");
		$('#mapnoteBtn').text("등록");
		$('#noteTitle').val('');
		$('#noteLocation').val('');
		$('#description').val('');
		mapnoteLayer.css('display', 'block');
		
		removeDropzone();
		createDropzone();
		
		if(mapnoteLayer.css('display') == 'block') {
			distanceLayer.hide();
			areaLayer.hide();
			$('#mapCtrlDistance').removeClass('on');
			$('#mapCtrlArea').removeClass('on');
		}
		layerClose(mapnoteLayer);
	});
	
	createDropzone();
	
})(jQuery);
*/

$(function() {

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
			$(areaLayer).css({'margin-top': '130px'}); 
		} else {
			$(areaLayer).css({'margin-top': '0px'});
		}
		$(this).trigger('afterClick');
	});
	
	// 거리 측정 옵션창 닫기
	$('#distanceLayer .layerHeader .layerClose').click(function() {
		distanceLayer.hide();
		if($(this).hasClass('on') === true) {
			$(areaLayer).css({'margin-top': '130px'}); 
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

	// 거리,면적 측정 시 초기화
	$('#distanceLayer button.focusA').click(function() {
		updateDistance(0);
	});
	
	$('#areaLayer button.focusA').click(function() {
		$('#areaLayer div.measure > span').text("0");
	});
	
	$('#distanceFactor').change(function (){
		updateDistance(lengthInMeters);
	});
	
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
	
/***** NAV WRAP: 시계열 *****/	
	// 위치 선택
	$('#getSatPoint').click(function() {
		$(this).toggleClass('on');
		$(this).trigger('afterClick');
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
	
	// 지점 버튼 클릭
	$('#getMapnotePoint').click(function() {
		e.preventDefault();
		e.stopPropagation();
		alert("!");
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
		mapnoteDetailLayer.hide();
	});
	
});


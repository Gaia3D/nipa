var mapnote;

var pageNo;
var totalCount;
var firstPage;
var lastPage;
var pageListCount;
var gotoPage;
var forwardPage;
var nextPage;

// 해당 페이지 바로가기
$('#gotoPageBtn').click(function() {
	pageNo = $('#gotoPage').val();
	ajaxMapnoteList(pageNo);
});
// 이전 페이지 목록 조회
$('button.forward').click(function() {
	if(firstPage <= forwardPage) {
		pageNo = forwardPage;
	}
	ajaxMapnoteList(pageNo);
});
// 다음 페이지 목록 조회
$('button.next').click(function() {
	if(lastPage >= nextPage) {
		pageNo = nextPage;
	}
	ajaxMapnoteList(pageNo);
});
// 처음 페이지 목록 조회
$('button.first').click(function() {
	pageNo = firstPage;
	ajaxMapnoteList(pageNo);
});
// 마지막 페이지 목록 조회
$('button.last').click(function() {
	pageNo = lastPage;
	ajaxMapnoteList(pageNo);
});

// 맵노트 목록
function ajaxMapnoteList(pageNo) {
	var url = "/mapnote/" + pageNo;
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		success: function(msg) {
			if(msg.result === "success") {
				var content = "";
				var contentObj;
				var mapnoteList = msg.mapnoteList;
				
				pageNo = msg.pagination.pageNo;
				totalCount = msg.pagination.totalCount;
				firstPage = msg.pagination.firstPage;
				lastPage = msg.pagination.lastPage;
				pageListCount = msg.pagination.pageListCount;
				gotoPage = $('#gotoPage').val(pageNo);
				forwardPage = pageNo - 1;
				nextPage = pageNo + 1;
				
				$('#mapnotePage').find('.countPage').text(pageNo);
				$('#mapnotePage').find('.countTotal').text(lastPage);
				$('#lastPage').text(lastPage);
				
				if(mapnoteList === null || mapnoteList.length === 0) {
					content 	= 	content
						+ 	"<p style=\"text-align: center; font-size: 14px;\">"
						+		"현재 등록된 지점이 없습니다."
						+	"</p>";
				} else {
					for(i=0; i <mapnoteList.length; i++) {
						var mapnote  = mapnoteList[i];
						removeAllBillboard();
						addBillboard(mapnote.longitude, mapnote.latitude, mapnote.note_title);
						
						 content 	= 	content
							+ 	"<li onclick=\"gotoFlyMark(" + mapnote.longitude + ", " + mapnote.latitude + ", " + 200 + ", \'" + mapnote.note_title + "\');\">"
							+		"<span class=\"title\">" + mapnote.note_title + "</span>"
							+		"<span>" + mapnote.longitude + ", " + mapnote.latitude + "</span>"
							+ 			"<div class=\"along\">"
							+				"<button type=\"button\" class=\"icoBtn detail\" title=\"상세보기\" onclick=\"detailMapnote("+ pageNo + ", " + mapnote.map_note_id +");\">" + "상세보기" + "</button>"
							+				"<button type=\"button\" class=\"icoBtn del\" title=\"삭제\" onclick=\"deleteMapnote("+ mapnote.map_note_id +");\">" + "삭제" + "</button>"
							+			"</div>"
							+	"</li>";
					}
				}
				contentObj = $(content);
				contentObj.find('button.detail').click(function (e) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
					$(this).trigger('afterClick');
				});
				contentObj.find('button.del').click(function (e) {
					e.preventDefault();
					e.stopPropagation();
					e.stopImmediatePropagation();
				});
				$('#mapnoteList').html("");
				$('#mapnoteList').append(contentObj);
				
			} else {
				alert(msg.result);
			}
		},
		error: function(request, status, error) {
			alert("ajax error!");
			console.log("code : " + request.status + "\n" + "message : " + request.resposeText + "\n" + error);
		}
	});
}

// 맵노트 validation - 지점 버튼 클릭으로 바뀔 것, 문자열 체크
function check() {
	var noteLocation = $('#noteLocation').val().replace(/ /g, '');
	var noteLongitude = noteLocation.substring(0, noteLocation.indexOf(","));
	var noteLatitude = noteLocation.substring(noteLocation.indexOf(",")+1, noteLocation.length);
	
	if($('#noteTitle').val() === "") {
		alert("지점명을 입력하여 주십시오.");
		$('#noteTitle').focus();
		return false;
	}
	if(noteLocation === "") {
		alert("지점 위치를 선택하여 주십시오.");
		$('#noteLocation').focus();
		return false;
	}
	if(noteLongitude < (-180) || noteLongitude > 180) {
		alert("경도의 값을 확인해 주십시오.");
		$('#noteLocation').focus();
		return false;
	}
	if(noteLatitude < (-90) || noteLatitude > 90) {
		alert("위도의 값을 확인해 주십시오.");
		return false;
	}
}

// 맵노트 상세
// TODO 화면 중앙 배치
function detailMapnote(pageNo, map_note_id) {
	var url = "/mapnote/" + pageNo + "/" + map_note_id;

	$.ajax({
		url: url,
		type: "GET",
		success: function(msg) {
			var content = 	"";
			content 	= 	content
						+ 	"<li style=\"text-align: left; font-size: 17px; padding: 10px;\">" + msg.mapnote.note_title + "</li><hr>"
						+	"<li style=\"text-align: right; font-size: 12px; margin-right: 10px;\">" + msg.mapnote.longitude + ", " + msg.mapnote.latitude + "</li>"
						+	"<li style=\"text-align: left; margin-left: 20px; margin-top: 10px;\">" + msg.mapnote.description + "</li>";
			$('#mapnoteDetail').empty();
			$('#mapnoteDetail').html(content);
			$('#updateBtn').attr("onclick", "updateForm(" + map_note_id + ")");

			var files = msg.file;
			$('#thumbnail').empty();
			if(files.length >= 1) {
				for(var i = 0, len = files.length; i < len; i++)
				{
					if(files.length === 1) $('#thumbnail').attr('style', 'display: block; text-align: center; margin: 10px;'); 
					
					var img = $('<img style="margin: 10px;">');
					img.attr('src', '../displayImg/' + files[i].file_info_id);

					var content = 	"";
					content 	= 	content
								+ 	"<figure itemprop=\"associatedMedia\" itemscope itemtype=\"http://schema.org/ImageObject\" style=\"display: inline-block; margin: 10px;\">"
								+		"<a href=\"../showImg/" + files[i].file_info_id + "\" itemprop=\"contentUrl\" data-size=\"" + files[i].file_width + "x" + files[i].file_height +"\">"
								+			"<img src=\"../displayImg/" + files[i].file_info_id + "\" itemprop=\"thumbnail\" alt=\"Image description\"/>";
								+		"</a>"
								+ 	"</figure>";
					$('#thumbnail').append($(content));
					initPhotoSwipeFromDOM('#thumbnail');
				}
			} else {
				$('#thumbnail').empty();
			}
			$('#mapnoteDetailLayer').center(); // 옵션창을 화면 중앙에 배치
		},
		error: function(request, status, error) {
			console.log("code : " + request.status + "\n message : " + request.message +  "\n error : " + error);
		}
	});
} 


// 맵노트 수정 화면
function updateForm (map_note_id) {
var url = "/updateForm/" + map_note_id;
     
	$.ajax({
			url: url,
			type: 'GET',
	        success: function(msg) {
				if(msg.result === "success") {
					$('#mapnoteLayer').find('#noteTitle').val(msg.mapnote.note_title);
					$('#mapnoteLayer').find('#noteLocation').val( msg.mapnote.longitude + ", " + msg.mapnote.latitude);
					$('#mapnoteLayer').find('#description').val(msg.mapnote.description);
					MAP_NOTE_ID = map_note_id;
					$('#uploadForm').attr('action', "/upload/" +  MAP_NOTE_ID);
				} else {
					alert(msg.result);
				}
			},
			error: function(request, status, error) {
				console.log("code : " +  request.status + " \n message : " +  request.message + "\n error : " + error);
			}
	});
}

// 맵노트 수정
var isUpdatetMapnote = true;
function submitUpdateMapnote (map_note_id) {
	
	var url = "/update/" + map_note_id;
	
	if(check() == false) {
		return false;
	}
	
	formData = new FormData();
    
	formData.set("note_title", $('#noteTitle').val());
    formData.set("note_location", $('#noteLocation').val().replace(/ /g, ''));
	formData.set("description", $('#description').val());
     
	if(isUpdatetMapnote){
		isUpdatetMapnote = false;
		$.ajax({
				url: url,
				data: formData,
				processData: false,
				contentType: false,
				type: 'POST',
		
		        success: function(msg) {
					if(msg.result === "success") {
						alert("수정되었습니다.");
						ajaxMapnoteList(1);
					} else {
						alert(msg.result);
					}
					isUpdatetMapnote = true;	
				},
				error: function(request, status, error) {
					console.log("code : " +  request.status + " \n message : " +  request.message + "\n error : " + error);
					isUpdatetMapnote = true;
				}
		});
	}
}

// 맵노트 삭제
function deleteMapnote(map_note_id) {
	var url = "/mapnote/" + map_note_id;

	if (confirm("정말 삭제하시겠습니까??") == true){    
		$.ajax({
			url: url,
			type: 'DELETE',
			success: function(msg) {
				ajaxMapnoteList(1);
			},
			error: function(request, status, error) {
				console.log("code : " + request.status + "\n message : " + request.message +  "\n error : " + error);
			}
		});
	} else {  
	    return false;
	}
}

// 좌표 독취 후 맵노트 등록
function addMapnote() {
	var DMS = $('#DMS').attr('placeholder');
	$('#noteLocation').val(DMS);
}

// 원본 이미지 보기
function showDetailImg(file_info_id) {
	url = "/showImg/" + file_info_id;
	
	$.ajax({
		url: url,
		type: 'GET',
		 success: function() {
			if(msg) {
				alert(msg);
				var index = $('#thumbnail').find('img').length;
				console.log("######" + index);
				$('#thumbnail').find('a').attr('href', '\"showImg/' + file_info_id + '\"');
			} else {
				alert(msg);
			}
		},
		error: function(request, status, error) {
			console.log("code : " + request.status + "\n message : " + request.message +  "\n error : " + error);
		}
	});
}

function MapnoteControll(viewer) 
{
	mapnote = new Mapnote(viewer);
}

function addBillboard(longitude, latitude, name) 
{
	mapnote.addBillboard(longitude, latitude, name);
}

function removeAllBillboard()
{
	mapnote.removeAll();
}

function gotoFlyMark(longitude, latitude, heigth, name) 
{
	mapnote.gotoFly(longitude, latitude, heigth);
	mapnote.addBillboard(longitude, latitude, name);
}

function Mapnote(viewer)
{
	this.addBillboard = function (longitude, latitude, name) {
		
	    var target = viewer.entities.add({
	        position : Cesium.Cartesian3.fromDegrees(longitude, latitude),
	        billboard :{
	        	name : name,
	        	disableDepthTestDistance : Number.POSITIVE_INFINITY,
	        	//translucencyByDistance : new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),
	            image : '../images/kdg_logo.png',
	            width : 32,
	            height : 32
	        }
	    });
	};
	
	this.gotoFly = function (longitude, latitude, heigth) {
		viewer.camera.flyTo({
		    destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, heigth)
		});
	};
	
	this.removeAll= function () {
		viewer.entities.removeAll();
		
	};
	
	this.removeById= function () {
		viewer.entities.removeById();
	};
}
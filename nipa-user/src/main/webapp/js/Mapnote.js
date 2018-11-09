var mapnote;
var status;

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

// 맵노트 입력 확인
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
				
				// TODO 위치가 틀렸습니다. 페이징 위에 가야됨
				if(mapnoteList === null || mapnoteList.length === 0) {
					content 	= 	content
						+ 	"<p style=\"text-align: center; font-size: 14px;\">"
						+		"현재 등록된 지점이 없습니다."
						+	"</p>";
				} else {
					removeAllBillboard();
					for(i = 0; i < mapnoteList.length; i++) {
						var mapnote  = mapnoteList[i];
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


// 파일 리스트 번호
var fileIndex = 0;
// 등록할 전체 파일 사이즈
var totalFileSize = 0;
// 파일 리스트
var fileList = new Array();
// 파일 사이즈 리스트
var fileSizeList = new Array();
// 등록 가능한 파일 사이즈 MB
var uploadSize = 50;
// 등록 가능한 총 파일 사이즈 MB
var maxUploadSize = 500;

$(function () {
	fileDropDown();
});

var dropZone = $('.fileDrop');
function fileDropDown() {
	dropZone.on("dragenter dragover", function(e) {
		e.preventDefault();
	});
	
	dropZone.on("drop", function(e) {
		e.preventDefault();
		
		var files = e.originalEvent.dataTransfer.files;
		
		if(files != null){
            if(files.length < 1){
                alert("파일을 추가해 주세요.");
                return;
            }
            selectFile(files)
            $('#filetext').remove();
        }else{
            alert("ERROR");
        }
	});
}

// 파일 추가
function selectFile(fileObject){
    var files = null;
    
    if(fileObject != null){
        // 파일 Drag 이용하여 등록시
        files = fileObject;
        
    }else{
        // 직접 파일 등록시
        files = $('#multipaartFileList_' + fileIndex)[0].files;
    }
    
    // 다중파일 등록
    if(files != null){
        for(var i = 0; i < files.length; i++){
            // 파일 이름
            var fileName = files[i].name;
            var fileNameArr = fileName.split("\.");
            // 확장자
            var ext = fileNameArr[fileNameArr.length - 1];
            // 파일 사이즈(단위 :MB)
            var fileSize = files[i].size / 1024 / 1024;
            
            if($.inArray(ext, ['jpg', 'jpeg', 'png', 'gif', 'JPG', 'JPEG', 'PNG', 'GIF']) < 0){
                // 확장자 체크
                alert("이미지 파일만 업로드 가능합니다.");
                break;
            }else if(fileSize > uploadSize){
                // 파일 사이즈 체크
                alert("파일 크기 초과\n업로드 가능 용량 : " + uploadSize + " MB");
                break;
            }else{
                // 전체 파일 사이즈
                totalFileSize += fileSize;
                // 파일 배열에 넣기
                fileList[fileIndex] = files[i];
                // 파일 사이즈 배열에 넣기
                fileSizeList[fileIndex] = fileSize;
                // 업로드 파일 목록 생성
                addFileList(fileIndex, fileName, fileSize);
                // 파일 번호 증가
                fileIndex++;
            }
        }
    }else{
        alert("ERROR");
    }
}

//업로드 파일 목록 생성
function addFileList(fIndex, fileName, fileSize){
	var content = 	"";
	content 	= 	content
				+	"<div id='tempFiles_" + fIndex + "' style='margin: 15px;'>"
				+		"<p class='tempFile'>" + fileName + "<a id='delA' href='#' onclick='deleteFile(" + fIndex + "); return false;'>X</a>"
				+	"</div>";
						
	dropZone.append($(content));
}

// 맵노트 등록
var isUploadMapnote = true;
function uploadMapnote() {
	var url = '/insert';
	
	if (check() === false) return false;

	// 용량을 500MB를 넘을 경우 업로드 불가
	if(totalFileSize > maxUploadSize){
		alert("총 용량 초과\n총 업로드 가능 용량 : " + maxUploadSize + " MB");
		return;
	}
	
    var formData = new FormData();
    formData.append("noteTitle", $('#noteTitle').val());
    formData.append("noteLocation", $('#noteLocation').val());
    formData.append("description", $('#description').val());
    
    // 등록할 파일 리스트
    var uploadFileList = Object.keys(fileList);
    for(var i = 0; i < uploadFileList.length; i++){
    	formData.append('file', fileList[uploadFileList[i]]);
    }
    
    if(isUploadMapnote){
    	isUploadMapnote = false;
	    $.ajax({
	        url: url,
	        data:formData,
	        type:'POST',
	        processData:false,
	        contentType:false,
	        dataType:'json',
	        cache:false,
	        success:function(msg) {
	            if(msg.result == "success") {
	                alert("맵노트를 등록했습니다.");
	                ajaxMapnoteList(1);
	            } else {
	                alert("맵노드 등록에 실패했습니다.");
	            }
	            isUploadMapnote = true;	
	        },
	        error: function(request, status, error) {
				console.log("code : " + request.status + "\n message : " + request.message +  "\n error : " + error);
				isUploadMapnote = true;	
			}
	    });
    }
}


// 업로드 파일 삭제
function deleteFile(fIndex){
    // 전체 파일 사이즈 수정
    totalFileSize -= fileSizeList[fIndex];
    // 파일 배열에서 삭제
    delete fileList[fIndex];
    // 파일 사이즈 배열 삭제
    delete fileSizeList[fIndex];
    // 업로드 파일 테이블 목록에서 삭제
    $("#tempFiles_" + fIndex).remove();
    
    if(dropZone.children().length === 0) {
    	dropZone.append("<div id=\"filetext\"><p>파일을 첨부하여주십시오</p><div>");
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
						+	"<li style=\"text-align: left; margin-left: 20px; margin-top: 20px; margin-bottom: 20px;\">" + msg.mapnote.description + "</li>";
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
			url: "/updateForm/" + map_note_id,
			type: 'GET',
	        success: function(msg) {
				if(msg.result === "success") {
					$('#mapnoteLayer').find('#noteTitle').val(msg.mapnote.note_title);
					$('#mapnoteLayer').find('#noteLocation').val( msg.mapnote.longitude + ", " + msg.mapnote.latitude);
					$('#mapnoteLayer').find('#description').val(msg.mapnote.description);

					if(msg.fileInfoList.length >= 0) {
						$('#filetext').remove();
					}
					
					for(var i = 0, len = msg.fileInfoList.length; i< len; i++) {
						addFileList(len, msg.fileInfoList[i].file_name, msg.fileInfoList[i].file_size);
					}
					
					$('#mapnoteBtn').attr("onclick", "updateMapnote(" + msg.mapnote.map_note_id + ")");
					
					var existingFileCount = msg.fileCount;
					for(var i = 0; i < existingFileCount; i++) {
						var fileInfo  = msg.fileInfoList[i];
					}
					
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
function updateMapnote(map_note_id) {
	
	var url = "/update/" + map_note_id;
	
	if(check() == false) return false;
	
	formData = new FormData();
	formData.append("noteTitle", $('#noteTitle').val());
    formData.append("noteLocation", $('#noteLocation').val());
    formData.append("description", $('#description').val());
	
	// 등록할 파일 리스트
    var uploadFileList = Object.keys(fileList);
    for(var i = 0; i < uploadFileList.length; i++){
    	formData.append('file', fileList[uploadFileList[i]]);
    }
	
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

	if (confirm("맵노트를 삭제하시겠습니까??") == true){    
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
	this.pins = [];
	this.viewer = viewer;
	this.addBillboard = function (longitude, latitude, name) {
		
	    var target = this.viewer.entities.add({
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
	    this.pins.push(target);
	};
	
	this.gotoFly = function (longitude, latitude, heigth) {
		this.viewer.camera.flyTo({
		    destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, heigth)
		});
	};
	
	this.removeAll = function ()
	{
		for(var i=0, len = this.pins.length; i <len; i++)
		{
			this.viewer.entities.remove(this.pins[i]);
		}
		this.pins= [];
	}
	
	this.removeById = function () {
		this.viewer.entities.removeById();
	};
	
	this.pickPosition = function () {

	};
	
}
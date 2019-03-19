// 로딩중 Spinner 처리
function startSpinner(loadingId) {
	var $spinnerDiv = $("#" + loadingId);
    var $spinner = $spinnerDiv.progressSpin({ activeColor: "white", fillColor:"green" });
    $spinner.start();
}

// 검색어 enter
$("#fullTextSearch").keyup(function(e) {
	if(e.keyCode == 13) {
		if(fullTextSearchCheck()) {
			fullTextSearch();
		}
	}
});

// 검색 버튼을 눌렀을때
$("#fullTextSearchButton").click(function() {
	if(fullTextSearchCheck()) {
		fullTextSearch();
	}
});

// 입력 체크
function fullTextSearchCheck() {
	if($("#fullTextSearch").val() === null || $("#fullTextSearch").val().trim() === "") {
		alert("검색어를 입력하여 주십시오.");
		$("#fullTextSearch").focus();
		return false;
	}
	if($("#fullTextSearch").val().trim().length === 1) {
		alert("검색어는 최소 1자 이상을 입력하여 주십시오.");
		$("#fullTextSearch").focus();
		return false;
	}
	return true;
}

// 검색하는 타입 개수만큼 되었을때 검색 버튼을 활성화 시켜 준다.
var SEARCH_COUNT = 1;
var searchTypeCount = 0;
var fullTextSearchFlag = true;
function fullTextSearch() {
	if(fullTextSearchFlag) {
		fullTextSearchFlag = false;
		var searchWord = $("#fullTextSearch").val();
		
		showSearchMenu();
		showSearchSubMenu();
		
		// jibunSearch(null, searchWord);
		newAddressSearch(null, searchWord);
	} else {
		alert("검색 중 입니다.");
		return;
	}
}

// 검색창 클릭시 메뉴 제어
function showSearchMenu() {
	$("#searchMenu").toggleClass("on");
	$('#searchContent').toggle(true);
	$('#contentsWrap').toggle(true);
}
// 검색창 클릭시 메뉴 서브 제어
function showSearchSubMenu() {
	// $("#jibun").addClass("on");
	$("#newAddress").addClass("on");

	// $("#jibunSearchList").height(200);
	$("#newAddressSearchList").height(200);
}

// 지번주소 검색
function jibunSearch(pageNo, searchWord) {
	var jibunContent = "";
	var jibunContent = jibunContent
		+ "<li style=\"text-align: center; padding-top: 70px; padding-left: 100px;\">"
		+	 "<span id=\"jibunSearchSpinner\" style=\"width: 120px; height: 54px;\"></span>"
		+ "</li>";

	$("#jibunSearchList").html(jibunContent);
	startSpinner("jibunSearchSpinner");

	var info = "fullTextSearch=" + searchWord;
	info += "&searchKey=jibun";
	if(pageNo !== null) {
		info = info + "&pageNo=" + pageNo;
	}
	$.ajax({
		url: "./searchmap/jibun",
		type: "GET",
		data: info,
		dataType: "json",
		success: function(msg){
			if(msg.result == "success") {
				drawListJibunSearch(msg.pagination, msg.totalCount, msg.addrJibunList, msg.searchWord, msg.searchKey);
			} else {
				alert(JS_MESSAGE[msg.result]);
			}
			searchTypeCount++;
			console.log("jibun  .....  searchTypeCount = " + searchTypeCount);
			if(searchTypeCount === SEARCH_COUNT) {
				searchTypeCount = 0;
				fullTextSearchFlag = true;
			}
		},
		error:function(request,status,error) {
			//console.log(" code : " + request.status + "\n" + ", message : " + request.responseText + "\n" + ", error : " + error);
			alert(" code : " + request.status + "\n" + ", message : " + request.responseText + "\n" + ", error : " + error);
			searchTypeCount++;
			console.log("jibun error .....  searchTypeCount = " + searchTypeCount);
			if(searchTypeCount === SEARCH_COUNT) {
				searchTypeCount = 0;
				fullTextSearchFlag = true;
			}
		}
	});
}

// 지번 검색 목록
function drawListJibunSearch(pagination, totalCount, addrJibunList, searchWord, searchKey) {
	var addrJibunList = addrJibunList;
	var content = "";
	if (addrJibunList != null && addrJibunList.length > 0) {
		for(i=0; i<addrJibunList.length; i++ ) {
			var addrJibun = null;
			addrJibun = addrJibunList[i];

			content += "<li><span>";
			if ((addrJibun.longitude === null || addrJibun.longitude === undefined) ||
				addrJibun.latitude === null || addrJibun.latitude === undefined) {
				content += "<button type='button' class='btnText' style='margin-right:10px;'>바로가기</button>"
			}
			else {
				content += "<button type='button' class='btnTextF' onclick=\"gotoFly(" + addrJibun.longitude + ", " + addrJibun.latitude + ", 300, 2)\" style='margin-right:10px;'>바로가기</button>"
			}
			content += addrJibun.jibun_addr + "</span></li>";
		}
	} else {
		content += 	"<li style=\"vertical-align:middle; text-align:center; height: 50px;\">검색 결과가 존재하지 않습니다.</li>";
		$("#jibunSearchList").height(50);
	}

	$("#jibunSearchCount").empty();
	$("#jibunSearchCount").html(totalCount);
	$("#jibunSearchList").empty();
	$("#jibunSearchList").html(content);
	drawPage("jibunSearch", pagination, "jibunSearchPaging", searchWord, searchKey);
}

// 새주소 검색
function newAddressSearch(pageNo, searchWord) {
	var newAddressContent = "";
	var newAddressContent = newAddressContent
		+ "<li style=\"text-align: center; padding-top: 70px; padding-left: 100px;\">"
		+	 "<span id=\"newAddressSearchSpinner\" style=\"width: 120px; height: 54px;\"></span>"
		+ "</li>";

	$("#newAddressSearchList").html(newAddressContent);
	startSpinner("newAddressSearchSpinner");

	var info = "fullTextSearch=" + searchWord;
	info += "&searchKey=newAddress";
	if(pageNo !== null) {
		info = info + "&pageNo=" + pageNo;
	}
	$.ajax({
		url: "./searchmap/newAddress",
		type: "GET",
		data: info,
		dataType: "json",
		success: function(msg){
			if(msg.result == "success") {
				drawListNewAddressSearch(msg.pagination, msg.totalCount, msg.newAddressList, msg.searchWord, msg.searchKey);
			} else {
				alert(JS_MESSAGE[msg.result]);
			}
			searchTypeCount++;
			console.log("new address  .....  searchTypeCount = " + searchTypeCount);
			if(searchTypeCount === SEARCH_COUNT) {
				searchTypeCount = 0;
				fullTextSearchFlag = true;
			}
		},
		error:function(request,status,error) {
			//console.log(" code : " + request.status + "\n" + ", message : " + request.responseText + "\n" + ", error : " + error);
			alert(" code : " + request.status + "\n" + ", message : " + request.responseText + "\n" + ", error : " + error);
			searchTypeCount++;
			console.log("new address error .....  searchTypeCount = " + searchTypeCount);
			if(searchTypeCount === SEARCH_COUNT) {
				searchTypeCount = 0;
				fullTextSearchFlag = true;
			}
		}
	});
}

// 새주소 검색 목록
function drawListNewAddressSearch(pagination, totalCount, newAddressList, searchWord, searchKey) {
	var newAddressList = newAddressList;
	var content = "";
	if (newAddressList != null && newAddressList.length > 0) {
		for(i=0; i<newAddressList.length; i++ ) {
			var newAddress = null;
			newAddress = newAddressList[i];

			content += "<li><span>";
			if ((newAddress.longitude === null || newAddress.longitude === undefined) ||
				newAddress.latitude === null || newAddress.latitude === undefined) {
				content += "<button type='button' class='btnText' style='margin-right:10px;'>바로가기</button>"
			}
			else {
				content += "<button type='button' class='btnTextF' onclick=\"gotoFly(" + newAddress.longitude + ", " + newAddress.latitude + ", 300, 2)\" style='margin-right:10px;'>바로가기</button>"
			}
			content += newAddress.new_addr + "</span></li>";
		}
	} else {
		content += 	"<li style=\"vertical-align:middle; text-align:center; height: 50px;\">검색 결과가 존재하지 않습니다.</li>";
		$("#newAddressSearchList").height(50);
	}

	$("#newAddressSearchCount").empty();
	$("#newAddressSearchCount").html(totalCount);
	$("#newAddressSearchList").empty();
	$("#newAddressSearchList").html(content);
	drawPage("newAddressSearch", pagination, "newAddressSearchPaging", searchWord, searchKey);
}

var searchWord;
var searchKey;
function drawPage(searchType, pagination, areaId, searchWord, searchKey) {
	var pagecontent = "";
	var pageIndex = null;
	var pageNum = pagination.pageNo;

	searchWord = searchWord;
	searchKey = searchKey;
	
	pagecontent	= pagecontent 
		+	"<div class='pagerB'>"
		+ "<span class=\"countPage\">" + pageNum + "</span> /"
		+	"<span class=\"countTotal\"> 총 " + pagination.totalCount + "</span>"
		+	"<div>";
	
	if(pagination.totalCount > 0) {
		var prePage = pageNum;
		var nextPage = pageNum;
		
		if(prePage > pagination.firstPage)	prePage--;
		if(nextPage < pagination.lastPage)	nextPage++;
		
		pagecontent += "<button type='button' class=\"first\" onclick=\"" + searchKey + "Search(" + pagination.firstPage + ", '" + searchWord + "');\">처음</button>"
			pagecontent +=		"<button type='button' class=\"forward\" onclick=\"" + searchKey + "Search(" + prePage + ", '" + searchWord + "');\">이전</button>"
			pagecontent += 		"<input type='text' id='pageNum' value='1' size='1'> / <span style='padding-right:5px;'>" + pagination.lastPage + "</span>" 
			pagecontent +=		"<button type='button' class=\"next\" onclick=\"" + searchKey + "Search(" + nextPage + ", '" + searchWord + "');\">다음</button>"
			pagecontent +=		"<button type='button' class=\"last\" onclick=\"" + searchKey + "Search(" + pagination.lastPage + ", '" + searchWord + "');\">마지막</button>"
			pagecontent +=		"<button type='button' id='pageBtn' onclick=\"gotoPage('" + areaId + "', '" + searchWord + "', '" + searchKey + "'); return false;\" class='btnText' style='margin-left:5px;'>이동</button>"
			pagecontent +=		"</div></div>";
			
			$("#" + areaId).empty();
			$("#" + areaId).html(pagecontent);
			$('#'+ areaId +' #pageNum').val(pageNum);
			$('#'+ areaId +' span.countPage').text(pageNum);
	}
}

function gotoPage(areaId, searchWord, searchKey) {
	var pageNum = $('#'+ areaId +' #pageNum').val();
	
	switch(searchKey) {
		// case 'jibun' :
		// 	jibunSearch(pageNum, searchWord)
		// 	break;
		case 'newAddress' :
			newAddressSearch(pageNum, searchWord)
			break;
	}
	$('#'+ areaId +' span.countPage').text(pageNum);
}


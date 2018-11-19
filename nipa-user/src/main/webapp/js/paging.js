var searchWord;
function drawPage(searchType, pagination, areaId, searchWord) {
	var pagecontent = "";
	var pageIndex = null;
	searchWord = searchWord;
	
	pagecontent	= pagecontent 
		+	"<div class='pagerB'>"
		+	"<span class=\"countPage\">" + pagination.pageNo + "</span> /"
		+	"<span class=\"countTotal\"> 총 " + pagination.totalCount + "</span>"
		+	"<div>";
	
	if(pagination.totalCount > 0) {
		var pageNum = 1;
		var prePage = 1;
		var nextPage = 1;
		if(pagination.pageNo < pagination.totalCount) {
			nextPage++;
			if(prePage > pagination.startPage) {
				prePage--;
			} else {
				prePage = pagination.startPage;
			}
		} else {
			prePage = prePage--;
			if(nextPage < pagination.lastPage) {
				nextPage++;
			} else {
				nextPage = pagination.lastPage;
			}
		}
			pagecontent +=		"<button type='button' class=\"first\" onclick=\"newAddressSearch(" + pagination.startPage + ", '" + searchWord + "');\">처음</button>"
			pagecontent +=		"<button type='button' class=\"forward\" onclick=\"newAddressSearch(" + prePage + ", '" + searchWord + "');\">이전</button>"
			pagecontent += 		"<input type='text' id='pageNum' value='1' size='1'> / <span style='padding-right:5px;'>" + pagination.lastPage + "</span>" 
			pagecontent +=		"<button type='button' class=\"next\" onclick=\"newAddressSearch(" + nextPage + ", '" + searchWord + "');\">다음</button>"
			pagecontent +=		"<button type='button' class=\"last\" onclick=\"newAddressSearch(" + pagination.lastPage + ", '" + searchWord + "');\">마지막</button>"
			pagecontent +=		"<button type='button' id='pageBtn' onclick=\"newAddressSearch(" + pageNum + ", '" + searchWord + "');\" class='btnText' style='margin-left:5px;'>이동</button>"
			pagecontent +=		"</div></div>";
			
			$("#" + areaId).empty();
			$("#" + areaId).html(pagecontent);
			pageNum = $('#pageNum').val();
			$('span.countPage').text($('#pageNum').val());

	}
	
}

//function gotoPage(searchWord) {
//	var pageNo = $('#pageNo').val();
//	newAddressSearch(pageNo, "'" + searchWord + "'");
//	$('span.countPage').text(pageNo);
//}


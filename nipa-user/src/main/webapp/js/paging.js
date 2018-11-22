var searchWord;
var searchKey;
function drawPage(searchType, pagination, areaId, searchWord, searchKey) {
	var pagecontent = "";
	var pageIndex = null;
	searchWord = searchWord;
	searchKey = searchKey;
	
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
			pagecontent +=		"<button type='button' class=\"first\" onclick=\"" + searchKey + "Search(" + pagination.startPage + ", '" + searchWord + "');\">처음</button>"
			pagecontent +=		"<button type='button' class=\"forward\" onclick=\"" + searchKey + "Search(" + prePage + ", '" + searchWord + "');\">이전</button>"
			pagecontent += 		"<input type='text' id='pageNum' value='1' size='1'> / <span style='padding-right:5px;'>" + pagination.lastPage + "</span>" 
			pagecontent +=		"<button type='button' class=\"next\" onclick=\"" + searchKey + "Search(" + nextPage + ", '" + searchWord + "');\">다음</button>"
			pagecontent +=		"<button type='button' class=\"last\" onclick=\"" + searchKey + "Search(" + pagination.lastPage + ", '" + searchWord + "');\">마지막</button>"
			pagecontent +=		"<button type='button' id='pageBtn' onclick=\"gotoPage('" + areaId + "', '" + searchWord + "', '" + searchKey + "'); return false;\" class='btnText' style='margin-left:5px;'>이동</button>"
			pagecontent +=		"</div></div>";
			
			$("#" + areaId).empty();
			$("#" + areaId).html(pagecontent);
			pageNum = pagination.pageNo;
			$('#'+ areaId +' #pageNum').val(pageNum);
			$('#'+ areaId +' span.countPage').text(pageNum);
	}
}

function gotoPage(areaId, searchWord, searchKey) {
	var pageNum = $('#'+ areaId +' #pageNum').val();
	
	switch(searchKey) {
		case 'distrirct' :
			districtSearch(pageNum, searchWord)
			break;
		case 'placeName' :
			placeNameSearch(pageNum, searchWord)
			break;
		case 'jibun' :
			jibunSearch(pageNum, searchWord)
			break;
		case 'newAddress' :
			newAddressSearch(pageNum, searchWord)
			break;
		case 'countryPlaceNumber' :
			countryPlaceNumberSearch(pageNum, searchWord)
			break;
	}
	$('#'+ areaId +' span.countPage').text(pageNum);
}


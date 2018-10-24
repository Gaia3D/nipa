function drawPage(searchType, pagination, areaId) {
	var pagecontent = "";
	var pageIndex = null;
	
	pagecontent	= pagecontent 
		+	"<span class=\"countPage\">" + pagination.pageNo + "</span> /"
		+	"<span class=\"countTotal\"> 총 " + pagination.lastPage + "</span>"
		+	"<div>";
	
	if(pagination.totalCount > 0) {
		pagecontent +=			"<a href=\"#\" class=\"first\" onclick=\"" + searchType + "('" + pagination.startPage + "'); return false;\"><span class=\"icon-glyph glyph-first\"></span></a>";
		if(pagination.existPrePage == true) {
			pagecontent +=		"<a href=\"#\" class=\"prev\" onclick=\"" + searchType + "('" + pagination.prePageNo + "'); return false;\"><span class=\"icon-glyph glyph-prev\"></span></a>";
		}
		for(var pageIndex = pagination.startPage; pageIndex <= pagination.endPage; pageIndex++) {
			if(pageIndex == pagination.pageNo) {
				pagecontent +=	"<a href=\"#\" class=\"current-page\">" + pageIndex + "</a>";
			} else {
				pagecontent +=	"<a href=\"#\" onclick=\"" + searchType + "('" + pageIndex + "'); return false;\">" + pageIndex + "</a>";
			}
		}
		if(pagination.existNextPage == true) {
			pagecontent +=		"<a href=\"#\" class=\"next\" onclick=\"" + searchType + "('" + pagination.nextPageNo + "'); return false;\"><span class=\"icon-glyph glyph-next\"></span></a>";
		}
		pagecontent +=			"<a href=\"#\" class=\"last\" onclick=\"" + searchType + "('" + pagination.lastPage + "'); return false;\"><span class=\"icon-glyph glyph-last\"></span></a>";
	}
	
	pagecontent +=			"</div>";
	$("#" + areaId).empty();
	$("#" + areaId).html(pagecontent);
}
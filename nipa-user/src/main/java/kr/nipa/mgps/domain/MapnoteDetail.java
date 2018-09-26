package kr.nipa.mgps.domain;

import lombok.Data;

@Data
public class MapnoteDetail {
	/****** validator ********/
	private String method_mode;
	private String error_code;
	
	/********** 페이징 ************/
	// 총건수
	private Long totalCount;
	// 페이지 처리를 위한 시작
	private Long offset;
	// 페이지별 표시할 건수
	private Long limit;
		
	/********** Table ************/
	// 맵노트 상세 고유번호
	private Long map_note_detail_id;
	// 맵노트 고유번호
	private Long map_note_id;
	// 지점명
	private String place_name;
	// 설명
	private String description;
	// 수정일
	private String update_date;
	// 등록일
	private String insert_date;

}

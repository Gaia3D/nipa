package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class Mapnote {
	// 검증
	private String method_mode;

	// 검증
	private String error_code;
	
	// 맵노트 상세 고유번호
	private Long map_note_detail_id;

	// 맵노트 파일 고유번호
	private Long file_info_id;
	
	// 맵노트 파일 이름
	private String file_name;

	// 총건수
	private Long totalCount;

	// 페이지 처리를 위한 시작
	private Long offset;

	// 페이지별 표시할 건수
	private Long limit;

	// 하단 페이지 갯수
	private Long list_counter = 10l;

	// 고유번호
	private Long map_note_id;

	// 사용자 아이디
	private String user_id;

	// 지점명
	private String note_title;

	// 설명
	private String description;

	// location(위도, 경도)
	private String[] note_location;

	// 경도
	private BigDecimal longitude;

	// 위도
	private BigDecimal latitude;

	// 높이
	private BigDecimal height;

	// 수정일
	private String update_date;

	// 등록일
	private String insert_date;
}

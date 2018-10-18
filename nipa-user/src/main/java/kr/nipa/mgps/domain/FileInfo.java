package kr.nipa.mgps.domain;

import lombok.Data;

@Data
public class FileInfo {
	/****** validator ********/
	private String method_mode;
	private String error_code;
	
	/********** Table ************/
	// 고유번호
	private Long file_info_id;
	// 맵노트 고유번호
	private Long map_note_id;
	// 사용자 아이디
	private String user_id;
	// 업무 타입
	private String job_type;
	// 나열 순서
	private Integer view_order;
	// 파일 이름
	private String file_name;
	// 파일 실제 이름
	private String file_real_name;
	// 파일 경로
	private String file_path;
	// 썸네일 이름
	private String thumbnail_name;
	// 썸네일 경로
	private String thumbnail_path;
	// 파일 사이즈
	private String file_size;
	// 파일 확장자
	private String file_ext;
	// 파일 가로 크기
	private int file_width;
	// 파일 세로 크기
	private int file_height;
	// 수정일
	private String update_date;
	// 등록일
	private String insert_date;
}

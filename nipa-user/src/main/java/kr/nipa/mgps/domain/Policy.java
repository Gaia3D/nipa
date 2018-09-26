package kr.nipa.mgps.domain;

import lombok.Data;

@Data
public class Policy {
	
	/********** Table ************/
	// 고유번호
	private Long policy_id;
	// 업로딩 가능 확장자
	private String upload_type;
	// 최대 업로딩 사이즈
	private Long upload_max_filesize;
	// 최대 업로드 파일 수
	private Integer upload_max_count;
	// 등록일
	private String insert_date;
	
}

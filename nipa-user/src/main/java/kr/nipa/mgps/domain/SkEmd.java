package kr.nipa.mgps.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Cheon JeongDae
 *
 */
@Getter
@Setter
@ToString
public class SkEmd {

	// 시도 1, 시군구 2, 읍면동 3
	private Integer layer_type;
	// 고유번호
	private Long gid;
	// PK
	private String ufid;
	// 법정동 코드
	private String bjcd;
	// 시도 코드
	private String sdo_code;
	// 시군구 코드
	private String sgg_code;
	// 읍면동 코드
	private String emd_code;
	// 명칭
	private String name;
	// 구분
	private String divi;
	// 통합코드
	private String scls;
	// 제작정보
	private String fmta;
	// 기하정보
	private String geom;
	// 등록일
	private String insert_date;
}
package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class PlaceName extends SearchFilter {

	private String fullTextSearch;
	
	// 지명(화면 표시)
	private String place_name;
	// 경도
    private BigDecimal longitude;
	// 위도
    private BigDecimal latitude;
	// 고유번호
	private Long gid;
	// 지명 위치
	private String geom;
	// 한글지명 (검색키워드)
	private String name_ko;
	// 영문지명
	private String name_en;
	// 구분
	private String category;
	// 경도
	private Double lon;
	// 위도
	private Double lat;
	// UTM 좌표
	private String utm;
	// 군사 좌표
	private String mgrs;
	// 갱신일
	private String update;
}

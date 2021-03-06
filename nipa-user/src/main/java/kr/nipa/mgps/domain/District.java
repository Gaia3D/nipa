package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class District extends SearchFilter {

	private String fullTextSearch;
	
	// 행정구역 코드
	private Integer id;
	// 행정구역명(화면 표시)
	private String name;
	// 경도
    private BigDecimal longitude;
	// 위도
    private BigDecimal latitude;
	
	/******** 시도 **********/
	private Integer sido_id;
	private String sido_geom;
	private String sido_cd;
	private String sido_eng_nm;
	private String sido_kor_nm;

	
	/******** 시군구 **********/
	private Integer sgg_id;
	private String sgg_geom;
	private String sgg_cd;
	private String sgg_eng_nm;
	private String sgg_kor_nm;
	
	
	/******** 읍면동 **********/
	private Integer emd_id;
	private String emd_geom;
	private String emd_cd;
	private String emd_eng_nm;
	private String emd_kor_nm;
	
}

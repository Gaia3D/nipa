package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class CountryPlaceNumber extends SearchFilter {
	
	private String fullTextSearch;
	
	// 국가지점번호(화면 표시)
	private String country_place_number;
	// 경도
    private BigDecimal longitude;
	// 위도
    private BigDecimal latitude;
	// 고유번호
	private long gid;
	// 지점 번호 위치
	private String geom;
	// 시군구 코드
	private String sgg_cd;
	// 읍면동 코드
	private String emd_cd;
	// 리 코드
	private String li_cd;
	// 지점 순번
	private Long spo_fcl_cd;
	// 지점 번호 코드(통합검색 키워드)
	private String spo_no_cd;
	// 지점명 코드 순번
	private String ins_fcl_sn;
	// 지점명(통합검색 키워드)
	private String fcltylc_nm;
	// GRS80 X
	private Double grs80_x;
	// GRS80 Y
	private Double grs80_y;
	// 경도
	private Double lon;
	// 위도
	private Double lat;
	// 갱신일
	private String spo_ins_date;
}

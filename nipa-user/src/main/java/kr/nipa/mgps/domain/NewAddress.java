package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class NewAddress extends SearchFilter {

	private String fullTextSearch;
	
	private String new_addr;
    // 경도
    private BigDecimal longitude;
	// 위도
    private BigDecimal latitude;
	// 주소관할 읍면동 코드
	private String code_emd;
	// 시도명
	private String kname_sido;
	// 시군구명
	private String kname_sgg;
	// 읍면동명
	private String kname_emd;
	// 도로명 코드
	private String name_addr;
	// 지하여부
	private String basement;
	// 건물본번
	private Integer building_no1;
	// 건물부번
	private Integer building_no2;
	// 우편번호
	private String zipcode;
	// 건물 관리 번호 
	private String building_mno;
	// 시군구용건물명
	private String name_sgg_building;
	// 건출물용도분류
	private String cat_building ;
	// 행정동코드
	private String code_adm;
	// 행정동명
	private String name_adm;
	// 지상층수
	private Integer ground_floor;
	// 지하층수
	private Integer basement_floor;
	// 공동주택구분
	private String apartment;
	// 건물수
	private Integer count_building;
	// 상세건물명
	private String detail_bname;
	// 건물명 변경이력
	private String hist_bname;
	// 상세 건물명 변경이력
	private String hist_detail_bname;
	// 거주여부
	private String residence;
	// 건물중심점_x좌표
	private Double center_x;
	// 건물중심점_y좌표
	private Double center_y;
	// 출입구_x좌표
	private Double enterance_x;
	// 출입구_y좌표
	private Double enterance_y;
	// 시도명(영문)
	private String ename_sido;
	// 시군구명(영문)
	private String ename_sgg;
	// 읍면동명(영문)
	private String ename_emd;
	// 도로명(영문)
	private String ename_road;
	// 읍면동구분
	private String is_emd;
	// 이동사유코드
	private String code_mv;
	// 기하정보
	private String geom;
}

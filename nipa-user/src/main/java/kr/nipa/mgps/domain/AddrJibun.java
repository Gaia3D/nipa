package kr.nipa.mgps.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class AddrJibun extends SearchFilter {
	
	private String fullTextSearch;
	
	private String jibun_addr;
	// 법정동코드
	private String code_law;
	// 시도명
	private String kname_sido;
	// 시군구명
	private String kname_sgg;
	// 읍면동명
	private String kname_emd;
	// 리명
	private String kname_li;
	// 산여부
	private String is_mnt;
	// 지번본번
	private String jibun_no1;
	// 지번부번
	private String jibun_no2;
	// 도로명코드
	private String code_addr;
	// 지하여부
	private String basement;
	// 건물본번
	private Integer building_no1;
	// 건물부번
	private Integer building_no2;
	// 지번일련번호
	private String jibun_seq;
	// 시도명(영문)
	private String ename_sido;
	// 시군구명(영문)
	private String ename_sgg;
	// 읍면동명(영문)
	private String ename_emd;
	// 리명(영문)
	private String ename_li;
	// 
	private String code_mv;
	// 건물관리 번호
	private String building_mno;
	// 주소 관할 읍면동 코드
	private String code_emd;
}

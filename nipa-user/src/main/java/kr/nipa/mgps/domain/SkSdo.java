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
public class SkSdo {

	// 고유번호
	private Long gid;
	private String ufid;
	private String bjcd;
	private String sdo_code;
	private String name;
	private String divi;
	private String scls;
	private String fmta;
	private String geom;
	private String insert_date;
}

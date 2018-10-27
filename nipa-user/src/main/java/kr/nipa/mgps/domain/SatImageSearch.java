package kr.nipa.mgps.domain;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class SatImageSearch {
    //
    private String type;
    //
    private String sdate;
    //
    private String edate;
    // 경도
    private BigDecimal longitude;
    //private Double longitude;
	// 위도
    private BigDecimal latitude;
    // private Double latitude;
    //    
    private Long offset;
    //
    private Long limit;
}
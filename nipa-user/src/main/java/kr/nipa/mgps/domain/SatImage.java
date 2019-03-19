package kr.nipa.mgps.domain;

import lombok.Data;

@Data
public class SatImage
{
    /**
     * 고유번호
     */
    private Long fid;

    /**
     * 위성영상 구분
     */
    private String type;

    /**
     * 위성번호
     */
    private String sat_id;

    /**
     * 위성이름
     */
    private String sat;

    /**
     * 위성센서 이름
     */
    private String sensor;

    /**
     * 영상 촬영 날짜
     */
    private String acquisition;

    /**
     * 위성영상 썸네일
     */
    private String thumbnail;

    /**
     * 위성영상
     */
    private String img;

    /**
     * 위성영상 boundingbox 영역
     */
    private String bbox;

    /**
     * 위성영상 footprint 영역
     */
    private String footprint;
}
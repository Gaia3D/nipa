package kr.nipa.mgps.service;

import java.util.List;

import kr.nipa.mgps.domain.SatImage;
import kr.nipa.mgps.domain.SatImageSearch;

public interface SatImageService {

    /**
     * 위성영상 목록 총 건수
     * 
     * @param satImageSearch
     * @return
     */
    Long getListSatImageTotalCount(SatImageSearch satImageSearch);

    /**
     * 위성영상 목록
     * 
     * @param satImageSearch
     * @return
     */
    List<SatImage> getListSatImage(SatImageSearch satImageSearch);

    /**
     * 위성영상 정보
     * 
     * @param id
     * @return
     */
    SatImage getSatImageById(Long id);
}
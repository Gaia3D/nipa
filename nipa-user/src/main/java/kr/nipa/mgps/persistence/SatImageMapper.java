package kr.nipa.mgps.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.nipa.mgps.domain.SatImage;
import kr.nipa.mgps.domain.SatImageSearch;

@Repository
public interface SatImageMapper {

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
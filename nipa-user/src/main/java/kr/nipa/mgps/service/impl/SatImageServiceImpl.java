package kr.nipa.mgps.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.nipa.mgps.domain.SatImage;
import kr.nipa.mgps.domain.SatImageSearch;
import kr.nipa.mgps.persistence.SatImageMapper;
import kr.nipa.mgps.service.SatImageService;

@Service
public class SatImageServiceImpl implements SatImageService {

    @Autowired
    private SatImageMapper satImageMapper;

    @Transactional(readOnly=true)
	public List<SatImage> getListSatImage(SatImageSearch satImageSearch) {
		return satImageMapper.getListSatImage(satImageSearch);
	}

    @Transactional(readOnly=true)
    public Long getListSatImageTotalCount(SatImageSearch satImageSearch) {
        return satImageMapper.getListSatImageTotalCount(satImageSearch);
    }

    @Transactional(readOnly=true)
    public SatImage getSatImageById(SatImage satImage) {
        return satImageMapper.getSatImageById(satImage.getFid());
    }
}
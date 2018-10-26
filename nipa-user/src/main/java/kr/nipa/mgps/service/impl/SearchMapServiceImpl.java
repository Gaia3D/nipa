package kr.nipa.mgps.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.nipa.mgps.domain.AddrJibun;
import kr.nipa.mgps.domain.CountryPlaceNumber;
import kr.nipa.mgps.domain.District;
import kr.nipa.mgps.domain.NewAddress;
import kr.nipa.mgps.domain.PlaceName;
import kr.nipa.mgps.domain.SkEmd;
import kr.nipa.mgps.domain.SkSdo;
import kr.nipa.mgps.domain.SkSgg;
import kr.nipa.mgps.persistence.SearchMapMapper;
import kr.nipa.mgps.service.SearchMapService;

@Service
public class SearchMapServiceImpl implements SearchMapService {

	@Autowired
	private SearchMapMapper searchMapMapper;
	
	/**
	 * Sdo 목록(geom 은 제외)
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<SkSdo> getListSdoExceptGeom() {
		return searchMapMapper.getListSdoExceptGeom();
	}
	
	/**
	 * Sgg 목록(geom 은 제외)
	 * @param sdo_code
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<SkSgg> getListSggBySdoExceptGeom(String sdo_code) {
		return searchMapMapper.getListSggBySdoExceptGeom(sdo_code);
	}
	
	/**
	 * emd 목록(geom 은 제외)
	 * @param skEmd
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<SkEmd> getListEmdBySdoAndSggExceptGeom(SkEmd skEmd) {
		return searchMapMapper.getListEmdBySdoAndSggExceptGeom(skEmd);
	}
	
	/**
	 * 선택한 시도의 center point를 구함
	 * @param skSdo
	 * @return
	 */
	@Transactional(readOnly=true)
	public String getCentroidSdo(SkSdo skSdo) {
		return searchMapMapper.getCentroidSdo(skSdo);
	}
	
	/**
	 * 선택한 시군구 center point를 구함
	 * @param skSgg
	 * @return
	 */
	@Transactional(readOnly=true)
	public String getCentroidSgg(SkSgg skSgg) {
		return searchMapMapper.getCentroidSgg(skSgg);
	}
	
	/**
	 * 선택한 읍면동 center point를 구함
	 * @param skEmd
	 * @return
	 */
	@Transactional(readOnly=true)
	public String getCentroidEmd(SkEmd skEmd) {
		return searchMapMapper.getCentroidEmd(skEmd);
	}
	
	/**
	 * 행정구역 검색 총 건수
	 * @param district
	 * @return
	 */
	@Transactional(readOnly=true)
	public Long getDistrictTotalCount(District district) {
		return searchMapMapper.getDistrictTotalCount(district);
	}
	
	/**
	 * 지명 검색 총 건수
	 * @param placeName
	 * @return
	 */
	@Transactional(readOnly=true)
	public Long getPlaceNameTotalCount(PlaceName placeName) {
		return searchMapMapper.getPlaceNameTotalCount(placeName);
	}
	
	/**
	 * 지번 검색 총 건수
	 * @param addrJibun
	 * @return
	 */
	@Transactional(readOnly=true)
	public Long getJibunTotalCount(AddrJibun addrJibun) {
		return searchMapMapper.getJibunTotalCount(addrJibun);
	}
	
	/**
	 * 새 주소 검색 총 건수
	 * @param newAddress
	 * @return
	 */
	@Transactional(readOnly=true)
	public Long getNewAddressTotalCount(NewAddress newAddress) {
		return searchMapMapper.getNewAddressTotalCount(newAddress);
	}
	
	/**
	 * 국가 지점 번호 검색 총 건수
	 * @param countryPlaceNumber
	 * @return
	 */
	@Transactional(readOnly=true)
	public Long getCountryPlaceNumberTotalCount(CountryPlaceNumber countryPlaceNumber) {
		return searchMapMapper.getCountryPlaceNumberTotalCount(countryPlaceNumber);
	}
	
	/**
	 * 행정 구역 검색
	 * @param district
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<District> getListDistrict(District district) {
		return searchMapMapper.getListDistrict(district);
	}
	
	/**
	 * 지명 구역 검색
	 * @param placeName
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<PlaceName> getListPlaceName(PlaceName placeName) {
		return searchMapMapper.getListPlaceName(placeName);
	}
	
	/**
	 * 지번 검색 목록
	 * @param addrJibun
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<AddrJibun> getListJibun(AddrJibun addrJibun) {
		return searchMapMapper.getListJibun(addrJibun);
	}
	
	/**
	 * 새 주소 검색
	 * @param newAddress
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<NewAddress> getListNewAddress(NewAddress newAddress) {
		return searchMapMapper.getListNewAddress(newAddress);
	}
	
	/**
	 * 국가 지점번호 검색 검색
	 * @param countryPlaceNumber
	 * @return
	 */
	@Transactional(readOnly=true)
	public List<CountryPlaceNumber> getListCountryPlaceNumber(CountryPlaceNumber countryPlaceNumber) {
		return searchMapMapper.getListCountryPlaceNumber(countryPlaceNumber);
	}
}

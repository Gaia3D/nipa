package kr.nipa.mgps.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.nipa.mgps.domain.SkEmd;
import kr.nipa.mgps.domain.SkSdo;
import kr.nipa.mgps.domain.SkSgg;

@Repository
public interface SearchMapMapper {

	/**
	 * Sdo 목록(geom 은 제외)
	 * @return
	 */
	List<SkSdo> getListSdoExceptGeom();
	
	/**
	 * Sgg 목록(geom 은 제외)
	 * @param sdo_code
	 * @return
	 */
	List<SkSgg> getListSggBySdoExceptGeom(String sdo_code);
	
	/**
	 * emd 목록(geom 은 제외)
	 * @param skEmd
	 * @return
	 */
	List<SkEmd> getListEmdBySdoAndSggExceptGeom(SkEmd skEmd);
	
	/**
	 * 선택한 시도의 center point를 구함
	 * @param skSdo
	 * @return
	 */
	public String getCentroidSdo(SkSdo skSdo);
	
	/**
	 * 선택한 시군구 center point를 구함
	 * @param skSgg
	 * @return
	 */
	public String getCentroidSgg(SkSgg skSgg);
	
	/**
	 * 선택한 읍면동 center point를 구함
	 * @param skEmd
	 * @return
	 */
	public String getCentroidEmd(SkEmd skEmd);
	
	/**
	 * 행정 구역 검색
	 * @param search_word
	 * @return
	 */
	public List<SkEmd> getListDistrict(String search_word);
}

package kr.nipa.mgps.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.nipa.mgps.domain.Mapnote;

@Repository
public interface MapnoteMapper {
	
	/**
	 * 맵노트 목록
	 * @param mapnote
	 * @return
	 */
	List<Mapnote> getListMapnote(Mapnote mapnote);
	
	/**
	 * 맵노트 총 건수
	 * @param mapnote
	 * @return
	 */
	Long getMapnoteTotalCount(Mapnote mapnote);
	
	/**
	 * 맵노트 아이디로 한 건 조회 
	 * @param mapnote
	 * @return
	 */
	Mapnote getMapnoteById(Long mapnote);
	
	/**
	 * 맵노트 아이디로 한 건 조회 
	 * @param mapnote
	 * @return
	 */
	Long getMapnoteId();
	
	/**
	 * 맵노트 등록
	 * @param mapnote
	 * @return
	 */
	int insertMapnote(Mapnote mapnote);
	
	/**
	 * 맵노트 삭제
	 * @param map_note_id
	 * @return
	 */
	int deleteMapnote(Long map_note_id);
	
	/**
	 * 맵노트 파일 등록
	 * @param mapnoteFile
	 * @return
	 */
//	int insertMapnoteFile(MapnoteFile mapnoteFile);
	
	/**
	 * 맵노트 수정
	 * @param mapnote
	 * @return
	 */
//	int updateMapnote(Mapnote mapnote);

	
}

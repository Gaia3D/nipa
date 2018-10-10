package kr.nipa.mgps.service;

import java.util.List;

import kr.nipa.mgps.domain.Mapnote;

public interface MapnoteService {

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
	 * @param map_note_id
	 * @return
	 */
	Mapnote getMapnoteById(Long map_note_id);

	/**
	 * 맵노트 아이디 시퀀스 조회
	 * @param map_note_id
	 * @return
	 */
	Long getMapnoteId();

	/**
	 * 맵노트 등록
	 * @param mapnote
	 * @return
	 */
	Mapnote insertMapnote(Mapnote mapnote);
	
	/**
	 * 맵노트 수정
	 * @param mapnote
	 * @return
	 */
	int updateMapnote(Mapnote mapnote);
	
	/**
	 * 맵노트 삭제
	 * @param map_note_id
	 * @return
	 */
	int deleteMapnote(Long map_note_id);
	
}

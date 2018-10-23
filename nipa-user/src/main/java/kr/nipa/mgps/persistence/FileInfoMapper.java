package kr.nipa.mgps.persistence;

import java.util.List;

import org.springframework.stereotype.Repository;

import kr.nipa.mgps.domain.FileInfo;

@Repository
public interface FileInfoMapper {
	
	/**
	 * 맵노트 파일 정보 획득
	 * @param map_note_id
	 * @return
	 */
	List<FileInfo> getListFileInfo(Long map_note_id);
	
	/**
	 * 파일 한 건 정보 획득
	 * @param file_info_id
	 * @return
	 */
	FileInfo getFileInfoByFileId(Long file_info_id);
	               
	/**
	 * 맵노트 별 파일 총 건수
	 * @param map_note_id
	 * @return
	 */
	Long getFileCountByMapnoteId(Long map_note_id);
	
	/**
	 * 파일 정보 등록
	 * @param fileInfo
	 * @return
	 */
	void insertFileInfo(FileInfo fileInfo);

	/**
	 * 파일 정보 수정
	 * @param fileInfo
	 * @return
	 */
	int updateFileInfo(FileInfo fileInfo);
	
	/**
	 * 맵노트 파일 삭제
	 * @param map_note_id
	 * @return
	 */
	int deleteFileInfo(Long map_note_id);
	
	/**
	 * 개별 파일 삭제
	 * @param file_info_id
	 * @return
	 */
	int deleteEachFile(Long file_info_id);
	
}

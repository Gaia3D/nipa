package kr.nipa.mgps.service;

import java.util.List;

import kr.nipa.mgps.domain.FileInfo;

public interface FileService {
	
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
	public void insertFiles(List<FileInfo> fileList);
	
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
	
}

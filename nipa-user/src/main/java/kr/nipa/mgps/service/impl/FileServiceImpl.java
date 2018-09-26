package kr.nipa.mgps.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.nipa.mgps.domain.FileInfo;
import kr.nipa.mgps.persistence.FileInfoMapper;
import kr.nipa.mgps.service.FileService;

@Service
public class FileServiceImpl implements FileService {
	
	@Autowired
	private FileInfoMapper fileMapper;

	@Override
	public List<FileInfo> getListFileInfo(Long map_note_id) {
		return fileMapper.getListFileInfo(map_note_id);
	}
	
	@Override
	public FileInfo getFileInfoByFileId(Long file_info_id) {
		return fileMapper.getFileInfoByFileId(file_info_id);
	}
	
	@Override
	public Long getFileCountByMapnoteId(Long map_note_id) {
		return fileMapper.getFileCountByMapnoteId(map_note_id);
	}

	@Override
	public void insertFiles(List<FileInfo> fileList) {
		for(FileInfo fileInfo : fileList) {
			fileMapper.insertFileInfo(fileInfo);
		}
	}

	@Override
	public int updateFileInfo(FileInfo fileInfo) {
		return fileMapper.updateFileInfo(fileInfo);
	}

	@Override
	public int deleteFileInfo(Long map_note_id) {
		return fileMapper.deleteFileInfo(map_note_id);
	}

	
	
}

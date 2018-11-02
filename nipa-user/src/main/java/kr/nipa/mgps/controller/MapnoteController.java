package kr.nipa.mgps.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.nipa.mgps.config.PropertiesConfig;
import kr.nipa.mgps.domain.FileInfo;
import kr.nipa.mgps.domain.Mapnote;
import kr.nipa.mgps.domain.Pagination;
import kr.nipa.mgps.service.FileService;
import kr.nipa.mgps.service.MapnoteService;
import kr.nipa.mgps.service.PolicyService;
import kr.nipa.mgps.util.FileUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/nipa")
public class MapnoteController {
	
	@Autowired
	private MapnoteService mapnoteService;
	
	@Autowired
	private PolicyService policyService;
	
	@Autowired
	PropertiesConfig propertiesConfig;
	
	@Autowired
	FileService fileService;
	
	/** 
	 ** TODO 지점 - 버튼 클릭 시 경위도값 읽어오기
	 **/
	
	/**
	 * 맵노트 목록
	 * @param request
	 * @param pageNo
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value ="mapnote/{pageNo}", method = RequestMethod.GET)
	@GetMapping(value = "mapnote/{pageNo}")
	public Map<String, Object> ajaxListMapnote(HttpServletRequest request, @PathVariable("pageNo")Long pageNo) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			Mapnote mapnote = new Mapnote();
			
			long totalCount = mapnoteService.getMapnoteTotalCount(mapnote);
			Pagination pagination = new Pagination(request.getRequestURI(), totalCount, pageNo, mapnote.getList_counter());
			log.info("@@ pagination = {}", pagination);
			mapnote.setOffset(pagination.getOffset());
			mapnote.setLimit(pagination.getPageRows());
			map.put("pagination", pagination);
			
			List<Mapnote> mapnoteList = new ArrayList<>();
			if(totalCount > 0l) {
				mapnoteList = mapnoteService.getListMapnote(mapnote);
			}
			map.put("mapnoteList", mapnoteList);
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	/**
	 * 맵노트 등록
	 * @param mapnote
	 * @param request
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="insert", method = RequestMethod.POST)
	public Map<String, Object> insertMapnoteFile(@ModelAttribute Mapnote mapnote, MultipartHttpServletRequest request) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			mapnote.setUser_id("guest");
			String noteTitle = request.getParameter("noteTitle");
			String[] noteLocation = request.getParameter("noteLocation").split(",");
			String longitude = noteLocation[0].trim();
			String latitude = noteLocation[1].trim();
			String description = request.getParameter("description");
			log.info("noteTitle = {}, longitude = {}, latitude = {}", noteTitle, longitude, latitude);
			
			mapnote.setNote_title(noteTitle);
			mapnote.setLongitude(new BigDecimal(longitude));
			mapnote.setLatitude(new BigDecimal(latitude));
			mapnote.setHeight(new BigDecimal(0));
			mapnote.setDescription(description);
			
			long map_note_id= mapnoteService.getMapnoteId();
			mapnote.setMap_note_id(map_note_id);
			mapnote.setMap_note_detail_id(map_note_id);
			mapnoteService.insertMapnote(mapnote);
			map.put("mapnote", mapnote);
			log.info("@@@ after mapnote = {}", mapnote);
			
			// 파일 등록
			List<FileInfo> fileList = new ArrayList<>();
			Map<String, MultipartFile> fileMap = request.getFileMap();
		
			for(MultipartFile multipartFile :  fileMap.values()) {
				if(multipartFile.equals("") || multipartFile.getSize() == 0) { // 파일 첨부 없이 등록하는 경우
					map.put("result", result);
					return map;
				}

				FileInfo fileInfo = FileUtil.fileUpload(FileUtil.SUBDIRECTORY_YEAR_MONTH_DAY, multipartFile, policyService.getPolicy(), propertiesConfig.getFileUploadDir(), propertiesConfig.getThumbnailUploadDir());
				
				if(fileInfo.getError_code() != null && !"".equals(fileInfo.getError_code())) {
					log.info("@@@@@ error_code = {}", fileInfo.getError_code());
					result = fileInfo.getError_code();
					break;
				}
				fileInfo.setMap_note_id(map_note_id);
				fileList.add(fileInfo);
			}
			fileService.insertFiles(fileList);
			long count = fileService.getFileCountByMapnoteId(map_note_id);
			map.put("count", count);
			
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		map.put("result", result);
		return map;
	}
	
	/**
	 * 썸네일 파일 이미지 다운로드
	 * @param file_info_id
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="displayImg/{file_info_id}", method = RequestMethod.GET)
	public ResponseEntity<byte[]> displayImg(@PathVariable("file_info_id")Long file_info_id) throws IOException {
		log.info("@@@@@ file_info_id = {}", file_info_id);
		FileInfo file = fileService.getFileInfoByFileId(file_info_id);
		
		String thumbnailPath = file.getThumbnail_path();
		String thumbnailName = file.getThumbnail_name();
		String thumbnailFile =  thumbnailPath + "\\" + thumbnailName;
		
		InputStream in = null;
		ResponseEntity<byte[]> entity = null;
		try {
			HttpHeaders headers = new HttpHeaders();

			in = new FileInputStream(thumbnailFile);
			headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
			headers.add("Content-Disposition", "attachment; filename=\""+ new String(file.getFile_name().getBytes("UTF-8"), "ISO-8859-1") + "\""); 
			entity = new ResponseEntity<byte[]>(IOUtils.toByteArray(in), headers, HttpStatus.CREATED);
			
		} catch (Exception e) {
			e.printStackTrace();
			entity = new ResponseEntity<byte[]>(HttpStatus.BAD_REQUEST);
		} finally {
			in.close();
		}
		return entity;
	}
	
	/**
	 * 원본 파일 이미지 다운로드
	 * @param file_info_id
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="showImg/{file_info_id}", method = RequestMethod.GET)
	@ResponseBody
	public void showImg (@PathVariable("file_info_id")Long file_info_id, HttpServletResponse response) throws IOException {
		log.info("@@@@@ file_info_id = {}", file_info_id);
		FileInfo fileInfo = fileService.getFileInfoByFileId(file_info_id);
		
		log.info("@@@@@ file_info_id = {}", file_info_id);
		
		String originalFilePath = fileInfo.getFile_path();
		String originalName = fileInfo.getFile_real_name();
		String originallFile =  originalFilePath + "\\" + originalName;
		String fileExt = fileInfo.getFile_ext();
		
		response.setContentType("image/" + fileExt);

		BufferedInputStream in = null;
		BufferedOutputStream out = null;
		try {
			File file = new File(originallFile);
			in = new BufferedInputStream(new FileInputStream(file));
			out = new BufferedOutputStream(response.getOutputStream());

			FileCopyUtils.copy(in, out);
			out.flush();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if(out != null) { try { out.close(); } catch(Exception e) { e.printStackTrace(); } }
			if(in != null) { try { in.close(); } catch(Exception e) { e.printStackTrace(); } }
		}
	}
	
	/**
	 * 맵노트 상세
	 * @param pageNo
	 * @param map_note_id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="mapnote/{pageNo}/{map_note_id}", method = RequestMethod.GET)
	public Map<String, Object> detailMapnote(@PathVariable("pageNo")Long pageNo, @PathVariable("map_note_id")Long map_note_id) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {
			if(map_note_id == null || map_note_id.longValue() <= 0) {
				result = "map_note_id.invalid";
				map.put("result", result);
			} else {
				Mapnote mapnote = mapnoteService.getMapnoteById(map_note_id);
				List<FileInfo> files = fileService.getListFileInfo(map_note_id);
				log.info("@@@ detail mapnote = {}", mapnote);
				map.put("pageNo", pageNo);
				map.put("mapnote", mapnote);
				map.put("file", files);
			}
			
		} catch(Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		map.put("result", result);
		return map;
	}

	/**
	 * 맵노트 수정 화면
	 * @param map_note_id
	 * @return
	 */
	@ResponseBody
	@GetMapping(value= "updateForm/{map_note_id}")
	public Map<String, Object> updateForm(@PathVariable("map_note_id") Long map_note_id) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			if(map_note_id == null || map_note_id.longValue() <= 0) {
				result = "map_note_id.invalid";
				map.put("result", result);
				return map;
			}
			Mapnote mapnote = mapnoteService.getMapnoteById(map_note_id);
			map.put("mapnote", mapnote);
			
			long fileCount = fileService.getFileCountByMapnoteId(map_note_id);
			map.put("fileCount", fileCount);
			
			List<FileInfo> fileInfoList = fileService.getListFileInfo(map_note_id);
			map.put("fileInfoList", fileInfoList);
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	/**
	 * 맵노트 수정
	 * @param mapnote
	 * @param request
	 * @param map_note_id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value="update/{map_note_id}", method = RequestMethod.POST)
	public Map<String, Object> updateMapnoteFile(@ModelAttribute Mapnote mapnote, MultipartHttpServletRequest request, @PathVariable("map_note_id")Long map_note_id) {
		log.info("############## map_note_id = {}", map_note_id);
		
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			mapnote.setMap_note_id(map_note_id);
			mapnote.setUser_id("guest");
			String noteTitle = request.getParameter("noteTitle");
			String[] noteLocation = request.getParameter("noteLocation").split(",");
			String longitude = noteLocation[0].trim();
			String latitude = noteLocation[1].trim();
			String description = request.getParameter("description");
			log.info("noteTitle = {}, longitude = {}, latitude = {}", noteTitle, longitude, latitude);
			
			mapnote.setNote_title(noteTitle);
			mapnote.setLongitude(new BigDecimal(longitude));
			mapnote.setLatitude(new BigDecimal(latitude));
			mapnote.setHeight(new BigDecimal(0));
			mapnote.setDescription(description);
			
			log.info("@@@ before mapnote = {}", mapnote);
			mapnoteService.updateMapnote(mapnote);
			map.put("mapnote", mapnote);
			log.info("@@@ after mapnote = {}", mapnote);
			
			List<FileInfo> fileList = new ArrayList<>();
			Map<String, MultipartFile> fileMap = request.getFileMap();
		
			for(MultipartFile multipartFile :  fileMap.values()) {
				if(multipartFile.equals("") || multipartFile.getSize() == 0) { // 파일 재첨부 없이 수정하는 경우
					map.put("result", result);
					return map;
				}
				
				FileInfo fileInfo = FileUtil.fileUpload(FileUtil.SUBDIRECTORY_YEAR_MONTH_DAY, multipartFile, policyService.getPolicy(), propertiesConfig.getFileUploadDir(), propertiesConfig.getThumbnailUploadDir());
				
				if(fileInfo.getError_code() != null && !"".equals(fileInfo.getError_code())) {
					log.info("@@@@@ error_code = {}", fileInfo.getError_code());
					result = fileInfo.getError_code();
					break;
				}
				fileInfo.setMap_note_id(map_note_id);
				fileList.add(fileInfo);
			}
			fileService.insertFiles(fileList);
			map.put("count", fileList.size());
			
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		map.put("result", result);
		return map;
	}
	
	/**
	 * 맵노트 삭제
	 * @param map_note_id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value ="mapnote/{map_note_id}", method = RequestMethod.DELETE)
	public Map<String, Object> deleteMapnote(@PathVariable("map_note_id")Long map_note_id) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			if(map_note_id == null || map_note_id.longValue() <= 0) {
				result = "map_note_id.invalid";
				map.put("result", result);
			}
			Mapnote mapnote = mapnoteService.getMapnoteById(map_note_id);
			mapnoteService.deleteMapnote(map_note_id);
			log.info("@@@ delete mapnote = {}", mapnote);
			List<Mapnote> mapnoteList = mapnoteService.getListMapnote(mapnote);
			map.put("mapnoteList", mapnoteList);
			
			// 파일 삭제
			long fileCount = fileService.getFileCountByMapnoteId(map_note_id);
			if(fileCount > 0l) {
				List<FileInfo> fileList = fileService.getListFileInfo(map_note_id);
				log.info("@@@ Deleted FileCount = {}", fileCount);
				
				for(FileInfo file : fileList) {
					String uploadName = file.getFile_real_name();
					String thumbName = file.getThumbnail_name();
					String  uploadPath = file.getFile_path();
					String thumbPath = file.getThumbnail_path();
					log.info("삭제된 원본 파일 = {}, 삭제된 썸네일 파일 = {}", uploadName, thumbName);
					FileUtil.deleteFile(uploadPath, thumbPath, uploadName, thumbName);
				}
				
				log.info("@@@ Deleted FileInfo = {}", fileList);
				fileService.deleteFileInfo(map_note_id);
				
			}
			
		} catch(Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	
	/**
	 * 개별 파일 삭제
	 * @param file_info_id
	 * @return
	 */
	@ResponseBody
	@RequestMapping(value ="fileInfo/{file_info_id}", method = RequestMethod.DELETE)
	public Map<String, Object> deleteEachFile(@PathVariable("file_info_id")Long file_info_id) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		
		try {
			if(file_info_id == null || file_info_id.longValue() <= 0) {
				result = "file_info_id.invalid";
				map.put("result", result);
			}
			FileInfo fileInfo = fileService.getFileInfoByFileId(file_info_id);
			String uploadName = fileInfo.getFile_real_name();
			String thumbName = fileInfo.getThumbnail_name();
			String  uploadPath = fileInfo.getFile_path();
			String thumbPath = fileInfo.getThumbnail_path();
			FileUtil.deleteFile(uploadPath, thumbPath, uploadName, thumbName);
			log.info("삭제된 원본 파일 = {}, 삭제된 썸네일 파일 = {}", uploadName, thumbName);
			
			fileService.deleteEachFile(file_info_id);
			log.info("@@@ deleted file = {}", fileInfo);
			
			List<FileInfo> fileInfoList = fileService.getListFileInfo(fileInfo.getMap_note_id());
			map.put("fileInfoList", fileInfoList);
			
		} catch(Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}

		map.put("result", result);
		return map;
	}
	
}



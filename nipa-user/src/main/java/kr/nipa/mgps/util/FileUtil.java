package kr.nipa.mgps.util;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.imageio.stream.ImageOutputStream;

import org.imgscalr.Scalr;
import org.springframework.web.multipart.MultipartFile;

import kr.nipa.mgps.domain.FileInfo;
import kr.nipa.mgps.domain.Policy;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class FileUtil {
	// 디렉토리 생성 방법 
	public static final int SUBDIRECTORY_YEAR = 1;
	public static final int SUBDIRECTORY_YEAR_MONTH = 2;
	public static final int SUBDIRECTORY_YEAR_MONTH_DAY = 3;
	
	// 업로더 가능한 파일 사이즈
	public static final long FILE_UPLOAD_SIZE = 10000000l;
	// 파일 copy 시 버퍼 사이즈
	public static final int BUFFER_SIZE = 8192;
	
	
	public static FileInfo fileUpload(int subDirectoryType, MultipartFile multipartFile, Policy policy, String uploadDirectory, String thumbDirectory) throws Exception {
		// 파일 validation
		FileInfo fileInfo = fileValidation(multipartFile, policy);
		if(fileInfo.getError_code() != null && !"".equals(fileInfo.getError_code())) {
			return fileInfo;
		}
		
		// 파일을 upload 디렉토리로 복사
		fileInfo = fileCopy(subDirectoryType, multipartFile, fileInfo, uploadDirectory);
		
		// 파일 썸네일 디렉토리로 복사
		makeThumbnail(uploadDirectory, thumbDirectory, subDirectoryType, fileInfo.getFile_real_name(), fileInfo);
		
		return fileInfo;
	}

	
	// 파일을 업로드 디렉토리로 복사
	private static FileInfo fileCopy(int subDirectoryType, MultipartFile multipartFile, FileInfo fileInfo, String uploadDirectory) {
		// 최상위 /upload/user/ 생성
		File rootDirectory = new File(uploadDirectory);
		if(!rootDirectory.exists()) {
			rootDirectory.mkdir();
		}
		
		// 현재년 sub 디렉토리 생성
		String today = DateUtil.getToday(FormatUtil.YEAR_MONTH_DAY_TIME14);
		String year = today.substring(0,4);
		String month = today.substring(4,6);
		String day = today.substring(6,8);
		String sourceDirectory = uploadDirectory;
		
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR) {
			File yearDirectory = new File(uploadDirectory + year);
			if(!yearDirectory.exists()) {
				yearDirectory.mkdir();
			}
			sourceDirectory = uploadDirectory + year + File.separator;
		}
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR_MONTH) {
			File monthDirectory = new File(uploadDirectory + year + File.separator + month);
			if(!monthDirectory.exists()) {
				monthDirectory.mkdir();
			}
			sourceDirectory = uploadDirectory + year + File.separator + month + File.separator;
		}
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR_MONTH_DAY) {
			File dayDirectory = new File(uploadDirectory + year + File.separator + month + File.separator + day);
			if(!dayDirectory.exists()) {
				dayDirectory.mkdir();
			}
			sourceDirectory = uploadDirectory + year + File.separator + month + File.separator + day + File.separator;
		}
		
		String saveFileName = today + "_" + System.nanoTime() + "." + fileInfo.getFile_ext();
		long size = 0L;
		try (	InputStream inputStream = multipartFile.getInputStream();
				OutputStream outputStream = new FileOutputStream(sourceDirectory + saveFileName)) {
		
			int bytesRead = 0;
			byte[] buffer = new byte[BUFFER_SIZE];
			while ((bytesRead = inputStream.read(buffer, 0, BUFFER_SIZE)) != -1) {
				size += bytesRead;
				outputStream.write(buffer, 0, bytesRead);
			}
		
			fileInfo.setFile_real_name(saveFileName);
			fileInfo.setFile_size(String.valueOf(size));
			fileInfo.setFile_path(sourceDirectory);
		} catch(Exception e) {
			e.printStackTrace();
			fileInfo.setError_code("fileinfo.copy.exception");
		}

		return fileInfo;
	}
	
	// 파일 validation
	private static FileInfo fileValidation(MultipartFile multipartFile, Policy policy) {
		FileInfo fileInfo = new FileInfo();
		
		// 1.파일 공백 체크
		if(multipartFile == null || multipartFile.getSize() == 0l) {
			log.info("@@ multipartFile is null");
			fileInfo.setError_code("fileInfo.invalid");
			return fileInfo;
		}
		
		// 2.파일 이름 - ('..', '/')
		String fileName = multipartFile.getOriginalFilename();
		if(fileName.indexOf("..") >= 0 || fileName.indexOf("/") >= 0) {
			log.info("@@ fileName = {}", fileName);
			fileInfo.setError_code("fileInfo.name.invalid");
			return fileInfo;
		}
		
		// 3.파일 확장자 - ('.', '..')
		String[] fileNameValues = fileName.split("\\.");
		if(fileNameValues.length != 2) {
			log.info("@@ fileNameValues.length = {}, fileName = {}", fileNameValues.length, fileName);
			fileInfo.setError_code("fileInfo.name.invalid");
			return fileInfo;
		}
		if(fileNameValues[0].indexOf(".") >= 0 || fileNameValues[0].indexOf("..") >= 0) {
			log.info("@@ fileNameValues[0] = {}", fileNameValues[0]);
			fileInfo.setError_code("fileInfo.name.invalid");
			return fileInfo;
		}
		// 확장자 소문자 변환
		String extension = fileNameValues[1];
		List<String> extList = new ArrayList<String>();
		if(policy.getUpload_type() != null && !"".equals(policy.getUpload_type())) {
			String[] uploadTypes = policy.getUpload_type().toLowerCase().split(",");
			extList = Arrays.asList(uploadTypes);
		}
		if(!extList.isEmpty() && !extList.contains(extension.toLowerCase())) {
			log.info("@@ extList = {}, extension = {}", extList, extension);
			fileInfo.setError_code("fileinfo.ext.invalid");
			return fileInfo;
		}
		
		// 4.파일 사이즈
		long fileSize = multipartFile.getSize();
		if(fileSize > policy.getUpload_max_filesize() * 1000000l) {
			log.info("@@ fileSize = {}, upload max filesize = {} M", (fileSize / 1000), policy.getUpload_max_filesize());
			fileInfo.setError_code("fileInfo.size.invalid");
			return fileInfo;
		}
				
		fileInfo.setFile_name(fileName);
		fileInfo.setFile_ext(extension);
		
		return fileInfo;
	}
	
	// 파일 경로
	private static String readPath(String uploadPath) {
		Calendar cal = Calendar.getInstance();
		String yearPath = String.valueOf(cal.get(Calendar.YEAR));
		String monthPath = yearPath + File.separator + new DecimalFormat("00").format(cal.get(Calendar.MONTH) + 1);
		String datePath = monthPath + File.separator + new DecimalFormat("00").format(cal.get(Calendar.DATE)); 
		
		return uploadPath + datePath;
	}
	
	// 썸네일 생성
	public static String makeThumbnail(String uploadDirectory, String thumbDirectory, int subDirectoryType, String fileName, FileInfo fileInfo) throws Exception {
		File rootDirectory = new File(thumbDirectory);
		if(!rootDirectory.exists()) {
			rootDirectory.mkdir();
		}
		
		// 현재년 sub 디렉토리 생성
		String today = DateUtil.getToday(FormatUtil.YEAR_MONTH_DAY_TIME14);
		String year = today.substring(0,4);
		String month = today.substring(4,6);
		String day = today.substring(6,8);
		String writePath = thumbDirectory;
		
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR) {
			File yearDirectory = new File(thumbDirectory + year);
			if(!yearDirectory.exists()) {
				yearDirectory.mkdir();
			}
			writePath = thumbDirectory + year + File.separator;
		}
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR_MONTH) {
			File monthDirectory = new File(thumbDirectory + year + File.separator + month);
			if(!monthDirectory.exists()) {
				monthDirectory.mkdir();
			}
			writePath = thumbDirectory + year + File.separator + month + File.separator;
		}
		if(subDirectoryType >= FileUtil.SUBDIRECTORY_YEAR_MONTH_DAY) {
			File dayDirectory = new File(thumbDirectory + year + File.separator + month + File.separator + day);
			if(!dayDirectory.exists()) {
				dayDirectory.mkdir();
			}
			writePath = thumbDirectory + year + File.separator + month + File.separator + day + File.separator;
		}
		
		// 원본 파일, 썸네일 파일 경로
		String readPpath = readPath(uploadDirectory);
		
		// 저장된 원본파일로부터 BufferedImage 객체를 생성합니다.
	    BufferedImage srcImg = ImageIO.read(new File(readPpath, fileName));
	    
		// 썸네일의 너비와 높이
	    int dw = 80, dh = 80;
	    
	    // 원본 이미지의 너비와 높이
	    int ow = srcImg.getWidth();
	    int oh = srcImg.getHeight();
	    
	    // 원본 너비를 기준으로 하여 썸네일의 비율로 높이를 계산
	    int nw = ow;
	    int nh = (ow * dh) / dw;
	    
	    // 계산된 높이가 원본보다 높다면 crop이 안되므로 원본 높이를 기준으로 썸네일의 비율로 너비를 계산
	    if(nh > oh) {
	        nw = (oh * dw) / dh;
	        nh = oh;
	    }
	  	
	    // 계산된 크기로 원본이미지를 가운데에서 crop.
	    BufferedImage cropImg = Scalr.crop(srcImg, (ow-nw)/2, (oh-nh)/2, nw, nh);

	    // crop된 이미지로 썸네일을 생성
	    BufferedImage destImg = Scalr.resize(cropImg, dw, dh);
	    
	    // 썸네일을 저장
	    String thumbName = "THUMB_" + fileName;
	    String formatName = fileName.substring(fileName.lastIndexOf(".")+1);
	   
	    ImageIO.write(destImg, formatName, new File(writePath, thumbName));
	    
	    fileInfo.setThumbnail_path(writePath);
	    fileInfo.setThumbnail_name(thumbName);
	    
	    return thumbName.replace(File.separatorChar, '/');
	}
	
	// 디렉토리에 있는 파일 삭제
	public static void deleteFile(String uploadPath, String thumbPath, String uploadName, String thumbName) {
		File uploadFolder = new File(uploadPath);
		File[] uploadFiles = uploadFolder.listFiles();
		for (File file : uploadFiles) {
		    if (file.getName().equals(uploadName)) {
		        file.delete();
		    }
		}
		
		File thumbFolder = new File(thumbPath);
		File[] thumbFiles = thumbFolder.listFiles();
		for (File file : thumbFiles) {
		    if (file.getName().equals(thumbName)) {
		        file.delete();
		    }
		}
	}
	
	
}

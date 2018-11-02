package kr.nipa.mgps.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import org.springframework.web.servlet.ModelAndView;

import kr.nipa.mgps.config.PropertiesConfig;
import kr.nipa.mgps.domain.Mapnote;
import kr.nipa.mgps.service.FileService;
import kr.nipa.mgps.service.MapnoteService;
import kr.nipa.mgps.service.PolicyService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class TestController {
	
	@Autowired
	private MapnoteService mapnoteService;
	
	@Autowired
	private PolicyService policyService;
	
	@Autowired
	PropertiesConfig propertiesConfig;
	
	@Autowired
	FileService fileService;
	
/*	
	@RequestMapping(value = "/uploadForm", method = RequestMethod.POST)
	public Map<String, Object> uploadForm(MultipartFile file) {
		Map<String, Object> map = new HashMap<>();
		
		String result = "success";
		
		try {
			log.info("originalName = {}", file.getOriginalFilename());
			log.info("size = {}", file.getSize());
			log.info("contentType = {}", file.getContentType());
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		map.put("result", result);

		return map;
	}
	
*/	
	@GetMapping("/uploadForm")
	public ModelAndView upload (HttpServletRequest request, Model model) {
		return new ModelAndView("uploadForm");
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/uploadAjax", method = RequestMethod.POST, produces = "text/plain;charset=UTF-8")
	public ResponseEntity<String> uploadAjax(MultipartFile file) throws Exception {
		
		log.info("originalName = {}", file.getOriginalFilename());
		log.info("size = {}", file.getSize());
		log.info("contentType = {}", file.getContentType());
		
		return new ResponseEntity<>(file.getOriginalFilename(), HttpStatus.CREATED);
	}
	
}

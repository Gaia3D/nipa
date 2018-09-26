package kr.nipa.mgps.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.nipa.mgps.domain.SkEmd;
import kr.nipa.mgps.domain.SkSdo;
import kr.nipa.mgps.domain.SkSgg;
import kr.nipa.mgps.service.SearchMapService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestMapping("/searchmap/")
@Controller
public class SearchMapController {
	
	@Autowired
	private SearchMapService searchMapService;
	
	/**
	 * 시도 목록
	 * @return
	 */
	@GetMapping("sdos")
	@ResponseBody
	public Map<String, Object> getListSdo() {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {

			List<SkSdo> sdoList = searchMapService.getListSdoExceptGeom();
			map.put("sdoList", sdoList);
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}

	/**
	 * 시군구 목록
	 * @param sdo_code
	 * @return
	 */
	@GetMapping("sdos/{sdo_code:[0-9]+}/sggs")
	@ResponseBody
	public Map<String, Object> getListSggBySdo(@PathVariable String sdo_code) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {
			// TODO 여기 들어 오지 않음. PathVariable 은 불칠전해서 이렇게 하고 싶음
			if(sdo_code == null || "".equals(sdo_code)) {
				map.put("result", "sdo.code.invalid");
				log.info("validate error 발생: {} ", map.toString());
				return map;
			}
			
			List<SkSgg> sggList = searchMapService.getListSggBySdoExceptGeom(sdo_code);
			map.put("sggList", sggList);
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	/**
	 * 읍면동 목록
	 * TODO PathVariable 대신 SkEmd으로 받고 싶다.
	 * @param sdo_code
	 * @param sgg_code
	 * @return
	 */
	@GetMapping("sdos/{sdo_code:[0-9]+}/sggs/{sgg_code:[0-9]+}/emds")
	@ResponseBody
	public Map<String, Object> getListEmdBySdoAndSgg(@PathVariable String sdo_code, @PathVariable String sgg_code) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {
			// TODO 여기 들어 오지 않음. PathVariable 은 불칠전해서 이렇게 하고 싶음
			if(sdo_code == null || "".equals(sdo_code)) {
				map.put("result", "sdo.code.invalid");
				log.info("validate error 발생: {} ", map.toString());
				return map;
			}
			if(sgg_code == null || "".equals(sgg_code)) {
				map.put("result", "sgg.code.invalid");
				log.info("validate error 발생: {} ", map.toString());
				return map;
			}
			
			SkEmd mapEmd = new SkEmd();
			mapEmd.setSdo_code(sdo_code);
			mapEmd.setSgg_code(sgg_code);
			
			List<SkEmd> emdList = searchMapService.getListEmdBySdoAndSggExceptGeom(mapEmd);
			map.put("emdList", emdList);
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	/**
	 * 선택 한 위치의 center point를 구함
	 * @param skEmd
	 * @return
	 */
	@GetMapping("centroids")
	@ResponseBody
	public Map<String, Object> getCentroid(SkEmd skEmd) {
		log.info("@@@@ skEmd = {}", skEmd);
		
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {
			// TODO 여기 들어 오지 않음. PathVariable 은 불칠전해서 이렇게 하고 싶음
			
			String centerPoint = null;
			if(skEmd.getLayer_type() == 1) {
				// 시도
				SkSdo skSdo = new SkSdo();
				skSdo.setName(skEmd.getName());
				skSdo.setBjcd(skEmd.getSdo_code());
				centerPoint = searchMapService.getCentroidSdo(skSdo);
				log.info("@@@@ sdo center point {}", centerPoint);
			} else if(skEmd.getLayer_type() == 2) {
				// 시군구
				SkSgg skSgg = new SkSgg();
				skSgg.setName(skEmd.getName());
				skSgg.setBjcd(skEmd.getSdo_code() + skEmd.getSgg_code());
				centerPoint = searchMapService.getCentroidSgg(skSgg);
				log.info("@@@@ sgg center point {}", centerPoint);
			} else if(skEmd.getLayer_type() == 3) {
				// 읍면동
				skEmd.setBjcd(skEmd.getEmd_code());
				centerPoint = searchMapService.getCentroidEmd(skEmd);
				log.info("@@@@ emd center point {}", centerPoint);
			}
			
			String[] location = centerPoint.substring(centerPoint.indexOf("(") + 1, centerPoint.indexOf(")")).split(" "); 
			map.put("longitude", location[0]);
			map.put("latitude", location[1]);
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
	
	/**
	 * 행정 구역 검색
	 * @param sdo_code
	 * @return
	 */
	@GetMapping("districts")
	@ResponseBody
	public Map<String, Object> getListDistrict(String search_word) {
		Map<String, Object> map = new HashMap<>();
		String result = "success";
		try {
			if(search_word == null || "".equals(search_word)) {
				map.put("result", "search.word.invalid");
				log.info("validate error 발생: {} ", map.toString());
				return map;
			}
			
			List<SkEmd> districtList = searchMapService.getListDistrict(search_word);
			map.put("districtList", districtList);
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
		}
		
		map.put("result", result);
		return map;
	}
}

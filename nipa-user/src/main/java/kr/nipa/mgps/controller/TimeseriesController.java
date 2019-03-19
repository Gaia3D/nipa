package kr.nipa.mgps.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.nipa.mgps.config.PropertiesConfig;
import kr.nipa.mgps.domain.Pagination;
import kr.nipa.mgps.domain.SatImage;
import kr.nipa.mgps.domain.SatImageSearch;
import kr.nipa.mgps.service.SatImageService;
import kr.nipa.mgps.util.DateUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/timeseries")
@CrossOrigin(origins = "*")
public class TimeseriesController {

    @Autowired
	private SatImageService satImageService;
	
	@Autowired
	PropertiesConfig propertiesConfig;

    /**
	 * 위성영상 조회
	 * @param request
	 * @param pageNo
	 * @return
	 */
    @ResponseBody
    @GetMapping(value = "/")
	public Map<String, Object> getListSatImage(HttpServletRequest request, @ModelAttribute("SatImageSearch") SatImageSearch satImageSearch) {

        String dateFormat = "yyyy-MM-dd";
        if(!DateUtil.isThisDateValid(satImageSearch.getSdate(), dateFormat))
        {
            satImageSearch.setSdate(DateUtil.getToday(dateFormat));
        }
        if(!DateUtil.isThisDateValid(satImageSearch.getEdate(), dateFormat))
        {
            satImageSearch.setEdate(DateUtil.getToday(dateFormat));
        }
        if(satImageSearch.getLongitude() == null)
        {
            satImageSearch.setLongitude(new BigDecimal("127.0016985"));    
        }
        if(satImageSearch.getLatitude() == null)
        {
            satImageSearch.setLatitude(new BigDecimal("37.5642135"));    
        }

        log.info("@@@ SatImageSearch = {}", satImageSearch);

        Map<String, Object> map = new HashMap<>();
        String result = "success";

        try {
            long totalCount = satImageService.getListSatImageTotalCount(satImageSearch);
            long pageNo = 1;
            long pageListCount = 10;
            Pagination pagination = new Pagination(request.getRequestURI(), totalCount, pageNo, pageListCount);
            log.info("@@ pagination = {}", pagination);
            
			satImageSearch.setOffset(pagination.getOffset());
			satImageSearch.setLimit(pagination.getPageRows());
			map.put("pagination", pagination);
			
			List<SatImage> satImageList = new ArrayList<>();
			// if(totalCount > 0l) {
                satImageList = satImageService.getListSatImage(satImageSearch);
				map.put("imageList", satImageList);
			// }
			
		} catch (Exception e) {
			e.printStackTrace();
			result = "db.exception";
        }
        
        map.put("result", result);
        return map;
    }

    /**
	 * 위성영상 썸네일
	 * @param id
	 * @return
	 * @throws IOException
	 */
    @ResponseBody
	@GetMapping(value="/images/{id}")
	public void showImg (HttpServletResponse response, @PathVariable("id")Long id) {

		SatImage image = new SatImage();
		image.setFid(id);
		image = satImageService.getSatImageById(image);
		
		String originallFile =  image.getThumbnail();
		String fileExt = FilenameUtils.getExtension(originallFile);
		
		response.setContentType("image/" + fileExt);

		BufferedInputStream in = null;
		BufferedOutputStream out = null;
		try {
			File file = new File(propertiesConfig.getTimeseriesDir() + File.separator + originallFile);
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
}
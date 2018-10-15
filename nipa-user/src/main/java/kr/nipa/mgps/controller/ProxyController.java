package kr.nipa.mgps.controller;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletInputStream;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ProxyController {
	@RequestMapping(value = "/proxy")
	public void makeProxy(HttpServletRequest request, HttpServletResponse response) throws Exception {

		String url = request.getQueryString();
		Boolean isPOST = "POST".equalsIgnoreCase(request.getMethod());
		if (isPOST) {
			StringBuffer params = new StringBuffer();
			Enumeration<String> enu = request.getParameterNames();
			int total = 0;
			while (enu.hasMoreElements()) {
				String paramName = (String) enu.nextElement();
				if (paramName.equals("url")) {
					url = request.getParameter(paramName);
				} else {
					if (total > 0) {
						params.append("&");
					}
					params.append(paramName).append("=")
					.append(URLEncoder.encode(request.getParameter(paramName), "utf-8"));
					++total;
				}
			}
		} else {
			url = url.substring(4);
		}

		if (url == null || url.trim().length() == 0) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		boolean doPost = request.getMethod().equalsIgnoreCase("POST");
		URL urlt = new URL(url);
		HttpURLConnection http = (HttpURLConnection) urlt.openConnection();
		Enumeration<String> headerNames = request.getHeaderNames();
		while (headerNames.hasMoreElements()) {
			String key = (String) headerNames.nextElement();
			if (!key.equalsIgnoreCase("Host")) {
				http.setRequestProperty(key, request.getHeader(key));
			}
		}

		http.setDoInput(true);
		http.setDoOutput(doPost);

		byte[] buffer = new byte[8192];
		int read = -1;

		if (doPost) {
			OutputStream os = http.getOutputStream();
			ServletInputStream sis = request.getInputStream();
			while ((read = sis.read(buffer)) != -1) {
				os.write(buffer, 0, read);
			}
			os.close();
		}

		InputStream is = http.getInputStream();
		response.setStatus(http.getResponseCode());

		Map<String, List<String>> headerKeys = http.getHeaderFields();
		Set<String> keySet = headerKeys.keySet();
		Iterator<String> iter = keySet.iterator();
		while (iter.hasNext()) {
			String key = (String) iter.next();
			String value = http.getHeaderField(key);
			if (key != null && value != null) {
				response.setHeader(key, value);
			}
		}

		ServletOutputStream sos = response.getOutputStream();
		response.resetBuffer();
		while ((read = is.read(buffer)) != -1) {
			sos.write(buffer, 0, read);
		}
		response.flushBuffer();
		sos.close();
	}
}

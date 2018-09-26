package kr.nipa.mgps.domain;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class MapnoteForm {
	@JsonIgnore
	private MultipartFile files;
}

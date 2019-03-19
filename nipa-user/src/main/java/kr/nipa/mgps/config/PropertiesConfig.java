package kr.nipa.mgps.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import lombok.Data;

@Data
@Configuration
@PropertySource("classpath:nipa.properties")
@ConfigurationProperties(prefix = "nipa")
public class PropertiesConfig {	
	private String fileUploadDir;
	
	private String thumbnailUploadDir;

	private String timeseriesDir;
}

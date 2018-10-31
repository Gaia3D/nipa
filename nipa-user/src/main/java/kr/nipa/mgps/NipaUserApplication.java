package kr.nipa.mgps;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class NipaUserApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(NipaUserApplication.class, args);
	}
}

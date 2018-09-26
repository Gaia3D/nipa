package kr.nipa.mgps.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/nipa")
public class HomeController {
	@GetMapping("/hello")
	public ModelAndView helloWorld(HttpServletRequest request, Model model) {
		return new ModelAndView("hello");
	}
	
	@GetMapping("/")
	public ModelAndView main(HttpServletRequest request, Model model) {
		return new ModelAndView("index");
	}
}

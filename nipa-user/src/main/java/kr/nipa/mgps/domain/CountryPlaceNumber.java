package kr.nipa.mgps.domain;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@ToString
@Setter
@Getter
public class CountryPlaceNumber extends SearchFilter {

	private String fullTextSearch;
}

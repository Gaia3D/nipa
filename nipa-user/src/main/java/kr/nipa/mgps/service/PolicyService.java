package kr.nipa.mgps.service;

import kr.nipa.mgps.domain.Policy;

public interface PolicyService {
	
	/**
	 * 운영 정책 정보
	 * @return
	 */
	Policy getPolicy();
	
	/**
	 * 파일 업로딩 정책 수정
	 * @param policy
	 * @return
	 */
	int updatePolicyUpload(Policy policy);
}

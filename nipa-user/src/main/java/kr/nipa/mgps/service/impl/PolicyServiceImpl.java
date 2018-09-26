package kr.nipa.mgps.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.nipa.mgps.domain.Policy;
import kr.nipa.mgps.persistence.PolicyMapper;
import kr.nipa.mgps.service.PolicyService;

@Service
public class PolicyServiceImpl implements PolicyService {

	@Autowired
	private PolicyMapper policyMapper;
	
	@Transactional(readOnly=true)
	public Policy getPolicy() {
		return policyMapper.getPolicy();
	}
	
	@Transactional
	public int updatePolicyUpload(Policy policy) {
		return policyMapper.updatePolicyUpload(policy);
	}	
	
}

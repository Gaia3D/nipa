package kr.nipa.mgps.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.nipa.mgps.domain.Mapnote;
import kr.nipa.mgps.persistence.MapnoteMapper;
import kr.nipa.mgps.service.MapnoteService;

@Service
public class MapnoteServiceImpl implements MapnoteService {
	
	@Autowired
	MapnoteMapper mapnoteMapper;
	
	
	@Override
	public List<Mapnote> getListMapnote(Mapnote mapnote) {
		return mapnoteMapper.getListMapnote(mapnote);
	}

	@Override
	public Long getMapnoteTotalCount(Mapnote mapnote) {
		return mapnoteMapper.getMapnoteTotalCount(mapnote);
	}

	@Override
	public Mapnote getMapnoteById(Long map_note_id) {
		return mapnoteMapper.getMapnoteById(map_note_id);
	}

	@Override
	public Long getMapnoteId() {
		return mapnoteMapper.getMapnoteId();
	}

	@Override
	public Mapnote insertMapnote(Mapnote mapnote) {
		mapnoteMapper.insertMapnote(mapnote);
		return mapnote;
	}

	@Override
	public int deleteMapnote(Long map_note_id) {
		return mapnoteMapper.deleteMapnote(map_note_id);
	}

	
}

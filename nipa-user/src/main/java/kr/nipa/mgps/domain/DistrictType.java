package kr.nipa.mgps.domain;

/*
 * 행정구역 타입 정의
 */
public enum DistrictType {
	SDO(1), SGG(2), EMD(3);

	private int layerType;

	DistrictType(int layerType) {
		this.layerType = layerType;
	}

	public DistrictType valueOf(int layerType) {
		DistrictType districtType = null;
		switch (layerType) {
		case 1:
			districtType = DistrictType.SDO;
			break;
		case 2:
			districtType = DistrictType.SGG;
			break;
		case 3:
			districtType = DistrictType.EMD;
			break;
		default:
			break;
		}
		return districtType;
	}
	
	public int getLayerType() {
		return this.layerType;
	}
}

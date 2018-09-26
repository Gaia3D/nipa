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
		DistrictType DistrictType = null;
		switch (layerType) {
		case 1:
			DistrictType = DistrictType.SDO;
			break;
		case 2:
			DistrictType = DistrictType.SGG;
			break;
		case 3:
			DistrictType = DistrictType.EMD;
			break;
		default:
			break;
		}
		return DistrictType;
	}
	
	public int getLayerType() {
		return this.layerType;
	}
}

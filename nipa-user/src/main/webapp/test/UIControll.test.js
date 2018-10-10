describe("jQuery Comment Plugin", function () {
  it("Should find jQuery", function () {
        expect($).not.toBeNull();
  });
});

describe('색상변환 테스트', function() {
    'use strict';

    var rgbStr = "rgb(255,0,0)"; //red color
    var rgbaStr = "rgba(255,0,0,0)"; //red color
    var rgbaStr2 = "rgba(255,0,0,1)"; //red color
    
    var hexStr = '#ff0000';

    it('rgb 문자열을 색상코드로 변환', function() {
        expect(rgbaToHex(rgbStr)).toEqual(hexStr);
    });
    
    it('rgba 문자열을 색상코드로 변환', function() {
        expect(rgbaToHex(rgbaStr)).toEqual(hexStr);
    });
    
    it('색상코드를 rgb 문자열을 로 변환(옵션 해상도값을 입력안할때 성공해야됨)', function() {
        expect(hex2rgb(hexStr)).toEqual(rgbaStr2);
    });
    
    it('색상코드를 rgb 문자열을 로 변환', function() {
        expect(hex2rgb(hexStr, 1)).toEqual(rgbaStr2);
    });
    
    it('색상코드를 rgb 문자열을 로 변환', function() {
        expect(hex2rgb(hexStr, 0)).toEqual(rgbaStr);
    });
});
 
describe("Button Click Event Tests", function() {
    'use strict';
    
    beforeEach(function() {
        $('#mapCtrlDistance').trigger( "click" );
    });
    
    it("should remove the message when button is clicked.", function() {
        expect($('#distanceLayer')).not.toBeHidden();
    });
});
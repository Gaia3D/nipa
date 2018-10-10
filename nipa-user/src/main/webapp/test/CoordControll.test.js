describe('MGRS 좌표계 테스트', function() {
    'use strict';

    var mgrsStr = "24XWT783908"; // near UTM zone border, so there are two ways to reference this
    //var point = proj4.mgrs.toPoint(mgrsStr);
    var point = proj4.Point.fromMGRS(mgrsStr);

    it('Longitude of point from MGRS correct.', function() {
        expect(point.x).toBeCloseTo(-32.66433, 5);
    });

    it('Latitude of point from MGRS correct.', function() {
        expect(point.y).toBeCloseTo(83.62778, 5);
    });

    it('MGRS reference with 1-digit accuracy correct.', function() {
        expect(point.toMGRS(3)).toEqual('25XEN041865');
    });

    it('MGRS reference with 5-digit accuracy, northing all zeros', function(){
        expect(proj4.mgrs.forward([0, 0], 5)).toEqual('31NAA6602100000');
    });

    it('MGRS reference with 5-digit accuracy, northing one digit', function(){
        expect(proj4.mgrs.forward([0,0.00001],5)).toEqual('31NAA6602100001');
    });
});

describe('UTM 좌표계 테스트', function() {
    'use strict';
    // 52N 338192E 4208787N
    var point = proj4.toPoint([127.156797, 38.012334]);

    // Compute the UTM zone.
    var zone = Math.floor ((point.x + 180.0) / 6) + 1;
    var hemisphere = (point.y < 0) ? "S" : "N";

    if ((zone < 1) || (60 < zone)) {
        alert ("The UTM zone you entered is out of range.  " +
               "Please enter a number in the range [1, 60].");
        return false;
    }

    var utm = "+proj=utm +zone="+zone;
    var wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";

    it('WGS84 좌표계를 UTM 좌표계로 변환 후 값 확인', function(){
        var pt = proj4(wgs84, utm, point);
        expect(pt.x.toFixed(0)).toEqual('338192');
        expect(pt.y.toFixed(0)).toEqual('4208787');
    });
});

describe('좌표계 변환 테스트 1', function() {
    'use strict';

    var point = proj4.toPoint([127.97973632812499, 35.73759515174781]);

    it('DD 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDD);
        expect(result).toEqual("127.979736°,35.737595°");
    });

    it('DM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDM);
        expect(result).toEqual("127°58.784',35°44.256'");
    });

    it('DMS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDMS);
        expect(result).toEqual("127°58'47.05'',35°44'15.34''");
    });

    it('MGRS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterMGRS);
        expect(result).toEqual("52SDE0774155324");
    });

    it('UTM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterUTM);
        expect(result).toEqual("52N 407741mE 3955324mN");
    });
});

describe('좌표계 변환 테스트 2', function() {
    'use strict';

    var point = proj4.toPoint([127.1567970, 38.0123340]);

    it('DD 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDD);
        expect(result).toEqual("127.156797°,38.012334°");
    });

    it('DM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDM);
        expect(result).toEqual("127°09.408',38°00.740'");
    });

    it('DMS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDMS);
        expect(result).toEqual("127°09'24.47'',38°00'44.40''");
    });

    it('MGRS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterMGRS);
        expect(result).toEqual("52SCH3819208787");
    });

    it('UTM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterUTM);
        expect(result).toEqual("52N 338192mE 4208787mN");
    });
});

describe('좌표계 변환 테스트 3', function() {
    'use strict';

    var point = proj4.toPoint([-159.013954, -10.660258]);

    it('DD 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDD);
        expect(result).toEqual("-159.013954°,-10.660258°");
    });

    it('DM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDM);
        expect(result).toEqual("-159°00.837',-10°39.615'");
    });

    it('DMS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterDMS);
        expect(result).toEqual("-159°00'50.23'',-10°39'36.93''");
    });

    it('MGRS 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterMGRS);
        expect(result).toEqual("4LDP9847421586");
    });

    it('UTM 값 표시', function() {
        var result = getposition(point.x, point.y, positionFormatterUTM);
        expect(result).toEqual("04S 498474mE 8821586mN");
    });
});
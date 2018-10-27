function CoordControll(viewer, option) {
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  this._position;
  this._longitude;
  this._latitude;
  this._coordPoint;

  var that = this;
  var handler = null;

  // 좌표 이동
  $('#moveToLocation').click(function () {
    if (that._longitude && that._latitude)
      gotoFly('3ds.json', '133', 'ISSUE_TYPE_MODIFY', that._longitude, that._latitude, '100', '2');
  });

  // 좌표 복사
  $('#coordinateCopy').click(function () {
    var copyText = "DD : " + $('#DD').val() + "\n"
      + "DM : " + $('#DM').val() + "\n"
      + "DMS : " + $('#DMS').val() + "\n"
      + "MGRS : " + $('#MGRS').val() + "\n"
      + "UTM : " + $('#UTM').val() + "\n";

    coordinateCopy(copyText);
  });

  // 지점등록
  $('#addMapnote').click(function () {
	  if(that._longitude != undefined && that._longitude !== null && that._latitude != undefined && that._latitude !==null) {
		  $('#noteLocation').val(that._longitude + ", " +  that._latitude);
	  } else {
		  $('#noteLocation').val('');
	  }
  });

  // 좌표 초기화
  $('#textReset').click(function () {
    clearCoordinate();
  });

  this.clear = function () {
    if (Cesium.defined(handler)) {
      handler.destroy();
      handler = null;
    }
    viewer.entities.remove(this._coordPoint);
    this._coordPoint = null;
  }

  function clearCoordinate() {
    this._position = null;
    this._longitude = null;
    this._latitude = null;

    this.clear();
    /*
    $('.coordinateBtns > button.on').each(function () {
      $(this).trigger('afterClick');
    })
    */  
    $('#DD').val("");
    $('#DM').val("");
    $('#DMS').val("");
    $('#MGRS').val("");
    $('#UTM').val("");
  }

  function updateCoordinate() {
    var lon = that._longitude;
    var lat = that._latitude;

    //console.log(lon + "," + lat);

    $('#DD').val(getposition(lon, lat, positionFormatterDD));
    $('#DM').val(getposition(lon, lat, positionFormatterDM));
    $('#DMS').val(getposition(lon, lat, positionFormatterDMS));
    $('#MGRS').val(getposition(lon, lat, positionFormatterMGRS));
    $('#UTM').val(getposition(lon, lat, positionFormatterUTM));
  }

  // 화면중심 좌표독취
  $('#getScreen').bind('afterClick', function () {
    that.clear();
    if ($(this).hasClass('on')) {
      var dynamicPositions = new Cesium.CallbackProperty(function () {
        return that._position;
      }, false);
      that._coordPoint = createPoint(dynamicPositions);
      viewer.scene.postRender.addEventListener(getScreenPosition);
    }
    else {
      viewer.scene.postRender.removeEventListener(getScreenPosition);
    }
  });

  // 포인트 좌표독취
  $('#getPoint').bind('afterClick', function () {
    that.clear();
    if ($(this).hasClass('on')) {
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      var dynamicPositions = new Cesium.CallbackProperty(function () {
        return that._position;
      }, false);
      that._coordPoint = createPoint(dynamicPositions);
      handler.setInputAction(function (event) {
        var earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);

          that._longitude = Cesium.Math.toDegrees(cartographic.longitude);
          that._latitude = Cesium.Math.toDegrees(cartographic.latitude);
          that._position = Cesium.Cartesian3.fromDegrees(that._longitude, that._latitude);
        }
        updateCoordinate();
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
  });

  var rectEntity = null;
  var rectangle = null;
  var rectPositions = [];
  // 지정영역 중심 좌표독취
  $('#getSquare').bind('afterClick', function () {
    that.clear();

    if ($(this).hasClass('on')) {
      handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      var dynamicPositions = new Cesium.CallbackProperty(function () {
        return that._position;
      }, false);

      rectangle = new Cesium.Rectangle();
      var dynamicRectPositions = new Cesium.CallbackProperty(function () {
        return rectangle;
      }, false);

      that._coordPoint = createPoint(dynamicPositions);
      rectEntity = createRectangle(dynamicRectPositions);

      handler.setInputAction(function (event) {
        if (rectPositions[0] !== undefined) return;

        var earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
          var tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));

          rectPositions[0] = tempPosition;
          rectPositions[1] = tempPosition;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      handler.setInputAction(function (event) {
        if (rectPositions[0] === undefined) return;

        var earthPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(earthPosition)) {
          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
          var tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));

          rectPositions[1] = tempPosition;

          var src = Cesium.Cartographic.fromCartesian(rectPositions[0]);
          var dst = Cesium.Cartographic.fromCartesian(rectPositions[1]);

          rectangle.east = Math.max(src.longitude, dst.longitude);
          rectangle.west = Math.min(src.longitude, dst.longitude);
          rectangle.north = Math.max(src.latitude, dst.latitude);
          rectangle.south = Math.min(src.latitude, dst.latitude);

          var center = Cesium.Rectangle.center(rectangle);
          that._longitude = Cesium.Math.toDegrees(center.longitude);
          that._latitude = Cesium.Math.toDegrees(center.latitude);
          that._position = Cesium.Cartesian3.fromDegrees(that._longitude, that._latitude);

          updateCoordinate();
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      handler.setInputAction(function (event) {
        if (rectPositions[0] === undefined) return;

        var earthPosition = viewer.scene.pickPosition(event.position);
        if (Cesium.defined(earthPosition)) {
          var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
          var tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));

          rectPositions[1] = tempPosition;

          var src = Cesium.Cartographic.fromCartesian(rectPositions[0]);
          var dst = Cesium.Cartographic.fromCartesian(rectPositions[1]);

          rectangle.east = Math.max(src.longitude, dst.longitude);
          rectangle.west = Math.min(src.longitude, dst.longitude);
          rectangle.north = Math.max(src.latitude, dst.latitude);
          rectangle.south = Math.min(src.latitude, dst.latitude);

          var center = Cesium.Rectangle.center(rectangle);
          that._longitude = Cesium.Math.toDegrees(center.longitude);
          that._latitude = Cesium.Math.toDegrees(center.latitude);
          that._position = Cesium.Cartesian3.fromDegrees(that._longitude, that._latitude);

          rectPositions.length = 0;

          updateCoordinate();
        }
      }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    else {
      viewer.entities.remove(rectEntity);
      rectEntity = null;
      rectangle = null;
    }
  });

  // 좌표독취 클릭
  $('#insertCoordinate').click(function () {
    if (that._position != null) {
      var data = {
        coordinateDD: $('#DD').val(),
        coordinateDM: $('#DM').val(),
        coordinateDMS: $('#DMS').val(),
        coordinateMGRS: $('#MGRS').val(),
        coordinateUTM: $('#UTM').val()
      };
      var content = $(Handlebars.templates.coordinate(data));
      var lon = that._longitude;
      var lat = that._latitude;

      var copyText = "DD : " + $('#DD').val() + "\n"
        + "DM : " + $('#DM').val() + "\n"
        + "DMS : " + $('#DMS').val() + "\n"
        + "MGRS : " + $('#MGRS').val() + "\n"
        + "UTM : " + $('#UTM').val() + "\n";

      content.find('.move').click(function () {
        gotoFly('3ds.json', '133', 'ISSUE_TYPE_MODIFY', lon, lat, '100', '2');
      });
      content.find('.copy').click(function () {
        coordinateCopy(copyText);
      });
      content.find('.note').click(function () {

      });
      content.find('.delete').click(function (e) {
        e.preventDefault();
        $(this).parent().parent().remove();
      });

      $('.coordinateWrap').prepend(content);
    }
  });

  function createPoint(worldPosition) {
    var entity = viewer.entities.add({
      position: worldPosition,
      point: {
        color: Cesium.Color.YELLOW,
        pixelSize: 5,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
      }
    });
    return entity;
  }

  function createRectangle(worldPosition) {
    var entity = viewer.entities.add({
      rectangle: {
        coordinates: worldPosition,
        material: Cesium.Color.YELLOW.withAlpha(0.5)
      }
    });
    return entity;
  }

  function getScreenPosition() {
    var windowPosition = new Cesium.Cartesian2(viewer.container.clientWidth / 2, viewer.container.clientHeight / 2);
    var pickRay = viewer.scene.camera.getPickRay(windowPosition);
    var pickPosition = viewer.scene.globe.pick(pickRay, viewer.scene);

    if (Cesium.defined(pickPosition)) {
      var cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(pickPosition);
      this._position = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));
      this._longitude = Cesium.Math.toDegrees(cartographic.longitude);
      this._latitude = Cesium.Math.toDegrees(cartographic.latitude);
    }
    updateCoordinate();
  }
}

/**
* Converts a set of Longitude and Latitude co-ordinates to UTM
* using the WGS84 ellipsoid.
*
* @private
* @param {object} ll Object literal with lat and lon properties
*     representing the WGS84 coordinate to be converted.
* @return {object} Object literal containing the UTM value with easting,
*     northing, zoneNumber and zoneLetter properties, and an optional
*     accuracy property in digits. Returns null if the conversion failed.
*/
function LLtoUTM(ll) {
  var Lat = ll.lat;
  var Long = ll.lon;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var k0 = 0.9996;
  var LongOrigin;
  var eccPrimeSquared;
  var N, T, C, A, M;
  var LatRad = degToRad(Lat);
  var LongRad = degToRad(Long);
  var LongOriginRad;
  var ZoneNumber;
  // (int)
  ZoneNumber = Math.floor((Long + 180) / 6) + 1;

  //Make sure the longitude 180.00 is in Zone 60
  if (Long === 180) {
    ZoneNumber = 60;
  }

  // Special zone for Norway
  if (Lat >= 56.0 && Lat < 64.0 && Long >= 3.0 && Long < 12.0) {
    ZoneNumber = 32;
  }

  // Special zones for Svalbard
  if (Lat >= 72.0 && Lat < 84.0) {
    if (Long >= 0.0 && Long < 9.0) {
      ZoneNumber = 31;
    }
    else if (Long >= 9.0 && Long < 21.0) {
      ZoneNumber = 33;
    }
    else if (Long >= 21.0 && Long < 33.0) {
      ZoneNumber = 35;
    }
    else if (Long >= 33.0 && Long < 42.0) {
      ZoneNumber = 37;
    }
  }

  LongOrigin = (ZoneNumber - 1) * 6 - 180 + 3; //+3 puts origin
  // in middle of
  // zone
  LongOriginRad = degToRad(LongOrigin);

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  N = a / Math.sqrt(1 - eccSquared * Math.sin(LatRad) * Math.sin(LatRad));
  T = Math.tan(LatRad) * Math.tan(LatRad);
  C = eccPrimeSquared * Math.cos(LatRad) * Math.cos(LatRad);
  A = Math.cos(LatRad) * (LongRad - LongOriginRad);

  M = a * ((1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256) * LatRad - (3 * eccSquared / 8 + 3 * eccSquared * eccSquared / 32 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(2 * LatRad) + (15 * eccSquared * eccSquared / 256 + 45 * eccSquared * eccSquared * eccSquared / 1024) * Math.sin(4 * LatRad) - (35 * eccSquared * eccSquared * eccSquared / 3072) * Math.sin(6 * LatRad));

  var UTMEasting = (k0 * N * (A + (1 - T + C) * A * A * A / 6.0 + (5 - 18 * T + T * T + 72 * C - 58 * eccPrimeSquared) * A * A * A * A * A / 120.0) + 500000.0);

  var UTMNorthing = (k0 * (M + N * Math.tan(LatRad) * (A * A / 2 + (5 - T + 9 * C + 4 * C * C) * A * A * A * A / 24.0 + (61 - 58 * T + T * T + 600 * C - 330 * eccPrimeSquared) * A * A * A * A * A * A / 720.0)));
  if (Lat < 0.0) {
    UTMNorthing += 10000000.0; //10000000 meter offset for
    // southern hemisphere
  }

  return {
    northing: Math.round(UTMNorthing),
    easting: Math.round(UTMEasting),
    zoneNumber: ZoneNumber,
    zoneLetter: getLetterDesignator(Lat)
  };
}

/**
* Converts UTM coords to lat/long, using the WGS84 ellipsoid. This is a convenience
* class where the Zone can be specified as a single string eg."60N" which
* is then broken down into the ZoneNumber and ZoneLetter.
*
* @private
* @param {object} utm An object literal with northing, easting, zoneNumber
*     and zoneLetter properties. If an optional accuracy property is
*     provided (in meters), a bounding box will be returned instead of
*     latitude and longitude.
* @return {object} An object literal containing either lat and lon values
*     (if no accuracy was provided), or top, right, bottom and left values
*     for the bounding box calculated according to the provided accuracy.
*     Returns null if the conversion failed.
*/
function UTMtoLL(utm) {

  var UTMNorthing = utm.northing;
  var UTMEasting = utm.easting;
  var zoneLetter = utm.zoneLetter;
  var zoneNumber = utm.zoneNumber;
  // check the ZoneNummber is valid
  if (zoneNumber < 0 || zoneNumber > 60) {
    return null;
  }

  var k0 = 0.9996;
  var a = 6378137.0; //ellip.radius;
  var eccSquared = 0.00669438; //ellip.eccsq;
  var eccPrimeSquared;
  var e1 = (1 - Math.sqrt(1 - eccSquared)) / (1 + Math.sqrt(1 - eccSquared));
  var N1, T1, C1, R1, D, M;
  var LongOrigin;
  var mu, phi1Rad;

  // remove 500,000 meter offset for longitude
  var x = UTMEasting - 500000.0;
  var y = UTMNorthing;

  // We must know somehow if we are in the Northern or Southern
  // hemisphere, this is the only time we use the letter So even
  // if the Zone letter isn't exactly correct it should indicate
  // the hemisphere correctly
  if (zoneLetter < 'N') {
    y -= 10000000.0; // remove 10,000,000 meter offset used
    // for southern hemisphere
  }

  // There are 60 zones with zone 1 being at West -180 to -174
  LongOrigin = (zoneNumber - 1) * 6 - 180 + 3; // +3 puts origin
  // in middle of
  // zone

  eccPrimeSquared = (eccSquared) / (1 - eccSquared);

  M = y / k0;
  mu = M / (a * (1 - eccSquared / 4 - 3 * eccSquared * eccSquared / 64 - 5 * eccSquared * eccSquared * eccSquared / 256));

  phi1Rad = mu + (3 * e1 / 2 - 27 * e1 * e1 * e1 / 32) * Math.sin(2 * mu) + (21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32) * Math.sin(4 * mu) + (151 * e1 * e1 * e1 / 96) * Math.sin(6 * mu);
  // double phi1 = ProjMath.radToDeg(phi1Rad);

  N1 = a / Math.sqrt(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad));
  T1 = Math.tan(phi1Rad) * Math.tan(phi1Rad);
  C1 = eccPrimeSquared * Math.cos(phi1Rad) * Math.cos(phi1Rad);
  R1 = a * (1 - eccSquared) / Math.pow(1 - eccSquared * Math.sin(phi1Rad) * Math.sin(phi1Rad), 1.5);
  D = x / (N1 * k0);

  var lat = phi1Rad - (N1 * Math.tan(phi1Rad) / R1) * (D * D / 2 - (5 + 3 * T1 + 10 * C1 - 4 * C1 * C1 - 9 * eccPrimeSquared) * D * D * D * D / 24 + (61 + 90 * T1 + 298 * C1 + 45 * T1 * T1 - 252 * eccPrimeSquared - 3 * C1 * C1) * D * D * D * D * D * D / 720);
  lat = radToDeg(lat);

  var lon = (D - (1 + 2 * T1 + C1) * D * D * D / 6 + (5 - 2 * C1 + 28 * T1 - 3 * C1 * C1 + 8 * eccPrimeSquared + 24 * T1 * T1) * D * D * D * D * D / 120) / Math.cos(phi1Rad);
  lon = LongOrigin + radToDeg(lon);

  var result;
  if (utm.accuracy) {
    var topRight = UTMtoLL({
      northing: utm.northing + utm.accuracy,
      easting: utm.easting + utm.accuracy,
      zoneLetter: utm.zoneLetter,
      zoneNumber: utm.zoneNumber
    });
    result = {
      top: topRight.lat,
      right: topRight.lon,
      bottom: lat,
      left: lon
    };
  }
  else {
    result = {
      lat: lat,
      lon: lon
    };
  }
  return result;
}

/**
* Calculates the MGRS letter designator for the given latitude.
*
* @private
* @param {number} lat The latitude in WGS84 to get the letter designator
*     for.
* @return {char} The letter designator.
*/
function getLetterDesignator(lat) {
  //This is here as an error flag to show that the Latitude is
  //outside MGRS limits
  var LetterDesignator = 'Z';

  if ((84 >= lat) && (lat >= 72)) {
    LetterDesignator = 'X';
  }
  else if ((72 > lat) && (lat >= 64)) {
    LetterDesignator = 'W';
  }
  else if ((64 > lat) && (lat >= 56)) {
    LetterDesignator = 'V';
  }
  else if ((56 > lat) && (lat >= 48)) {
    LetterDesignator = 'U';
  }
  else if ((48 > lat) && (lat >= 40)) {
    LetterDesignator = 'T';
  }
  else if ((40 > lat) && (lat >= 32)) {
    LetterDesignator = 'S';
  }
  else if ((32 > lat) && (lat >= 24)) {
    LetterDesignator = 'R';
  }
  else if ((24 > lat) && (lat >= 16)) {
    LetterDesignator = 'Q';
  }
  else if ((16 > lat) && (lat >= 8)) {
    LetterDesignator = 'P';
  }
  else if ((8 > lat) && (lat >= 0)) {
    LetterDesignator = 'N';
  }
  else if ((0 > lat) && (lat >= -8)) {
    LetterDesignator = 'M';
  }
  else if ((-8 > lat) && (lat >= -16)) {
    LetterDesignator = 'L';
  }
  else if ((-16 > lat) && (lat >= -24)) {
    LetterDesignator = 'K';
  }
  else if ((-24 > lat) && (lat >= -32)) {
    LetterDesignator = 'J';
  }
  else if ((-32 > lat) && (lat >= -40)) {
    LetterDesignator = 'H';
  }
  else if ((-40 > lat) && (lat >= -48)) {
    LetterDesignator = 'G';
  }
  else if ((-48 > lat) && (lat >= -56)) {
    LetterDesignator = 'F';
  }
  else if ((-56 > lat) && (lat >= -64)) {
    LetterDesignator = 'E';
  }
  else if ((-64 > lat) && (lat >= -72)) {
    LetterDesignator = 'D';
  }
  else if ((-72 > lat) && (lat >= -80)) {
    LetterDesignator = 'C';
  }
  return LetterDesignator;
}

/**
* Conversion from degrees to radians.
*
* @private
* @param {number} deg the angle in degrees.
* @return {number} the angle in radians.
*/
function degToRad(deg) {
  return (deg * (Math.PI / 180.0));
}

/**
* Conversion from radians to degrees.
*
* @private
* @param {number} rad the angle in radians.
* @return {number} the angle in degrees.
*/
function radToDeg(rad) {
  return (180.0 * (rad / Math.PI));
}

function parseDMS(dmsString) {
  dmsString = dmsString.trim();

  // See https://regex101.com/r/JAw9dx/1
  var dmsRe = /([NSEW])?(-)?(\d+(?:\.\d+)?)[°º:d\s]?\s?(?:(\d+(?:\.\d+)?)['’‘′:]\s?(?:(\d{1,2}(?:\.\d+)?)(?:"|″|’’|'')?)?)?\s?([NSEW])?/i;

  var result = {};

  var m1, m2, decDeg1, decDeg2, dmsString2;

  m1 = dmsString.match(dmsRe);

  if (!m1) throw 'Could not parse string';

  // If dmsString starts with a hemisphere letter, then the regex can also capture the 
  // hemisphere letter for the second coordinate pair if also in the string
  if (m1[1]) {
    m1[6] = undefined;
    dmsString2 = dmsString.substr(m1[0].length - 1).trim();
  } else {
    dmsString2 = dmsString.substr(m1[0].length).trim();
  }

  decDeg1 = decDegFromMatch(m1);

  m2 = dmsString2.match(dmsRe);

  decDeg2 = m2 ? decDegFromMatch(m2) : {};

  if (typeof decDeg1.latLon === 'undefined') {
    if (!isNaN(decDeg1.decDeg) && isNaN(decDeg2.decDeg)) {
      // If we only have one coordinate but we have no hemisphere value,
      // just return the decDeg number
      return decDeg1.decDeg;
    } else if (!isNaN(decDeg1.decDeg) && !isNaN(decDeg2.decDeg)) {
      // If no hemisphere letter but we have two coordinates,
      // infer that the first is lat, the second lon
      decDeg1.latLon = 'lat';
      decDeg2.latLon = 'lon';
    } else {
      throw 'Could not parse string';
    }
  }

  // If we parsed the first coordinate as lat or lon, then assume the second is the other
  if (typeof decDeg2.latLon === 'undefined') {
    decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
  }

  result[decDeg1.latLon] = decDeg1.decDeg;
  result[decDeg2.latLon] = decDeg2.decDeg;

  return result;

};

function decDegFromMatch(m) {
  var signIndex = {
    "-": -1,
    "N": 1,
    "S": -1,
    "E": 1,
    "W": -1
  };

  var latLonIndex = {
    "N": "lat",
    "S": "lat",
    "E": "lon",
    "W": "lon"
  };
  var degrees, minutes, seconds, sign, latLon;

  sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
  degrees = Number(m[3]);
  minutes = m[4] ? Number(m[4]) : 0;
  seconds = m[5] ? Number(m[5]) : 0;
  latLon = latLonIndex[m[1]] || latLonIndex[m[6]];

  if (!inRange(degrees, 0, 180)) throw 'Degrees out of range';
  if (!inRange(minutes, 0, 60)) throw 'Minutes out of range';
  if (!inRange(seconds, 0, 60)) throw 'Seconds out of range';

  return {
    decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
    latLon: latLon
  };
}

function inRange(value, a, b) {
  return value >= a && value <= b;
}
// Decimal degrees 'DD' (DDD.DDDDD°)
function positionFormatterDD(pos) {
  var lon = pos.position[0];
  var lat = pos.position[1];
  var lon_neg = pos.negative[0];
  var lat_neg = pos.negative[1];
  var designator = pos.designator;

  lon = format('#0.000000', lon) + '°';
  lat = format('##0.000000', lat) + '°';

  return (!designator && lon_neg ? '-' : '') + lon + (designator ? (lon_neg ? ' W' : ' E') : '') + "," +
    (!designator && lat_neg ? '-' : '') + lat + (designator ? (lat_neg ? ' S' : ' N') : '')
}

// Degrees and decimal minutes 'DM' (DDD° MM.MMM')
function positionFormatterDM(pos) {
  var lon = pos.position[0];
  var lat = pos.position[1];
  var lon_neg = pos.negative[0];
  var lat_neg = pos.negative[1];
  var designator = pos.designator;

  deg = parseInt(lon);
  lon = deg + '°' + format('00.000', (lon - deg) * 60) + "'";
  deg = parseInt(lat);
  lat = deg + '°' + format('00.000', (lat - deg) * 60) + "'";

  return (!designator && lon_neg ? '-' : '') + lon + (designator ? (lon_neg ? ' W' : ' E') : '') + "," +
    (!designator && lat_neg ? '-' : '') + lat + (designator ? (lat_neg ? ' S' : ' N') : '')
}

// Degrees, minutes and seconds 'DMS' (DDD° MM' SS.S")
function positionFormatterDMS(pos) {
  var lon = pos.position[0];
  var lat = pos.position[1];
  var lon_neg = pos.negative[0];
  var lat_neg = pos.negative[1];
  var designator = pos.designator;

  deg = parseInt(lon);
  min = (lon - deg) * 60;
  lon = deg + '°' + format('00', parseInt(min)) + "'" + format('00.00', (min - parseInt(min)) * 60) + "''";
  deg = parseInt(lat);
  min = (lat - deg) * 60;
  lat = deg + '°' + format('00', parseInt(min)) + "'" + format('00.00', (min - parseInt(min)) * 60) + "''";

  return (!designator && lon_neg ? '-' : '') + lon + (designator ? (lon_neg ? ' W' : ' E') : '') + "," +
    (!designator && lat_neg ? '-' : '') + lat + (designator ? (lat_neg ? ' S' : ' N') : '')
}

function positionFormatterMGRS(pos) {
  var lon = Number((pos.negative[0] ? "-" : "") + pos.position[0]);
  var lat = Number((pos.negative[1] ? "-" : "") + pos.position[1]);

  // 5-digit accuracy
  return proj4.mgrs.forward([lon, lat], 5);
}

function positionFormatterUTM(pos) {
  var lon = Number((pos.negative[0] ? "-" : "") + pos.position[0]);
  var lat = Number((pos.negative[1] ? "-" : "") + pos.position[1]);

  var digits = Number(digits || 0); // default 0 if not supplied
  var utm = LLtoUTM({ lon: lon, lat: lat });
  var z = utm.zoneNumber < 10 ? '0' + utm.zoneNumber : utm.zoneNumber; // leading zero
  var h = pos.negative[1] ? "S" : "N";
  var e = utm.easting;
  var n = utm.northing;

  if (isNaN(z) || !h.match(/[NS]/) || isNaN(e) || isNaN(n)) return '';

  return z + h + ' ' + e.toFixed(digits) + 'mE ' + n.toFixed(digits) + 'mN';
}

function getposition(_lon, _lat, _formatter) {
  var lon = _lon;
  var lat = _lat;
  var formatter = _formatter;
  var lon_neg = false;
  var lat_neg = false;
  // designator	Boolean	false	Show N-S and E-W
  var designator = false;

  if (formatter == undefined) formatter = positionFormatterDD;

  // 180 degrees & negative
  if (lon < 0) {
    lon_neg = true;
    lon = Math.abs(lon);
  }
  if (lat < 0) {
    lat_neg = true;
    lat = Math.abs(lat);
  }
  if (lon > 180) {
    lon = 360 - lon;
    lon_neg = !lon_neg;
  }

  var coord = {
    position: [lon, lat],
    negative: [lon_neg, lat_neg],
    designator: designator
  };

  return formatter(coord);
}

function coordinateCopy(copyText) {
  var temp = $("<textarea>");
  $('body').append(temp);
  temp.val(copyText).select();
  document.execCommand("copy");
  temp.remove();
}
function AnalysisControll(viewer) {
var drawHelper = new DrawHelper(viewer);

//const WPS_URL = 'http://mango.iptime.org:28985/geoserver1/wps';
//const WMS_URL = 'http://mango.iptime.org:28985/geoserver1/wms';
//const WFS_URL = 'http://mango.iptime.org:28985/geoserver1/wfs';

const WPS_URL = 'http://localhost:8585/geoserver1/wps';
const WMS_URL = 'http://localhost:8585/geoserver1/wms';
const WFS_URL = 'http://localhost:8585/geoserver1/wfs';

const layerDem = 'mnd:dem_4326';
// const layerSlope = 'foss:seoul_slope30';
const layerRoute = 'mnd:pgr_fromAtoB';
const layerRouteLink = 'link';
const layerRouteNode = 'node';

const sourceProjection = 'EPSG:3857';
const targetProjection = 'EPSG:4326';

const layerRadialLineOfSightId 	 = 'rlos';
const layerLinearLineOfSightId 	 = 'llos';
const layerRasterProfileId 		 = 'rp';
const layerRasterHighLowPointsId = 'rhlp';
const layerFromAtoBId = 'fab';

const layerDrawStrId = 'drawStr';
const layerDrawEndId = 'drawEnd';

var isDrawFeature = {
	isDraw: false,
	type: '',
	target: ''
}

// 가시권 분석 - 관측지점 위치선택 콜백
$('#analysisRadialLineOfSight .drawObserverPoint').click(function(e) {
	drawHelper.startDrawingMarker({
		callback: function (position) {
			var coordsLonLat = positionToLonLat(position);
			var json = makePointTypeJson(coordsLonLat);

			$('#analysisRadialLineOfSight .observerPointMGRS').val(
				getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
			);

			removeAnalysisDataSource(layerDrawStrId);
			removeAnalysisDataSource(layerDrawEndId);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('point', ds, layerDrawStrId);
			});

			// json.geometry.coordinates = proj4(targetProjection, sourceProjection, json.geometry.coordinates);
			$('#analysisRadialLineOfSight .observerPoint').val(wellknown.stringify(json));
		}
	});
});

// 가시권 분석 - 분석실행
$('#analysisRadialLineOfSight .execute').click(function(e) {
	var inputCoverage = layerDem;
	var observerOffset = $('#analysisRadialLineOfSight .observerOffset').val();
	var radius = $('#analysisRadialLineOfSight .radius').val();
	var sides = $('#analysisRadialLineOfSight .sides').val();
	var observerPoint = $("#analysisRadialLineOfSight .observerPoint").val();

	if (observerPoint == "") {
		alert("관측지점을 선택하세요!");
		return;
	}

	var extent = getViewExtentLonLat();

	var xml = requestBodyRadialLineOfSight(inputCoverage, observerPoint, observerOffset, radius, sides, extent);

	var resource = requestPostResource(xml);
	resource.then(function (res) {
		var promise = Cesium.GeoJsonDataSource.load(JSON.parse(res));
		promise.then(function (ds) {

			ds.id = layerRadialLineOfSightId;
			ds.type = 'analysis';
			viewer.dataSources.add(ds);

			var entities = ds.entities.values;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				entity.polyline.material = Cesium.Color.fromCssColorString('rgb(255, 0, 0, .8)');
				entity.polyline.width = 1.5;
				entity.polyline.clampToGround = true;
				if (entity.properties.Visible == 1) {
					entity.polyline.material = Cesium.Color.fromCssColorString('rgb(0, 255, 0, .8)');
				}
			}

			// viewer.flyTo(entities);
		});
	}).otherwise(function (error) {
		window.alert(error);
	});
});

// 가시권 분석 - 초기화
$('#analysisRadialLineOfSight .reset').click(function(e) {
	removeAnalysisDataSource(layerDrawStrId);
	removeAnalysisDataSource(layerDrawEndId);
	removeAnalysisDataSource(layerRadialLineOfSightId);
});


// 가시선 분석 - 관측지점 선택 콜백
$('#analysisLinearLineOfSight .drawObserverPoint').click(function(e){
	drawHelper.startDrawingMarker({
		callback: function (position) {

			var coordsLonLat = positionToLonLat(position);
			var json = makePointTypeJson(coordsLonLat);

			$('#analysisLinearLineOfSight .observerPointMGRS').val(
				getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
			);

			removeAnalysisDataSource(layerDrawStrId);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('point', ds, layerDrawStrId);
			});

			// json.geometry.coordinates = proj4(targetProjection, sourceProjection, json.geometry.coordinates);
			$('#analysisLinearLineOfSight .observerPoint').val(wellknown.stringify(json));
		}
	});
});

// 가시선 분석 - 대상지점 선택 콜백
$('#analysisLinearLineOfSight .drawTargetPoint').click(function(e){
	drawHelper.startDrawingMarker({
		callback: function (position) {

			var coordsLonLat = positionToLonLat(position);
			var json = makePointTypeJson(coordsLonLat);

			$('#analysisLinearLineOfSight .targetPointMGRS').val(
				getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
			);

			removeAnalysisDataSource(layerDrawEndId);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('point', ds, layerDrawStrId);
			});

			// json.geometry.coordinates = proj4(targetProjection, sourceProjection, json.geometry.coordinates);
			$('#analysisLinearLineOfSight .targetPoint').val(wellknown.stringify(json));
		}
	});
});

// 가시선 분석 - 실행
$('#analysisLinearLineOfSight .execute').click(function(e) {
	var inputCoverage = layerDem;
	var observerOffset = $('#analysisLinearLineOfSight .observerOffset').val();
	var observerPoint = $('#analysisLinearLineOfSight .observerPoint').val();
	var targetPoint = $('#analysisLinearLineOfSight .targetPoint').val();

	if (observerPoint == "") {
		alert("관측지점을 선택하세요!");
		return;
	}

	if (targetPoint == "") {
		alert("대상지점을 선택하세요!");
		return;
	}

	var extent = getViewExtentLonLat();

	var xml = requestBodyLinearLineOfSight(inputCoverage, observerOffset, observerPoint, targetPoint, extent);

	var resource = requestPostResource(xml);
	resource.then(function (res) {
		var promise = Cesium.GeoJsonDataSource.load(JSON.parse(res));
		promise.then(function (ds) {
			ds.id = layerLinearLineOfSightId;
			ds.type = 'analysis';
			viewer.dataSources.add(ds);

			var entities = ds.entities.values;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				entity.polyline.material = Cesium.Color.fromCssColorString('rgb(255, 0, 0)');
				if (entity.properties.Visible == 1) {
					entity.polyline.material = Cesium.Color.fromCssColorString('rgb(0, 255, 0)');
					entity.polyline.width = 3;
				}
			}
			// viewer.flyTo(entities);
		});
	}).otherwise(function (error) {
		window.alert(error);
	});
});

// 가시선 분석 - 초기화
$('#analysisLinearLineOfSight .reset').click(function(e) {
	removeAnalysisDataSource(layerDrawStrId);
	removeAnalysisDataSource(layerDrawEndId);
	removeAnalysisDataSource(layerLinearLineOfSightId);
});


// 연직분석 - 측정경로 선택 콜백
$('#analysisRasterProfile .drawUserLine').click(function(e) {
	isDrawFeature = {
		isDraw: true,
		type: 'polyline',
		target: $('#analysisRasterProfile .coordsText')
	}
	$('#analysisRasterProfile .reset').click();

	drawHelper.startDrawingPolyline({
		callback: function (positions) {

			// reset - MGRS coords List
			$('#analysisRasterProfile .coordsText span:last-child').remove();

			isDrawFeature = {
				isDraw: false,
				type: '',
				target: ''
			}

			removeAnalysisDataSource(layerDrawStrId);
			removeAnalysisDataSource(layerDrawEndId);

			var coordsLonLatList = positionsToLonLat(positions);
			var json = makeLineStringTypeJson(coordsLonLatList);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('linestring', ds, layerDrawStrId, positions);
			});

			var reprojection = reprojectionPositions(coordsLonLatList, targetProjection, sourceProjection)
			reprojection.pop();

			// json = makeLineStringTypeJson(reprojection);
			$('#analysisRasterProfile .userLine').val(wellknown.stringify(json));

		}
	});
});

// 연직분석 - 실행
$('#analysisRasterProfile .execute').click(function(e) {

	var inputCoverage = layerDem;
	var interval = $('#analysisRasterProfile .interval').val();
	var userLine = $('#analysisRasterProfile .userLine').val();

	if (userLine == "") {
		alert("측정경로를 선택하세요!");
		return;
	}

	var extent = getViewExtentLonLat();

	var xml = requestBodyRasterProfile(inputCoverage, interval, userLine, extent);

	var resource = requestPostResource(xml);
	resource.then(function (res) {

		removeAnalysisDataSource(layerDrawStrId);
		removeAnalysisDataSource(layerDrawEndId);
		removeAnalysisDataSource(layerRasterProfileId);

		var promise = Cesium.GeoJsonDataSource.load(JSON.parse(res));
		promise.then(function (ds) {
			ds.id = layerRasterProfileId;
			ds.type = 'analysis';
			viewer.dataSources.add(ds);

			var entities = ds.entities.values;
			var polylines = new Cesium.PolylineCollection();
			var temp = [];
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				temp.push(Cesium.Cartesian3.fromArray([
					entity.position._value.x,
					entity.position._value.y,
					entity.position._value.z
				]));
			}

			createGraduatedColorStyle(ds.entities.values, "value");
			createProfileGraph(ds.entities.values);

			ds.entities.add({
				polyline: {
					positions: temp,
					width: 4,
					material: Cesium.Color.fromCssColorString('rgba(255, 0, 0, .5)'),
					clampToGround: true
				}
			});

			// viewer.flyTo(layerRasterProfile.entities);
		});
	}).otherwise(function (error) {
		window.alert(error);
	});
});

// 연직분석 - 초기화
$('#analysisRasterProfile .reset').click(function(e) {
	removeAnalysisDataSource(layerDrawStrId);
	removeAnalysisDataSource(layerDrawEndId);
	removeAnalysisDataSource(layerRasterProfileId);

	// remove graph
	$('#analysisRasterProfile .viewGraph').css('display','none');
	d3.select("#analysisRasterProfile .viewGraph g").remove();

	// remove coords list
	$('#analysisRasterProfile .coordsText').html('');

	// remove legend
	$('#analysisRasterProfile .legend').parent().css('display','none');
	$('#analysisRasterProfile .legend').html('');
});


// 최고/최저 지점찾기 - 분석영역 선택
$('#analysisRasterHighLowPoints .areaType').change(function(e) {
	if (e.target.value == 'useArea') {
		$('#analysisRasterHighLowPoints .wrapCropShape').css('display', 'block');
	} else {
		$('#analysisRasterHighLowPoints .wrapCropShape').css('display', 'none');
	}
});

// 최고/최저 지점찾기 - 영역선택
$('#analysisRasterHighLowPoints .drawCropShape').click(function(e) {
	$('#analysisRasterHighLowPoints .reset').click();
	drawHelper.startDrawingPolygon({
		callback: function (positions) {

			removeAnalysisDataSource(layerDrawEndId);
			removeAnalysisDataSource(layerRasterHighLowPointsId);

			var coordsLonLatList = positionsToLonLat(positions);
			coordsLonLatList.push(coordsLonLatList[0]);
			var json = makePolygonTypeJson(coordsLonLatList);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('polygon', ds, layerDrawStrId);
			});

			// var reprojection = reprojectionPositions(coordsLonLatList, targetProjection, sourceProjection);
			// json = makePolygonTypeJson(reprojection);
			$('#analysisRasterHighLowPoints .cropShape').val(wellknown.stringify(json));
		}
	});
});

// 최고/최저 지점찾기 - 분석실행
$('#analysisRasterHighLowPoints .execute').click(function(e) {

	var inputCoverage = layerDem;
	var areaType = $('#analysisRasterHighLowPoints .areaType').val();
	var cropShape = $('#analysisRasterHighLowPoints .cropShape').val();
	var valueType = $('#analysisRasterHighLowPoints .valueType').val();

	if (areaType == 'extent') {
		var coordsLonLatList = getViewExtentPositions();

		var json = makePolygonTypeJson(coordsLonLatList);
		var promise = Cesium.GeoJsonDataSource.load(json);
		promise.then(function (ds) {
			promiseDrawtoolCallback('polygon', ds, layerDrawStrId);
		});

		// json = makePolygonTypeJson(
		// 	reprojectionPositions(coordsLonLatList, targetProjection, sourceProjection)
		// );
		$('#analysisRasterHighLowPoints .cropShape').val(wellknown.stringify(json));

	} else if (areaType == 'useArea') {

		if ($('#analysisRasterHighLowPoints .cropShape').val() == "") {
			alert("분석영역을 선택하세요!");
			return;
		}
	} else {
		return;
	}

	// 임시로 사용 현재 위치 extent
	var extent = getViewExtentLonLat();

	var xml = requestBodyRasterHighLowPoints(inputCoverage, $('#analysisRasterHighLowPoints .cropShape').val(), valueType, extent);

	var resource = requestPostResource(xml);
	resource.then(function (res) {
		var promise = Cesium.GeoJsonDataSource.load(JSON.parse(res));
		promise.then(function (ds) {

			removeAnalysisDataSource(layerRasterHighLowPointsId);

			ds.id = layerRasterHighLowPointsId;
			ds.type = 'analysis';
			viewer.dataSources.add(ds);

			var entities = ds.entities.values;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				entity.billboard = undefined;
				entity.point = new Cesium.PointGraphics({
					color: Cesium.Color.fromCssColorString("rgba(255, 0, 0)"),
					pixelSize: 10,
					outlineColor: Cesium.Color.fromCssColorString("rgba(0, 0, 0)"),
					outlineWidth: 1
				});
			}

			// viewer.flyTo(ds.entities);
		});
	}).otherwise(function (error) {
		window.alert(error);
	});
});

// 최고/최저 지점찾기 - 초기화
$('#analysisRasterHighLowPoints .reset').click(function(e) {
	removeAnalysisDataSource(layerDrawStrId);
	removeAnalysisDataSource(layerDrawEndId);
	removeAnalysisDataSource(layerRasterHighLowPointsId);
});


// 경로 분석 - 시작점 선택
$('#analysisFromAtoB .drawStartPoint').click(function(e) {
	drawHelper.startDrawingMarker({
		callback: function (position) {
			var coordsLonLat = positionToLonLat(position);
			var json = makePointTypeJson(coordsLonLat);

			$('#analysisFromAtoB .startPointMGRS').val(
				getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
			);

			removeAnalysisDataSource(layerDrawStrId);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('point', ds, layerDrawStrId);
			});

			$('#analysisFromAtoB .startPointX').val(coordsLonLat[0]);
			$('#analysisFromAtoB .startPointY').val(coordsLonLat[1]);
		}
	});
});

// 경로 분석 - 종료점 선택
$('#analysisFromAtoB .drawEndPoint').click(function(e) {
	drawHelper.startDrawingMarker({
		callback: function (position) {

			var coordsLonLat = positionToLonLat(position);
			var json = makePointTypeJson(coordsLonLat);

			$('#analysisFromAtoB .endPointMGRS').val(
				getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
			);

			removeAnalysisDataSource(layerDrawEndId);

			var promise = Cesium.GeoJsonDataSource.load(json);
			promise.then(function (ds) {
				promiseDrawtoolCallback('point', ds, layerDrawEndId);
			});

			$('#analysisFromAtoB .endPointX').val(coordsLonLat[0]);
			$('#analysisFromAtoB .endPointY').val(coordsLonLat[1]);
		}
	});
});

// 경로 분석 - 실행
$('#analysisFromAtoB .execute').click(function(e) {

	var routeType = $('#analysisFromAtoB .routeType').val();
	var startPointX = $('#analysisFromAtoB .startPointX').val();
	var startPointY = $('#analysisFromAtoB .startPointY').val();
	var endPointX = $('#analysisFromAtoB .endPointX').val();
	var endPointY = $('#analysisFromAtoB .endPointY').val();

	var viewParams = 'link:' + layerRouteLink;
	viewParams += ';node:' + layerRouteNode;
	viewParams += ';x1:' + startPointX;
	viewParams += ';y1:' + startPointY;
	viewParams += ';x2:' + endPointX;
	viewParams += ';y2:' + endPointY;
	viewParams += ';routeType:' + routeType;

	var params = {
		service: 'WFS',
		version: '1.1.0',
		request: 'GetFeature',
		outputFormat: 'application/json',
		typeName: layerRoute,
		viewparams: viewParams
	};

	$.ajax({
		type: 'get',
		url: WFS_URL,
		data: params,
		success: function(res) {
			var promise = Cesium.GeoJsonDataSource.load(res);
			promise.then(function (ds) {

				ds.id = layerFromAtoBId;
				ds.type = 'analysis';
				viewer.dataSources.add(ds);

				var entities = ds.entities.values;
				for (var i = 0; i < entities.length; i++) {
					var entity = entities[i];
					// entity.polyline.material = Cesium.Color.fromCssColorString('rgb(255, 0, 0)');
					entity.polyline.material = Cesium.Color.YELLOW;
					entity.polyline.width = 4;
				}
			});
		},
		error: function(xhr, status, error) {
			alert(status + error);
		}
	});

});

// 경로 분석 - 초기화
$('#analysisFromAtoB .reset').click(function(e) {
	removeAnalysisDataSource(layerDrawStrId);
	removeAnalysisDataSource(layerDrawEndId);
	removeAnalysisDataSource(layerFromAtoBId);
});







function createGraduatedColorStyle(vectorLayer, field) {
	// var colors_blues = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];
	var colors_brewer = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'];

	var classBreaks = getClassBreaks(vectorLayer, field, colors_brewer.length, colors_brewer);

	for (var i = 0; i < vectorLayer.length; i++) {
		var entity = vectorLayer[i];
		var fillColor = colors_brewer[0];
		var val = entity.properties[field];
		for (var j = 0; j < classBreaks.length; j++) {
			if (val >= classBreaks[j] && val < classBreaks[j + 1]) {
				fillColor = colors_brewer[j];
				break;
			}
		}

		fillColor = hex2rgb(fillColor);
		var strokeColor = hex2rgb("#ffffff");
		entity.billboard = undefined;
		entity.point = new Cesium.PointGraphics({
			color: Cesium.Color.fromCssColorString(fillColor),
			pixelSize: 10,
			outlineColor: Cesium.Color.fromCssColorString(strokeColor),
			outlineWidth: 1.2
		});
	}
}


function hex2rgb(hex) {
	var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	hex = hex.replace(shorthandRegex, function (m, r, g, b) {
		return r + r + g + g + b + b;
	});

	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? 'rgba(' +
		parseInt(result[1], 16) + ', ' +
		parseInt(result[2], 16) + ', ' +
		parseInt(result[3], 16) + ')' :
		'rgba(255, 255, 255)';
};


function getClassBreaks(features, field, bin, colors) {
	var minValue = Number.MAX_VALUE;
	var maxValue = Number.MIN_VALUE;
	var items = new Array();
	for (var i = 0, length = features.length; i < length; i++) {
		var value = features[i].properties[field];
		if (isNaN(value)) {
			continue;
		}

		items[i] = Number(value).toFixed(7);
		minValue = Math.min(value, minValue);
		maxValue = Math.max(value, maxValue);
	}

	var breaks;
	var stat = new geostats(items);
	stat.setPrecision(6);

	breaks = stat.getClassEqInterval(bin);

	breaks[0] = minValue - 0.1;
	breaks[breaks.length - 1] = maxValue + 0.1;

	$('#analysisRasterProfile .legend').html(
		stat.getHtmlLegend(colors, "범례", true)
	);
	$('#analysisRasterProfile .legend').parent().css('display','block');

	return breaks;
}


function createProfileGraph(vectorLayer) {
	// create data array
	var data = [];
	for (var i = 0, length = vectorLayer.length; i < length; i++) {
		var elevation = vectorLayer[i].properties['value'];
		if (isNaN(elevation)) {
			continue;
		}

		var dict = {};
		dict['distance'] = vectorLayer[i].properties['distance'] / 1000; // m to km
		dict['elevation'] = elevation;
		data.push(dict);
	}

	// sort by distance
	data.sort(function (a, b) {
		var x = a['distance'];
		var y = b['distance'];
		return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	});

	// create profile graph
	var margin = {
		top: 10,
		right: 30,
		bottom: 50,
		left: 50
	};
	// var width = 670 - margin.left - margin.right;
	// var height = 300 - margin.top - margin.bottom;
	var width = 220;
	var height = 200;

	var xScale = d3.scale.linear()
		.domain([0, d3.max(data, function (d) {
			return d.distance;
		})])
		.range([0, width]);

	var yScale = d3.scale.linear()
		.domain([0, d3.max(data, function (d) {
			return d.elevation;
		})])
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.innerTickSize(-height)
		.outerTickSize(0)
		.tickPadding(20);

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.innerTickSize(-width)
		.outerTickSize(0)
		.tickPadding(10);

	var area = d3.svg.area()
		.x(function (d) {
			return xScale(d.distance);
		})
		.y0(height)
		.y1(function (d) {
			return yScale(d.elevation);
		})
		.interpolate('cardinal');


	$('#analysisRasterProfile .viewGraph').css('display','block');

	var svg = d3.select("#analysisRasterProfile .viewGraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("path")
		.datum(data)
		.attr("class", "area")
		.attr("d", area);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("y", 45)
		.style("text-anchor", "start")
		.text("Distance (km)");

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Elevation (m)");
}


function viewMGRSFlyTo(mgrs) {
	var wgs84 = proj4.mgrs.toPoint(mgrs);
	viewer.camera.flyTo({
		destination : Cesium.Cartesian3.fromDegrees(wgs84[0], wgs84[1], 1500.0)
	});
}


function drawPolyline(vectorLayer, positions) {
	// Add draw polyline
	vectorLayer.entities.add({
		polyline: {
			positions: positions,
			width: 4,
			material: Cesium.Color.fromCssColorString('rgba(255, 0, 0, 1)'),
			clampToGround: true
		}
	});
}

function promiseDrawtoolCallback(type, dataSource, layerId, positions) {

	dataSource.id = layerId;
	dataSource.type = 'analysis';
	viewer.dataSources.add(dataSource);

	if (type == 'point') {
		var entities = dataSource.entities.values;
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			entity.billboard = undefined;
			entity.point = new Cesium.PointGraphics({
				// color: Cesium.Color.fromCssColorString("rgba(255, 255, 255)"),
				color: Cesium.Color.YELLOW,
				pixelSize: 10,
				outlineColor: Cesium.Color.fromCssColorString("rgba(0, 0, 0)"),
				outlineWidth: 2,
				heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
			});
		}

	} else if (type == 'linestring') {
		var entities = dataSource.entities.values;
		for (var i = 0; i < entities.length; i++) {
			var entity = entities[i];
			entity.billboard = undefined;
			entity.polyline = new Cesium.PolylineGraphics({
				positions: positions,
				width: 4,
				// material: Cesium.Color.fromCssColorString('rgba(255, 0, 0)'),
				material: Cesium.Color.YELLOW,
				clampToGround: true
			});
		}

	} else if (type == 'polygon') {
		// var entities = dataSource.entities.values;
		// for (var i = 0; i < entities.length; i++) {
		// 	var entity = entities[i];
		// 	entity.billboard = undefined;
		// 	entity.polygon = new Cesium.PolygonGraphics({
		// 		material : Cesium.Color.GREEN,
		// 		outline: true,
		// 		outlineColor: Cesium.Color.BLACK
		// 	});
		// }

	}
}



function positionToLonLat(position) {

	var ellipsoid = viewer.scene.globe.ellipsoid;
	var pos = ellipsoid.cartesianToCartographic(position);

	var coordinates = [];
	coordinates.push(Number(Cesium.Math.toDegrees(pos.longitude)));
	coordinates.push(Number(Cesium.Math.toDegrees(pos.latitude)));

	return coordinates;
}

function positionsToLonLat(positions) {

	var ellipsoid = viewer.scene.globe.ellipsoid;
	var coordinates = [];
	for (var i = 0; i < positions.length; i++) {
		var temp = [];
		var pos = ellipsoid.cartesianToCartographic(positions[i]);
		temp.push(Cesium.Math.toDegrees(pos.longitude));
		temp.push(Cesium.Math.toDegrees(pos.latitude));
		coordinates.push(temp);
	}

	return coordinates;
}

function makePointTypeJson(coordsLonLat) {

	var json = {};
	json.type = 'Feature';
	json.properties = null;
	json.geometry = {};
	json.geometry.type = 'Point';
	json.geometry.coordinates = coordsLonLat;

	return json;
}

function makeLineStringTypeJson(coordsLonLatList) {

	var json = {};
	json.type = 'Feature';
	json.properties = null;
	json.geometry = {};
	json.geometry.type = 'LineString';
	json.geometry.coordinates = coordsLonLatList;

	return json;
}

function makePolygonTypeJson(coordsLonLatList) {

	var json = {};
	json.type = 'Feature';
	json.properties = null;
	json.geometry = {};
	json.geometry.type = 'Polygon';
	json.geometry.coordinates = [coordsLonLatList];

	return json;
}

function reprojectionPosition(position, targetPrj, sourcePrj) {
	return proj4(
		targetPrj, sourcePrj, [position[0], position[1]]
	);
}

function reprojectionPositions(positions, targetPrj, sourcePrj) {
	var reproject = [];
	for (var i = 0; i < positions.length; i++) {
		reproject.push(
			proj4(targetPrj, sourcePrj, [positions[i][0], positions[i][1]])
		);
	}
	return reproject;
}

function getViewExtentPositions() {
	var cl2 = new Cesium.Cartesian2(0, 0);
	var leftTop = viewer.scene.camera.pickEllipsoid(cl2, viewer.scene.globe.ellipsoid);

	cr2 = new Cesium.Cartesian2(viewer.scene.canvas.width, viewer.scene.canvas.height);
	var rightDown = viewer.scene.camera.pickEllipsoid(cr2, viewer.scene.globe.ellipsoid);

	if (leftTop != null && rightDown != null) {
		leftTop = viewer.scene.globe.ellipsoid.cartesianToCartographic(leftTop);
		rightDown = viewer.scene.globe.ellipsoid.cartesianToCartographic(rightDown);


		var extent = new Cesium.Rectangle(leftTop.longitude, rightDown.latitude, rightDown.longitude, leftTop.latitude);
		var west = Number(Cesium.Math.toDegrees(extent.west).toFixed(7));
		var south = Number(Cesium.Math.toDegrees(extent.south).toFixed(7));
		var east = Number(Cesium.Math.toDegrees(extent.east).toFixed(7));
		var north = Number(Cesium.Math.toDegrees(extent.north).toFixed(7));

		var coordinates = [];
		coordinates.push([west, south]);
		coordinates.push([west, north]);
		coordinates.push([east, north]);
		coordinates.push([east, south]);
		coordinates.push([west, south]);

		return coordinates;

	} else { //The sky is visible in 3D
		console.log("Sky is visible");
		return null;
	}
}

function getViewExtentLonLat() {
	var cl2 = new Cesium.Cartesian2(0, 0);
	var leftTop = viewer.scene.camera.pickEllipsoid(cl2, viewer.scene.globe.ellipsoid);

	cr2 = new Cesium.Cartesian2(viewer.scene.canvas.width, viewer.scene.canvas.height);
	var rightDown = viewer.scene.camera.pickEllipsoid(cr2, viewer.scene.globe.ellipsoid);

	if (leftTop != null && rightDown != null) {
		leftTop = viewer.scene.globe.ellipsoid.cartesianToCartographic(leftTop);
		rightDown = viewer.scene.globe.ellipsoid.cartesianToCartographic(rightDown);

		var extent = new Cesium.Rectangle(leftTop.longitude, rightDown.latitude, rightDown.longitude, leftTop.latitude);
		var west = Cesium.Math.toDegrees(extent.west).toFixed(7);
		var south = Cesium.Math.toDegrees(extent.south).toFixed(7);
		var east = Cesium.Math.toDegrees(extent.east).toFixed(7);
		var north = Cesium.Math.toDegrees(extent.north).toFixed(7);

		return [west, south, east, north];

	} else { //The sky is visible in 3D
		console.log("Sky is visible");
		return null;
	}
}


// POST Request
function requestPostResource(xml) {
	var resource = new Cesium.Resource.post({
		url: WPS_URL,
		headers: {
			'Content-Type': 'text/xml;charset=utf-8'
		},
		data: xml
	});

	return resource;
}

// GET Request
function requestGetWFSResource(params) {

	// var resource = new Cesium.Resource({
	// 	url: WFS_URL,
	// 	// proxy: new DefaultProxy('/proxy/'),
	// 	queryParameters: params
	// });
	// return resource;

	$.ajax({
		type: 'get',
		url: WFS_URL,
		data: params,
		success: function(res) {
			console.log('~~~~~');
			console.log(res);
			console.log('~~~~~');
		},
		error: function(xhr, status, error) {
			alert(status + error);
		}
	});

}

// 분석 레이어 삭제
function containsAnalysisDataSource(layer) {
	if (viewer.dataSources.contains(layer)) {
		return true;
	} else {
		return false;
	}
}

// 분석 레이어 삭제
function removeAnalysisDataSource(id) {
	var dsArray = viewer.dataSources._dataSources;

	for(var i = dsArray.length; i--;) {
		if (dsArray[i].id == id && dsArray[i].type == 'analysis') {
			viewer.dataSources.remove(dsArray[i]);
		}
	}
}
}
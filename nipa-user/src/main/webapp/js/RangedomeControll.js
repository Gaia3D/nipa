function RangedomeControll (viewer, option) {
    this._viewer = viewer;
    this._scene = viewer.scene;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._shape;
	this._position;
    this._longitude;
    this._latitude;

    var that = this;

    const layerDrawStrId = 'drawStr';

	// 화망 분석 - 관측지점 위치선택 콜백
	$('#analysisRangeDome .drawObserverPoint').click(function(e) {
		drawHelper.startDrawingMarker({
			callback: function (position) {
				var coordsLonLat = positionToLonLat(position);
				var json = makePointTypeJson(coordsLonLat);

				that._position = position;
                that._longitude = coordsLonLat[0];
                that._latitude = coordsLonLat[1];

				$('#analysisRangeDome .observerPointMGRS').val(
					getposition(coordsLonLat[0], coordsLonLat[1], positionFormatterMGRS)
				);

				removeAnalysisDataSource(layerDrawStrId);

				var promise = Cesium.GeoJsonDataSource.load(json);
				promise.then(function (ds) {
					promiseDrawtoolCallback('point', ds, layerDrawStrId);
				});

				$('#analysisRangeDome .observerPoint').val(wellknown.stringify(json));
			}
		});
    });

    // 화망 분석 - 분석실행
	$('#analysisRangeDome .execute').click(function(e) {
	    var radius = $('#analysisRangeDome .radius').val();
		var observerPoint = $("#analysisRangeDome .observerPoint").val();

	    if (observerPoint == "") {
	        alert("Please select the observer point!!");
	        return;
	    }
        if(that._shape !== undefined)
        {
            that.clearDome();
        }
        that._shape = viewer.entities.add({
            name : 'Threat Dome('+radius+'m)',
            position: Cesium.Cartesian3.fromDegrees(that._longitude, that._latitude, 0.0),
            ellipsoid : {
                radii : new Cesium.Cartesian3(radius, radius, radius),
                material : Cesium.Color.RED.withAlpha(0.5),
                outline : true,
                outlineColor : Cesium.Color.BLACK
            }
        });
    });
    
    this.clearDome = function () {
        viewer.entities.remove(this._shape);
        this._shape = null;
    }

	// 화망 분석 - 초기화
	$('#analysisRangeDome .reset').click(function(e) {
        removeAnalysisDataSource(layerDrawStrId);
        that.clearDome();
    });
    
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
					color : Cesium.Color.YELLOW,
					pixelSize : 10,
					outlineColor : Cesium.Color.WHITE,
					outlineWidth : 3,
					heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
				});
			}

		} else if (type == 'linestring') {
			var entities = dataSource.entities.values;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				entity.billboard = undefined;
				entity.corridor = new Cesium.CorridorGraphics({
					positions: positions,
					width: 4,
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
    
	function makePointTypeJson(coordsLonLat) {

		var json = {};
		json.type = 'Feature';
		json.properties = null;
		json.geometry = {};
		json.geometry.type = 'Point';
		json.geometry.coordinates = coordsLonLat;

		return json;
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
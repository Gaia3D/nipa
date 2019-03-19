
function AnalysisControll(viewer) {

	const WPS_URL = '/geoserver/wps';
	const WMS_URL = '/geoserver/wms';
	const WFS_URL = '/geoserver/wfs';

	const layerDEM = 'mago3d:dem';
	const layerDSM = 'mago3d:dsm';

	const layerRoute = 'mago3d:pgr_fromAtoB';
	const layerRouteLink = 'link';
	const layerRouteNode = 'node';
	const layerRouteLink_nk = 'link_nk';
	const layerRouteNode_nk = 'node_nk';

	const sourceProjection = 'EPSG:4326';
	const targetProjection = 'EPSG:4326';

	const layerRadialLineOfSightId 	 = 'rlos';
	const layerLinearLineOfSightId 	 = 'llos';
	const layerRasterProfileId 		 = 'rp';
	const layerRasterProfileOverlayId= 'rp_o';
	const layerRasterHighLowPointsId = 'rhlp';
	const layerFromAtoBId = 'fab';

	const layerDrawStrId = 'drawStr';
	const layerDrawEndId = 'drawEnd';

	var rasterProfileChart = null;


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

		var inputCoverage = $('#analysisRadialLineOfSight .dataType').val();
		var observerOffset = $('#analysisRadialLineOfSight .observerOffset').val();
	    var radius = $('#analysisRadialLineOfSight .radius').val();
	    var sides = $('#analysisRadialLineOfSight .sides').val();
		var observerPoint = $("#analysisRadialLineOfSight .observerPoint").val();

	    if (observerPoint == "") {
	        alert("관측지점을 선택하세요!");
	        return;
	    }

		if (inputCoverage == "DEM") {
			inputCoverage = layerDEM;
		} else if (inputCoverage == "DSM") {
			inputCoverage = layerDSM;
		} else {
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
					
					entity.corridor = entity.polyline
					entity.corridor.material = Cesium.Color.fromCssColorString('rgb(255, 0, 0, .8)');
					entity.corridor.width = 1;
					if (entity.properties.Visible == 1) {
						entity.corridor.material = Cesium.Color.fromCssColorString('rgb(0, 255, 0, .8)');
					}
	            }
	            // viewer.flyTo(entities);
	        });
	    }).otherwise(function (error) {
	        window.alert('분석영역 선택이 잘못 선택되었습니다.');
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
		var inputCoverage = $('#analysisLinearLineOfSight .dataType').val();
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

		if (inputCoverage == "DEM") {
			inputCoverage = layerDEM;
		} else if (inputCoverage == "DSM") {
			inputCoverage = layerDSM;
		} else {
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
					
					entity.corridor = entity.polyline
					entity.corridor.material = Cesium.Color.fromCssColorString('rgb(255, 0, 0, .8)');
					entity.corridor.width = 5;
					if (entity.properties.Visible == 1) {
						entity.corridor.material = Cesium.Color.fromCssColorString('rgb(0, 255, 0, .8)');
					}
	            }
	            // viewer.flyTo(entities);
	        });
	    }).otherwise(function (error) {
	        window.alert('분석영역 선택이 잘못 선택되었습니다.');
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

		var inputCoverage = $('#analysisRasterProfile .dataType').val();
		var interval = $('#analysisRasterProfile .interval').val();
		var userLine = $('#analysisRasterProfile .userLine').val();

		if (userLine == "") {
			alert("측정경로를 선택하세요!");
			return;
		}

		if (inputCoverage == "DEM") {
			inputCoverage = layerDEM;
		} else if (inputCoverage == "DSM") {
			inputCoverage = layerDSM;
		} else {
			return;
		}

		var extent = getViewExtentLonLat();

		var xml = requestBodyRasterProfile(inputCoverage, interval, userLine, extent);

		var resource = requestPostResource(xml);
		resource.then(function (res) {

			removeAnalysisDataSource(layerDrawStrId);
			removeAnalysisDataSource(layerDrawEndId);
			removeAnalysisDataSource(layerRasterProfileId);
			removeAnalysisDataSource(layerRasterProfileOverlayId);

	        var promise = Cesium.GeoJsonDataSource.load(JSON.parse(res));
	        promise.then(function (ds) {
				ds.id = layerRasterProfileId;
				ds.type = 'analysis';
				viewer.dataSources.add(ds);

	            var entities = ds.entities.values;
	            var temp = [];
	            for (var i = 0; i < entities.length; i++) {
	                var entity = entities[i];
	                temp.push(Cesium.Cartesian3.fromArray([
						entity.position._value.x,
						entity.position._value.y,
						entity.position._value.z
					]));
	            }

	            ds.entities.add({
	                corridor: {
	                    positions: temp,
	                    width: 10,
						material: Cesium.Color.fromCssColorString(hex2rgb('#2c82ff')),
						// material: Cesium.Color.RED,
	                    clampToGround: true
	                }
	            });

				colors = createGraduatedColorStyle(ds.entities.values, "value");
				createProfileGraph(ds.entities.values, colors);

				$('.analysisGroup .profileInfo').css('display','block');
				$('.analysisGraphic').css('display','block');

	            // viewer.flyTo(layerRasterProfile.entities);
	        });
	    }).otherwise(function (error) {
	        window.alert('분석영역 선택이 잘못 선택되었습니다.');
	    });
	});

	// 연직분석 - 초기화
	$('#analysisRasterProfile .reset').click(function(e) {
		removeAnalysisDataSource(layerDrawStrId);
		removeAnalysisDataSource(layerDrawEndId);
		removeAnalysisDataSource(layerRasterProfileId);
		removeAnalysisDataSource(layerRasterProfileOverlayId);

		// remove graph
		$('.analysisGraphic').css('display','none');
		if (rasterProfileChart != null) {
			rasterProfileChart.destroy();
		}

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
			var viewType3d = $('#mapCtrlModeling').hasClass('on');

			if (viewType3d) {
				if ( confirm("분석영역으로 현재 지도 범위로 선택하기 위해서는 카메라 뷰의 기울어짐을 꺼야합니다.") ) {
					viewer.scene.screenSpaceCameraController.enableTilt = false;
		            viewer.scene.screenSpaceCameraController.enableLook = false;
		            viewer.scene.camera.flyTo({
		                destination: viewer.scene.camera.position,
		                orientation: {
		                    heading: 0,
		                    pitch: Cesium.Math.toRadians(-90),
		                    roll: 0
		                }
		            });
					$('#mapCtrlModeling').removeClass('on');

		} else {
					viewer.scene.screenSpaceCameraController.enableTilt = true;
					viewer.scene.screenSpaceCameraController.enableLook = true;
				}
			}

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

		var inputCoverage = $('#analysisRasterHighLowPoints .dataType').val();
		var areaType = $('#analysisRasterHighLowPoints .areaType').val();
		var cropShape = $('#analysisRasterHighLowPoints .cropShape').val();
		var valueType = $('#analysisRasterHighLowPoints .valueType').val();

		if (inputCoverage == "DEM") {
			inputCoverage = layerDEM;
		} else if (inputCoverage == "DSM") {
			inputCoverage = layerDSM;
		} else {
			return;
		}

		if (areaType == 'extent') {

			$('#analysisRasterHighLowPoints .reset').click();


			//줌레벨에 따라 분석가능영역 확인
			var zDistance = $('.distance-legend-label').text()
			if (zDistance.match('km') != null) {
				zDistance = Number.parseInt(zDistance.replace(' km', '')) * 1000;
				if (zDistance > 3000) {
					alert('분석 영역이 너무 큽니다.');
					return false;
				}

			} else {
				zDistance = Number.parseInt(zDistance.replace(' m', ''));
				if (zDistance > 3000) {
					alert('분석 영역이 너무 큽니다.');
					return false;
				}
			}

			var coordsLonLatList = getViewExtentPositions();
			//console.log(coordsLonLatList);

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
	                    outlineColor: Cesium.Color.BLACK,
	                    outlineWidth: 1,
						heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
	                });
	            }

	            // viewer.flyTo(ds.entities);
	        });
	    }).otherwise(function (error) {
			window.alert('분석영역 선택이 잘못 선택되었습니다.');
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

				var promise = Cesium.GeoJsonDataSource.load(json, {
					clampToGround: true
				});
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

		analysisFromAtoBReset();

		var locationType = $('#analysisFromAtoB .locationType').val();
		var routeType = $('#analysisFromAtoB .routeType').val();
		var startPointX = $('#analysisFromAtoB .startPointX').val();
		var startPointY = $('#analysisFromAtoB .startPointY').val();
		var endPointX = $('#analysisFromAtoB .endPointX').val();
		var endPointY = $('#analysisFromAtoB .endPointY').val();

		var node = '';
		var link = '';
		if (locationType == 'south') {
			node = layerRouteNode;
			link = layerRouteLink;
		} else if (locationType == 'north') {
			node = layerRouteNode_nk;
			link = layerRouteLink_nk;
		} else {
			node = layerRouteNode;
			link = layerRouteLink;
		}

		var viewParams = 'link:' + link;
		viewParams += ';node:' + node;
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

					var length = 0;
					var times = 0;

					var roadNames = [];

					var entities = ds.entities.values;
					for (var i=0; i<entities.length; i++) {
						var entity = entities[i];

						entity.corridor = entity.polyline;
						entity.corridor.material.color = Cesium.Color.fromCssColorString(hex2rgb('#2c82ff'));
						entity.corridor.width = 30;
						entity.corridor.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND;

						var overlap = false;
						if (i > 0) {
							overlap = entity.properties.seq.getValue() == entities[i-1].properties.seq.getValue() ? true : false;
						}

						if (!overlap) {
						length += entity.properties.length.getValue();

						if ( entity.properties.speed.getValue() == undefined || entity.properties.speed.getValue() > 1) {
							times += (entity.properties.length.getValue() / 40 ) * 3600;
						} else {
							times += (entity.properties.length.getValue() / entity.properties.speed.getValue() ) * 3600;
						}
						}

						var eName = entity.properties.name.getValue();
						var eId = entity.id;
						if (roadNames.length > 0) {
							if (roadNames[roadNames.length-1][0] == eName) {
								roadNames[roadNames.length-1][1].push(eId);
							} else {
								roadNames.push([eName,[eId]]);
							}
						} else {
							roadNames.push([eName,[eId]]);
						}
					}

					var r_hour = parseInt(times / 3600);
					var r_min = parseInt((times - (parseInt(times / 3600) * 3600)) / 60);
					// var r_sec = Math.round(times - (parseInt((times - (parseInt(times / 3600)*3600)) / 60)*60) - (parseInt(times / 3600)*3600), 2);
					var r_leadTime = r_hour < 1 ? '' : r_hour + '시간 ';
					r_leadTime += r_min + '분';

					$('.routeResult .time').text(r_leadTime);
					$('.routeResult .length').text(Math.round(length, 2) + 'km');

					for (var i=0; i<roadNames.length; i++) {
						roadName = null;
						if(roadNames[i][0] != null) {
							roadName = roadNames[i][0];
						} else {
							roadName = '이름없는 길';
						}

						r_row = $('<div class="r_row" />').attr('data-id', roadNames[i][1].toString());
						r_row.append($('<div class="num" />').text(i + 1));
						r_row.append($('<div class="name" />').text(roadName));
						r_row.click(function() {

							$('.analysisGroup .routeList .r_row').removeClass('on');
							$(this).addClass('on');

							var dataSources = getAnalysisDataSource(layerFromAtoBId);
							var entities = ds.entities.values;
							for (var i=0; i<entities.length; i++) {
								var entity = entities[i];
								entity.corridor.material = Cesium.Color.fromCssColorString(hex2rgb('#2c82ff'));
								entity.corridor.width = 18;
							}

							var ids = $(this).data('id').split(',');
							for (var j=0; j<ids.length; j++) {
								entity = dataSources.entities.getById(ids[j]);
								entity.corridor.material = Cesium.Color.WHITE;
								entity.corridor.width = 20;
							}

							// viewer.flyTo( dataSources.entities.getById(ids[0]) );
						});

						$('.routeList').append(r_row);
					}

					$('.analysisGroup .routeInfo').css('display','block');
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
		// removeAnalysisDataSource(layerFromAtoBId);

		analysisFromAtoBReset();
	});

	function analysisFromAtoBReset() {
		removeAnalysisDataSource(layerFromAtoBId);

		$('.analysisGroup .routeInfo').css('display','none');
		$('.analysisGroup .routeList').empty();
		$('.analysisGroup .routeResult .time').empty();
		$('.analysisGroup .routeResult .length').empty();
	}



	function createGraduatedColorStyle(vectorLayer, field) {
		// var colors_blues = ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c'];
		var colors_brewer = ['#ffffb2', '#fecc5c', '#fd8d3c', '#f03b20', '#bd0026'];

	    var classBreaks = getClassBreaks(vectorLayer, field, colors_brewer.length, colors_brewer);

		var colors = [];

	    for (var i = 0; i < vectorLayer.length-1; i++) {
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
	            outlineWidth: 1,
				heightReference : Cesium.HeightReference.CLAMP_TO_GROUND
	        });

			colors.push(fillColor);
	    }

		return colors;
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

		try {
			for (var i = 0; i<features.length-1; i++) {
		        var value = features[i].properties[field].getValue();
		        if (isNaN(value)) {
		            continue;
		        }

		        items[i] = Number(value).toFixed(7);
		        minValue = Math.min(value, minValue);
		        maxValue = Math.max(value, maxValue);
		    }
		} catch (e) {
			console.log(e);
		}

	    var breaks;
	    var stat = new geostats(items);
	    stat.setPrecision(6);

	    breaks = stat.getClassEqInterval(bin);

	    breaks[0] = minValue - 0.1;
	    breaks[breaks.length - 1] = maxValue + 0.1;

		$('.analysisGroup .profileInfo .legend').html(
			stat.getHtmlLegend(colors, "범례", true)
		);

	    return breaks;
	}


	function createProfileGraph(vectorLayer, colors) {

		var data = [];

		var distances = [];
		var elevations = [];

		for (var i=0; i<vectorLayer.length-1; i++) {
			try {
				elevation = vectorLayer[i].properties.value.getValue();
				distance = vectorLayer[i].properties.distance.getValue();

				if (i == 0) {
					distances.push(0);
				} else {
					from = positionToLonLat(vectorLayer[0].position._value);
					to = positionToLonLat(vectorLayer[i].position._value);

					length = distanceByLonLat(from[0], from[1], to[0], to[1]);
					distances.push(length.toFixed(2));
				}

				elevations.push(elevation);

			} catch (e) {
				consoel.log(e);
			}
		}

		if (rasterProfileChart != null) {
			rasterProfileChart.destroy();
		}
		rasterProfileChart = new Chart(document.getElementById("analysisGraphic"), {
		    type: 'line',
		    data: {
				labels: distances,
		        datasets: [{
					// label: '',
		            data: elevations,
		            // backgroundColor: [
					// 	'rgba(0,0,255,0.5)'
		            // ],
		            borderColor: [
		                'rgba(44,130,255,1)'
		            ],
					pointBackgroundColor: [
						'rgba(255,0,255,0.5)',
						'rgba(255,0,150,0.5)',
						'rgba(255,150,0,0.5)'
					],
					pointBackgroundColor: colors,
					pointRadius: 5,
					pointHoverRadius: 10,
					pointHitRadius: 10,
					pointStyle: 'circle'
		        }]
		    },
		    options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false,
					position: 'top',
					labels: {
						boxWidth: 80,
						fontColor: 'black'
					}
				},
				hover: {
					mode: 'index',
					intersect: true
				},
				tooltips: {
					enabled: true,
					mode: 'nearest',
					intersect: false,
					callbacks: {
						label: function(item, data) {
							console.log(item + '/' + data);

							var dataSource = getAnalysisDataSource(layerRasterProfileId);
							var entities = dataSource.entities.values;
							for (var i=0; i<entities.length-1; i++) {
								if (item.index == i) {
									entities[i].point.pixelSize = 20;
									entities[i].point.outlineWidth = 2;
									entities[i].point.outlineColor = Cesium.Color.fromCssColorString(hex2rgb("#000"));
								} else {
									entities[i].point.pixelSize = 10;
									entities[i].point.outlineWidth = 1;
									entities[i].point.outlineColor = Cesium.Color.fromCssColorString(hex2rgb("#fff"));
								}
							}

							return item.yLabel + 'm';
						}
					}
				},
		        scales: {
					xAxes: [{
						display: true,
						scaleLabel: {
							display: true,
							labelString: '거리(km)'
						},
						ticks: {
							autoSkip: true,
							minRotation: 0
						}
					}],
		            yAxes: [{
						display: true,
						stacked: true,
						scaleLabel: {
							display: true,
							labelString: '높이'
						},
						ticks: {
							autoSkip: true,
							minRotation: 0
						}
		            }]
		        }
		    }
		});
	}


	// 프로파일 측정경로 좌표 이동
	$(document).on('click', '.coordText .coordBtn', function(e) {
		var wgs84 = proj4.mgrs.toPoint( $(this).data('value') );
		viewer.camera.flyTo({
		    destination : Cesium.Cartesian3.fromDegrees(wgs84[0], wgs84[1], 1500.0)
		});
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
			var entities = dataSource.entities.values;
			for (var i = 0; i < entities.length; i++) {
				var entity = entities[i];
				var pg = new Cesium.PolygonGraphics({
					hierarchy: entity.polygon.hierarchy,
					material: entity.polygon.material,
					outline: entity.polygon.outline,
					outlineColor: entity.polygon.outlineColor,
					outlineWidth: entity.polygon.outlineWidth,
					heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
				});
				entity.polygon = pg;
			}
		}
	}

	function distanceByLonLat(lat1, lon1, lat2, lon2) {

	    var R = 6378.137; // Radius of earth in KM
	    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
	    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
	    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
	    Math.sin(dLon/2) * Math.sin(dLon/2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	    var d = R * c;

		return d;	//km
	    // return d * 1000; // meters
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

	// 레이어 이름으로 조회
	// function containsAnalysisDataSource(layer) {
	// 	if (viewer.dataSources.contains(layer)) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }

	function getAnalysisDataSource(id) {
		var dsArray = viewer.dataSources._dataSources;

		for(var i = dsArray.length; i--;) {
			if (dsArray[i].id == id && dsArray[i].type == 'analysis') {
				return dsArray[i];
			}
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

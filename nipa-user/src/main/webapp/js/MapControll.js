var lengthInMeters = 0;
var areaInMeters = 0;

function MapControll(viewer, option) {
    this._viewer = viewer;
    this._scene = viewer.scene;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._polylines = [];
    this._labels = [];
    this._tooltip = new Tooltip(viewer.container);

    var that = this;
    var handler = null;

    var drawingMode = 'line';
    var activeShapePoints = [];
    var activeShape;
    var activeLabel;
    var floatingPoint;

    /**
     * 나침반 동작
     */
    viewer.scene.postRender.addEventListener(function () {
        var camera = this._viewer.camera;
        var angle = Cesium.Math.toDegrees(camera.heading);
        if (angle > 359.9 || angle < .1) {
            $("#mapCtrlCompass").addClass('on');
        }
        else {
            $("#mapCtrlCompass").removeClass('on');
            $("#mapCtrlCompass").css({
                '-webkit-transform': 'rotate(' + -angle + 'deg)',
                '-moz-transform': 'rotate(' + -angle + 'deg)',
                '-ms-transform': 'rotate(' + -angle + 'deg)',
                'transform': 'rotate(' + -angle + 'deg)'
            });
        }
    });
    /*
        var material = new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.3));
    
        // A polyline with two connected line segments
        var polyline = new Cesium.PolylineGeometry({
        positions : positionData,
        width: 3,
        geodesic: true,
        granularity: 10000,
        appearance: new Cesium.PolylineMaterialAppearance({
            aboveGround : false
        }),
        material : material
      });
      var geometry = Cesium.PolylineGeometry.createGeometry(polyline);
    */

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

    var dynamicCenter = new Cesium.CallbackProperty(function () {
        var bs = Cesium.BoundingSphere.fromPoints(activeShapePoints);
        return Cesium.Ellipsoid.WGS84.scaleToGeodeticSurface(bs.center);
    }, false);

    var dynamicLabel = new Cesium.CallbackProperty(function () {
        return getArea(activeShapePoints);
    }, false);

    function drawShape(positionData) {
        var shape;
        if (drawingMode === 'line') {
            shape = viewer.entities.add({
                corridor: {
                    //polyline: {                    
                    positions: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW),
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    //followSurface: true,
                    //clampToGround : true,
                    width: 3
                }
            });
        }
        else if (drawingMode === 'polygon') {
            shape = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.3)),
                    height: 0.1,
                    outline: true,
                    outlineColor: Cesium.Color.BLACK
                }
            });
            activeLabel = viewer.entities.add({
                position: dynamicCenter,
                label: {
                    text: dynamicLabel,
                    font: 'bold 20px sans-serif',
                    fillColor: Cesium.Color.BLUE,
                    style: Cesium.LabelStyle.FILL,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
                }
            });
        }
        return shape;
    }

    // use scratch object to avoid new allocations per frame.
    var startCartographic = new Cesium.Cartographic();
    var endCartographic = new Cesium.Cartographic();
    var scratch = new Cesium.Cartographic();
    var geodesic = new Cesium.EllipsoidGeodesic();

    function getLineLength(positions) {
        lengthInMeters = 0;
        for (var i = 1, len = positions.length; i < len; i++) {
            var startPoint = positions[i - 1];
            var endPoint = positions[i];

            lengthInMeters += Cesium.Cartesian3.distance(startPoint, endPoint);
        }
        updateDistance(lengthInMeters);
        return formatDistance(lengthInMeters);
    }

    function getArea(positions) {
        areaInMeters = 0;
        if (positions.length >= 3)
        {
            var points = [];
            for(var i = 0, len = positions.length; i < len; i++)
            {
                //points.push(Cesium.Cartesian2.fromCartesian3(positions[i]));
                var cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
                points.push(new Cesium.Cartesian2(cartographic.longitude, cartographic.latitude));
            }
            if(Cesium.PolygonPipeline.computeWindingOrder2D(points) === Cesium.WindingOrder.CLOCKWISE)
            {
                points.reverse();
            }

            var triangles = Cesium.PolygonPipeline.triangulate(points);

            for(var i = 0, len = triangles.length; i < len; i+=3)
            {
                //areaInMeters += Cesium.PolygonPipeline.computeArea2D([points[triangles[i]], points[triangles[i + 1]], points[triangles[i + 2]]]);
                areaInMeters += calArea(points[triangles[i]], points[triangles[i + 1]], points[triangles[i + 2]]);
            }
        }
        updateArea(areaInMeters);
        return formatArea(areaInMeters);
    }
    function calArea(t1, t2, t3, i) {
        var r = Math.abs(t1.x * (t2.y - t3.y) + t2.x * (t3.y - t1.y) + t3.x * (t1.y - t2.y)) / 2;
		var cartographic = new Cesium.Cartographic((t1.x + t2.x + t3.x) / 3, (t1.y + t2.y + t3.y) / 3);
		var cartesian = viewer.scene.globe.ellipsoid.cartographicToCartesian(cartographic);
        var magnitude = Cesium.Cartesian3.magnitude(cartesian);
        return r * magnitude * magnitude * Math.cos(cartographic.latitude)
    }

    function drawLabel(positionData) {
        var label;
        // if (drawingMode === 'line') {
            label = viewer.entities.add({
                position: positionData,
                label: {
                    text: getLineLength(activeShapePoints),
                    font: 'bold 20px sans-serif',
                    fillColor: Cesium.Color.YELLOW,
                    style: Cesium.LabelStyle.FILL,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND/*,
                    pixelOffset : new Cesium.Cartesian2(5, 20)*/
                }
            });
        // }
        return label;
    }

    // Redraw the shape so it's not dynamic and remove the dynamic shape.
    function terminateShape() {
        //activeShapePoints.pop();
        lengthInMeters = 0;
        areaInMeters = 0
        this._polylines.push(drawShape(activeShapePoints));
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        viewer.entities.remove(activeLabel);
        
        floatingPoint = undefined;
        activeShape = undefined;
        activeLabel = undefined;
        activeShapePoints = [];
    }

    this.clearMap = function () {
        lengthInMeters = 0;
        areaInMeters = 0
        if (Cesium.defined(handler)) {
            handler.destroy();
            handler = null;
        }
        for (var i = 0, len = this._polylines.length; i < len; i++) {
            viewer.entities.remove(this._polylines[i]);
        }
        for (var i = 0, len = this._labels.length; i < len; i++) {
            viewer.entities.remove(this._labels[i]);
        }
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        viewer.entities.remove(activeLabel);

        floatingPoint = undefined;
        activeShape = undefined;
        activeLabel = undefined;
        activeShapePoints = [];
    }


    $('#mapCtrlCompass').click(function () {
        console.log("맵컨트롤 : 나침반");
        $(this).addClass('on');
        var camera = viewer.scene.camera;
        camera.flyTo({
            destination: camera.position,
            orientation: {
                heading: 0,
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            }
        });
    });

    //$('#mapCtrlModeling').click(function () {
    $('#mapCtrlModeling').bind("afterClick", function () {
        console.log("맵컨트롤 : 전환");
        if ($(this).hasClass('on')) {
            viewer.scene.screenSpaceCameraController.enableTilt = true;
            viewer.scene.screenSpaceCameraController.enableLook = true;
        }
        else {
            viewer.scene.screenSpaceCameraController.enableTilt = false;
            viewer.scene.screenSpaceCameraController.enableLook = false;
            var camera = viewer.scene.camera;
            camera.flyTo({
                destination: camera.position,
                orientation: {
                    heading: 0,
                    pitch: Cesium.Math.toRadians(-90),
                    roll: 0
                }
            });
        }
    });

    $('#mapCtrlReset').click(function () {
        console.log("맵컨트롤 : 초기화");
        that._scene.camera.flyHome();
    });

    $('#mapCtrlDistance').bind('afterClick', function () {
        console.log("맵컨트롤 : 거리");
        that.clearMap();
        drawingMode = 'line';
        updateDistance(0);
        
        if ($(this).hasClass('on')) {
            startDrawPolyLine();
        }
    });

    $('#mapCtrlArea').bind('afterClick', function () {
        console.log("맵컨트롤 : 면적");
        that.clearMap();
        drawingMode = 'polygon';
        updateArea(0);

        if ($(this).hasClass('on')) {
            startDrawPolyLine();
        }
    });

    $('#mapCtrlZoomIn').click(function () {
        console.log("맵컨트롤 : 확대");
        that._scene.camera.zoomIn();
    });

    $('#mapCtrlZoomOut').click(function () {
        console.log("맵컨트롤 : 축소");
        that._scene.camera.zoomOut();
    });

    $('#distanceLayer button.focusA').click(function () {
        that.clearMap();
        $('#mapCtrlDistance').trigger('afterClick');
    });

    $('#areaLayer button.focusA').click(function () {
        that.clearMap();
        $('#mapCtrlArea').trigger('afterClick');
    });

    function startDrawPolyLine() {
        handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
        var dynamicPositions = new Cesium.CallbackProperty(function () {
            return activeShapePoints;
        }, false);

        handler.setInputAction(function (event) {
            var earthPosition = viewer.scene.pickPosition(event.position);
            if (Cesium.defined(earthPosition)) {
                var cartographic = Cesium.Cartographic.fromCartesian(earthPosition);
                var tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));

                activeShapePoints.push(tempPosition);
                if (activeShapePoints.length === 1) {
                    activeShape = drawShape(dynamicPositions);
                }
                else {
                    this._labels.push(drawLabel(tempPosition));
                }
                this._polylines.push(createPoint(tempPosition));
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        handler.setInputAction(function (event) {
            terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }
}

var formatDistance = function (_length) {
    var unitFactor = parseFloat($('#distanceFactor option:selected').val());
    var unitName = $('#distanceFactor option:selected').text();
    var output= Math.round(_length / unitFactor * 100) / 100 + " " + unitName.substring(0, unitName.indexOf('('));
    return output;
};

var formatArea = function (_area) {
    var unitFactor = parseFloat($('#areaFactor option:selected').val());
    var unitName = $('#areaFactor option:selected').text();
    var output= Math.round(_area / unitFactor * 100) / 100 + " " + unitName.substring(0, unitName.indexOf('('));
    return output;
};

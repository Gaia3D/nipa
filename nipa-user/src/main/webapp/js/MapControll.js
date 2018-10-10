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
        }
        return shape;
    }

    // use scratch object to avoid new allocations per frame.
    var endCartographic = new Cesium.Cartographic();
    var scratch = new Cesium.Cartographic();
    var geodesic = new Cesium.EllipsoidGeodesic();

    // Calculate the length of the line
    function getLength(time, result) {
        //function getLength(startPoint, endPoint) {
        // Get the end position from the polyLine's callback.
        //var endPoint = redLine.polyline.positions.getValue(time, result)[1];
        var len = activeShapePoints.length;
        if (1 == len) {
            startPoint = activeShapePoints[0];
            endPoint = activeShapePoints[0];
        }
        else {
            startPoint = activeShapePoints[len - 2];
            endPoint = activeShapePoints[len - 1];
        }
        startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
        endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

        geodesic.setEndPoints(startCartographic, endCartographic);
        var lengthInMeters = Math.round(geodesic.surfaceDistance);

        //return (lengthInMeters / 1000).toFixed(1) + ' km';
        return formatDistance(lengthInMeters);
    }

    function getMidpoint(time, result) {
        //function getMidpoint(startPoint, endPoint) {
        // Get the end position from the polyLine's callback.
        //var endPoint = redLine.polyline.positions.getValue(time, result)[1];
        var len = activeShapePoints.length;
        if (1 == len) {
            startPoint = activeShapePoints[0];
            endPoint = activeShapePoints[0];
        }
        else {
            startPoint = activeShapePoints[len - 2];
            endPoint = activeShapePoints[len - 1];
        }

        startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
        endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

        geodesic.setEndPoints(startCartographic, endCartographic);
        var midpointCartographic = geodesic.interpolateUsingFraction(0.5, scratch);
        return Cesium.Cartesian3.fromRadians(midpointCartographic.longitude, midpointCartographic.latitude);
    }
    /*
        function destroy() {
            for(var i = 0, len = this._polylines.length; i < len; i++)
            {
                viewer.entities.remove(this._polylines[i]);
            }
            for(var i = 0, len = this._labels.length; i < len; i++)
            {
                viewer.entities.remove(this._labels[i]);
            }
        }
    */
    function getLineLength(positions) {
        var lengthInMeters = 0;
        for (var i = 1, len = positions.length; i < len; i++) {
            var startPoint = positions[i - 1];
            var endPoint = positions[i];

            startCartographic = Cesium.Cartographic.fromCartesian(startPoint);
            endCartographic = Cesium.Cartographic.fromCartesian(endPoint);

            geodesic.setEndPoints(startCartographic, endCartographic);
            var length = Math.round(geodesic.surfaceDistance);

            lengthInMeters += isNaN(length) ? 0 : length;
        }
        $('#distanceLayer div.measure > span').text(Math.round(lengthInMeters / 1000 * 100) / 100);
        return formatDistance(lengthInMeters);
    }

    function drawLabel(positionData) {
        var label;
        if (drawingMode === 'line') {
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
        }
        else if (drawingMode === 'polygon') {
            /*
             label = viewer.entities.add({
                polygon: {
                    hierarchy: positionData,
                    material: new Cesium.ColorMaterialProperty(Cesium.Color.YELLOW.withAlpha(0.3)),
                    height       : 0.1,
                    outline      : true,
                    outlineColor : Cesium.Color.BLACK
                }
            });
            */
        }
        return label;
    }

    // Redraw the shape so it's not dynamic and remove the dynamic shape.
    function terminateShape() {
        //activeShapePoints.pop();
        this._polylines.push(drawShape(activeShapePoints));
        viewer.entities.remove(floatingPoint);
        viewer.entities.remove(activeShape);
        floatingPoint = undefined;
        activeShape = undefined;
        activeShapePoints = [];
    }

    this.clearMap = function () {
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
        floatingPoint = undefined;
        activeShape = undefined;
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
        $('#distanceLayer div.measure > span').text(0);

        if ($(this).hasClass('on')) {
            startDrawPolyLine();
        }
    });

    $('#mapCtrlArea').bind('afterClick', function () {
        console.log("맵컨트롤 : 면적");
        that.clearMap();
        drawingMode = 'polygon';

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
                    //floatingPoint = createPoint(tempPosition);
                    //activeShapePoints.push(tempPosition);
                }
                else {
                    this._labels.push(drawLabel(tempPosition));
                }
                //activeShapePoints.push(tempPosition);
                this._polylines.push(createPoint(tempPosition));
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        /*
        handler.setInputAction(function (event) {
            if (Cesium.defined(floatingPoint)) {
                var newPosition = viewer.scene.pickPosition(event.endPosition);
                if (Cesium.defined(newPosition)) {
                    var cartographic = Cesium.Cartographic.fromCartesian(newPosition);
                    var tempPosition = Cesium.Cartesian3.fromDegrees(Cesium.Math.toDegrees(cartographic.longitude), Cesium.Math.toDegrees(cartographic.latitude));

                    this._tooltip.showAt(event.endPosition, "클릭하세요.");
                    if (Cesium.defined(floatingPoint)) {
                        floatingPoint.position.setValue(tempPosition);
                        activeShapePoints.pop();
                        activeShapePoints.push(tempPosition);
                        this._tooltip.showAt(event.endPosition, "마우스 오른쪽을 클릭하면 그리기 종료를 종료합니다.");
                    }
                }
                else {
                    this._tooltip.hide();
                }
            }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        */
        handler.setInputAction(function (event) {
            terminateShape();
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    }
}

var formatDistance = function (_length) {
    var length = Math.round(_length * 100) / 100;
    var output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
    } else {
        output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
    }
    return output;
};

var formatArea = function (polygon) {
    var area;
    area = polygon.getArea();
    var output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

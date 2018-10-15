function MouseControll(viewer) {
    var scene = viewer.scene;
    var pickPosition = { lat: null, lon: null, alt: null };

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction(function (event) {
        var newPosition = viewer.scene.pickPosition(event.endPosition);
        if (scene.pickPositionSupported && Cesium.defined(newPosition)) {
            var cartographic = Cesium.Cartographic.fromCartesian(newPosition);
            pickPosition.lon = Cesium.Math.toDegrees(cartographic.longitude);
            pickPosition.lat = Cesium.Math.toDegrees(cartographic.latitude);
            pickPosition.alt = Math.round(cartographic.height);

            showClickPosition(pickPosition);
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    /** 
     * 축척 표시
    */
    this._lastLegendUpdate = undefined;
    this.distanceLabel = undefined;
    this.barWidth = undefined;

    var geodesic = new Cesium.EllipsoidGeodesic();

    var distances = [
        1, 2, 3, 5,
        10, 20, 30, 50,
        100, 200, 300, 500,
        1000, 2000, 3000, 5000,
        10000, 20000, 30000, 50000,
        100000, 200000, 300000, 500000,
        1000000, 2000000, 3000000, 5000000,
        10000000, 20000000, 30000000, 50000000];
        
    viewer.scene.postRender.addEventListener(function () {
        var now = Cesium.getTimestamp();
        if (now < this._lastLegendUpdate + 250) {
            return;
        }

        this._lastLegendUpdate = now;

        // Find the distance between two pixels at the bottom center of the screen.
        var width = scene.canvas.clientWidth;
        var height = scene.canvas.clientHeight;

        var left = scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
        var right = scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));

        var globe = scene.globe;
        var leftPosition = globe.pick(left, scene);
        var rightPosition = globe.pick(right, scene);

        if (!Cesium.defined(leftPosition) || !Cesium.defined(rightPosition)) {
            this.barWidth = undefined;
            this.distanceLabel = undefined;
        }
        else
        {
            var leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
            var rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);
    
            geodesic.setEndPoints(leftCartographic, rightCartographic);
            var pixelDistance = geodesic.surfaceDistance;
    
            // Find the first distance that makes the scale bar less than 100 pixels.
            var maxBarWidth = 100;
            var distance;
            for (var i = distances.length - 1; !Cesium.defined(distance) && i >= 0; --i) {
                if (distances[i] / pixelDistance < maxBarWidth) {
                    distance = distances[i];
                }
            }
    
            if (Cesium.defined(distance)) {
                var label;
                if (distance >= 1000) {
                    label = (distance / 1000).toString() + ' km';
                } else {
                    label = distance.toString() + ' m';
                }
    
                this.barWidth = (distance / pixelDistance) | 0;
                this.distanceLabel = label;
            } else {
                this.barWidth = undefined;
                this.distanceLabel = undefined;
            }
        }
        if(this.distanceLabel && this.barWidth)
        {
            $('.distance-legend').show();    
        }
        else
        {
            $('.distance-legend').hide();
        }
        $('.distance-legend-label').text(this.distanceLabel);
        $('.distance-legend-scale-bar').width(this.barWidth + 'px').css('left', (5 + (125 - barWidth) / 2) + 'px');
    });
}

// display current mouse position
// click poisition call back function
function showClickPosition(position) {
    var lon = position.lon;
    var lat = position.lat;
    var alt = position.alt;

    alt = alt > 0 ? alt : 0;

    $('#positionAlt').text(alt+"m");
    $('#positionDD').text(getposition(lon, lat, positionFormatterDD));
    $('#positionDM').text(getposition(lon, lat, positionFormatterDM));
    $('#positionDMS').text(getposition(lon, lat, positionFormatterDMS));
    $('#positionMGRS').text(getposition(lon, lat, positionFormatterMGRS));
    $('#positionUTM').text(getposition(lon, lat, positionFormatterUTM));
}
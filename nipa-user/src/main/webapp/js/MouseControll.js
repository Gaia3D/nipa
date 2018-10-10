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

    return handler;
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
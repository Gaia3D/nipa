var dateFormat = "yy-mm-dd";

$.datepicker.setDefaults({
    dateFormat: dateFormat,
    prevText: '이전 달',
    nextText: '다음 달',
    monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    showMonthAfterYear: true,
    closeText: "완료",
    currentText: "오늘",
    yearSuffix: '년'
});

$.datepicker._gotoToday = function (id) {
    $(id).datepicker('setDate', "-0d").datepicker('hide').change().blur();
};

var startDate = $("#startDatepicker").datepicker({
    showOn: "both",
    buttonImage: "images/calendar.png",
    buttonImageOnly: true,
    showButtonPanel: true,
    selectOtherMonths: true
}).on("change", function () {
    endDate.datepicker("option", "minDate", getDate(this));
});

var endDate = $("#endDatepicker").datepicker({
    showOn: "both",
    buttonImage: "images/calendar.png",
    buttonImageOnly: true,
    showButtonPanel: true,
    selectOtherMonths: true
}).on("change", function () {
    startDate.datepicker("option", "maxDate", getDate(this));
});

$(".date").datepicker("setDate", "-0d").change();

function getDate(element) {
    var date;
    try {
        date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
        date = null;
    }

    return date;
}

var timeserieslayer;
var defaultSatLayer = {
    name : "위성영상 시계열",
    provider : new Cesium.WebMapServiceImageryProvider({
                    url        : "http://localhost:9999/geoserver/SatTimeseries/wms",
                    layers     : "SatTimeseries:SatTimeseries",
                    parameters : {
                        service     : "WMS",
                        version     : "1.1.1",
                        request     : "GetMap",
                        transparent : "true",
                        format      : "image/png",
                        tiled : 'true'
                    },
                    enablePickFeatures: false
                }),
    alpha : 1.0,
    show : true
};

function showSatImage(queryString) {
    timeserieslayer._imageryProvider._resource._queryParameters.cql_filter = queryString;
    timeserieslayer._imageryProvider._tileProvider._resource._queryParameters.cql_filter = queryString;
}

var isSearchingSatImage = true;
function TimeseriesControll(viewer, option) {
    this._viewer = viewer;
    this._scene = viewer.scene;

    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

    this._position;
    this._longitude;
    this._latitude;
    this._coordPoint;

    var that = this;
    var handler = null;

    // timeserieslayer = viewer.imageryLayers.addImageryProvider(defaultSatLayer.provider);
    // timeserieslayer.alpha = Cesium.defaultValue(defaultSatLayer.alpha, 1.0);
    // timeserieslayer.show = Cesium.defaultValue(defaultSatLayer.show, true);
    // timeserieslayer.name = defaultSatLayer.name;

    // 좌표 복사
    $('#satCoordCopy').click(function () {
        var copyText = "DD : " + $('#satDD').val() + "\n"
            + "DMS : " + $('#satDMS').val() + "\n"
            + "MGRS : " + $('#satMGRS').val() + "\n"
            + "UTM : " + $('#satUTM').val() + "\n";

        coordinateCopy(copyText);
    });

    // 좌표 초기화
    $('#satTextReset').click(function () {
        clearCoordinate();
    });

    this.clearHandler = function () {
        if (Cesium.defined(handler)) {
            handler.destroy();
            handler = null;
        }
    }

    this.clear = function () {
        this.clearHandler();
        viewer.entities.remove(this._coordPoint);
        this._coordPoint = null;
    }

    function clearCoordinate() {
        this._position = null;
        this._longitude = null;
        this._latitude = null;

        $('#getSatPoint').trigger('afterClick');

        $('#satDD').val("");
        $('#satDMS').val("");
        $('#satMGRS').val("");
        $('#satUTM').val("");
    }

    function updateCoordinate() {
        var lon = that._longitude;
        var lat = that._latitude;

        $('#satDD').val(getposition(lon, lat, positionFormatterDD));
        $('#satDMS').val(getposition(lon, lat, positionFormatterDMS));
        $('#satMGRS').val(getposition(lon, lat, positionFormatterMGRS));
        $('#satUTM').val(getposition(lon, lat, positionFormatterUTM));

        that.clearHandler();
        $('#getSatPoint').removeClass('on');
    }

    // 위성영상 검색을 위한 위치 지정
    $('#getSatPoint').bind('afterClick', function () {
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

    $('#searchSatImage').click(function () {
        if (timeserieslayer !== null && timeserieslayer !== undefined) {
            viewer.imageryLayers.remove(timeserieslayer, true);
        }
        var urlSatImageAPI = "http://localhost:8181/timeseries/";
        var form = new FormData();
/*
        if (that._longitude === undefined || that._latitude === undefined) {
            alert("영상을 검색할 위치를 지정하세요!");
            return false;
        }
*/
        form.set("type", $('#satType option:selected').val());
        form.set("sdate", $('#startDatepicker').val());
        form.set("edate", $('#endDatepicker').val());
        form.set("longitude", that._longitude);
        form.set("latitude", that._latitude);
        form.set("offset", 0);
        form.set("limit", 10);

        satApp.images = [];

        var queryString = new URLSearchParams(form).toString();
        if (isSearchingSatImage) {
            isSearchingSatImage = false;
            $.ajax({
                url: urlSatImageAPI,
                data: queryString,
                type: 'GET',
                success: function (msg) {
                    if (msg.result === "success") {
                        var images = msg.imageList;
                        var len = images.length;
                        if (len == 0) {
                            alert("검색된 결과가 없습니다.");
                        }
                        else {
                            for (var i = 0; i < len; i++) {
                                var date = moment(images[i].acquisition, "YYYYMMDDHHmmss");
                                if (date.isValid()) {
                                    images[i].date = date.format("YYYY-MM-DD");
                                }
                                images[i].show = false;
                            images[i].src = "http://localhost:8181/timeseries/images/" + images[i].id;
                            satApp.images.push(images[i]);
                        }
                        }
                    } else {
                        alert(msg.result);
                    }
                    isSearchingSatImage = true;
                },
                error: function (request, status, error) {
                    console.log("code : " + request.status + " \n message : " + request.message + "\n error : " + error);
                    isSearchingSatImage = true;
                }
            });
        }
    })
    
    var satApp = new Vue({
        el : "#allSatImages",
        data: {
            active : true,
            display : true,
            images : []
        },
        beforeMount : function () {
        },
        mounted : function () {
        },
        methods : {
            showImage: function (image) {
                console.log("showImage" + image);
                for (var i = 0, len = this.images.length; i < len; i++) {
                    this.images[i].show = false;
                }
                image.show = true;

                var queryString = "sat_id='" + image.sat_id + "'";
                // timeserieslayer.show = false;
                // timeserieslayer._imageryProvider._resource._queryParameters.cql_filter = queryString;
                // timeserieslayer._imageryProvider._tileProvider._resource._queryParameters.cql_filter = queryString;
                // timeserieslayer.show = true;

                if (timeserieslayer !== null && timeserieslayer !== undefined) {
                    viewer.imageryLayers.remove(timeserieslayer, true);
                }
                timeserieslayer = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapServiceImageryProvider({
                    url: "http://localhost:9999/geoserver/SatTimeseries/wms",
                    layers: "SatTimeseries:SatTimeseries",
                    parameters: {
                        service: "WMS",
                        version: "1.1.1",
                        request: "GetMap",
                        transparent: "true",
                        format: "image/png",
                        cql_filter: queryString,
                        tiled: 'true'
                    },
                    enablePickFeatures: false
                }));
            }
        }
    });

}
Vue.filter('toPercent', function (value) {
    return parseInt(parseFloat(value) * 100);
});
Vue.filter('toPercentString', function (value) {
    return parseInt(parseFloat(value) * 100) + "%";
});
Vue.filter('toHexColor', function (value) {
    return "#" + value.toString().substr(0, 6);
});

function LayerControll(viewer) {
    var geo_server_url = "/geoserver/wms";
    var geo_server_layers = "mago3d:mago3d_bg";
    var geo_server_parameters_service = "WMS";
    var geo_server_parameters_version = "1.1.0";
    var geo_server_parameters_request = "GetMap";
    var geo_server_parameters_transparent = "true";
    var geo_server_parameters_format = "image/png";

    var wmsParams = {
        service: geo_server_parameters_service,
        version: geo_server_parameters_version,
        request: geo_server_parameters_request,
        transparent: geo_server_parameters_transparent,
        format: geo_server_parameters_format,
        tiled: true
    }

    var default3DLayer = [{
        name: "3D Model",
        show: true
    }];

    var defaultImgLayer = [{
        id: "1",
        name: "Sejong City",
        provider: new Cesium.WebMapServiceImageryProvider({
            url: geo_server_url,
            layers: "mago3d:sejong",
            parameters: wmsParams,
            enablePickFeatures : false
        }),
        alpha: 1.0,
        show: false
    },
    {
        id: "2",
        name: "OpenStreetMaps",
        provider: Cesium.createOpenStreetMapImageryProvider(),
        alpha: 0.7,
        show: false
    },
    {
        id: "3",
        name: "ArcGIS World Street Maps",
        provider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        }),
        alpha: 0.5,
        show: false
    }];
    var defaultMapLayer = [{
        id: "1", name:
            'Boundary(SiDo)',
        provider: new Cesium.WebMapServiceImageryProvider({
            url: geo_server_url,
            layers: "mago3d:sk_sdo",
            parameters: wmsParams
        }), alpha: 1.0, show: false, color: "FFFF00", line: 1.0
    },
    {
        id: "2", name:
            'Boundary(SiGunGu)',
        provider: new Cesium.WebMapServiceImageryProvider({
            url: geo_server_url,
            layers: "mago3d:sk_sgg",
            parameters: wmsParams
        }), alpha: 1.0, show: false, color: "00FF40", line: 0.5
    },
    {
        id: "3", name:
            'Boundary(EubMyeonDong)',
        provider: new Cesium.WebMapServiceImageryProvider({
            url: geo_server_url,
            layers: "mago3d:sk_emd",
            parameters: wmsParams
        }), alpha: 1.0, show: false, color: "22B1FF", line: 0.2
    },
    {
        id: "4", name:
            'Road network',
        provider: new Cesium.WebMapServiceImageryProvider({
            url: geo_server_url,
            layers: "mago3d:link",
            parameters: wmsParams
        }), alpha: 1.0, show: false, color : "AAAAAA", line : 0.5
    }];

    var imageryLayers = viewer.imageryLayers;

    createLayers(defaultImgLayer);
    createLayers(defaultMapLayer);

    var layerApp = new Vue({
        el: "#layerContent",
        data: {
            index: 0,
            selectedLayer: null,
            defaultLayer: null,
            show3DLayer: true,
            showImgLayer: true,
            showMapLayer: true,
            mago3DLayers: JSON.parse(JSON.stringify(default3DLayer)),
            imgLayers: JSON.parse(JSON.stringify(defaultImgLayer)),
            mapLayers: JSON.parse(JSON.stringify(defaultMapLayer)),
            defaultImgLayers: JSON.parse(JSON.stringify(defaultImgLayer)),
            defaultMapLayers: JSON.parse(JSON.stringify(defaultMapLayer))
        },
        beforeMount: function () {
            this.selectedLayer = this.imgLayers[0];
            this.defaultLayer = this.defaultImgLayers[0];
        },
        mounted: function () {
            // 레이어 옵션
            var range = $('#range-slider');
            var value = $('#range-value');
            var color = $('input[type="color"]');

            // 설정화면 투명도 값 변경 시 동작
            value.change(function () {
                var value = $(this).val();
                if (value < 0) value = 0;
                if (value > 100) value = 100;
                if (value.lastIndexOf("%") == 2) {
                    range.val(parseInt(value));
                } else {
                    $(this).val(parseInt(value) + "%");
                    range.val(parseInt(value));
                }
            });
            // 설정화면 투명도 슬라이더 변경 시 동작
            range.change(function () {
                value.val($(this).val() + "%");
            });
            color.change(function () {
                selectedColor = $(this).val();
                $(this).css('fill', selectedColor);
            });
            $('#settingLayer').find('.layerHeader .layerClose').click(function () {
                $('#settingLayer').removeClass('on').hide();
            });

            $('#closeBtn').click(function () {
                $('#settingLayer').removeClass('on').hide();
            });
        },
        methods: {
            initLayer: function () {
                //this.selectedLayer.show = this.defaultLayer.show;
                this.selectedLayer.alpha = this.defaultLayer.alpha;
                this.selectedLayer.color = this.defaultLayer.color;
                this.selectedLayer.line = this.defaultLayer.line;

                var layer = imageryLayers.get(this.index + 1);
                layer.alpha = this.selectedLayer.alpha;
                layer.show = this.selectedLayer.show;

                var query = makeQueryString(this.selectedLayer);
                if (query !== "") {
                    layer._imageryProvider._resource._queryParameters.env = query;
                    layer._imageryProvider._tileProvider._resource._queryParameters.env = query;
                }

                imageryLayers.remove(layer, false);
                imageryLayers.add(layer, this.index + 1);
            },
            settingLayer: function (index, layer, defaultLayer) {
                this.index = index;
                this.selectedLayer = layer;
                this.defaultLayer = defaultLayer;

                var obj = $('#settingLayer');
                obj.toggleClass('on');
                obj.toggle(obj.hasClass('on'));
                obj.center(); // 옵션창을 화면 중앙에 배치

                console.log("SettingLayer = " + layer);
            },
            updateLayer: function () {
                var obj = $('#settingLayer');
                var opacity = $('#range-slider').val();
                var color = $('#styleColor').val();
                var line = $('#styleLine').val();

                if (opacity !== undefined) {
                    this.selectedLayer.alpha = parseInt(opacity) / 100;
                }

                if (color !== undefined) {
                    this.selectedLayer.color = color.substr(1, 6);
                }

                if (line !== undefined) {
                    this.selectedLayer.line = line;
                }

                var layer = imageryLayers.get(this.index + 1);
                layer.alpha = this.selectedLayer.alpha;
                layer.show = this.selectedLayer.show;

                var query = makeQueryString(this.selectedLayer);
                if (query !== "") {
                    layer._imageryProvider._resource._queryParameters.env = query;
                    layer._imageryProvider._tileProvider._resource._queryParameters.env = query;
                }

                imageryLayers.remove(layer, false);
                imageryLayers.add(layer, this.index + 1);
            },
            changeLayer: function (e, offset, group) {
                switch (group) {
                    case '0':
                        var defaultLayer = this.defaultImgLayers;
                        break;
                    case '1':
                        var defaultLayer = this.defaultMapLayers;
                        break;
                }

                var target = e.moved;
                if (target) {
                    defaultLayer.splice(target.newIndex, 0, defaultLayer.splice(target.oldIndex, 1)[0]);

                    var length = defaultLayer.length;
                    var oldIndex = offset + length - target.oldIndex;
                    var newIndex = offset + length - target.newIndex;

                    var layer = imageryLayers.get(oldIndex);
                    imageryLayers.remove(layer, false);
                    imageryLayers.add(layer, newIndex);

                    console.log(target.element.id + "(" + target.element.name + ")");
                    console.log(target.oldIndex + "-->" + target.newIndex);
                }
            },
            toggleLayer: function (index, layer) {
                layer.show = !layer.show;
                var imageryLayer = imageryLayers.get(index + 1);
                imageryLayer.show = layer.show;
            },
            toggle3DLayer: function (index, layer) {
                layer.show = !layer.show;
                changeMagoStateAPI(managerFactory, layer.show);
            }
        }
    });

    function createLayers(layers) {
        //for (var i = 0, len = layers.length; i < len; i++) {
        for (var i = layers.length - 1; i >= 0; i--) {
            var layer = imageryLayers.addImageryProvider(layers[i].provider);
            layer.alpha = Cesium.defaultValue(layers[i].alpha, 1.0);
            layer.show = Cesium.defaultValue(layers[i].show, true);
            layer.name = layers[i].name;

            var query = makeQueryString(layers[i]);
            if (query !== "") {
                layer._imageryProvider._resource._queryParameters.env = query;
                layer._imageryProvider._tileProvider._resource._queryParameters.env = query;
            }
        }
    }

    function makeQueryString(style) {
        var result = "";
        if (style.color !== undefined && style.color !== null) {
            result += "color:" + style.color + ";";
        }
        if (style.line !== undefined && style.line !== null) {
            result += "stroke-width:" + style.line + ";";
        }

        return result;
    }
}

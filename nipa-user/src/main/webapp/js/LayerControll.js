Vue.filter('toPercent', function (value) {
    return parseInt(parseFloat(value)*100);
});
Vue.filter('toPercentString', function (value) {
    return parseInt(parseFloat(value)*100) + "%";
});
Vue.filter('toHexColor', function (value) {
    return "#" + value.toString().substr(0,6);
});

var defaultImgLayer = [{
    id: "1",
    name : "OpenStreetMaps",
    provider : Cesium.createOpenStreetMapImageryProvider(),
    alpha : 0.7,
    show : false
},
{
    id: "2",
    name : "ArcGIS World Street Maps",
    provider : new Cesium.ArcGisMapServerImageryProvider({
        url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
    }),
    alpha : 0.5,
    show : false
}];
var defaultMapLayer = [{
    id: "1",
    name : "행정구역(시도)",
    color : "ff0000",
    provider : new Cesium.WebMapServiceImageryProvider({
                    url        : "http://localhost:9999/geoserver/mago3d/wms",
                    layers     : "mago3d:sk_sdo",
                    parameters : {
                        service     : "WMS",
                        version     : "1.1.1",
                        request     : "GetMap",
                        transparent : "true",
                        format      : "image/png",
                        env : "color:000000"
                    }
                }),
    alpha : 0.3,
    show : false
},
{
    id: "2",
    name : "행정구역(시군구)",
    color : "00ff00",
    provider : new Cesium.WebMapServiceImageryProvider({
                    url        : "http://localhost:9999/geoserver/mago3d/wms",
                    layers     : "mago3d:sk_sgg",
                    parameters : {
                        service     : "WMS",
                        version     : "1.1.1",
                        request     : "GetMap",
                        transparent : "true",
                        format      : "image/png",
                        env : "color:000000"
                    }
                }),
    alpha : 0.6,
    show : false
},
{
    id: "3",
    name : "행정구역(읍면동)",
    color : "0000ff",
    provider : new Cesium.WebMapServiceImageryProvider({
                    url        : "http://localhost:9999/geoserver/mago3d/wms",
                    layers     : "mago3d:sk_emd",
                    parameters : {
                        service     : "WMS",
                        version     : "1.1.1",
                        request     : "GetMap",
                        transparent : "true",
                        format      : "image/png",
                        env : "color:000000"
                    }
                }),
    alpha : 0.9,
    show : false
}];

function LayerControll(viewer)
{
    var imageryLayers = viewer.imageryLayers;

    createLayers(defaultImgLayer);
    createLayers(defaultMapLayer);

    var layerApp = new Vue({
        el : "#layerContent",
        data: {
            index : 0,
            selectedLayer : null,
            defaultLayer : null,
            showImgLayer : true,
            showMapLayer : true,
            imgLayers : JSON.parse(JSON.stringify(defaultImgLayer)),
            mapLayers : JSON.parse(JSON.stringify(defaultMapLayer)),
            defaultImgLayers : JSON.parse(JSON.stringify(defaultImgLayer)),
            defaultMapLayers : JSON.parse(JSON.stringify(defaultMapLayer))
        },
        beforeMount : function () {
            this.selectedLayer = this.imgLayers[0];
            this.defaultLayer = this.defaultImgLayers[0];
        },
        mounted : function () {
            // 레이어 옵션
            var range = $('#range-slider');
            var value = $('#range-value');
            var color = $('input[type="color"]');
            
            // 설정화면 투명도 값 변경 시 동작
            value.change(function(){
                var value = $(this).val();
                if(value < 0 ) value = 0;
                if(value > 100) value = 100;
                if(value.lastIndexOf("%") == 2) {
                    range.val(parseInt(value));
                } else {
                    $(this).val(parseInt(value) + "%");
                    range.val(parseInt(value));
                }
            });
            // 설정화면 투명도 슬라이더 변경 시 동작
            range.change(function(){
                value.val($(this).val() + "%");
            });
            color.change(function() {
                selectedColor = $(this).val();
                $(this).css('fill',selectedColor);
            });
            $('#settingLayer').find('.layerHeader .layerClose').click(function() {
                $('#settingLayer').removeClass('on').hide();
            });
            
            $('#closeBtn').click(function() {
                $('#settingLayer').removeClass('on').hide();
            });
        },
        methods : {
            initLayer : function() {
                //this.selectedLayer.show = this.defaultLayer.show;
                this.selectedLayer.alpha = this.defaultLayer.alpha;

                var layer = imageryLayers.get(this.index + 1);
                layer.alpha = this.selectedLayer.alpha;
                layer.show = this.selectedLayer.show;

                if(this.defaultLayer.color !== undefined && this.selectedLayer.color !== undefined)
                {
                    this.selectedLayer.color = this.defaultLayer.color;
                    layer._imageryProvider._resource._queryParameters.env = "color:" + this.selectedLayer.color;
                    layer._imageryProvider._tileProvider._resource._queryParameters.env = "color:" + this.selectedLayer.color;
                }

                imageryLayers.remove(layer, false);
                imageryLayers.add(layer, this.index + 1);
            },
            settingLayer : function (index, layer, defaultLayer)
            {
                this.index = index;
                this.selectedLayer = layer;
                this.defaultLayer = defaultLayer;

                var obj = $('#settingLayer');
                obj.toggleClass('on');
                obj.toggle(obj.hasClass('on'));        
                obj.center(); // 옵션창을 화면 중앙에 배치

                console.log("SettingLayer = " + layer);
            },
            updateLayer : function ()
            {
                var obj = $('#settingLayer');
                var opacity = $('#range-slider').val();
                var color = $('input[type="color"]').val();
                
                this.selectedLayer.alpha = parseInt(opacity)/100;

                var layer = imageryLayers.get(this.index + 1);
                layer.alpha = this.selectedLayer.alpha;
                layer.show = this.selectedLayer.show;

                if(color!== undefined && this.selectedLayer.color !== undefined)
                {
                    this.selectedLayer.color = color.substr(1,6);
                    layer._imageryProvider._resource._queryParameters.env = "color:" + this.selectedLayer.color;
                    layer._imageryProvider._tileProvider._resource._queryParameters.env = "color:" + this.selectedLayer.color;
                }

                imageryLayers.remove(layer, false);
                imageryLayers.add(layer, this.index + 1);
            },
            changeLayer : function (e, offset, group)
            {
                switch (group) {
                    case '0' :
                        var defaultLayer = this.defaultImgLayers;
                        break;
                    case '1' :
                        var defaultLayer = this.defaultMapLayers;
                        break;
                }

                var target = e.moved;
                if(target)
                {
                    defaultLayer.splice(target.newIndex, 0, defaultLayer.splice(target.oldIndex, 1)[0]);

                    var oldIndex = offset + target.oldIndex + 1;
                    var newIndex = offset + target.newIndex + 1;

                    var layer = imageryLayers.get(oldIndex);
                    imageryLayers.remove(layer, false);
                    imageryLayers.add(layer, newIndex);

                    console.log(target.element.id + "(" + target.element.name +")");
                    console.log(target.oldIndex + "-->" + target.newIndex);                    
                }
            },
            toggleLayer : function (index, layer)
            {
                layer.show = !layer.show;
                var imageryLayer = imageryLayers.get(index + 1);
                imageryLayer.show = layer.show;
            }
        }
    });

    function createLayers(layers)
    {
        for(var i = 0, len = layers.length; i < len; i++)
        {
            var layer = imageryLayers.addImageryProvider(layers[i].provider);
            layer.alpha = Cesium.defaultValue(layers[i].alpha, 1.0);
            layer.show = Cesium.defaultValue(layers[i].show, true);
            layer.name = layers[i].name;

            if(layers[i].color !== undefined)
            {
                layer._imageryProvider._resource._queryParameters.env = "color:" + layers[i].color;
                layer._imageryProvider._tileProvider._resource._queryParameters.env = "color:" + layers[i].color;
            }
        }
    }
}

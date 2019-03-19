var district = null;
var DISTRICT_PROVIDER = null;
function DistrictControll(viewer, option)
{
    district = new District(viewer);
}

function District(viewer)
{
    this.drawDistrict = function (name, sdo_code, sgg_code, emd_code) {
        var now = new Date();
        var rand = ( now - now % 5000) / 5000;
    
        this.deleteDistrict();
        
        // 시도(2) + 시군구(3) + 읍면동(3) + 리(2)
        var queryString = "bjcd = " + sdo_code.toString().padStart(2, '0') + sgg_code.toString().padStart(3, '0') + emd_code.toString().padStart(3, '0') + '00';
     
        var provider = new Cesium.WebMapServiceImageryProvider({
            url : "/geoserver/wms",
            layers : 'mago3d:district',
            parameters : {
                service : 'WMS'
                ,version : '1.1.1'
                ,request : 'GetMap'
                ,transparent : 'true'
                ,format : 'image/png'
                ,time : 'P2Y/PRESENT'
                ,rand:rand
                ,maxZoom : 25
                ,maxNativeZoom : 23
                ,CQL_FILTER: queryString
                //bjcd LIKE '47820253%' AND name='청도읍'
            },
            enablePickFeatures : false
        });
        
        DISTRICT_PROVIDER = viewer.imageryLayers.addImageryProvider(provider);
    }

    this.deleteDistrict = function () {
        if(DISTRICT_PROVIDER !== null && DISTRICT_PROVIDER !== undefined) {
            viewer.imageryLayers.remove(DISTRICT_PROVIDER, true);
        }
        DISTRICT_PROVIDER = null;
    }
}
loadDistrict();

var sdo_name = "";
var sgg_name = "";
var emd_name = "";
var sdo_code = "";
var sgg_code = "";
var emd_code = "";
var district_map_type = 1;

var defaultDistrictObject = '<li class="on">전체</li>';

function updateViewDistrictName()
{
	// 시군구가 blank
	if(sgg_name.trim() === "" || sdo_name === sgg_name) {
		// 읍면동이 blan 이거나 시도랑 같은 경우
		if(emd_name.trim() === "" || sdo_name === emd_name) {
			$("#viewDistrictName").html([sdo_name]);
		} else {
			$("#viewDistrictName").html([sdo_name, emd_name].join(" "));
		}
	} else {
		// 시도랑 시군구랑 다를때
		// 시도랑 읍면동이 같을때
		if(sdo_name === emd_name) {
			$("#viewDistrictName").html([sdo_name, sgg_name].join(" "));
		} else {
			if(sgg_name === emd_name) {
				$("#viewDistrictName").html([sdo_name, sgg_name].join(" "));
			} else {
				$("#viewDistrictName").html([sdo_name, sgg_name, emd_name].join(" "));
			}
		}
			
		if(sgg_name === emd_name) {
			$("#viewDistrictName").html([sdo_name, sgg_name].join(" "));
		} else {
			$("#viewDistrictName").html([sdo_name, sgg_name, emd_name].join(" "));
		}
	}
}
/**
 * 시도 목록을 로딩
 */
function loadDistrict()
{
    var url = "./searchmap/sdos";
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success : function(msg) {
            if(msg.result === "success") {
                var sdoList = msg.sdoList;
                var content = "";

                content += defaultDistrictObject;
                for(var i=0, len=sdoList.length; i < len; i++)                    
                {
                    var sdo = sdoList[i];
                    content += '<li onclick="changeSdo(this, '+sdo.sdo_code+')">'+sdo.name+'</li>';
                }
                $('#sdoList').html(content);
            }
        },
        error : function(request, status, error) {
            console.log("code : " + request.status + "\n message : " + request.responseText + "\n error : " + error);
        }
    });
}

// 시도가 변경되면 하위 시군구, 읍면동이 변경됨
function changeSdo(_this, _sdo_code) {
    sdo_code = _sdo_code;
    sgg_code = "";
    emd_code = "";
    district_map_type = 1;

    var url = "./searchmap/sdos/" + sdo_code + "/sggs";
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success : function(msg) {
            if(msg.result === "success") {
                var sggList = msg.sggList;
                var content = "";

                content += defaultDistrictObject;
                for(var i=0, len=sggList.length; i < len; i++)                    
                {
                    var sgg = sggList[i];
                    content += '<li onclick="changeSgg(this, '+sdo_code+', '+sgg.sgg_code+')">'+sgg.name+'</li>';
                }
                sdo_name = $(_this).text();
                sgg_name = "";
                emd_name = "";

                $('#sggList').html(content);
                $('#emdList').html(defaultDistrictObject);

                $("#sdoList li").removeClass("on");
                $(_this).addClass('on');

                updateViewDistrictName();
            }
        },
        error : function(request, status, error) {
            console.log("code : " + request.status + "\n message : " + request.responseText + "\n error : " + error);
        }
    });
}

// 시군구가 변경되면 하위 읍면동이 변경됨
function changeSgg(_this, _sdo_code, _sgg_code) {
    sdo_code = _sdo_code;
    sgg_code = _sgg_code;
    emd_code = "";
    district_map_type = 2;

    var url = "./searchmap/sdos/" + sdo_code + "/sggs/" + sgg_code + "/emds" ; 
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success : function(msg) {
            if(msg.result === "success") {
                var emdList = msg.emdList;
                var content = "";

                content += defaultDistrictObject;
                for(var i=0, len=emdList.length; i < len; i++)                    
                {
                    var emd = emdList[i];
                    content += '<li onclick="changeEmd(this, '+sdo_code+', '+sgg_code+', '+emd.emd_code+')">'+emd.name+'</li>';
                }
                sgg_name = $(_this).text();
                emd_name = "";

                $('#emdList').html(content);

                $("#sggList li").removeClass("on");
                $(_this).addClass('on');

                updateViewDistrictName();
            }
        },
        error : function(request, status, error) {
            console.log("code : " + request.status + "\n message : " + request.responseText + "\n error : " + error);
        }
    });
}

// 읍면동을 선택
function changeEmd(_this, _sdo_code, _sgg_code, _emd_code)
{
    sdo_code = _sdo_code;
    sgg_code = _sgg_code;
    emd_code = _emd_code;
    district_map_type = 3;

    emd_name = $(_this).text();

    $("#emdList li").removeClass("on");
    $(_this).addClass('on');

    updateViewDistrictName();
}

$("#districtFlyButton").click(function () {
    var name = [sdo_name, sgg_name, emd_name].join(" ").trim();
    district.drawDistrict(name, sdo_code, sgg_code, emd_code);
    getCentroid(name, sdo_code, sgg_code, emd_code);
});

$("#districtCancleButton").click(function () {
    district.deleteDistrict();
});


function getCentroid(name, sdo_code, sgg_code, emd_code) {
    var layerType = district_map_type;
    var bjcd = sdo_code.toString().padStart(2, '0') + sgg_code.toString().padStart(3, '0') + emd_code.toString().padStart(3, '0') + '00';
    var time = 3;

    var info = "layer_type=" + layerType + "&name=" + name  + "&bjcd=" + bjcd;
    $.ajax({
        url: "./searchmap/centroids",
        type: "GET",
        data: info,
        dataType: "json",
        success : function(msg) {
            if(msg.result === "success") {
                var altitude = 50000;
                if(layerType === 2) {
                    altitude = 15000;
                } else if(layerType === 3) {
                    altitude = 1500;
                }
                gotoFly(msg.longitude, msg.latitude, altitude, time);
            } else {
                alert(msg.result);
            }
        },
        error : function(request, status, error) {
            //alert(JS_MESSAGE["ajax.error.message"]);
            console.log("code : " + request.status + "\n message : " + request.responseText + "\n error : " + error);
        }
    });		
}

function DistrictControll(viewer, option)
{
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
    $("#viewDistrictName").html([sdo_name, sgg_name, emd_name].join(" "));
}
/**
 * 시도 목록을 로딩
 */
function loadDistrict()
{
    var url = "/searchmap/sdos";
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
function changeSdo(_this, sdo_code) {
    var url = "/searchmap/sdos/" + sdo_code + "/sggs";
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
function changeSgg(_this, sdo_code, sgg_code) {
    var url = "/searchmap/sdos/" + sdo_code + "/sggs/" + sgg_code + "/emds" ; 
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
function changeEmd(_this, sdo_code, sgg_code, emd_code)
{
    emd_name = $(_this).text();

    $("#emdList li").removeClass("on");
    $(_this).addClass('on');

    updateViewDistrictName();
}
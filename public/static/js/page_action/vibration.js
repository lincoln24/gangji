require.config({
    baseUrl: "/static/js/",
    shim: {
        "md5":["jquery"],
        "Validform":["jquery"],//验证插件
        "PCtc":["jquery"]//弹窗插件
    },
    paths: {
        "jquery": "./jquery-1.9.1",
        "md5":"md5",
        "Validform":"./Validform_v5.3.2_min",//验证插件
        "PCtc":"tc.all", //弹窗插件
        "pc_public":"page_action/public_amd",//pc 公共函数
        "public":"page_action/public",// pc 和 lcd共用函数
        "nav":"page_action/nav"
    }
});
require(['nav','vibration'], function (nav, vibration){
    nav.index_init();
    vibration.get_zone_list();
    vibration.datainterval();
});

// JavaScript Document
define(["jquery","public"],function($,pub){
    var get_zone_list=function(){
        $.ajax({
            type: "POST",
            data: {"user_id": 1},
            url: "/index/user/get_zone_list",
            success: function (returnData) {
                var data = JSON.parse(returnData);
                if(data.code == 0)
                {
                    var zone_list = data.data;
                    // alert(data);
                    var idn_zone=$("#zone_list");
                    var html='';
                    idn_zone.empty();
                    html += '<span onclick=change_zone('+zone_list[0].ZoneId+')';
                    html += ' id=zone_list_'+zone_list[0].ZoneId;
                    html += ' class="statics-figcaption-click">'+zone_list[0].ZoneDesc+'</span>'
                    for(var i=1;i<zone_list.length;i++){
                        html += '<span onclick=change_zone('+zone_list[i].ZoneId+')';
                        html += ' id=zone_list_'+zone_list[i].ZoneId+'>';
                        html += zone_list[i].ZoneDesc+'</span>';
                    }
                    idn_zone.html(html);
                    vibration_ajax(zone_list[0].ZoneId);
                }
            }
        });
    };

    /**实时数据ajax*/
    var vibration_ajax=function(zone_id){
        // $("#EnvPagecc0,#EnvPagecc1").removeClass("page_no_data");
        $.ajax({
            type: "POST",
            data: {"zone_id": zone_id},
            url: "/index/vibration/get_vibration_data",
            success: function (data) {
                if(!pub.ifNullData(data)){
                    // alert(data);
                    vibration_bar_data(data);//图表
                }else{
                    // alert("no data");
                    $("#env_realData_container").html('暂无数据');
                }
                $("#keep_Env").find(".loading_center").hide();//loading
            }
        });
    };
    var vibration_bar_data=function(returnData){//获取图表数据
        var i= 0,table_html = [];
        $.each(JSON.parse(returnData),function(key,value){
            var n=Math.floor(i/8);
            if(i%8==0){table_html[n]=''}
            table_html[n]+=vibration_create_table_cc_rule(key,value);
            i++;
        });

        real_time_data_table_create(table_html);//环境实时数据
    };

    /*******************************环境实时数据*******************************/
    var vibration_create_table_cc_rule=function(key,value){
        return '<table class="grey_env_table">' +
                '<tbody>' +
                '<tr>' +
                '<td class="grey_td">'+value.Name+'</td>' +
                '</tr>' +
                '<tr>' + 
                pub.dev_state_rule($('<td></td>'),value.Status) +
                '</tr>' +
                '</tbody>' +
                '</table>';
    };
    var real_time_data_table_create=function(table_html){
        var idn_envc=$("#env_realData_container");
        var html='';
        idn_envc.empty();
        for(var i=0;i<table_html.length;i++){
            if(!pub.ifNullData(table_html[i])){
                html+='<div class="all_table_container env_minitable">'+
                        '<table id="Env_title_table"><tbody>' +
                        '<tr><td colspan="2">名称</td></tr>' +
                        '<tr><td colspan="2" class="light_blue_td">状态</td></tr>' +
                        '</tbody></table>'+table_html[i]+
                        '</div><br>';
            }
        }
        idn_envc.html(html);
        var idn_enT=$(".env_minitable");
        if(idn_enT.length>0){
            idn_enT.width(1360);
        }
    };
    var datainterval=function(){//设置定时器，实时刷新数据
        // pub.static_fig_click(".ccontainer");
        pub.TimerArray_Lister("vibration",function() {
            var vibrationI=setInterval(function () {
                // env_ajax();
            }, 5000);
            return vibrationI;
        });
    };
    return {
        get_zone_list:get_zone_list,
        vibration_ajax:vibration_ajax,
        datainterval:datainterval
    }
});

function change_zone(zone_id){
    // alert(zone_id);
    $("#zone_list").children("span").removeClass("statics-figcaption-click");
    $("#zone_list_"+zone_id).addClass("statics-figcaption-click");
    require(['vibration'], function (vibration){
        vibration.vibration_ajax(zone_id);
    });
}
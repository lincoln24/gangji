// JavaScript Document
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
        "nav":"page_action/nav"
    }
});
requirejs(['jquery','nav','pc_public'], function ($,nav,PCpub){
    /*总体信息info同高*/
    var infor_high=function(){
        var infor_h=[];
        var idn=$(".Em_info_cotainer_ul");
        idn.each(function(index){
            infor_h[index]=$(this).height();
        });
        var max_infor_h=Math.max.apply(null, infor_h);
        idn.height(max_infor_h);
    };
    /*系统总运行时间  时钟 每秒一次*/
    var EmG_time=function(){
        var t=runtime;
        if(jQuery.isEmptyObject(t)){
            t="---";
            $("#runTime").html(t);
        }
        else{
            t=parseFloat(runtime);
            setInterval(function(){
                t+=1;
                $("#runTime").html(showDivideTime(t));
            },1000);
        }
    };
    /*数据添加单位*/
    var EmG_word=function(){
        $("#storage_hd").html(
            PCpub.data_null((Number(storage_hdu)).toFixed(2))+"/"+
            PCpub.data_null((Number(storage_hdt)).toFixed(2)));
    };
    /*联机方式*/
    var netway_rule=function(idn,id){
        if(idn==0){
            $("#"+id).html(net_way_manual);
        }else{
            $("#"+id).html(net_way_auto);
        }
    };
    /*存储方式*/
    var his_store_rule=function(idn,id){
        if(idn==0){
            $("#"+id).html("Flash");
        }else if(idn==1){
            $("#"+id).html(SYS_SD);
        }else if(idn==2){
            $("#"+id).html(COMMOM_HARD_DISK);
        }
    };
    /*时间换算为dd:hh:mm:ss格式*/
    var showDivideTime=function(totalTime){
        var s= 0,m= 0,h= 0,d=0;
        if(totalTime>59){
            s=totalTime%60;
            var temp_m= parseInt(totalTime/60);
            if(temp_m>59){
                m=temp_m%60;
                var temp_h=parseInt(temp_m/60);
                if(temp_h>23){
                    h=temp_h%24;
                    d=parseInt(temp_h/24);
                }
                else {
                    h=temp_h;
                }
            }
            else {
                m=temp_m;
            }
        }
        else {
            s=totalTime;
            m=h=d=0;
        }
        return PCpub.ten_form(d)+":"+PCpub.ten_form(h)+":"+PCpub.ten_form(m)+":"+PCpub.ten_form(s);
    };
    var EmGeneral=function(){
        // PCpub.before_load(2);
        EmG_word();/*系统总运行时间  时钟 每秒一次*/
        EmG_time();/*数据添加单位*/
        infor_high();
    };

    var get_table_data=function(){
        $.ajax({
            type: "POST",
            data: {"user_id": 1},
            url: "/index/zone/get_devtype_list",
            success: function (returnData) {
                var i= 0,table_html = "";
                data = JSON.parse(returnData).data;
                $.each(data,function(key,value){
                    $.each(value.devtype_list,function(dkey,dvalue){
                        if(dkey == 0){
                            table_html+='<tr>'+
                                      '<td rowspan="'+value.devtype_list.length+'">'+value.ZoneDesc+'</td>'+
                                      '<td><a>'+dvalue.typeName+'</a></td>'+
                                      '<td>'+dvalue.total+'</td>'+
                                      '<td>'+dvalue.abnormal+'</td>'+
                                      '</tr>';

                        }else{
                            table_html+='<tr>'+
                                      '<td><a>'+dvalue.typeName+'</a></td>'+
                                      '<td>'+dvalue.total+'</td>'+
                                      '<td>'+dvalue.abnormal+'</td>'+
                                      '</tr>';
                        }
                    });
                });

                real_time_data_table_create(table_html);
            }
        });
    };

    var real_time_data_table_create=function(table_html){
        var idn=$("#deviceInfoTable");
        var html='';

        idn.empty();
        html += '<tr>'+
                '<td width="25%">所在区域</td>'+
                '<td width="25%">设备类型</td>'+
                '<td width="25%">设备总数</td>'+
                '<td width="25%">异常总数</td>'+
                '</tr>';
        html += table_html;
        idn.html(html);
    };

    //调用
    nav.index_init();
    EmGeneral();
    get_table_data();
});

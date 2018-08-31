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

        "echarts":"chart/echarts",//图表插件

        "pc_public":"page_action/public_amd",//pc 公共函数
        "public":"page_action/public",// pc 和 lcd共用函数
        "nav":"page_action/nav"
    }
});
require(['nav','temp'], function (nav, temp){
    nav.index_init();
    temp.get_zone_list();
    // temp.env_ajax();
    temp.Envdatainterval();
});

// JavaScript Document
define(["jquery","echarts","public"],function($,echarts,pub){
    var Envchart=[];
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
                    var idn_zone=$("#zone_list");
                    var html='';
                    idn_zone.empty();
                    html += '<span onclick=change_zone('+zone_list[0].ZoneId+')';
                    html += ' id=zone_list_'+zone_list[0].ZoneId;
                    html += ' class="statics-figcaption-click">'+zone_list[0].ZoneName+'</span>'
                    for(var i=1;i<zone_list.length;i++){
                        html += '<span onclick=change_zone('+zone_list[i].ZoneId+')';
                        html += ' id=zone_list_'+zone_list[i].ZoneId+'>';
                        html += zone_list[i].ZoneName+'</span>';
                    }
                    idn_zone.html(html);
                    env_ajax(zone_list[0].ZoneId);
                }
            }
        });
    };

    /**实时数据ajax*/
    var env_ajax=function(zone_id){
        // $("#EnvPagecc0,#EnvPagecc1").removeClass("page_no_data");
        $.ajax({
            type: "POST",
            data: {"zone_id": zone_id},
            url: "/index/temp/get_temp_sensor_data",
            success: function (returnData) {
                data = JSON.parse(returnData).data;
                if(!pub.ifNullData(data)){
                    // alert(data);
                    env_bar_data(data);//图表
                }else{
                    // alert("no data");
                    Envchart[0].setOption({
                        series : [
                            {data: null}
                        ]
                    });
                    Envchart[1].setOption({
                        series : [
                            {data: null}
                        ]
                    });
                    pub.Air_create_label("#env_temp_label",null,0,null);
                    pub.Air_create_label("#env_humi_label",null,1,null);
                    // $("#EnvPageth,#EnvPagecc1").addClass("page_no_data");
                }
                $("#keep_Env").find(".loading_center").hide();//loading
            }
        });
    };
    var env_bar_data=function(returnData){//获取图表数据
        var temp=[],humi=[];
        var tempX=[],name=[];
        var i= 0,table_html=[];
        $.each(returnData,function(key,value){
            temp.push(pub.echart_null_data(value.Temp,2));
            name.push(value.Name);
            tempX.push(pub.ten_check(key));//横坐标
            humi.push(pub.echart_null_data([80.4-i*5,0],2));
        });

        bar_chart_rule('env_temp_chart',temp,tempX,0);
        bar_chart_rule('env_humi_chart',humi,tempX,1);
        pub.Air_create_label("#env_temp_label",tempX,0,name);
        pub.Air_create_label("#env_humi_label",tempX,1,name);
    };
    /*******************************环境图示*******************************/
     //图表配置
    var bar_chart_rule=function(idn,data,tempX,flag){
        if(pub.ifNullData(Envchart[flag])) {//首次加载
            var color,name,Cunit,CFontsize,Cleft,Cright;
            switch(flag){
                case 0:
                    color=['#44b7be','#f45c5b'];
                    Cunit='(℃)';
                    name='温度'+Cunit;
                    break;
                case 1:
                    color=['#aad971','#fbb033'];
                    Cunit='(V)';
                    name='电压'+Cunit;
                    break;
                default:
                    break;
            }
                CFontsize=14;
                Cleft='2.5%';
                Cright='2.1%';
            pub.Home_chart_init(idn);
            Envchart[flag] = echarts.init(document.getElementById(idn));
            var option = {
                color :color,
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow',        // 默认为直线，可选为：'line' | 'shadow'
                        shadowStyle:{opacity:0}
                    }
                },
                legend: {
                    textStyle: {
                        color :color,
                        fontSize:CFontsize
                    },
                    right : '3%',
                    data:[name]
                },
                grid: {
                    left: Cleft,
                    right: Cright,
                    top:'15%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [{
                    axisLine  : {lineStyle : {color :  '#647798'}},
                    type : 'category',
                    data : [],
                    axisTick : {show : false}
                }],
                yAxis : [{
                        type : 'value',
                        name : name,
                        nameLocation : 'end',
                        nameGap : CFontsize,
                        nameTextStyle:{fontSize:CFontsize},
                        splitLine  : {lineStyle : {type : 'dashed'}},
                        axisLine  : {lineStyle : {color :  '#647798'}},
                        axisLabel:{textStyle:{fontSize:CFontsize-2}}
                }],
                series : [{
                        name:name,
                        type:'bar',
                        barWidth : '15%',
                        data:data
                    }]
            };            
            Envchart[flag].setOption(option);
        }else{
            Envchart[flag].setOption({
                series : [
                    {data: data}
                ]
            });
        }
        pub.air_null_data(idn,data);//空数据
    };
    var Envdatainterval=function(){//设置定时器，实时刷新数据
        // pub.static_fig_click(".ccontainer");
        pub.mainchart_WH_init(2,'env_temp_chart',0.95,0.35);
        pub.mainchart_WH_init(2,'env_humi_chart',0.95,0.35);
        pub.TimerArray_Lister("Env",function() {
            var EnvI=setInterval(function () {
                // env_ajax();
            }, 5000);
            return EnvI;
        });
    };
    return {
        get_zone_list:get_zone_list,
        env_ajax:env_ajax,
        Envdatainterval:Envdatainterval
    }
});

function change_zone(zone_id){
    // alert(zone_id);
    $("#zone_list").children("span").removeClass("statics-figcaption-click");
    $("#zone_list_"+zone_id).addClass("statics-figcaption-click");
    require(['temp'], function (temp){
        temp.env_ajax(zone_id);
    });
}
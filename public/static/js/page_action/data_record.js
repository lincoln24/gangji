// JavaScript Document
require.config({
    baseUrl: "/static/js/",
    shim: {
        "md5":["jquery"],
        "Validform":["jquery"],//验证插件
        "PCtc":["jquery"],//弹窗插件

        "mobiscroll":["jquery"], //时间插件
        "My97DatePicker":["jquery"], //时间插件
    },
    paths: {
        "jquery": "./jquery-1.9.1",
        "md5":"md5",
        "Validform":"./Validform_v5.3.2_min",//验证插件
        "PCtc":"tc.all", //弹窗插件

        "mobiscroll":"./mobiscroll/mobiscroll.custom-2.5.2.min",
        "My97DatePicker":"My97DatePicker/WdatePicker", //日期插件
        "jqueryui":"jquery-ui.min",//jquery-ui
        "echarts":"chart/echarts",//图表插件

        "pc_public":"page_action/public_amd",//pc 公共函数
        "public":"page_action/public",// pc 和 lcd共用函数
        "nav":"page_action/nav",
    }
});
require(['nav','data_record',"pc_public"], function (nav,data_record,PCpub){
    nav.index_init();
    data_record.HistoryData_init();
    data_record.HistoryData_get_ajax();
    data_record.radio_action();
    $("#hisD_return").click(function(){
        PCpub.goLCD_page('HistoryData/main/type/0')
    });
});

define(["jquery","echarts","public","pc_public","mobiscroll",'jqueryui',"My97DatePicker"],
		function($,echarts,pub,PCpub){
	var myChart =[];
	var DevType;//设备类型
	var zoneId;//区域编号
	var hisD_slider,SliderChange= 0,slider_time;//滑条

	var set_chart_datazoom=function(startV,endV,flag){
		var index=get_show_chartIndex();
		if(flag=='zoom'){
			var arr=hisD_slider.slider( "values");
			var arrStart=Number(arr[0])+startV;
			var arrEnd=Number(arr[1])+endV;
			if(arrStart<=arrEnd){
				hisD_slider.slider( "values", [arrStart,arrEnd] );
			}
		}
		HistoryData_chart_ajax(index,0);
	};
	//范围滑条初始化
	var historyData_jqui_range=function(maxV){
		SliderChange=0;
		var maxValue=(maxV-1)>0?(maxV-1):0;
		$("#his_time_slider").empty().append('<span id="hisD_slide_range" class="hisD_range_c"></span>');
		hisD_slider=$( "#hisD_slide_range" ).slider({
			range: true,
			min: 0,
			max: maxValue,
			values: [ 0, maxValue ],
			change: function( event, ui ) {
				if(ui.values[ 0 ]==0 && ui.values[1]==maxValue){
					SliderChange=0;
				}else{
					SliderChange=1;
				}
				set_chart_datazoom(ui.values[ 0 ],ui.values[ 1 ]);
			}
		});
	};
	/**
	 获取ajax路径及图表文字
	 **/
	var get_historyData_url=function(){
		var array='',idn;
		idn=$("#hDC_t").find('option:selected');
		var d_index=Number(idn.attr('dindex'));
		var d_type=idn.attr('dtype');
		array=[['温度(℃)',['温度']]];
		return array;
	};

	//图表step 1   获取设备名称
	var get_hisD_title=function(){
		myChart =[];
		$.ajax({
			type: "POST",
			data: {
				"zone_id":zoneId,
				"type":DevType
				},
			url:  "/index/equip/get_conf",
			success: function (returnData) {
				var idn_cc=$("#history_cc");
				var html_t='',html_c='';
				data = JSON.parse(returnData).data;
				if(!pub.ifNullData(data)){
					$.each(data,function(key,value){
						var dname=value.Name;//设备名称
						var dtype=value.SensorType;
						var dindex=value.SensorId;
						var message='chartIndex="'+dindex+'" dtype="'+dtype+'" dindex="'+dindex+'"';
						
						html_t+='<option '+message+'>'+dname+'</option>';

						html_c+='<div class="hDC_content" HDtip="'+dindex+'" id="hDC_content'+dindex+'">' +
								'<span class="loading_center"></span>' +
								'</div>';
					});
				}else{
					idn_cc.addClass('page_no_data');//暂无数据
				}
				$("#hDC_t").html(html_t);
				idn_cc.html(html_c);
				hisD_getlist_ajax();//图表step 3 数据交互
			}
		});
	};

	//图表step 3 数据交互
	var hisD_getlist_ajax=function(){
		var idn=$("#hDC_t").find("span");
		if(!idn.hasClass("statics-figcaption-click")){
			var idn_span=idn.eq(0);
			var chartIndex=idn_span.attr('chartindex');
			idn.eq(0).addClass("statics-figcaption-click");
			$("#history_cc").find(".hDC_content[hdtip="+chartIndex+"]").css("visibility","visible");
		}
		historyD_fig_click(".hDC_content");
		HistoryData_chart_ajax(get_show_chartIndex(),0);
	};
	/**图表step 4 创建图表
	 * flag 0图表  1表格
	 * @param num
	 * @param flag
	 * @param page
     * @constructor
     */
	var HistoryData_timer=0;
	var HistoryData_chart_ajax=function(num,flag,page){
		var getdata={},my_hisURL;
		var dev_ID=$("#historyData_id").val();
		var radio_interval=$("#hisChart_time").find("input:radio:checked").val();//年月日时
		var Lname=get_historyData_url();//图例名
		$(".hDC_content").html('<span class="loading_center"></span>');
		$(".hisD_zoom,#his_time_slider").hide();
		if(isNaN(num)){
			bmsN=bmsN.split('_')[1];
		}

		var dev_index0;
		if(DevType==6){//用户
			dev_index0=$("#hDC_t").find(".statics-figcaption-click").attr('dindex');
		}else{
			dev_index0=dev_ID;
		}
		getdata['dev_type']=DevType;
		getdata['dev_index']=dev_index0;
		getdata['interval']=radio_interval;

		var timeR=get_search_time();//时间范围
		getdata['start']=timeR.start;
		getdata['end']=timeR.end;
		var chart_Ajax=$.ajax({
			type: "POST",
			timeout:10000,
			url: "/index/equip/get_his_data",
			data: getdata,
			success: function (returnData) {
				data = JSON.parse(returnData).data;
				data_record_show(data,num);
				// var chart_array=historyData_ChartData(data,Lname);//数据
				// history_data_chart_rule(chart_array,Lname,num);
				// chart_array=null;
			},
			error:function(XMLHttpRequest,textStatus ,errorThrown){
				chart_Ajax.abort();
				if(textStatus=="timeout"){
					$("#hDC_content"+num).html("<span class='hisD_timeout'>请求超时，请稍后再试。</span>");
				}else{
					$("#hDC_content"+num).html("<span class='hisD_timeout'>请求失败，请稍后再试。</span>");
				}
			},
			complete:function(XMLHttpRequest,status){ //请求完成后最终执行参数
				if(status=='timeout'){//超时,status还有success,error等值的情况
					HistoryData_timer+=10000;
					if(HistoryData_timer<15000){
						HistoryData_chart_ajax(num,flag,page)
					}else{
						chart_Ajax.abort();
						$("#hDC_content"+num).html("<span class='hisD_timeout'>请求超时，请稍后再试。</span>");
					}
				}
			}
		});
	};

	var data_record_show=function(returnData,number){//折线图
		var idn="hDC_content"+number;//图表id
		$(".hDC_content").css('visibility','hidden');
		$("#"+idn).css('visibility','visible');
		var i = 0;
		var time_f = [];
		var dev_data = [];
		$.each(returnData,function(key,value){
			time_f[i] = value.time_f;
			dev_data[i] = value.dev_data;
			i++;
		});

		if(myChart[number]){
			myChart[number].clear();
			myChart[number].dispose();
		}
		$("#"+idn).empty();
		var mainContainer = document.getElementById(idn);
		mainContainer.style.width = window.innerWidth*0.9+'px';
        mainContainer.style.height = window.innerHeight*0.5+'px';
		myChart[number] = echarts.init(mainContainer);
		// myChart[number].resize();
		option = {
		    title : {
		        text: '数据图表'
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:['温度']
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            boundaryGap : false,
		            data : time_f
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value',
		            axisLabel : {
		                formatter: '{value} °C'
		            }
		        }
		    ],
		    series : [
		        {
		            name:'温度',
		            type:'line',
		            data:dev_data,    
		            itemStyle: {
				        normal: {
				            color: "#2ec7c9",
				            lineStyle: {
				                color: "#2ec7c9"
				            }
				        }
				    },
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            }
		        }
		    ]
		};
		myChart[number].setOption(option);
		window.onresize = myChart[number].resize();
		option=null;
	};


	var hisD_change_height=function(){//高度调整
		var idn=$("#history_cc");
		idn.removeClass('hDC_c_small hDC_c_min hDC_c_mm');
		if($("#more_hDC_t").css('display')=='none'){
			if($(".TimeRange_cc").length!=0){//时
				idn.addClass('hDC_c_min');//210
			}
		}else{
			if($(".TimeRange_cc").length!=0){//时
				idn.addClass('hDC_c_mm');//190
			}else{
				idn.addClass('hDC_c_small');//180
			}
		}
	};
	//点击切换
	var historyD_fig_click=function(classname){
		var idn=$("#hDC_t").find("span");
		var idn_HistoryData=$("#load_HistoryData");
		idn.css("width",idn.parent().width()/idn.length);
		idn.unbind("mousedown").bind("mousedown",function(){
			var index_n=$(this).attr('chartIndex');
			$(this).parent().children("span").removeClass("statics-figcaption-click");
			$(this).addClass("statics-figcaption-click");
			if(pub.ifNullData($(this).attr("chartRang"))){
				$("#more_hDC_t").hide();
				idn_HistoryData.find(classname).css("visibility","hidden");
				idn_HistoryData.find(classname+'[hdtip='+index_n+']').css("visibility","visible");
				HistoryData_chart_ajax(index_n,0);
			}else{
				var ref=$(this).attr("chartRang").split("#");
				var html='',mimT='';
				if(ref.length==3){mimT=ref[2]}
				for(var i=Number(ref[0]);i<(Number(ref[1])+1);i++){
					html+='<span chartIndex="page_'+i+'">'+mimT+i+'</span>';
				}
				$("#more_hDC_t").html(html).show();
				var idn_more=$("#more_hDC_t").find("span");
				idn_more.css("width",idn_more.parent().width()/idn_more.length);
				//子菜单点击切换
				idn_more.off("mousedown").on("mousedown",function(){
					var chartIndex=$(this).attr('chartIndex');
					$(this).parent().children("span").removeClass("more_hDC_t_click");
					$(this).addClass("more_hDC_t_click");
					idn_HistoryData.find(classname).css("visibility","hidden");
					idn_HistoryData.find(classname+'[hdtip='+chartIndex+']').css("visibility","visible");
					HistoryData_chart_ajax(chartIndex,0);
				});
				idn_more.eq(0).trigger('mousedown');
			}
			hisD_change_height();//高度调整
			if(!pub.ifNullData(myChart[index_n])){
				myChart[index_n].resize();
			}
		});
	};
	var time_rage_action=function(){
		var idnR=$("#hisChart_time").find(".TimeRange");
		idnR.off('mousedown').on('mousedown',function(){
			idnR.removeClass('TimeRange_check');
			$(this).addClass('TimeRange_check');
			hisD_search_result();//获取查询结果
		});
	};
	//获取图表查询时间
	var get_search_time=function(){
		var idn_T=$("#hisChart_time");
		var startT,endT;
		if(SliderChange==0){
			if(idn_T.find('input:radio:checked').val()==6){//时
				var idn_r=idn_T.find('.TimeRange_check');
				startT=idn_r.attr('start');
				endT=idn_r.attr('end');
			}else{
				startT=$("#historyChart_start").val();
				endT=$("#historyChart_end").val();
			}
		}else{
			var timeA=slider_time;
			var arrN=hisD_slider.slider( "values");
			startT=timeA[arrN[0]];
			endT=timeA[arrN[1]];
		}
		return {'start':startT,'end':endT}
	};
	var get_show_chartIndex=function(){
		var num;
		num=$("#hDC_t").find("option:selected").attr('chartindex');
		return num;
	};
	var hisD_radio_rule=function(){
		var idn_myChart=myChart[get_show_chartIndex()];//图表
		var idn_ChartTime=$("#hisChart_time");
		var timeRadio_V=idn_ChartTime.find('input:radio:checked').val();
		if(timeRadio_V==6){//时
			idn_ChartTime.find('li:gt(1)').hide();

			var nowT=pub.getTimeNumber(pub.getNowFormatDate('datetime'));//时间戳
			var html_t='';
			for(var i=0;i<16;i++){
				var date=pub.getLocalTime(nowT-1800*i);
				var date_1=pub.getLocalTime(nowT-1800*(i+1));
				var tt=date.split(" ")[1].substring(0,5);
				var tt_1=date_1.split(" ")[1].substring(0,5);
				html_t+='<a class="TimeRange" end="'+date+'" start="'+date_1+'">'+tt+'-'+tt_1+'</a>';
			}
			idn_ChartTime.find(".TimeRange_cc").remove();
			idn_ChartTime.append('<p class="TimeRange_cc">'+html_t+'</p>');
			idn_ChartTime.find('.TimeRange').eq(0).addClass('TimeRange_check');
			time_rage_action();//时间范围点击
			nowT=null;
		}else{
			idn_ChartTime.find('p').remove();
			idn_ChartTime.find('li:gt(1)').show();

			var now_t=pub.getNowFormatDate('datetime');
			var timeY=now_t.split('-');
			if(timeRadio_V==5){//年
				$("#historyChart_start").val((Number(timeY[0])-1)+'-'+timeY[1]+'-'+timeY[2]);//年
			}else if(timeRadio_V==3){//月
				$("#historyChart_start").val(HisD_mounth());//月
			}else if(timeRadio_V==1){//日
				var timeD=timeY[2].split(' ');
				$("#historyChart_start").val(timeY[0]+'-'+timeY[1]+'-'+pub.ten_check(Number(timeD[0])-1)+' '+timeD[1]);//日
			}
			$("#historyChart_end").val(now_t);
			now_t=null;
		}
		hisD_change_height();//高度调整
		if(!pub.ifNullData(idn_myChart)){
			idn_myChart.resize();
		}
	};
	var HisD_mounth=function(){//月
		var time=pub.getNowFormatDate('datetime');
		var chart_b='';
		if(!pub.ifNullData(time)){
			var chart_dateS=time.split('-');
			if(chart_dateS[1]==1){
				chart_b=(Number(chart_dateS[0])-1)+'-'+12+'-'+chart_dateS[2];
			}else{
				chart_b=chart_dateS[0]+'-'+pub.ten_check(Number(chart_dateS[1])-1)+'-'+chart_dateS[2];
			}
		}
		time=null;
		return chart_b;
	};
	var hisD_search_result=function(){//获取查询结果
		var gIndex=get_show_chartIndex();
		SliderChange=0;
		HistoryData_chart_ajax(gIndex,$(".selectes_a").index(),1);
	};
	var radio_action=function(){//动作
		$("#hisChart_time").find("input:radio").unbind("click").bind("click",function(){
			hisD_radio_rule();
			hisD_search_result();//获取查询结果
		});
		$("#HistoryChart_search").unbind("mousedown").bind("mousedown",function(){//图表查询
			var flag= 0,warnW='';
			var radio_interval=$("#hisChart_time").find("input:radio:checked").val();//年月日时
			var startV=$("#historyChart_start").val();
			var endV=$("#historyChart_end").val();
			if(radio_interval==1){//日  7天
				var s1=pub.getTimeNumber(startV);
				var s2=pub.getTimeNumber(endV);
				warnW="时间范围不能超过7天！";
				if(((s2-s1) / 60 / 60 / 24)>7){
					flag=1;
				}
			}else if(radio_interval==3){//月  12月
				var m1=startV.split('-');
				var m2=endV.split('-');
				warnW="时间范围不能超过12个月！";
				if(m1[0]!=m2[0]){
					if(Number(m2[0])-Number(m1[0])>1){
						flag=1;
					}else{
						var mounthN=(12-Number(m1[1]))+Number(m2[1]);
						if(mounthN>12){
							flag=1;
						}
					}
				}
			}
			if(flag==0){
				hisD_search_result();//获取查询结果
			}else{
				pub.validform_wrong_tip(warnW,"historyData_r");//提示
			}
		});
	};
	var HistoryData_init=function(){//初始化
		var firstpage = 1;
		DevType=PCpub.url_value("type");
		zoneId=PCpub.url_value("zone");
		$("#historyData_dev_type").val(DevType);
		$("#historyData_id").val(1);
		PCpub.wdate_init("historyChart_start","historyChart_end",'yyyy-MM-dd HH:mm');
	};
	var HistoryData_get_ajax=function(){//数据交互
		setTimeout(function(){hisD_radio_rule();},1000)
		get_hisD_title();//获取设备名称
	};

	return {
		HistoryData_init:HistoryData_init,
		HistoryData_get_ajax:HistoryData_get_ajax,
		radio_action:radio_action
	}
});

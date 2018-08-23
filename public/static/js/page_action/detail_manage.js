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

requirejs(['jquery','nav','pc_public',"Validform"], function ($,nav,PCpub){
	var dev_type=0;
	var devID=0;
	var newID="";
	var zone_id=0;
	var demo;//验证

    var get_zone_list=function(){
    	$.ajax({
            type: "POST",
            data: {"user_id": 1},
            url: "/index/user/get_zone_list",
            success: function (data) {
		        var zone_list = JSON.parse(data);
		        var idn_zone=$("#Ema_ZoneId");
		        var html='';
		        idn_zone.empty();
		        for(var i=0;i<zone_list.length;i++){
		        	html += '<option value="'+zone_list[i].ZoneId+'">'+zone_list[i].ZoneDesc+'</option>';
		        }
		        idn_zone.html(html);
		        if(zone_id != 0){//若get_conf先获取到，这边要重新填值
		        	$('[name=EmaC_ZoneId]').val($('<div>').html(zone_id).text());
		        }
            }
        });
    };

	var Ema_action_rule=function(u){
		$("input[name],select[name]").change(function(){
			var a=$(this).attr('name');
			var b=$(this).val();
			$("[name="+a+"]").val(b);
		});
		$("#EmaC_cancel").click(function(){// 返回 取消
			EmaSeting_return();
		});
		$("#EmaC_apply").click(function(){//确认
			if(demo.check()==true){
				Ema_setting_getajax(u,"/set_conf");
			};
		});
	};
//保存数据格式
	var set_data=function(){
		var config ={};
		config["enable"] =$('[name=EmaC_is_en]').val();

		var obj=$("#equip_setting_ul").find("ul").not(":hidden").find("input[name],select[name]").not(":hidden");
		obj.find("[name=EmaC_name]").css("background","#f00");
		obj.each(function(){
			var classname=$(this).attr('name');
			var key=classname.substring(5,classname.length);
			config[key]=$.trim($(this).val());
		});
		config=JSON.stringify(config);
		return config;
	};
//获得数据
	var zone_get_detail_ajax=function(u){
		if(devID!=""){
			$.ajax({
				type:"POST",
				url:"/index/"+u+"/get_conf",
				data:{
					"dev_id":devID
				},
				success:function(returnData){
					data = JSON.parse(returnData);
						// alert(returnData);
					$.each(data,function(key,value){
						$('[name=EmaC_'+key+']').val($('<div>').html(value).text());//反转义value;
					});
					// if(data.enable!=null && data.enable!=undefined){
					// 	input_is_en_rule(data.enable);//是否启用
					// }
					// PCpub.get_cur_user_level_ajax();
				}
			});
		}
	};

	var Ema_get_detail_ajax=function(){
		if(devID!=""){
			$.ajax({
				type:"POST",
				url:"/index/equip/get_conf",
				data:{
					"type":dev_type,
					"dev_id":devID
				},
				success:function(returnData){
					data = JSON.parse(returnData);
						// alert(returnData);
					$.each(data[0],function(key,value){
						$('[name=EmaC_'+key+']').val($('<div>').html(value).text());//反转义value;
					});
					zone_id = data[0].ZoneId;
					// if(data.enable!=null && data.enable!=undefined){
					// 	input_is_en_rule(data.enable);//是否启用
					// }
					// PCpub.get_cur_user_level_ajax();
				}
			});
		}
	};

	var create_serial_tabody=function(serial_html){//数据采集器  串口
		$("#Emm_serial_tbody").html(serial_html).find('td').eq(0).append(
				'<div class="info">' +
				'<span class="Validform_checktip"></span>' +
				'<span class="dec"><a class="dec1"></a></span>' +
				'</div>');//数据采集器  串口
		$('.plan_table tbody tr:even').css('background', '#F7F7F7');
	};
//保存数据
	var Ema_setting_getajax=function(u,func){
		var config=set_data();
		$.ajax({
			type:"POST",
			url:"/index" + u + func,
			data:{
				"devID":devID,
				"type":dev_type,
				"config":config
			},
			success:function(returnData){
				data = JSON.parse(returnData);
				if(data.code==0){
					$("#EmaC_apply").prop("disabled",true);//防止多次提交
					EmaSeting_return();//返回
				}else if(data.code==5){
					PCpub.save_popready(0,PCpub.popwin_message_rule(1)+WARN_EM_MAX_DEV,function(){});//超过设备上限
				}
			}
		});
	};
	var EmaSeting_return=function(){//返回
		if(dev_type > 0){
			window.location.href="/index/equip/index/type/"+dev_type;
		}else{
			window.location.href="/index/zone";
		}
	};
	var detail_table_rule=function(){
		var idn_span=$("#Emm_title span");
		switch(dev_type){
			case 0://zone
				idn_span.html("区域设置");
				$("#equip_setting_ul").find("ul:gt(0)").hide();
				// $("#ul_model,#ul_number,#ul_addr,#ul_zone,#ul_overtime,#ul_datasave_span").hide();
				zone_get_detail_ajax("/zone");
				Ema_action_rule("/zone");
				break;
			case 1://温度
				idn_span.html('温度传感器设置');
				thproductor_rule();
				Ema_get_detail_ajax();
				Ema_action_rule("/equip");
				break;
			case 2:
				idn_span.html('振动传感器设置');
				vibration_model_rule();
				Ema_get_detail_ajax();
				Ema_action_rule("/equip");
				break;
			default:
				break;
		}
	};
	/*************************************************温度***************************************************/
	var thproductor_rule=function(){
		var html='<option value="0">SA05</option>'+
				 '<option value="1">SA06</option>'+
				 '<option value="2">THS003</option>';
		$("#Ema_Model").html(html);
	};
	/*************************************************振动***************************************************/
	var vibration_model_rule=function(){
		var html='<option value="0">SS01</option>'+
				 '<option value="1">SA02</option>'+
				 '<option value="2">VIB003</option>';
		$("#Ema_Model").html(html);
	};
	/*************************************************ATS***************************************************/

	//运行
	nav.index_init();
	// PCpub.before_load(3);
	PCpub.ie_indexof();//兼容
	dev_type=PCpub.url_value("type");
	get_zone_list();
	var str=window.location.href;
	if(str.indexOf("/id/")!=-1){//编辑设备
		devID=PCpub.url_value("id");
	}
	else{//新建设备
		devID='';
		newID=PCpub.url_value("new");
	}
	detail_table_rule();
	demo=PCpub.equip_form("form");
});


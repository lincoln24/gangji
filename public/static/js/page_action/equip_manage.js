// JavaScript Document
require.config({
    baseUrl: "/static/js/",
	shim: {
		"md5":["jquery"],
		"Validform":["jquery"],//验证插件
		"PCtc":["jquery"],//弹窗插件
		"poshytip":["jquery"]//提示
	},
	paths: {
		"jquery": "./jquery-1.9.1",
		"md5":"md5",
		"Validform":"./Validform_v5.3.2_min",//验证插件
		"PCtc":"tc.all", //弹窗插件
		"poshytip":"./jquery.poshytip",//提示
		"pc_public":"page_action/public_amd",//pc 公共函数
        "public":"page_action/public",
		"nav":"page_action/nav"
	}
});
requirejs(['jquery','nav','pc_public',"public","poshytip"], function ($,nav,PCpub,pub){
	var select_Flag= 0,page_n;
	var sensor_num = 0;

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
			        // 添加区域列表
			        var idn_zone=$("#dev_list");
			        var html='';
			        idn_zone.empty();
			        for(var i=0;i<zone_list.length;i++){
			        	html += '<div style="border-bottom:solid #144388">'+
			                    '<label>'+zone_list[i].ZoneName+'</label>'+
			              		'</div>'+
			                    '<div id="zone_'+zone_list[i].ZoneId+'"></div><div style="clear:both;height:1rem"></div>';
			        }
			        // zone_num = zone_list.length;
			        idn_zone.html(html);

			        for(var i=0;i<zone_list.length;i++){
			        	get_sensor_list(zone_list[i].ZoneId,"equip/get_conf");
			        }
			    }
            }
        });
    };

    var get_sensor_list=function(zoneId,url_link){
    	$.ajax({
            type: "POST",
            data: {"type":dev_type,
            		"zone_id": zoneId},
            url: "/index/"+url_link,
            success: function (returnData) {
            	if(!pub.ifNullData(returnData)){
			        var returnData = JSON.parse(returnData);
			        if(returnData.code == 0){
			        	data = returnData.data;
				        // 添加区域列表
				        var idn_sensor=$("#zone_"+zoneId);
				        var html='';
				        idn_sensor.empty();
				        for(var i=0;i<data.length;i++){
			        		html += '<div class="gradient">'+
				        			'<span class="Emanage_snall_title">'+
				                    '<input type="checkbox" class="em_checkbox" id="ss_'+data[i].SensorId+'" style="position:relative;margin:0.25rem;z-index:1">'+
				                    '<label class="namelimit EmLink" id="sensor_'+data[i].SensorId+'">'+data[i].Name+'</label>'+
				              		'</span>'+
			              			'</div>';
				        }
				        sensor_num += data.length;
				        idn_sensor.html(html);

						$(".EmLink").click(function(){
							Ema_action_rule(3,this)
						});
					}
                }
            }
        });
    };

	var Em_action=function(){
		$("#add_item").click(function(){
			Ema_action_rule(1)
		});
		$("#del_item").click(function(){
			Ema_action_rule(2)
		});
		//全、不选
		$("#All_no_slect").click(function(){
			if(select_Flag==0){
				$(".em_checkbox").each(function(){
					$(this).prop("checked",true);
				});
				select_Flag=1;
			}else{
				$(".em_checkbox").attr("checked",false);
				select_Flag=0;
			}
			// PCpub.checkbox_ready("input[type=checkbox]");
		});
	};
	var delete_data=function(){
		var list_delete=[];
		$("input:checked[type=checkbox]").each(function(index){
			var l={};
			var ids=$(this).attr("id").split("_");
			l["index"]=ids[1];
			list_delete[index]=l;
		});
		list_delete=JSON.stringify(list_delete);
		return list_delete;
	};
	var equip_delete_ajax=function(){
		$.ajax({
			type:"POST",
			url:"/index/equip/delete",
			data:{
				"type":dev_type,
				"list":delete_data()
			},
			success:function(data){
				location.reload();//刷新
			}
		});
	};
	var Ema_action_rule=function(n,obj){//按钮点击规则
		switch(Number(n)){
			case 1://添加
				var newid = sensor_num + 1;
				window.location.href="/index/equip/detail_manage/type/"+dev_type+"/new/" + newid;
				break;
			case 2://删除设备
				PCpub.if_select_pop(".Emanage_snall_title",equip_delete_ajax);
				break;
			case 3://编辑设备
				var str=obj.id.split("_");
				id=str[1];
				window.location.href="/index/equip/detail_manage/type/"+dev_type+"/id/"+id;
				break;
			default:
				break;
		}
	};
	//运行
	nav.index_init();
	get_zone_list();
	dev_type=PCpub.url_value("type");
	// PCpub.before_load(3);
	Em_action();
});



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
	var zone_num = 0;

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
			        // alert(zone_list);
			        var idn_zone=$("#dev_list");
			        var html='';
			        idn_zone.empty();
			        for(var i=0;i<zone_list.length;i++){
			        	html += '<div class="gradient">'+
			        			'<span class="Emanage_snall_title">'+
			                    '<input type="checkbox" class="em_checkbox" id="zone_'+zone_list[i].ZoneId+'" style="position:relative;margin:0.25rem;z-index:1">'+
			                    '<label class="namelimit EmLink" id="zonelink_'+zone_list[i].ZoneId+'">'+zone_list[i].ZoneDesc+'</label>'+
			              		'</span>'+
			              		'</div>';
			        }
			        zone_num = zone_list.length;
			        idn_zone.html(html);

					$(".EmLink").click(function(){
						Ema_action_rule(3,this)
					});
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
	var zone_delete_ajax=function(){
		$.ajax({
			type:"POST",
			url:"/index/zone/delete_zone",
			data:{
				"list":delete_data()
			},
			success:function(data){
				location.reload();//刷新
			}
		});
	};
	var Ema_action_rule=function(n,obj,devType){//按钮点击规则
		switch(Number(n)){
			case 1://添加区域
				var newid = zone_num + 1;
				window.location.href="/index/zone/detail_manage/type/0/new/" + newid;
				break;
			case 2://删除设备
				PCpub.if_select_pop(".Emanage_snall_title",zone_delete_ajax);
				break;
			case 3://编辑设备
				var str=obj.id.split("_");
				id=str[1];
				window.location.href="/index/zone/detail_manage/type/0/id/"+id;
				break;
			default:
				break;
		}
	};
	//运行
	nav.index_init();
	get_zone_list();
	// PCpub.before_load(3);
	Em_action();
});



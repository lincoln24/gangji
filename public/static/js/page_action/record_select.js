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
	var dev_type = 1;

    var get_zone_dev_list=function(){
    	$.ajax({
            type: "POST",
            data: {},
            url: "/index/zone/get_devtype_list",
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
			              		'</div>';

			            typeList = zone_list[i].devtype_list;
				        for(var j=0;j<typeList.length;j++){
			        		html += '<div class="gradient">'+
				        			'<span class="Emanage_snall_title">'+
				                    '<label class="namelimit selectLink"'+
				                    ' id="dev_'+zone_list[i].ZoneId+'_'+typeList[j].typeIndex+'">'+typeList[j].typeName+'</label>'+
				              		'</span>'+
			              			'</div>';
				        }

			            html +='<div style="clear:both;height:1rem"></div>';
			        }
			        idn_zone.html(html);

					$(".selectLink").click(function(){
						var str=this.id.split("_");
						zone = str[1];
						type = str[2];
						window.location.href="/index/equip/his_data/zone/"+zone+"/type/"+type;
					});
			    }
            }
        });
    };

	//运行
	nav.index_init();
	get_zone_dev_list();
});



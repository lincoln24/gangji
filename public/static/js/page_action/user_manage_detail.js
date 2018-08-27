// JavaScript Document
require.config({
    baseUrl: "/static/js/",
	shim: {
		"PCtc":["jquery"], //弹窗插件
		"My97DatePicker":["jquery"], //时间插件
		"md5":["jquery"],
		"Validform":["jquery"]//验证插件
	},
	paths: {
		"jquery": "./jquery-1.9.1",
		"md5":"md5",
		"Validform":"./Validform_v5.3.2_min",//验证插件
		"My97DatePicker":"My97DatePicker/WdatePicker", //日期插件
		"PCtc":"tc.all", //弹窗插件

		"pc_public":"page_action/public_amd",//pc 公共函数
		"nav":"page_action/nav"
	}
});
requirejs(['jquery','nav','pc_public',"Validform","My97DatePicker","PCtc"], function ($,nav,PCpub){
	var flag=0;
	var demo;
	var user_id = 0;
	/*获取用戶采集模块数据*/
	var save_usermagnage_for_new_ajax=function(){
		$.ajax({
			type:"POST",
			url:"/index/user/set_user_detail",
			data:{"user_id":user_id,
				  "config":save_newUmm_data()},
			success:function(returnData){
				$("#UmmNew_sure").prop("disabled",false);
				data = JSON.parse(returnData);
				check_UmmN_result(data.code);
			}
		});
	};
	var UmN_get_detail_ajax=function(){
		if(user_id!=0){
			$.ajax({
				type:"POST",
				url:"/index/user/get_user_detail",
				data:{
					"user_id":user_id
				},
				success:function(returnData){
					data = JSON.parse(returnData);
						// alert(returnData);
					if(data.code == 0)
					{
						$.each(data.data,function(key,value){
							$('[name=UmmN_'+key+']').val($('<div>').html(value).text());//反转义value;
						});
					}
				}
			});
		}
	};
	var save_newUmm_data=function(){
		var obj=$("#Umm_new_table").find("input[name^='UmmN_'],select[name^='UmmN_']");
		var config={};
		obj.each(function(){
			var name=$(this).attr("name");
			var key=name.substring(5,name.length);
			// if(key=="user_passwd"){
			// 	config[key]=$.md5($(this).val());
			// }else{
				config[key]=$(this).val();
			// }
		});
		config=JSON.stringify(config);
		return config;
	};
	var UmN_manage_action=function(){
		PCpub.wdate_init("alarm_start_time","alarm_end_time",'H:mm:ss');//时间初始化
		$("#UmmNew_cancel").click(function(){//取消
			window.location.href="/index/user";
		});
		$("#UmmNew_sure").click(function(){//保存
			if(demo.check()==true) {
				$(this).prop("disabled",true);
				save_usermagnage_for_new_ajax();//密码验证--提交数据
			}
		});
	};
//0 保存成功，1 保存失败，2 配置格式不正确，3 用户名已存在
	var check_UmmN_result=function(returndata){
		switch(returndata){
			case 0:
				window.location.href="/index/user";
				break;
			case 1:
				PCpub.save_popready(1);
				break;
			case 2:
				PCpub.save_popready(0,PCpub.popwin_message_rule(1)+USER_FOMAT_ERROR,function(){});//配置格式不正确
				break;
			case 3:
				PCpub.save_popready(0,PCpub.popwin_message_rule(3)+ERR_USERNAME_EXIST,function(){});//用户名已存在
				break;
			default:
				break;
		}
	};
	//运行
	nav.index_init();
	var str=window.location.href;
	if(str.indexOf("/id/")!=-1){//编辑设备
		user_id=PCpub.url_value("id");
	}
	else{//新建设备
		user_id='';
	}
	// PCpub.before_load(2);
	UmN_manage_action();//动态
	UmN_get_detail_ajax();
	demo=PCpub.equip_form(".UmNewForm");
});
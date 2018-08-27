// JavaScript Document
require.config({
    baseUrl: "/static/js/",
	shim: {
		"PCtc":["jquery"], //弹窗插件
		"ajaxfileupload":["jquery"],//上传
		"My97DatePicker":["jquery"], //时间插件
		"md5":["jquery"],
		"Validform":["jquery"]//验证插件
	},
	paths: {
		"jquery": "./jquery-1.9.1",
		"md5":"md5",
		"ajaxfileupload":"./ajaxfileupload-2.1",//上传
		"My97DatePicker":"My97DatePicker/WdatePicker", //日期插件
		"Validform":"./Validform_v5.3.2_min",//验证插件
		"PCtc":"tc.all", //弹窗插件

		"pc_public":"page_action/public_amd",//pc 公共函数
		"nav":"page_action/nav"
	}
});
requirejs(['jquery','nav','pc_public',"Validform","ajaxfileupload","My97DatePicker","PCtc"], function ($,nav,PCpub){
	var demo;//验证
	var sysTimezone=0;
	var sysTime=0;

	var system_expire_ajax=function(){
		$.ajax({
			type:"POST",
			url:"/index/setting/get_expire_conf",
			data:{},
			success:function(data){
				var time=data.login_expire;
				if(time!=null &&time!=''&&time.length!=0){
					set_power_rule(time);
				}
			}
		});
	};
   //选择登陆超时时间
	var set_power_rule=function(timeNum){
		var idn_power_auto=$("#Set_power_auto_loginTime");
		if(timeNum==0 ||timeNum==10 || timeNum==30){
			var idn=$("#Set_power_container").find(":radio[name=Set_power_login_expire][value="+timeNum+"]");
			idn.prop("checked",true);
			idn_power_auto.attr("disabled",true);
			idn_power_auto.val('');
		}else{
			$("#Set_power_container").find(":radio[name=Set_power_login_expire][value=auto]").prop("checked",true);
			idn_power_auto.attr("disabled",false);
			idn_power_auto.val(timeNum);
		}
	};
//获取数据
	var system_seting_ajax=function(){
		$.ajax({
			type:"POST",
			url:"/index/setting/get_conf",
			data:{},
			success:function(returnData){
				data = JSON.parse(returnData);
				$("select[name=sysset_data_store]").html('<option value="0">Flash</option>');
				$.each(data.system,function(key,value){//获取设置系统数据
					var a=$('<div>').html(value).text();//反转义
					$("[name=sysset_"+key+"]").val(a);
				});
				get_sys_date_data(data.datetime);//获取日期和时间数据
				$("#sys_setting").val(data.current_time);
				sys_current_time(data.current_time);
				sysTimezone=data.datetime.timezone_index;
				sysTime=data.current_time;
				sysTime=new Date(sysTime.replace(/-/g,'/'));
				sysTime=sysTime.getTime()/1000;
				System_set_init();//初始化
				System_set_action();//动态 初始化
				PCpub.get_cur_user_level_ajax();

			}
		})
	};
	var sys_current_time=function(t){
		$("#sys_current_time").html(t);
		var time=PCpub.getTimeNumber(t);//转换为时间戳
		setInterval(function(){
			time+=1;
			$("#sys_current_time").html(PCpub.getLocalTime(time));
		},1000);
	};
//保存设置系统参数
	var save_system_set_ajax=function(){
		var config={};
		$("[name^='sysset_']").each(function(){
			var key=$(this).attr('name');
			key=key.substring(7,key.length);
			config[key]=$("[name=sysset_"+key+"]").val();
		});
		config=JSON.stringify(config);
		$.ajax({
			type:"POST",
			url:"setting/set_sys",
			data:{"config":config},
			success:function(data){
				location.reload();
				// PCpub.save_popready(data.code);
			}
		})
	};
//保存日期与时间
	var save_set_datetime_ajax=function(){
		$.ajax({
			type:"POST",
			url:"setting/set_datetime",
			data:{"config":save_set_datetime_data()},
			success:function(data){
				location.reload();
				// PCpub.save_popready(data.code);
			}
		})
	};
//权限设置
	var save_set_expire_time_ajax=function(){
		var login_expire=$("#Set_power_container").find("input:radio[name=Set_power_login_expire]:checked").val();
		if(login_expire=='auto'){
			login_expire=$("#Set_power_auto_loginTime").val();
		}
		$.ajax({
			type:"POST",
			url:"setting/set_expire_conf",
			data:{
				"login_expire":login_expire
			},
			success:function(data){
				location.reload();
				// if(data.code==0){
				// 	PCpub.save_popready(0);
				// }else{
				// 	PCpub.save_popready(1);
				// }
			}
		});
	};
//日期与时间
	var save_set_datetime_data=function(){
		var config={};
		$("[name^='SyDate_']").each(function(){
			var key=$(this).attr('name');
			key=key.substring(7,key.length);
			if( key=="auto_time"){
				config[key]=$("input[name=SyDate_"+key+"]:checked").val();
			}else{
				config[key]=$("[name=SyDate_"+key+"]").val();
			}
		});
		config=JSON.stringify(config);
		return config;
	};
//获取日期和时间数据
	var get_sys_date_data=function(returndata){
		$.each(returndata,function(key,value){
			if(key=="auto_time"){
				$("[name=SyDate_"+key+"][value="+value+"]").prop("checked",true);
			}
			else{
				$("[name=SyDate_"+key+"]").val(value);
			}
		});
		$("#SyDate_s_date").val(PCpub.ten_form(returndata.adj_s_month)+"-"+PCpub.ten_form(returndata.adj_s_day));//起始时期
		$("#SyDate_e_date").val(PCpub.ten_form(returndata.adj_e_month)+"-"+PCpub.ten_form(returndata.adj_e_day));//结束时期
		$("#SyDate_s_day").val(PCpub.ten_form(returndata.adj_s_hour)+":"+PCpub.ten_form(returndata.adj_s_min));//起始时段
		$("#SyDate_e_day").val(PCpub.ten_form(returndata.adj_e_hour)+":"+PCpub.ten_form(returndata.adj_e_min));//结束时段
	};
	var System_set_action=function(){
		$(".right_bottom_cotainer button").eq(0).click(function(){//确认
			if(demo.eq(0).check()==true) {
				save_system_set_ajax();
			}
		});
		$(".right_bottom_cotainer button").eq(1).click(function(){//确认
			if(demo.eq(1).check()==true) {
				save_set_datetime_ajax();
			}
		});
		$(".right_bottom_cotainer button").eq(2).click(function(){//确认
			if(demo.eq(2).check()==true) {
				save_set_expire_time_ajax();
			}
		});
		$("#Set_power_container input:radio").click(function(){
			if($(this).val()=='auto'){
				$("#Set_power_auto_loginTime").prop('disabled',false);
			}else{
				$("#Set_power_auto_loginTime").prop('disabled',true);
			}
		});
		$("#https_button").click(function(){//上传http证书
			save_upload_https_cert_ajax();
		});
		//时间服务器
		$("select[name=SyDate_serv_type]").change(function(){
			time_serve_rule();
		});
		//使用网络日期和时间
		$("input[name='SyDate_auto_time']").click(function(){
			SyDate_auto_time_rule();
		});
		//设置日期时间
		$("#sys_setting").click(function(){
			sysTimezone=$("select[name=SyDate_timezone_index]").val();
		});
		$("#sys_setting").blur(function(){
			sysTime=$(this).val();
			sysTime=new Date(sysTime.replace(/-/g,'/'));
			sysTime=sysTime.getTime()/1000;
		});
		//时区
		$("select[name=SyDate_timezone_index]").change(function(){
			var sys_option=$(this).find("option[value="+sysTimezone+"]").attr("op");
			var now_option=$(this).find("option:checked").attr("op");
			var now_t=sysTime+(now_option-sys_option)*3600;
			$("input[name=SyDate_current_time]").val(PCpub.getLocalTime(now_t));
		});
	};
   //初始化
	var System_set_init=function(){
		time_serve_rule();//时间服务器初始化
		SyDate_auto_time_rule();//使用网络日期和时间
		demo=PCpub.equip_form(".sysform");
		PCpub.wdate_init("sys_setting",'yyyy-MM-dd H:mm:ss');//生效时段
		PCpub.wdate_init("SyDate_s_day","SyDate_e_day",'H:mm');//生效时段
		PCpub.wdate_init("SyDate_s_date","SyDate_e_date",'MM-dd');//生效时间
	};
   //时间服务器
	var time_serve_rule=function(){
		var obj=$("select[name=SyDate_serv_type]");
		var n=obj.val();
		switch(Number(n)){
			case 0://网络
				$("input[name=SyDate_serv_addr_self]").hide();
				$("select[name=SyDate_serv_index]").show();
				break;
			case 1://自定义
				$("select[name=SyDate_serv_index]").hide();
				$("input[name=SyDate_serv_addr_self]").show();
				break;
			default:
				break;
		}
	};
//使用网络日期和时间
	var SyDate_auto_time_rule=function(){
		var n=$("input[name='SyDate_auto_time']:checked").val();
		$("#date_time_table tr").show();
		switch(Number(n)){
			case 0://f否
				$("#date_time_table tr").eq(1).hide();
				$("#date_time_table tr").eq(2).hide();
				break;
			case 1://是
				$("#date_time_table tr").eq(3).hide();
				break;
			default:
				break;
		}
	};
	//运行
	nav.index_init();
	// PCpub.before_load(3);
	system_seting_ajax();
	system_expire_ajax();
	PCpub.Fileaction();//显示上传文件名
	PCpub.static_height();
});


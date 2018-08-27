// JavaScript Document
require.config({
    baseUrl: "/static/js/",
	shim: {
		"PCtc":["jquery"], //弹窗插件
		"md5":["jquery"],
		"Validform":["jquery"]//验证插件
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
requirejs(['jquery','nav','pc_public',"Validform","PCtc"], function ($,nav,PCpub){
	var dataMax= 1,demo;//数据总条数

	/*刪除數據*/
	var delete_data=function(){
		var obj=$("#userM_tbody").find("input:checked[type=checkbox]");
		var deletet_index=[];
		obj.each(function(index){
			var l={};
			l["index"]=($(this).attr("name").split("_"))[1];
			deletet_index[index] = l;
		});
		deletet_index=JSON.stringify(deletet_index);
		return deletet_index;
	};
	/*刪除用戶采集模块数据*/
	var delete_usermagnage_for_manager_ajax=function(){
		PCpub.ie_indexof();//indexof兼容ie8
		var deletet_index=delete_data();

		$.ajax({
			type:"POST",
			url:"/index/user/delete_user",
			data: {
				"list": deletet_index
			},
			success:function(data){
				if(JSON.parse(data).code==0){
					window.location.reload();
				}
			}
		});
	};
	/*获取用戶采集模块数据*/
	var usermagnage_for_manager_ajax=function(page){
		$.ajax({
			type:"POST",
			url:"/index/user/get_user_list",
			data:{
				"userType":$("#Umm_type_select").val(),
				"name":$("#Umm_name").val()},
			success:function(returnData){
				data = JSON.parse(returnData);
				if(data.code == 0)
				{
					get_user_data(data.data);
					// PCpub.get_cur_user_level_ajax();
				}
			}
		});
	};
//是否接收告警 0 不接收， 1 接收
	var is_recv_alarm=function(n){
		var is_recv_alarm='';
		switch(Number(n)){
			case 0:
				is_recv_alarm=USER_NOT_RECEIVE;//'不接收';
				break;
			case 1:
				is_recv_alarm=USER_RECEIVE;//'接收';
				break;
			default:
				break;
		}
		return is_recv_alarm;
	};
//用户类型 2 管理员 1 一般用户(只读用户)
	var user_type_rule=function(n){
		var user_type='';
		switch(Number(n)){
			case 2:
				user_type=USER_NORMAL_USER;//'一般用户';
				break;
			case 1:
				user_type=USER_MANAGER;//'系统管理员';
				break;
			default:
				break;
		}
		return user_type;
	};

	var get_user_data=function(returndata){
		$("#userM_tbody").empty();
		$.each(returndata,function(key,value){
			var html=
					'<tr>'+
					'<td>' +
					'<input type="checkbox" ' +
					'			name="Ummcheck_'+value.id+'" ' +
					'			id="Ummcheck_'+value.id+'">' +
					'</td>'+
					'<td>'+PCpub.checkIsNull(value.user_name)+'</td>'+
					'<td>'+PCpub.checkIsNull(user_type_rule(value.priv))+'</td>'+
					'<td class="namelimit">'+PCpub.checkIsNull(value.zone)+'</td>'+
					'<td>'+PCpub.checkIsNull(value.alarm_start)+'</td>'+
					'<td>'+PCpub.checkIsNull(value.alarm_end)+'</td>'+
					'<td>'+PCpub.checkIsNull(value.phone)+'</td>'+
					'<td>'+PCpub.checkIsNull(value.email)+'</td>'+
					'</tr>';
			$("#userM_tbody").append(html);
		});
		//全选
		if($(".plan_table thead tr td:first").children("input").prop("checked")==true){
			$(".plan_table tbody input[type=checkbox]").prop("checked", true);
		}

		PCpub.phoshytip(32);
		PCpub.checkbox_ready("input[type=checkbox]");
		PCpub.checkbox_ready_action("input[type=checkbox]");
	};
	var Umm_designPop_rule=function(){//修改---跳转页面
		var obj=$("#userM_tbody").find("input:checked[type=checkbox]").attr("name").split("_");
		window.location.href="/index/user/user_manage_detail/id/"+obj[1];
	};
	var Um_manage_action=function(){
		$("#Umm_search").click(function(){//查询
			if(demo.check()==true) {
				usermagnage_for_manager_ajax();
			}
		});
		$("#Umm_add").click(function(){//新增
			window.location.href="/index/user/user_manage_detail/new";
		});
		$("#Umm_design").click(function(){//修改
			PCpub.if_select_pop(".plan_table",1,Umm_designPop_rule);
		});
		$("#Umm_delete").click(function(){//刪除
			PCpub.if_select_pop(".plan_table",delete_usermagnage_for_manager_ajax);
		});
		$(".plan_table thead tr td:first").children("input").click(function(){//全选
			var isChecked = $(this).prop("checked");
			$(".plan_table tbody input[type=checkbox]").prop("checked", isChecked);
			PCpub.checkbox_ready("input[type=checkbox]");
			PCpub.checkbox_ready_action("input[type=checkbox]");
		});
	};
	//运行
	nav.index_init();
	// PCpub.before_load(3);
	Um_manage_action();//动态
	usermagnage_for_manager_ajax();
	demo=PCpub.equip_form(".Userm");
});
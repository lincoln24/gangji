// JavaScript Document
define(["jquery","Validform","md5"],function($){
	var ajaxFlag=100;
	var Power_level=0;//权限
	var ifMimaUse=1;//用户密码验证   0不弹出，1要弹出

	var checkbox_ready=function(obj){
		$(obj).not(".chk_1").each(function(){
			var idn=this.id;
			init_checkbox0(idn);
			init_checkbox(idn);
		});
	};
	var checkbox_ready_action=function(obj){
		var ccfunc=function(){
			var idn=this.id;
			init_checkbox(idn);
		};
		$(obj).not(".chk_1").unbind("click",ccfunc);
		$(obj).not(".chk_1").bind("click",ccfunc);
	};
	var init_checkbox0=function(ch_id){
		$("#Label_"+ch_id).remove();
		var idn_ch=$("#"+ch_id);
		idn_ch.after('<label for="'+ch_id+'" id="Label_'+ch_id+'"></label>');
		if(idn_ch.is(":hidden")){
			idn_ch.next("label").hide();
		}else{
			idn_ch.next("label").show();
		}
	};
	var init_checkbox=function(obj){
		var idn_obj=$("#"+obj);
		idn_obj.next("label").removeClass();
		if(idn_obj.prop("disabled")==false){
			if(idn_obj.prop("checked")==true){
				idn_obj.next("label").addClass("checkbox_label");
			}else{
				idn_obj.next("label").addClass("uncheckbox_label");
			}
		}
		else{
			if(idn_obj.prop("checked")==true){
				idn_obj.next("label").addClass("check_false_label");
			}else{
				idn_obj.next("label").addClass("uncheck_false_label");
			}
		}

	};
	var static_height=function(){
		var h=$("#index_main").height();
		var h2 = $(window).outerHeight(true)- 83- 32;
		$(".aside_cotainer").height(h-5).css("min-height",(h2-5)+"px");
		$(".loading_div").height(h).css({"min-height":h2+"px","line-height":h2+"px"});

	};
	/*浏览按钮初始化*/
	var inputFileAction=function(){
		$("input[datatype],textarea[datatype]").each(function(){
			$(this).attr("nullmsg",COMMOM_CANNOT_EMPTY);
		});
		$("a input[type=file]").each(function(){
			if($(this).prop("disabled")==true){
				$(this).parent("a").removeClass("inputFile");
				$(this).parent("a").addClass("inputFile_disabled");
			}else{
				$(this).parent("a").removeClass("inputFile_disabled");
				$(this).parent("a").addClass("inputFile");
			}
		});
	};

	/*收缩动画*/
	var es_action=function(){
		$(".es_arrow").mouseenter(function(){
			$(".es_arrow").animate({"right":"-260px"},300,function(){
				$(".aside_cotainer").animate({"right":"0px"},300)
			})
		});
		$(".aside_input").mouseleave(function(){
			$(".aside_cotainer").animate({"right":"-260px"},300,function(){
				$(".es_arrow").animate({"right":"0px"},300)
			})
		});
	};
	/*图片切换规则*/
	var Ema_switch_img_rule=function(n){
		var img='';
		switch(parseInt(n)){
			case 0://烟雾
				img="Ema_smoke.png";
				break;
			case 1://漏水
				img="Ema_drop.png";
				break;
			case 2://红外
				img="redLight.png";
				break;
			case 3://门磁
				img="Ema_normal_meg.png";
				break;
			case 5://防雷
				img="Ema_LightenSwitch.png";
				break;
			case 8://温感
				img="thsensor.png";
				break;
			case 9://极早期
				img="early.png";
				break;
			case 20://声光
				img="voicealarm.png";
				break;
			case 21://照明
				img="lightalarm.png";
				break;
			case -2://模块
				img="Swith_module.png";
				break;
			case -1://开关量
				img="swith_inout.png";
				break;
			default:
				img="swith_inout.png";
				break;
		}
		return img;
	};
	/*设备管理 UPS  AA名字  BB图片  CC id DD位置*/
	var Ema_create_rule=function(AA,BB,CC,DD,type,other_name){//动态创建图块
		var html='';
		var html_class='';
		var html_other='';
		if(type==0 || type==null){
			html_class="gradient_grey";
		}else{
			html_class="gradient";
		}
		if(other_name!=null && other_name.length!=0){
			html_other='<p class="Emm_aside_name namelimit">'+other_name+'</p>';
		}
		html+='<div class="'+html_class+' Emm_gradient">'+
				'<span class="Emanage_snall_title">'+
				'<input type="checkbox" id="EmaS'+DD+'_'+CC+'" class="Ema_switch_checkbox">'+
				'<label for="EmaS'+DD+'_'+CC+'" class="Emanage_switchtit namelimit">'+AA+'</label>'+
				'</span>'+
				'<span style="display:block;cursor: pointer;" id="'+DD+'_'+CC+'" >'+
				html_other+
				'<img src="'+ss_image+'Equipmanage/'+Ema_switch_img_rule(BB)+'">'+
				'</span>'+
				'</div>';
		$("#"+DD).append(html);
	};
	/*开关动作*/
	var check_init=function(){
		for(var i=0;i<8;i++){
			if($("#checkbox_a"+i).prop("checked")==false ){
				$("#checkbox_a"+i).parent().parent().children(".chk_1_button").css("left","28px");
				$("#checkbox_a"+i).parent().css("background-color","#c5c5c5");
			}
			else{
				$("#checkbox_a"+i).parent().parent().children(".chk_1_button").css("left","3px");
				$("#checkbox_a"+i).parent().css("background-color","#3799DB");
			}
		}
	};
	//switch动态check
	var check_animate=function(){
		$(".chk_1_label").parent().children(".chk_1_button").css("left","28px");
		$(".chk_1_label").css("background-color","#c5c5c5");
		for(var i=0;i<8;i++){
			$(".chk_1_label").click(function(){
				var k=this.id.split("_");
				k=k[1];
				if($("#checkbox_a"+k).prop("checked")==false ){
					$(this).parent().children(".chk_1_button").css("left","28px");
					$(this).css("background-color","#c5c5c5");
				}
				else{
					$(this).parent().children(".chk_1_button").css("left","3px");
					$(this).css("background-color","#3799DB");
				}
			});
		}
	};
	/**记录查询---tab**/
	var RS_tab_click=function(){
		$(".RStab_0").click(function(){//图表
			$(".RStab_0").addClass("selectes_a");
			$(".RStab_1").removeClass("selectes_a");
			$(".RSsection_0").show();
			$(".RSsection_1").hide();
		});
		$(".RStab_1").click(function(){//详细信息
			$(".RStab_0").removeClass("selectes_a");
			$(".RStab_1").addClass("selectes_a");
			$(".RSsection_0").hide();
			$(".RSsection_1").show();

		});
	};
	//表格创建规则(n1=列数  n2=行数  idn="#id")
	var PlanTbodyCreateRule=function(n1,n2,idn){
		var htmltd='';
		var htmltr='';
		for(var i=0;i<n1;i++){
			htmltd+='<td></td>'
		}
		for(var j=0;j<n2;j++){
			htmltr+='<tr>'+htmltd+'</tr>';
		}
		$(idn).append(htmltr);
		$('.plan_table tbody tr:even').css('background', '#F7F7F7');
	};
	/*按钮*/
	var button_create=function(idn){
		button_create_rule(COMM_EDIT,"design.png",idn);/*"编辑"*/
		button_create_rule(EMA_EQUIP_ADD,"add.png",idn);/*"添加设备"*/
		button_create_rule(EMA_EQUIP_DELETE,"shangchu.png",idn);/*"删除设备"*/
		button_create_rule(COMM_DONE,"complete.png",idn);/*"完成"*/
	};
	//创建按钮
	var button_create_rule=function(name,img,idn){
		var html='<button type="button"  class="input_4 ">'+
				'<img src="'+ss_image+'button_ico/'+img+'">'+
				'<span>'+name+'</span>'+
				'</button>';
		$(idn).append(html)
	};
	//删除确认
	var delete_check_popwin=function(func){
		var html='<span  class="midwin" >确认删除</span>';
		pop_create_rule("detail_common_confirmDelete",html,popTip,2);
		popWin("detail_common_confirmDelete");
		$("#detail_common_confirmDelete").find(".close1").bind("click",function(event) {
			$("#detail_common_confirmDelete").hide();
			$("#maskLayer").remove();
			func();
		});
	};
	/**
	 * 根据是否选中改变弹窗
	 * if_select_pop(idn,1，ff)--只能修改一项
	 * if_select_pop(idn,ff)--可以删除多选
	 *
	 * ff  密码验证成功后执行函数
	 *
	 * add by :caofei
	 */
	var if_select_pop=function(idn,ss,ff){
		var flag;
		var func;
		if(arguments.length==2){
			func=ss;
		}
		else if(arguments.length==3){
			func=ff;
		}
		flag=$(idn+" input[type='checkbox']:checked").length;
		if(flag==0){//请选择一个设备
			tishi_popready();
			popWin("detail_common_tishi");
		}else{//删除设备
			if(ss==1){
				if(flag>1){
					tishi_popready();
					popWin("detail_common_tishi");
				}
				else{
					func();//编辑
				}
			}else{
				delete_check_popwin(func);//删除
			}
		}
	};
	//弹窗图案  0成功 1失败 2重要 3告警
	var popwin_message_rule=function(n){
		var img='';
		switch(n){
			case 0:
				img="popwin_ico/success.png";
				break;
			case 1:
				img="popwin_ico/fail.png";
				break;
			case 2:
				img="popwin_ico/important.png";
				break;
			case 3:
				img="popwin_ico/alarm.png";
				break;
			default:
				break;
		}
		return '<img src="'+ss_image+img+'">';
	};
	/**
	 *
	 *
	 * save_popready(0)  save_popready(0,func)  保存成功
	 * save_popready(1)  save_popready(1,func)  保存失败
	 * save_popready(0，ww，func)  save_popready(0，内容ww，确认后执行函数func)
	 *
	 * @param n   0保存成功  1保存失败
	 * @param ww  内容
	 * @param f   确认后执行函数
	 */
	var save_popready=function(n,ww,f){
		var w;
		var func;
		var arg=arguments.length;
		if(arg==3){
			w=ww;
			func=f;
		}else{
			func=ww;
			if(n==0){
				w=popwin_message_rule(0)+saveSuccess;//"保存成功！"
			}else{
				w=popwin_message_rule(1)+saveFail;//"保存失败！"
			}
		}
		var html='<span  class="midwin" >'+w+'</span>';
		pop_create_rule("detail_result_save",html,popTip,1);/*"提示"*/

		var container_w=$(".midwin").text();//提示内容

		if(container_w.length!=0 && container_w!=null && container_w!="undefined"){
			popWin("detail_result_save");
			if(n==0){
				$("#detail_result_save").find(".close").bind("click",function(event){
					if(arg==1){
						location.reload();
					}else{
						func();
					}
					$(this).unbind(event);
				});
			}
		}
	};
	/*提示型弹窗*/
	var tishi_popready=function(){
		var html='<span id="tishi_span"  class="midwin" >'+selectOne+'！</span>';//请选择一个选项
		pop_create_rule("detail_common_tishi",html,popTip,1);/*"提示"*/
	};
	/*操作型弹窗*/
	var caozuo_popready=function(){
		var html='<span  class="midwin">'+inputPassword+':' +
				'<input type="text" name="MiMaPassword" id="MiMaText">' +
				'</span>';
		/*请输入密码*/
		pop_create_rule("detail_common_caozuo",html,popVerify,2);
		$("#MiMaText").focus(function(){
			$(this).remove();
			$("#detail_common_caozuo .midwin").append('<input type="password" name="MiMaPassword" id="MiMaPassword">');
			$("#MiMaPassword").focus();
		})
	};
	/**
	 * 弹窗创建
	 * idn "sss" 弹窗id
	 * cotainer 内容
	 * title 弹窗名
	 * type 1：只有一个确认按钮 2：确认和取消按钮
	 *
	 *
	 * add by :caofei
	 */
	var pop_create_rule=function(idn,cotainer,title,type){
		$("#"+idn).remove();
		var htmlpop_button1=
				'<div class="bot bot_note">'+
				'<button  type="button" class="input_5 close">'+COMM_CONFIRM+'</button>'+
				'</div>';
		var htmlpop_button=
				'<div class="bot bot_apply">'+
				'<button  type="button" class="input_5 close1">'+COMM_CONFIRM+'</button>'+
				'<button  type="button" class="input_5 close">'+COMM_CANCEL+'</button>'+
				'</div>';
		if(type==1){
			htmlpop_button=htmlpop_button1
		}else if(type == 0){
			htmlpop_button = "";
		}
		var htmlpop=
				'<div id="'+idn+'" class="detail"  unselectable="on" onselectstart="return false;">'+
				'<div class="detail_bg">'+
				'<div class="detail_cotainer">';

		if(type!=0){
			htmlpop+='<div class="tit">'+
					'<span class="tit_span">'+title+'</span>'+
					'<i class="close"></i>'+
					'</div>';
		}
		htmlpop+=	'<div class="popup2" >'+
				'<div class="popup_div">'+
				'<div  class="popup_alarm_cotainer" >'+
				cotainer+
				'</div>'+
				'</div>'+
				'</div>'+
				htmlpop_button+
				'</div>'+
				'</div>'+
				'</div>';
		$("body").append(htmlpop);
	};
	//n1 开始日期  n2 结束日期 form 格式
	var wdate_init=function(n1,n2,form){
		var ndx=getlanguage();//获取语言
		if(arguments.length==3){
			$("#"+n1).focus(function(){
				WdatePicker({
					skin:'twoer',
					readOnly:true,
					lang:ndx,
					dateFmt:form,
					maxDate:'#F{$dp.$D(\''+n2+'\')||\'2050-10-01\'}'
				})
			});
			$("#"+n2).focus(function(){
				WdatePicker({
					skin:'twoer',
					readOnly:true,
					lang:ndx,
					dateFmt:form,
					minDate:'#F{$dp.$D(\''+n1+'\')||\'2050-10-01\'}'
				})
			})
		}else{
			$("#"+n1).focus(function(){
				WdatePicker({
					skin:'twoer',
					readOnly:true,
					lang:ndx,
					dateFmt: n2
				})
			})
		}
	};
	//获取当前时间
	var get_now_time=function(){
		var myDate = new Date();
		var myget_overdate=myDate.getDate();
		var myget_overmonth=myDate.getMonth();
		if(myget_overmonth<9){
			myget_overmonth = "0"+(myget_overmonth+1);
		}
		if(myget_overdate<10){
			myget_overdate="0"+myget_overdate;
		}
		var mytime = myDate.getFullYear()+"-"+myget_overmonth+"-"+myget_overdate;//起始日期
		return mytime;
	};
	//日期初始化  相差七天 yyyy-MM-dd
	var begin_overdate_init=function(id_begin,id_over){
		var myDate = new Date();
		var mytime =get_now_time();

		var date = new Date(myDate.getTime() - 7 * 24 * 3600 * 1000);//相差七天
		var myget_begindate=date.getDate();
		var myget_beginmonth=date.getMonth();
		if(myget_beginmonth<9){
			myget_beginmonth = "0"+(myget_beginmonth+1);
		}
		if(myget_begindate<10){
			myget_begindate="0"+myget_begindate;
		}
		date = date.getFullYear()+"-"+myget_beginmonth+"-"+myget_begindate;//结束日期
		wdate_init(id_begin,id_over,'yyyy-MM-dd');
		$("#"+id_begin).val(date);
		$("#"+id_over).val(mytime);
	};
	/**
	 * 日期初始化
	 * @param id_begin 主框体id
	 * @param id_over 副框体id（无则填""）
	 * @param type 类型 （年:"Y",月:"M",日:"D"）
	 * @param num 整形 （0,1,2,3...）
	 */
	var datepicker_init=function(id_begin,id_over,type,num){
		var myDate = new Date();
		var myget_overdate=myDate.getDate();
		var myget_overmonth=myDate.getMonth();
		if(myget_overmonth<9){
			myget_overmonth = "0"+(myget_overmonth+1);
		}
		if(myget_overdate<10){
			myget_overdate="0"+myget_overdate;
		}
		var fmt;
		if(type == "Y"){
			fmt = "yyyy";
			var mytime = myDate.getFullYear();//起始日期
		}else if(type == "M"){
			fmt = 'yyyy-MM';
			var mytime = myDate.getFullYear()+"-"+myget_overmonth;//起始日期
		}else{
			fmt = 'yyyy-MM-dd';
			var mytime = myDate.getFullYear()+"-"+myget_overmonth+"-"+myget_overdate;//起始日期
		}
		$("#"+id_over).val(mytime);
		if(id_over == ""){
			wdate_init(id_begin,fmt);

		}else{
			if(type == "Y"){
				var date = new Date();
				date = date.getFullYear()-(num-1);//结束日期
				$("#"+id_begin).val(date);
			}else if(type == "M"){
				var date = new Date();
				if(date.getMonth() + 1 - num <=0){
					date.setFullYear(date.getFullYear()-1);
					date.setMonth(date.getMonth() + 1 - num +12);
				}else{
					date.setMonth(date.getMonth() + 1 - num);
				}
				var myget_beginmonth=date.getMonth();
				if(myget_beginmonth<9){
					myget_beginmonth = "0"+(myget_beginmonth+1);
				}

				date = date.getFullYear()+"-"+myget_beginmonth;//结束日期
				$("#"+id_begin).val(date);
			}else{
				var date = new Date(myDate.getTime() - (num-1) * 24 * 3600 * 1000);
				var myget_begindate=date.getDate();
				var myget_beginmonth=date.getMonth();
				if(myget_beginmonth<9){
					myget_beginmonth = "0"+(myget_beginmonth+1);
				}
				if(myget_begindate<10){
					myget_begindate="0"+myget_begindate;
				}
				date = date.getFullYear()+"-"+myget_beginmonth+"-"+myget_begindate;//结束日期
				$("#"+id_begin).val(date);
			}
			wdate_init(id_begin,id_over,fmt);
		}
	};
	//***计算字节   getBytesCount(str) ***获得n字节的字符串   getBytesCount(str,n)
	var getBytesCount=function(str,n) {
		var bytesCount = 0;
		var result;
		var num;
		if(arguments.length==2){
			num=n+1;
		}else{
			num=0;
		}
		if (str != null) {
			for (var i = 0; i < str.length; i++) {
				var c = str.charAt(i);
				if (/^[\u0000-\u00ff]$/.test(c)) {
					bytesCount += 1;
					if(bytesCount<num){
						result=str.substring(0,bytesCount);
					}
				} else {
					bytesCount += 2;
					if(bytesCount<num){
						result=str.substring(0,bytesCount/2);
					}
				}
			}
		}
		if(arguments.length==2){
			return result;
		}else{
			return bytesCount;
		}
	};
	/**
	 * 文字超出规定字节显示为。。。
	 * n 规定字节数
	 */
	var phoshytip=function(n){
		$(".namelimit").each(function(){
			var str=$.trim($(this).text());//获取文字  去除空格
			//$(".tip-yellow").remove();
			if (getBytesCount(str) >n ) {
				$(this).text(getBytesCount(str,n)+"...");
				$(this).hover(function(){
					$(this).poshytip('destroy');
					$(this).poshytip({
						content:str,
						alignTo: 'target',
						alignX: 'center',
						keepStay: true,
						offsetY:5,
						showOn: 'none',
						allowTipHover: false
					});
					$(this).poshytip('show') ;
				},function(){
					$(this).poshytip('destroy');
				});
			}
		});
	};
	//解析传递参数
	var url_value=function(name){
		var str=window.location.href.split(name+"/");
		var str3=str[1].split("/");
		return parseFloat(str3[0]);
	};
	var data_null=function(json){
		if(json==null){
			json="---";
		}
		return json;
	};
	//获取界面语言 中文  英文
	var getlanguage=function(){
		var strCookie=document.cookie;
		var web_lang='';//语言
		if(strCookie.match(/zh-CN/) || strCookie.match(/zh-cn/) ){
			web_lang='zh-cn';//中文
		}
		else{
			web_lang='en';//英文
		}
		return web_lang;
	};
	//显示上传文件名
	var Fileaction=function(){
		$(".inputFile").on("change",function(){
			var filePath=$(this).find("input[type='file']").val();
			$(this).prev("input[type=text]").val(filePath)
		});
	};
	/**
	 * 设置浏览器cookie
	 * @param name 设置的cookie名称
	 * @param value 设置cookie的值
	 */
	var SetCookie=function(name,value)
	{
		var Days = 3650;
		var exp  = new Date();
		exp.setTime(exp.getTime() + Days*86400000);
		document.cookie = name + "="+ escape (value) + ";expires=0;path=/";
	};
	/**
	 * 获取浏览器cookie
	 * @param name 设置的cookie名称
	 * @param value 设置cookie的值
	 */
	var getCookie=function(name) {
		var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		if (arr != null) return unescape(arr[2]);
		return null;
	};
	/**
	 * 数组转json简易方法
	 * @param o
	 * @returns {*}
	 */
	var arrayToJson=function(o) {
		var r = [];
		if (typeof o == "string") return o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") ;
		if (typeof o == "object") {
			if (!o.sort) {
				for (var i in o)
					r.push("\""+i+"\"" + ":" + "\""+arrayToJson(o[i])+"\"");
				if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
					r.push("\"toString\":" + o.toString.toString());
				}
				r = "{" + r.join() + "}";
			} else {
				for (var i = 0; i < o.length; i++) {
					r.push(arrayToJson(o[i]));
				}
				r = "[" + r.join() + "]";
			}
			return r;
		}
		return o.toString();
	};
	//通讯状态
	var linkStatus_word_rule=function(textObj,status){
		textObj.removeClass('text_green');
		textObj.removeClass('text_red');
		textObj.removeClass('text_grey');
		if(status == 0){
			textObj.addClass('text_green');
			textObj.html(normal);
		}else if(status == 1){
			textObj.addClass('text_red');
			textObj.html(abnormal);
		}else{
			textObj.addClass('text_grey');
			textObj.html(unknown);
		}
		return textObj;
	};
	var imgState_rule=function(idn,data){
		var className='';
		switch(Number(data)){
			case 0:
				className="green_circle";
				break;
			case 1:
				className="red_circle";
				break;
			default:
				className="grey_circle";
				break;
		}
		$(idn).removeClass();
		$(idn).addClass(className);
	};
	/**
	 * 图片状态
	 * UPSimgstate_rule(data,arr,idn1)
	 * UPSimgstate_rule(arr,idn1)
	 * @param data
	 * @param arr
	 * @param idn1
	 * @constructor
	 */
	var UPSimgstate_rule=function(data,arr,idn1){
		var img='';
		var img_src="";
		var img_id="";
		if(arguments.length>2){
			switch(Number(data)){
				case 0:
					img=arr[0];
					break;
				case 1:
					img=arr[1];
					break;
				default:
					img=arr[2];
					break;
			}
			img_src=ss_image+"Equipmessage/"+img;
			img_id=idn1;
		}else{
			img_src=data;
			img_id=arr;
		}
		if(brower_type()<9){
			$(img_id).css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+img_src+"',sizingMethod='scale')");
		}else{
			$(img_id).css("background-image","url("+img_src+")");
		}
	};
	/**
	 * 根据状态添加字体颜色
	 * @param textObj 节点
	 * @param value 值
	 * @param status 状态
	 */
	var getTextColor=function(textObj,value,status){
		textObj.removeClass('text_green');
		textObj.removeClass('text_red');
		textObj.removeClass('text_grey');
		if(status == 0){
			textObj.addClass('text_grey');
			textObj.html("NA");
		}else if(status == 1){
			textObj.addClass('text_green');
			textObj.html(value);
		}else if(status == 2){
			textObj.addClass('text_red');
			textObj.html(value);
		}else if(status == -1){
			textObj.addClass('text_grey');
			textObj.html(value);
		}
		return textObj;
	};
	/**
	 * 根据状态改变数值
	 * @param textObj 节点
	 * @param value 值
	 * @param status 状态
	 */
	var getTextNoColor=function(value,status){
		if(status == 0){
			value = "NA";
		}else if(status == 1){
		}else if(status == 2){
		}else if(status == -1){
		}
		return value;
	};
   // Ajax 文件下载
	jQuery.download = function(url, data, method){    // 获得url和data
		if( url && data ){
			// data 是 string 或者 array/object
			data = typeof data == 'string' ? data : jQuery.param(data);        // 把参数组装成 form的  input
			var inputs = '';
			jQuery.each(data.split('&'), function(){
				var pair = this.split('=');
				inputs+='<input type="hidden" name="'+ pair[0] +'" value="'+ pair[1] +'" />';
			});        // request发送请求
			jQuery('<form action="'+ url +'" method="'+ (method||'post') +'">'+inputs+'</form>')
					.appendTo('body').submit().remove();
		}
	};
	//不足10  补0
	var ten_form=function(n){
		if(n<10){
			n="0"+n;
		}
		return n;
	};
	//时间格式转换为时间戳
	var getTimeNumber=function(t){
		var sysTime;
		sysTime=new Date(t.replace(/-/g,'/'));
		sysTime=sysTime.getTime()/1000;
		return sysTime;
	};
	//时间戳转换为时间格式  yyyy-mm-dd  HH:mm:ss
	var getLocalTime=function(nS){
		var now = new Date(parseInt(nS) * 1000);
		var  year=now.getFullYear();
		var  month=now.getMonth()+1;
		var  date=now.getDate();
		var   hour=now.getHours();
		var   minute=now.getMinutes();
		var   second=now.getSeconds();
		return   year+"-"+ten_form(month)+"-"+ten_form(date)+" "+ten_form(hour)+":"+ten_form(minute)+":"+ten_form(second);
	};
	/**
	 * 计算2个日期间的
	 * @param d1 日期1 'yyyy-MM -dd'
	 * @param d2 日期2
	 * @param type 'Y':年;'M':月;'D':日
	 * @param val 差值
	 */
	var chenkTimeDif=function(d1,d2,type,val){
		var date1  = new Date();
		var date2  = new Date();
		if(d1.split("-").length == 1){
			date1.setFullYear(d1.split("-")[0]);
		}else if(d1.split("-").length == 2){
			date1.setFullYear(d1.split("-")[0]);
			date1.setMonth(Number(d1.split("-")[1])+1);
		}else {
			date1.setFullYear(d1.split("-")[0]);
			date1.setMonth(Number(d1.split("-")[1])+1);
			date1.setDate(d1.split("-")[2])
		}

		if(d2.split("-").length == 1){
			date2.setFullYear(d2.split("-")[0]);
		}else if(d1.split("-").length == 2){
			date2.setFullYear(d2.split("-")[0]);
			date2.setMonth(Number(d2.split("-")[1])+1);
		}else {
			date2.setFullYear(d2.split("-")[0]);
			date2.setMonth(Number(d2.split("-")[1])+1);
			date2.setDate(d2.split("-")[2])
		}
		if(type=='Y'){
			if((date2.getFullYear()-date1.getFullYear()+1)<=val){
				return true;
			}else{
				return false;
			}
		}else if(type=='M'){
			monthdif = (date2.getFullYear()-date1.getFullYear())*12 + (date2.getMonth()-date1.getMonth()+1);
			if((monthdif)<=val){
				return true;
			}else{
				return false;
			}
		}else if(type=='D'){
			iDays  =  parseInt((date2.getTime() -  date1.getTime())  /  1000  /  60  /  60  /24);
			if((iDays)<=val){
				return true;
			}else{
				return false;
			}
		}
	};
	/*表单验证规则---add by caofei*/
	var mmLimit_rule=function(gets,obj,form1,flag){
		var lim=obj.attr("mmLimit").split("#");
		if(obj.prop("disabled")==true){
			obj.removeClass("Validform_error");
			return true;
		}else{
			var min=Number(eval(lim[0]));
			var max=Number(eval(lim[1]));
			if(lim.length==3 && flag==0){//上限
				var idn_x=$("input[name="+lim[2]+"]").not(":hidden").val();
				if(idn_x>min  && idn_x!=null && idn_x.length!=0 && idn_x!='undefined'){
					min=idn_x;
				}
			}
			else if(lim.length==3 && flag==1){//下限
				var idn_s=$("input[name="+lim[2]+"]").not(":hidden").val();
				if(idn_s<max && idn_s!=null && idn_s.length!=0 && idn_s!='undefined'){
					max=idn_s;
				}
			}
			obj.attr("errormsg",ERR_DATA_RANGE+min+" - "+max);
			if(gets.match(form1) && Number(gets)>=min && Number(gets)<=max){
				return true;
			}
			return false;
		}
	};
	/*中文 3  英文 1*/
	var input_lenght_limit=function(i_rule,i_gets,obj,i_length,flag){
		var bytesCount=0;
		if (i_gets != null && i_gets.match(i_rule)) {
			for (var i = 0; i < i_gets.length; i++) {
				var c = i_gets.charAt(i);
				if (/^[\u4e00-\u9fa5]$/.test(c)) {
					bytesCount += 3;
				} else{
					bytesCount += 1;
				}
			}
			var chinese_l=Math.floor(i_length/3);
			if(bytesCount>i_length){
				if(flag==1){
					obj.attr("errormsg",USER_DESCRIBE_NOTE+i_length+USER_DESCRIBE);
				}else{
					obj.attr("errormsg",USER_DESCRIBE_NOTE+chinese_l+USER_DESCRIBE_CHINESE+","+i_length+USER_DESCRIBE_ENGLISH);
				}
				return false;
			}else{
				return true;
			}
		}else{
			obj.attr("errormsg",ERR_FORMAT);
			return false;
		}
	};
	var equip_form=function(ff){
		return $(ff).Validform({
			tiptype:function(msg,o,cssctl){
				if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
					var objtip=o.obj.parent().parent().parent().find(".info").children(".Validform_checktip");
					cssctl(objtip,o.type);
					objtip.text(msg);
					var infowidth=o.obj.width();
					var infoObj=o.obj.parent().parent().parent().find(".info");
					if(o.type==2){
						infoObj.fadeOut(200);
					}else{
						var left=o.obj.position().left;
						var top=o.obj.position().top;
						infoObj.css({
							left:left+infowidth/3,
							top:top-25
						}).show();
						setTimeout(function(){infoObj.fadeOut(200);},1000)
					}
				}
			},
			ajaxPost:true,
			showAllError:false,//false逐条验证 true一起验证
			ignoreHidden:true,//可选项 true | false 默认为false，当为true时对:hidden的表单元素将不做验证;
			datatype:{//gets--表单元素值  obj--表单元素  curform-表单  regxp为内置的一些正则表达式的引用;
				"name"://名称 ：中文、英文 数字 _ -
						function(gets,obj,curform,regxp){
							var form=/^[\u4e00-\u9fa5A-Za-z0-9-_ ~@\+\(\)（）￥\$&;；\.。,，、]*$/;
							return input_lenght_limit(form,gets,obj,45);
						},
				"describeText"://备注：中文、英文、数字、标点符号
						function(gets,obj,curform,regxp){
							var form=/^[\u4e00-\u9fa5,，。\.;:“‘？?!！ A-Za-z0-9_-]*$/;
							return  input_lenght_limit(form,gets,obj,64);
						},
				"servename":/^[A-Za-z0-9]*$/,//数字  字母
				"SMTPaddress":/^[. A-Za-z0-9]*$/,//数字  字母
				"normal" : /^[^\s\'\"\?]*$/,//限制'"
				"sysname" :
						function(gets,obj,curform,regxp){
							var form= /^[^\s\'\"~#\?]*$/;//限制'"#~
							return input_lenght_limit(form,gets,obj,20);
						},
				"integer0":/^[1-9]\d*$/,//只能数字>0
				"negative_integer":/^[0-9]\d*$/,//非负整数
				"NumberFloat3" ://小数点3位  最小值-最大值
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d{0,3})?$/;//正负数字1.000
							return mmLimit_rule(gets,obj,form1);
						},
				"NumberFloat2" ://小数点2位  最小值-最大值
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d{0,2})?$/;//正负数字1.00
							return mmLimit_rule(gets,obj,form1);
						},
				"NumberFloat" ://小数点一位  最小值-最大值
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d)?$/;//正负数字1.0
							return mmLimit_rule(gets,obj,form1);
						},
				"Numberlimit" ://整数  最小值-最大值
						function(gets,obj,curform,regxp){
							var form1 = /^(^-?\d+$)$/;//正负数字
							return mmLimit_rule(gets,obj,form1);
						},
				"NumberFloatlimit" ://小数点一位  最小值-最大值
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d)?$/;//正负数字1.0
							return mmLimit_rule(gets,obj,form1);
						},
				"NumberMax" ://小数点一位  上限
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d)?$/;//正负数字1.0
							return mmLimit_rule(gets,obj,form1,0);
						},
				"NumberMin" ://小数点一位  下限
						function(gets,obj,curform,regxp){
							var form1 = /^[\-\+]?\d+(\.\d)?$/;//正负数字1.0
							return mmLimit_rule(gets,obj,form1,1);
						},
				"integerMax" ://正负整数  上限
						function(gets,obj,curform,regxp){
							var form1 = /^-?[0-9]\d*$/;//正负数字
							return mmLimit_rule(gets,obj,form1,0);
						},
				"integerMin" ://正负整数  下限
						function(gets,obj,curform,regxp){
							var form1 = /^-?[0-9]\d*$/;//正负数字
							return mmLimit_rule(gets,obj,form1,1);
						},
				"IpAddress_2"://ip地址 除了0.0.0.0 255.255.255.255
						function(gets,obj,curform,regxp){
							var form1 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?|\*)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?|\*)$/;//ip地址
							if(gets.match(form1)){
								if(gets!="0.0.0.0" && gets!="255.255.255.255"){
									return get_ip_normal_form(gets);
								}
							}
							return false;
						},
				"IpAddress" :function(gets,obj,curform,regxp){
					var form1 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?|\*)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?|\*)$/;//ip地址
					if(gets.match(form1)){
						return get_ip_normal_form(gets);
					}
					return false;
				},
				"passageName" :/^[0-9a-zA-Z-]{1,32}$/,//32位 "数字 字母 -"   用户名
				"passageLimit" :/^[0-9a-zA-Z~!@#$%^&*,_]{1,32}$/,//32位 "数字 字母 ~!@#$%^&*_"    密码
				"IpNormal" :function(gets,obj,curform,regxp){
					var form1 = /^((25[0-5]|2[0-4]\d|1\d\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;//ip地址-2.2.2.2
					if(gets.match(form1)){
						return get_ip_normal_form(gets);
					}
					return false;
				},
				"DNSaddress" :function(gets,obj,curform,regxp){//不允许输入0.0.0.0
					var form1 = /^((25[0-5]|2[0-4]\d|1\d\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;//ip地址-2.2.2.2
					if(gets.match(form1)){
						if (gets!="0.0.0.0") {
							return get_ip_normal_form(gets,obj,"1");
						}
					}
					return false;
				},
				"gatewayNormal" :function(gets,obj,curform,regxp){
					var form1 = /^((25[0-5]|2[0-4]\d|1\d\d|[0-9]\d|[0-9])\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;//网关地址
					if(gets.match(form1)){
						return get_ip_normal_form(gets);
					}
					return false;
				},
				"maskNormal" :
						/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/ //子网掩码

			}
		});
	};
	var get_ip_normal_form=function(gets){
		var gets_p=gets.split(".");
		var is_right=gets_p.length;
		for(var i=0;i<gets_p.length;i++){
			if(gets_p[i].length>1){
				if(gets_p[i].substr(0,1)!=0){//不能01 02
					is_right--;
				}
			}else{
				is_right--;
			}
		}
		if(is_right==0){
			return true;
		}else{
			return false;
		}
	};
	//开关量连接状态
	var linkStatus_rule=function(unit,dev_status,link_status){
		var html;
		html=$("<span></span>");
		html.append("<"+unit+"></"+unit+">");
		if(link_status==0){
			if(dev_status == -1){
				html.find(unit).addClass("text_grey");
				html.find(unit).text(unknown);
			}else{
				html.find(unit).addClass((dev_status == 1)?"text_red":"text_green");
				html.find(unit).text((dev_status == 1)?abnormal:normal);
			}
		}
		else{
			html.find(unit).addClass("text_red");
			html.find(unit).text(AC_CONNECTION_ABORTED);//通讯异常
		}
		return html;
	};
	//开关量连接状态
	var linkStatusColor=function(unit,dev_status,link_status){
		var html=linkStatus_rule(unit,dev_status,link_status);
		return html.html();
	};
	//检测浏览器版本
	var brower_type=function(){
		var browser=navigator.appName;
		var b_version=navigator.appVersion;
		var version=b_version.split(";");
		if(document.all){
			var trim_Version=version[1].replace(/[ ]/g,"");
			if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){
				return 6;
			}
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){
				return 7;
			}
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){
				return 8;
			}
			else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){
				return 9;
			}
		}else{
			return 100
		}
	};
	//placeholder兼容ie8
	var placeholder_ie=function(){
		/*让IE8-浏览器支持html5 placeholder属性，支持类型为password*/
		if (!('placeholder' in document.createElement('input'))) {//判断浏览器是否支持placeholder属性，不支持则扩展
			//让IE7-支持display inline-block css，因为password类型需要用dom来模拟
			$.fn.placeholder = function (config) {
				return this.each(function () {
					var me = $(this), pl = me.attr('placeholder');
					if (this.type == 'password') {//为密码域不能通过val来设置值显示内容，会显示星号，只能用dom来模拟
						var wrap = me.wrap('<div class="placeholder" style="width:' + me.outerWidth(true) + 'px;height:' + me.outerHeight(true) + 'px"></div>').parent();
						var note = wrap.append('<div class="note" style="line-height:' + me.outerHeight(true) + 'px">' + pl + '</div>')
								.click(function () {
									wrap.find('div.note').hide(); me.focus();
								}).find('div.note');
						me.blur(function () {
							if (me.val() == '') note.show();
						});
						me.focus(function () {
							wrap.find('div.note').hide();
						});
					}
					else { //非密码域使用val设置placeholder值
						me.focus(function () {
							me.removeClass('placeholder');
							if (this.value == pl) this.value = '';
						}).blur(function () {
							if (this.value == '') me.val(pl).addClass('placeholder');
						}).trigger('blur').closest('form').submit(function () {
							if (me.val() == pl) me.val('');
						});
					}
				});
			};
			//扩展方法clearPlaceholderValue：提交数据前执行一下，清空和placeholder值一样的控件内容。防止提交placeholder的值。
			//用于输入控件不在表单中或者使用其他代码进行提交的，不会触发form的submit事件，记得一定要执行此方法
			//是否要执行这个方法，可以判断是否存在此扩展
			//DMEO:if($.fn.clearPlaceholderValue)$('input[placeholder],textarea[placeholder]').clearPlaceholderValue()
			$.fn.clearPlaceholderValue = function () {
				return this.each(function () {
					if (this.value == this.getAttribute('placeholder')) this.value = '';
				});
			};
			$(function () {
				$('input[placeholder],textarea[placeholder]').placeholder();
			});
		}
	};
	/**
	 * 使indexof()兼容ie
	 * 在indexof()前使用
	 */
	var ie_indexof=function(){
		if (!Array.prototype.indexOf)
		{
			Array.prototype.indexOf = function(elt /*, from*/)
			{
				var len = this.length >>> 0;

				var from = Number(arguments[1]) || 0;
				from = (from < 0)
						? Math.ceil(from)
						: Math.floor(from);
				if (from < 0)
					from += len;

				for (; from < len; from++)
				{
					if (from in this &&
							this[from] === elt)
						return from;
				}
				return -1;
			};
		}
	};
	/**
	 * 加载弹窗
	 */
	var load_pop=function(msg){
		var tipMessage ="<span class='load_pop'><img src='"+ss_image+"/loading.gif'></span><br/><br/>";
		if(arguments.length==0){
			msg=COMMOM_UPLOADING;
		}
		tipMessage += "<span>"+msg+"</span><br/>";/*系统升级中*/
		pop_create_rule("successMsg",tipMessage,popTip,0);
		popWin("successMsg");
	};
	/**
	 * 加载进度
	 * @param n
	 * before_load(n)   n：初始化加载ajax个数
	 * add by:caofei
	 */
	var before_load=function(n){
		ajaxFlag=n-1;//默认计算了get_status_bar_info方法，取消。
		$("#index_main").prepend(
				'<div  class="loading_div">'+
				'<img src="'+PUBLIC+'/ixx/loading.gif">'+
				'</div>');
		$(".loading_div").show();
		static_height();//高度初始化
	};
	var get_Power_level=function(){
		var n;
		$.ajax({
			type:"POST",
			url:pubicLocator+"global/get_cur_user_level",
			data:{},
			success:function(data){
				n=Number(data.userLevel);
				return n;
			}
		});
	};
	/**
	 * 初始化加载成功后移除加载进度
	 * add by:caofei
	 */
	var get_cur_user_level_ajax=function(){
		ajaxFlag=ajaxFlag-1;
		if(ajaxFlag==0){
			$.ajax({
				type:"POST",
				url:pubicLocator+"global/get_cur_user_level",
				data:{},
				success:function(data){
					Power_level=Number(data.userLevel);
					ifMimaUse=data.ask_pwd;
					get_user_level_power_rule(Power_level);
					checkbox_ready("input[type=checkbox]");
					checkbox_ready_action("input[type=checkbox]");

					$(".loading_div").hide();
					$(".statics_section").show();
				}
			});
		}else{
			static_height();
		}
	};
	//检查null字段
	var checkIsNull=function(str){
		if(str == null){
			return "";
		}
		return str;
	};
	var FontListener=function () {//文字大小自适应 兼容ie8
		var doc=document,win=window;
		var docEl = doc.documentElement;
		var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
		//orientationchange 用户水平或者垂直翻转设备
		var recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			if(clientWidth<800||clientWidth>1600){
				docEl.style.fontSize = 20 * (clientWidth / 1600) + 'px';
			}
		};
		recalc();
		addEvent(win,resizeEvt, recalc);
		addEvent(doc,'DOMContentLoaded', recalc);
		if(brower_type()==8) {//ie8
			$('html').append('<script type="text/javascript" src="'+PUBLIC+'/jxx/rem.min.js"></script>');
		}
	};
	/*
	* 兼容ie8
	 * 添加事件处理程序
	 * @param object object 要添加事件处理程序的元素
	 * @param string type 事件名称，如click
	 * @param function handler 事件处理程序，可以直接以匿名函数的形式给定，或者给一个已经定义的函数名。匿名函数方式给定的事件处理程序在IE6 IE7 IE8中可以移除，在标准浏览器中无法移除。
	 * @param boolean remove 是否是移除的事件，本参数是为简化下面的removeEvent函数而写的，对添加事件处理程序不起任何作用
	 */
	var addEvent=function(object,type,handler,remove){
		if(typeof object!='object'||typeof handler!='function') return;
		try{
			object[remove?'removeEventListener':'addEventListener'](type,handler,false);
		}catch(e){
			var xc='_'+type;
			object[xc]=object[xc]||[];
			if(remove){
				var l=object[xc].length;
				for(var i=0;i<l;i++){
					if(object[xc][i].toString()===handler.toString()) object[xc].splice(i,1);
				}
			}else{
				var l=object[xc].length;
				var exists=false;
				for(var i=0;i<l;i++){
					if(object[xc][i].toString()===handler.toString()) exists=true;
				}
				if(!exists) object[xc].push(handler);
			}
			object['on'+type]=function(){
				var l=object[xc].length;
				for(var i=0;i<l;i++){
					object[xc][i].apply(object,arguments);
				}
			}
		}
	};
	/*
	 * 移除事件处理程序
	 */
	var removeEvent=function(object,type,handler){
		addEvent(object,type,handler,true);
	};
/**********************************************权限开始****add by:caofei***************************************/
	/**
	 * 权限控制
	 *
	 * @constructor
	 */
	/*设备信息*/
	var ems_power=function(){
		page_disabled_rule("#EquipmessageUPS_body",".input_control");
		page_disabled_rule("#EquipmessageAircondition_body",".input_control");
		page_disabled_rule("#EquipmessageElecPdu_body",".input_control");
	};
	/*告警设置*/
	var am_power=function(){
		page_disabled_rule("#AlarmmanageSetting_body","input,select,button");
		page_disabled_rule("#AlarmmanageEventmanage_body",".plan_table button,.plan_table input");
		page_disabled_rule("#AlarmmanagUseralarmsetting_body",".bottom_button button,.event_alarm_tabel input");
		page_disabled_rule("#AlarmmanageAlarmlinkage_body","figcaption button");
	};
	/*历史记录*/
	var rs_power=function(){
		page_disabled_rule("#RecordsearchHistory_body",".plan_table button");
		page_disabled_rule("#RecordsearchData_body",".plan_table button");
		page_disabled_rule("#RecordsearchAlarm_body",".plan_table button");
		page_disabled_rule("#RecordsearchSystem_body",".plan_table button");
		page_disabled_rule("#RecordsearchPUE_body",".plan_table button");
	};
	/*设备管理*/
	var ema_power=function (){
		page_disabled_rule("#EquipmanageUPS_body","figcaption button");
		page_disabled_rule("#EquipmanageUPSseting_body","input,select,button");
		page_disabled_rule("#EquipmanagePUE_body","input,select,button");
		page_disabled_rule("#EquipmanageSwitch_body",".bottom_button button");
		EmSwitchSetting_disabled_rule();//开关量设置
		page_disabled_rule("#EquipmanageRoommap_body","input[type=button],input[type=file]");
		page_disabled_rule("#EquipmanageSerialport_body","input,select,button");
	};
	/*辅助功能*/
	var ax_power=function(){
		page_disabled_rule("#AuxiliaryfunctionSystemupdate_body","input,select,button");
		page_disabled_rule("#AuxiliaryfunctionAuthorizationset_body","input,select,button");
	};
	var page_disabled_rule=function (idn1,idn2){
		if($(idn1).length>0){
			$(idn1).find(idn2).prop("disabled",true);
			$(idn1).find(".statics_header button").prop("disabled",false);
		}
	};
	var EmSwitchSetting_disabled_rule=function (){
		var idn=$("#EquipmanageSwitchsetting_body");
		if(idn.length>0){
			idn.find("input,select,button").prop("disabled",true);
			idn.find(".statics_header button").prop("disabled",false);
			var obj_label=$(".EmaSetting_img_cotainer").find("label");
			obj_label.unbind("mouseenter").unbind("mouseleave").unbind("click");
		}
	};
//权限等级
	var get_user_level_power_rule=function (n){
		switch(n){
			case 1://"一般用户";
				ems_power();/*设备信息*/
				am_power();//告警设置
				rs_power();/*历史记录*/
				page_disabled_rule("#UsermanageManager_body","figcaption button");/*用户管理*/
				page_disabled_rule("#SystemSet_body","input,select,button"); /*系统设置*/
				ema_power();/*设备管理*/
				ax_power();/*辅助功能*/
				break;
			case 2://"操作员";
				am_power();//告警设置
				rs_power();/*历史记录*/
				page_disabled_rule("#UsermanageManager_body","figcaption button");/*用户管理*/
				page_disabled_rule("#SystemSet_body","input,select,button"); /*系统设置*/
				ema_power();/*设备管理*/
				ax_power();/*辅助功能*/
				break;
			case 3://"管理员";

				break;
			case 9://"超级管理员"
				if(
						$("#AuxiliaryfunctionSystemupdate_body").length>0 ||
						$("#AuxiliaryfunctionAuthorizationset_body").length>0 ||
						$("#AuxiliaryfunctionDebug_body").length>0 ||
						$("#AuxiliaryfunctionAbout_body").length>0
				){
					var idn=$(".tab_container a");
					idn.eq(2).show();
					idn.eq(3).show();
				}
				$("#sign_header_ico").hide();
				break;
			default:
				break;
		}
		inputFileAction();
	};
/**********************************************权限结束*******************************************/

	return {
		"static_height":static_height,
		"es_action":es_action,
		"getlanguage":getlanguage,//获取语言
		"get_cur_user_level_ajax":get_cur_user_level_ajax,
		"get_user_level_power_rule":get_user_level_power_rule,//权限等级
		"get_Power_level":get_Power_level,//权限等级
		"getTimeNumber":getTimeNumber,
		"getLocalTime":getLocalTime,
		"button_create":button_create,//创建按钮
		"Ema_create_rule":Ema_create_rule,//创建设备
		"Ema_switch_img_rule":Ema_switch_img_rule,//设备图片规则
		"phoshytip":phoshytip,//提示 超出字节
		"delete_check_popwin":delete_check_popwin,//密码验证
		"url_value":url_value,//解析传递参数
		"brower_type":brower_type,//检测版本
		"PlanTbodyCreateRule":PlanTbodyCreateRule,//图表创建
		"RS_tab_click":RS_tab_click,//tab点击
		"popwin_message_rule":popwin_message_rule,//弹窗图案
		"pop_create_rule":pop_create_rule,//弹窗创建
		"save_popready":save_popready,//弹窗
		"if_select_pop":if_select_pop,//是否弹窗
		"load_pop":load_pop,//等待弹窗
		"wdate_init":wdate_init,
		"data_null":data_null,
		"checkIsNull":checkIsNull,//检测nul字段
		"get_now_time":get_now_time,//获取当前时间
		"begin_overdate_init":begin_overdate_init,//日期初始化  相差7天
		"datepicker_init":datepicker_init,//日期初始化
		"chenkTimeDif":chenkTimeDif,//计算时间差
		"checkbox_ready":checkbox_ready,//多选框 初始化
		"checkbox_ready_action":checkbox_ready_action,//多选框绑定事件
		"Fileaction":Fileaction,
		"inputFileAction":inputFileAction,//浏览按钮初始化
		"equip_form":equip_form,//验证
		"before_load":before_load,//before_load(n)   n：初始化加载ajax个数
		"ten_form":ten_form,//不足10 补0
		"placeholder_ie":placeholder_ie,//兼容ie
		"ie_indexof":ie_indexof,//indexof 兼容ie
		"addEvent":addEvent,
		"removeEvent":removeEvent,
		"FontListener":FontListener  //文字大小自适应
	}
});
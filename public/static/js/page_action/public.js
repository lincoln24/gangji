// JavaScript Document
define(["jquery","pc_public"],function($,PCpub){
	var TimerArray = {};
	var FuncArray = {};

	var TimerArray_Lister=function(name,func){
		if(ifNullData(TimerArray[name])){
			TimerArray[name]=[func()];
			FuncArray[name]=[func];
		}else{
			TimerArray[name].push(func());
			FuncArray[name].push(func);
		}
		name=null;
		func=null;
	};
	var clearTimers = function(){//清除所有定时器
		$.each(TimerArray,function(key,value){
			$.each(value,function(k,v){
				clearInterval(v);
				v=null;//清除 intervalID
			});
		});
	};
	var startTimer = function(name){
		if(!ifNullData(FuncArray[name])){
			$.each(FuncArray[name],function(k,v){
				TimerArray[name][k]=v();
			});
		}
	};
	/*导航条*/
	var static_fig_click=function(classname,func){
		var id_main=$(".main").not(":hidden");
		var idn=id_main.find(".statics-figcaption-one span");
		// if(LCDFLAG=='LCD') {//LCD
			// idn.css("width",idn.parent().width()/idn.length);
		// }
		id_main.find(classname).eq(0).show();
		id_main.find(".statics-figcaption-one span").on("mousedown",function(){
			var index_n=$(this).index();
			$(this).parent().children("span").removeClass("statics-figcaption-click");
			$(this).addClass("statics-figcaption-click");
			id_main.find(classname).hide();
			id_main.find(classname).eq(index_n).show();
			func && func();
		});
	};
	/*小于10 补0*/
	var ten_check=function(nn){
		var number=Number(nn);
		if(number<10){
			number="0"+number;
		}
		return number;
	};

    //图表--机柜编号
	var env_label_td_rule=function(type,num){
		var ul_class='',li_class='';
		if(type==0){//蓝色
			ul_class="env_blue_ul";
			li_class="env_blue_li";
		}else{//绿色
			ul_class="env_green_ul";
			li_class="env_green_li";
		}
		return '<td><ul class="'+ul_class+'">' +
				'<li>' +num+'</li>' +
				'</ul></td>';
	};
	var Air_create_label=function(idn1,array,type,name){
		var html='',td_w;
		$(idn1).find("tr").find("td:gt(0)").remove();
		if(!ifNullData(array)){
			for(var i=0;i<array.length;i++){
				html+=env_label_td_rule(type,name[i]);
			}
				td_w='2%';
			$(idn1).find('tr').append(html+'<td width="'+td_w+'"></td>');
			$(idn1).show();
		}else{
			$(idn1).find('tr').append(html+'<td></td>');
			$(idn1).hide();
		}
		html=null;
	};
	//图表空数据
	var echart_null_data=function(data,fix){
		var n=arguments.length;
		if(ifNullData(data)){
			return '-';
		}else{
			if(data.length>1){
				if(data[1]==2){//NA
					return '-';
				}else{
					if(ifNullData(data[0])|| data[0]=='-'){
						return '-';
					}else{
						if(n==2){
							data[0]=Number(data[0]).toFixed(fix);
						}
						return data[0]
					}
				}
			}
		}
	};
	var air_null_data=function(idn,data){//判断图表数据是否为空
		var idn_elem=$("#"+idn);
		var flag=0;
		for(var i=0;i<data.length;i++){
			if(!ifNullData(data) && data.join('').replace(/-/g,'').match(/^[0-9]+/)){
				flag++;
			}
		}
		if(flag==0){
			if(idn_elem.find('.noData_air').length==0){
				var hh=idn_elem.height();
				idn_elem.append('<div class="noData_air" style="line-height:'+hh+'px">暂无数据</div>');
			}
		}else{
			idn_elem.find('.noData_air').remove();
		}
	};
	/**
	 * 文字颜色
	 * 1正常，2异常，0 NA, -1 该数据无正常异常之说不标颜色
	 */
	var air_state_rule=function(object,arrayData,unit,fixNumber){
		object.removeClass("normal_font abnormal_font");
		if(!ifNullData(arrayData)){
			var DataValue=arrayData[0];
			if(arguments.length==4&&!isNaN(DataValue)){
				DataValue=Number(DataValue).toFixed(fixNumber);
			}
			if(arrayData.length>1){
				switch(Number(arrayData[1])){
					case -1://不标颜色
						object.html(DataValue+unit);
						break;
					case 2://NA
						object.addClass('normal_font');
						object.html('NA');
						break;
					case 0://正常
						object.html(DataValue+unit);
						break;
					case 1://异常
						object.addClass('abnormal_font');
						object.html(DataValue+unit);
						break;
					default:
						break;
				}
			}else{
				object.addClass('normal_font');
				object.html(DataValue+unit);
			}
		}else{
			object.addClass('normal_font');
			object.html('NA');
		}
		return object.prop('outerHTML');
	};
		/**
	 * 文字颜色
	 * 0正常，1异常，其他 NA
	 */
	var dev_state_rule=function(object,inputData){
		object.removeClass("normal_font abnormal_font");
		if(!ifNullData(inputData)){
			switch(Number(inputData)){
				case 0://正常
					object.html('正常');
					break;
				case 1://异常
					object.addClass('abnormal_font');
					object.html('异常');
					break;
				default:
					object.addClass('normal_font');
					object.html('NA');
					break;
			}
		}else{
			object.addClass('normal_font');
			object.html('NA');
		}
		return object.prop('outerHTML');
	};
	var tip_popwindow=function(idn,content,type){
		if(LCDFLAG=='LCD') {
			$(".Tip-Result").remove();
			var html='';
			if(type==0){
				html='<span class="Tip-Result result_success"><i class="result_success_before">';
			}else{
				html='<span class="Tip-Result result_fail"><i class="result_fail_before">';
			}
			$(idn).not(":hidden").append(html+content+'</i></span>');
			$(".Tip-Result").animate({"opacity":1,"height":"100px"},"slow",function(){
				$(".Tip-Result").animate({"opacity":0,"height":"0px"},2000)
			});//展开
		}else{
			if(type!=0){type=1}
			PCpub.save_popready(0,PCpub.popwin_message_rule(type)+content,function(){})
		}
	};

	var dataValidation=function(data,fix){ //数据验证，空则返回空字符
		if(data!=null && data!= "undefined" && data.length!=0){
			if(arguments.length==2){
				return Number(data).toFixed(fix);
			}else{
				return data;
			}
		}else{
			return "";
		}
	};
	var dataValidation_html=function(idn,data,fix){ //判断数据和之前不一样才赋值
		var newData;//新数据
		if(arguments.length==3){
			newData=dataValidation(data,fix);
		}else{
			newData=dataValidation(data);
		}
		if(idn.html()!=newData){
			idn.html(newData)
		}
	};
	var ifNullData=function(data){
		if(data!=null && data!= "undefined" && data.length!=0){
			return false;
		}else{
			return true;
		}
	};
	//告警图标   0  告警图标隐藏
	var alarmNumValue=function(idn,value){
		if(value==0|| value==null || value=='undefined' || value.length==0){
			$(idn).hide();
		}else{
			$(idn).show();
			$(idn).html(value);
		}
	};
	//单选框  多选框  初始化
	var check_radio_init=function(){
		var AclassChecked='event_radio_checked event_checkbox_checked event_checkbox1_checked ' +
				'event_checkbox2_checked event_checkbox3_checked event_checkbox4_checked event_checkbox5_checked';
		$(".main,.event_sec").not(":hidden").on("click","label",function() {//绑定未创建的单选框
			$(this).removeClass(AclassChecked);
			var class1=$(this).attr('class');
			var inputN=$(this).attr('name');
			var class1_checked=class1+"_checked";
			$("."+class1).off("click").css('pointer-events', 'none');//避免重复绑定
			setTimeout(function(){
				$("."+class1).css('pointer-events', 'auto');
			}, 400);
			check_radio_state(class1);
			var idnn=$(this).closest(".main,.event_sec").not(":hidden");//当前页面
			idnn.find("input[name="+inputN+"]").parent("label").removeClass(class1_checked);
			idnn.find("input[name="+inputN+"]:checked").parent("label").addClass(class1_checked);
		});
	};
	var check_radio_state=function(class1){
		var class1_checked=class1+"_checked";
		var idn=$(".main,.event_sec").not(":hidden").find("."+class1);
		idn.removeClass(class1_checked);
		idn.find("input").parent("label").removeClass(class1_checked);
		idn.find("input:checked").parent("label").addClass(class1_checked);
	};
	/**
	 * 获取现在时间
	 * 参数:空          返回值：yyyy-mm-dd
	 * 参数:datetime    返回值：yyyy-mm-dd hh:mm
	 */
	var getNowFormatDate=function(flag){
		var currentdate='',time;
		if(LCDFLAG=='LCD') {//LCD
			currentdate = $("#header_date").html().split(" ")[0];
			time=$("#header_time").html().split(':');
		}else{
			var dd=$(".header_date").html();
			var tt=$(".headerTime").html();
			currentdate = dd;
			time=tt.split(':');
		}
		if(flag=='datetime'){
			currentdate = currentdate+" "+time[0] + ":" + time[1];
		}else if(flag=='time'){
			currentdate=time;
		}
		return currentdate;
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
			return   year+"-"+ten_check(month)+"-"+ten_check(date)+" "+ten_check(hour)+":"+ten_check(minute)+":"+ten_check(second);
	};

	//日期初始化
	// 'date'  yyyy-mm-dd
	// 'datetime'  yyyy-mm-dd hh:mm
	// 'time'  hh:mm
	var date_init=function(idn,dateType,flag,idn2){
		if(LCDFLAG=='LCD') {
			var currYear = (new Date()).getFullYear();
			var opt={};
			var parmFlag=arguments.length;
			opt.date = {preset : 'date'};
			opt.datetime = {preset : 'datetime'};
			opt.time = {preset : 'time'};

			opt.def = {
				inputClass: 'mob_select',
				lang: "zh",
				theme: 'android-ics light', //皮肤样式
				display: 'modal', //显示方式
				mode: 'scroller', //日期选择模式
				startYear:currYear - 20, //开始年份
				endYear:currYear + 20, //结束年份
				width: 300,
				rows: 5,
				onBeforeShow:function(event, inst){
					if(parmFlag==4){
						var dateT=$(idn2).val().split(' ');
						if(dateT.length==1){
							dateT.push("00:00:00")
						}
						var dateV=dateT[0].split("-");
						var timeV=dateT[1].split(":");
						if(flag=='min'){
							$(idn).mobiscroll('option', {
								minDate: new Date(dateV[0],dateV[1]-1, dateV[2],timeV[0],timeV[1],'00')
							});
						}else if(flag=='max'){
							$(idn).mobiscroll('option', {
								maxDate: new Date(dateV[0],dateV[1]-1, dateV[2],timeV[0],timeV[1],'00')
							});
						}
					}
				},
				setText : '确定', //确认按钮
				cancelText : '取消', //取消按钮
				dateFormat: 'yy-mm-dd',
				dateOrder: 'yymmdd',
				dayNames: ['周日', '周一;', '周二;', '周三', '周四', '周五', '周六'],
				dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
				dayText: '日',
				hourText: '时',
				minuteText: '分',
				monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
				monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				monthText: '月',
				secText: '秒',
				timeFormat: 'HH:ii',
				timeWheels: 'HHii',
				yearText: '年'
			};
			var optDate=$.extend(opt[dateType], opt['def']);

			if(dateType=='date'){//yyyy-mm-dd
				$(idn).mobiscroll().date(optDate);
				if(ifNullData($(idn).val())){
					$(idn).val(getNowFormatDate('date'));//当前时间
				}
			}else if(dateType=='datetime'){//yyyy-mm-dd hh:mm
				$(idn).mobiscroll().datetime(optDate);
				if(ifNullData($(idn).val())){
					$(idn).val(getNowFormatDate('datetime'));//当前时间
				}
			}else if(dateType=='time'){//hh:mm
				$(idn).mobiscroll().time(optDate);
			}else if(dateType=='select'){
				$(idn).mobiscroll().select(optDate);
			}
		}
	};
	/**
	 * //紧急告警//重要告警//一般告警//提示信息
	 * @param n
	 * @returns {string}
     */
	var getAlarmName=function(n,flag){//获取告警等级
		var name,classname,color;
		var arrayAlarm=["更多信息","提示信息","一般告警","重要告警","严重告警","紧急告警"];
		var arrayColor=["#64aadd","#2592f8","#febe10","#fb9e10","#ff6900","#f2605f"];
		if(!ifNullData(n)&& n>0 && n<arrayAlarm.length){
			n=Number(n);
			name=arrayAlarm[n];
			classname='Alarm'+n;
			color=arrayColor[n];
		}else{
			name=arrayAlarm[0];
			classname='Alarm0';
			color=arrayColor[0];
		}
		if(flag=='text'){
			return name;
		}else if(flag=='class'){
			return classname;
		}else if(flag=='color'){
			return color;
		}else{
			return '<span class="'+ classname+'">'+name+'</span>';
		}
	};
	var getAlarmstate=function(n,flag){//获取确认状态
		var name,stateclass;
		switch(Number(n)){
			case 0:
				name="未确认";
				stateclass='abnormal_font';
				break;
			case 1:
				name="已确认";
				stateclass='normal_font';
				break;
			default:
				name="---";
				break;

		}
		if(arguments.length==2&&flag=='logout'){
			stateclass='disabled_font';//灰色
		}
		return '<span class="'+stateclass+'">'+name+'</span>';
	};
	var getAlarmcancel=function(n){//获取恢复状态
		var name,stateclass;
		switch(Number(n)){
			case 0:
				name="未恢复";
				stateclass='abnormal_font';
				break;
			case 1:
				name="已恢复";
				stateclass='normal_font';
				break;
			default:
				name="---";
				break;

		}
		return '<span class="'+stateclass+'">'+name+'</span>';
	};
	//获取来源
	var mainD_position_device=function(positon,device){
		var source=dataValidation(device);
		if(!isNaN(positon) && Number(positon)<13){
			var positonArray=["","管控柜","配电柜","高压直流","电池","空调","机柜","漏水","极早期","消防","门禁","视频","环境"];
			if(ifNullData(device)){
				source=positonArray[positon];
			}else{
				source=positonArray[positon]+"/"+device;
			}
		}
		return source;
	};
	var Home_chart_init=function(idn){
		var idnn=$("#"+idn);
		if(idnn.is(":hidden")){//获取隐藏节点宽高
			idnn.parent().css("display","block");
			idnn.css({'width':idnn.width(),'height':idnn.height()});
			idnn.parent().css("display","none");
		}
	};
	var Html_load_over;
	var mainchart_WH_init=function(maxN,idn,w_Scal,h_scal){
		var n=arguments.length;
		if(n==2){
			var Dwidth =document.getElementById(idn).clientWidth;
			var Dheight =document.getElementById(idn).clientHeight;
			$('#'+idn).removeData("Dwidth Dheight").data({'Dwidth':Dwidth,'Dheight':Dheight});
		}else if(n==4){
			// if(LCDFLAG=='LCD') {//LCD
				var idnn=$('#'+idn);
				idnn.css({ 'width':idnn.parent().width()*w_Scal,'height':idnn.parent().height()*h_scal});
			// }
		}
		Html_load_over++;
		if(Html_load_over==maxN){
			setTimeout(function(){$(".loading_main").hide();},200)
		}
	};
	var gopage_addr_rule=function(idn,url,loadFunc){
		var idnLoading=$(".loading_main");
		$(".main").hide();
		idnLoading.addClass('loading_main_img').show();//进度gif
		clearTimers();//暂停定时器
		idn=$("#"+idn);
		$.ajaxSetup ({
			cache: false //关闭AJAX相应的缓存
		});
		if(url=='Event'){//事件页面
			idn.empty();
		}
		if(idn.html().trim()==""){
			idn.load(MYURL+url+URL_from_mod+Math.random(),{},function(){
				Html_load_over=0;
				idn.show();
				idnLoading.removeClass('loading_main_img');
				if(url!='main'&&url!='HVDC'&&url!='Air'&&url!='Env'){
					setTimeout(function(){idnLoading.hide();},200)
				}
				if(url=='Event'){//事件页面
					loadFunc();
				}
			});
		}else{
			startTimer(url);
			idn.show();
			idnLoading.hide();
			$.ajax({
				type: "GET",
				url: MYHumeURL + "Global/on_page_change"+URL_from_mod+'?tm='+new Date().getTime(),
				data: {},
				success: function (data) {}
			});
		}
	};
	var socket=null;
	var socketInterval;
	var socket_create=function(){
		if(!socket && check_browser_versions().trident){//ie浏览器
			socket = new WebSocket('ws://127.0.0.1:8808');
			socket.onopen = function(event) {// 打开Socket
				clearInterval(socketInterval);
				socket_send("7");
			};
			socket.onclose = function(event) {// 监听Socket的关闭
				console.log('Client notified socket has closed',event);
				socket.close();
				socket = null;
			};
			socket.onerror = function(event) {
				socketInterval=setInterval(function(){//重新连接socket
					openkeyBoard();
				},2000)
			};
			socket.onmessage=function(message){//功能码$ 参数个数 $ 参数一 $ 参数二 $ 参数三.....
				var messageData=message.data.split('$');
				if(messageData[0]=='1'){//自动登录
					if(messageData[2]==0){//0:登录  1：未登录
						$.post(MYHumeURL + "Index/login", {
							auth: messageData[3]
						}, function (data) {});
					}
				}
				if(messageData[0]=='2'){//屏保结束后重启
					socket_send('5');
				}
				if(messageData[0]=='3'){//获取屏保时间
					if(messageData[2]==1){//0,禁用,1启用
						$("#Set_power_waitTime").val(messageData[3]);
					}
				}
			};
		}
	};
	var openkeyBoard=function(){//调用键盘
		socket_create();
		/*$("body").on('focus',"#user_name,#user_pass,input:text,input:password,textarea",function(){
			if(!$(this).hasClass("mob_datetime")&& !$(this).hasClass("mob_date")&&
					!$(this).hasClass("mob_select")&& !$(this).hasClass('NoInout')){//去除日期框
				socket_send('1$0');//软键盘
			}
		});*/
	};
	var socket_send=function(msg){
		if(socket){
			socket.send(msg);// 发送一个初始化消息
		}
	};
	var check_browser_versions=function () {
		var u = navigator.userAgent, app = navigator.appVersion;
		return {//移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			bIsCE:u.indexOf('windows ce') > -1,  //windows ce移动系统
			mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/IEMobile/), //是否为移动终端 // || !!u.match(/AppleWebKit/)
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1, //android终端或者uc浏览器
			linux: u.indexOf('Linux') > -1,
			iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	};

	//创建二级弹窗
	var make_sure_create=function(type,id){
		var html_bottom='';
		if(type==0){
			html_bottom=
					'<li class="make_sure_last">' +
					'<form class="makeSure_textarea_form">' +
					'<textarea  rows="3" class="make_sure_textarea" maxn="240" datatype="describeText"></textarea>' +
					'</form>' +
					'<button class="event_blue_button" id="main_event_sure" event_id="'+id+'">确认</button>' +
					'</li>';
		}else{//详情
			html_bottom=
					'<li class="make_sure_last">' +
					'<ul class="make_sure_content">' +
					'<li><a>确认时间：</a>'+getText(id,"confirm")+'</li>' +
					'<li><a>确认人员：</a>'+getText(id,"user")+'</li>' +
					'<li><a>确认描述：</a>'+getText(id,"confirm_content")+'</li>' +
					'</ul>'+
					'</li>'
		}
		$(".make_sure_ul").find("i").off("click");
		$("body").on("click",".make_sure_ul i",function(){//二级弹窗取消
			$(this).closest(".make_sure_ul").remove();
		});
		return mainThreeD_messagetip_create(id)+ html_bottom + '</ul>';
	};
	var getText=function(id,name){//获取一级弹窗表格内容文字
		var idn=$('[event_id='+id+']').parent().parent();
		return idn.find('[type='+name+']').text();
	};
	var mainThreeD_messagetip_create=function(id){//创建二级弹窗内容上部分
		return '<ul class="make_sure_ul">' +
					'<li class="detail_tit"><span>'+getText(id,"source")+'</span><i>×</i></li>' +
					'<li class="detail_c">' +
						'<ul class="make_sure_content">' +
							'<li>发生时间：'+getText(id,"occurred")+'</li>' +
							'<li>事件来源：'+getText(id,"source")+'</li>' +
							'<li>事件内容：'+getText(id,"description")+'</li>' +
							'<li>告警等级：'+getText(id,"level")+'</li>' +
							'<li>处理建议：'+getText(id,"solution")+'</li>' +
						'</ul>' +
					'</li>';
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
	var timeout_validform=function(idn){//请求超时
		if(LCDFLAG=='LCD') {//LCD
			validform_wrong_tip("请求超时，请稍后再试。",idn);
		}else{
			$(".detail").hide();
			$("#maskLayer").remove();
			PCpub.save_popready(0,PCpub.popwin_message_rule(3)+"请求超时，请稍后再试。",function(){});
		}
	};
	var validform_wrong_tip=function(msg,idn,o,cssctl){
		var valid_tip='';
		if(LCDFLAG=='LCD') {//LCD
			valid_tip= $('<div class="wrong_center valid_tip">'+msg+'</div>');
			$(".valid_tip").remove();
			$("#"+idn).append(valid_tip);
			valid_tip.show();
			setTimeout(function(){valid_tip.fadeOut(200);},1000);
		}else{
			valid_tip= $('<div class="info">' +
					'<span class="Validform_checktip">'+msg+'</span>' +
					'<span class="dec"><a class="dec1"></a></span>' +
					'</div>');
			$(".info").remove();
			$("#"+idn).append(valid_tip);
			cssctl(valid_tip.find(".Validform_checktip"),o.type);
			var left=o.obj.position().left;
			var top=o.obj.position().top;
			valid_tip.css({
				left:left+o.obj.width()/3,
				top:top-25
			}).show();
			setTimeout(function(){valid_tip.fadeOut(200);},1000);
		}
	};
	/*表单验证规则---add by caofei*/
	function mmLimit_rule(gets,obj,form1,flag){
		var lim=obj.attr("mmLimit").split("#");
		if(obj.prop("disabled")==true){
			obj.removeClass("Validform_error");
			return true;
		}else{
			var min=Number(eval(lim[0]));
			var max=Number(eval(lim[1]));
			if(lim.length==3 && flag==0){//上限
				var idn_x=$("input[name="+lim[2]+"]").not(":hidden").val();
				if(idn_x<=max && idn_x>=min  && idn_x!=null && idn_x.length!=0 && idn_x!='undefined'){
					min=idn_x;
				}
			}
			else if(lim.length==3 && flag==1){//下限
				var idn_s=$("input[name="+lim[2]+"]").not(":hidden").val();
				if(idn_s>=min&&idn_s<=max && idn_s!=null && idn_s.length!=0 && idn_s!='undefined'){
					max=idn_s;
				}
			}
			ie_indexof();//兼容ie
			if(lim[0].indexOf(".")>0){
				var nn=lim[0].split(".")[1].length;//判断位数
				min=Number(min).toFixed(nn);
				max=Number(max).toFixed(nn);
			}
			obj.attr("errormsg",'数据范围:'+min+" ~ "+max);
			if(gets.match(form1) && Number(gets)>=min && Number(gets)<=max){
				return true;
			}else{
				return false;
			}
		}
	}
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
					obj.attr("errormsg",'最多为'+i_length+'个字符');
				}else{
					obj.attr("errormsg",'最多为'+chinese_l+'个中文字符'+","+i_length+'个英文字符');
				}
				return false;
			}else{
				return true;
			}
		}else{
			obj.attr("errormsg",'格式不正确');
			return false;
		}
	};
	var validform_init=function(form,idn){//表单验证
		$(form).find('input[datatype],textarea[datatype]').attr("nullmsg",'不能为空');//不能为空
		$(form).find('input[datatype],textarea[datatype]').focus(function(){
			if(!$(this).hasClass('Validform_error')){
				$(this).attr('rightV',$(this).val())
			}
		});
		$(form).find('input[datatype],textarea[datatype]').blur(function(){
			if($(this).hasClass('Validform_error')){
				var obj_this=$(this);
				var validblurTimer=setTimeout(function(){
					obj_this.val(obj_this.attr('rightV'));
					obj_this.removeClass('Validform_error');
					clearTimeout(validblurTimer);
				},1200);
			}
		});
		return $(form).Validform({
			tiptype:function(msg,o,cssctl){
				if(!o.obj.is("form")){//验证表单元素时o.obj为该表单元素，全部验证通过提交表单时o.obj为该表单对象;
					validform_wrong_tip(msg,idn,o,cssctl);
				}
			},
			ajaxPost:true,
			showAllError:false,//false逐条验证 true一起验证
			datatype:{//gets--表单元素值  obj--表单元素  curform-表单  regxp为内置的一些正则表达式的引用;
				"name"://名称 ：中文、英文 数字 _ -
						function(gets,obj,curform,regxp){
							var form=/^[\u4e00-\u9fa5A-Za-z0-9-_ ~@\+\(\)（）￥\$&;；\.。,，、]*$/;//设备名称
							return input_lenght_limit(form,gets,obj,obj.attr('maxN'));
						},
				"describeText"://备注 //限制'"
						function(gets,obj,curform,regxp){
							var form=/^[\u4e00-\u9fa5,，。.;:“‘？?!！ A-Za-z0-9_-]*$/;
							return  input_lenght_limit(form,gets,obj,obj.attr('maxN'));
						},
				"passageName" :/^[0-9a-zA-Z-]{1,32}$/,//  用户名
				"passageLimit" :/^[0-9a-zA-Z~!@#$%^&*,_]{1,32}$/,  //  密码;
				"Float2":/^[\-\+]?\d+(\.\d{0,2})?$/,//正负数字1.00
				"integer0":/^[1-9]\d*$/,//除0 以外的整数
				"negative_integer":/^[0-9]\d*$/,//非负整数
				"integerLim":function(gets,obj,curform,regxp){//整数大小限制
					var form1 = /^(^-?\d+$)$/;//正负数字
					if(gets.match(form1)){
						return mmLimit_rule(gets,obj,form1);
					}else{
						obj.attr("errormsg",'请输入整数！');
						return false;
					}
				},
				"IpAddress" :function(gets,obj,curform,regxp){
					var form1 = /^((2[0-4]\d|25[0-5]|[01]?\d\d?|\*)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?|\*)$/;//ip地址
					if(gets.match(form1)){
						return get_ip_normal_form(gets);
					}
					return false;
				}
			}
		});
	};
	/**
	 * 使indexof()兼容ie
	 * 在indexof()前使用
	 */
	var ie_indexof=function(){
		if (!Array.prototype.indexOf){
			Array.prototype.indexOf = function(elt /*, from*/){
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
				from = (from < 0)
						? Math.ceil(from)
						: Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++){
					if (from in this &&
							this[from] === elt)
						return from;
				}
				return -1;
			};
		}
	};
	var PowerLevel_control=function(){//权限控制
		if($("#PowerLevel").val()!='logout'){//权限
			$("#event_all_sure").show();//事件
			$("#guard_doorB_container").show();//安防按钮
		}else{
			$("#event_all_sure").hide();//事件
			$("#guard_doorB_container").hide();//安防按钮
		}
	};
	var ie_CollectGarbage=function(){
		if(check_browser_versions().trident && CollectGarbage){
			setTimeout(function(){
				CollectGarbage();//ie 内存
			}, 1);
		}
	};
   //3 管理员，2 操作人员， 1 一般用户(只读用户)
	var user_level_rule=function(n){
		var w;
		var PowerLevel=n;
		var idn_nE=$("#nav_EguardMonitor_module");
		var idn_ba=$("#header_back_ico");//返回
		var idn_us=$("#header_user");//用户名
		$("#header_login,#nav_set_module").hide();
		if(idn_ba.css('display')=='none'){idn_us.show();}
		switch(Number(n)){
			case 1:
				w="一般用户";
				break;
			case 2:
				w="操作员";
				break;
			case 3:
				w="管理员";
				if(idn_nE.css("display")=="none"){
					$("#nav_set_module").show();
				}
				break;
			case 9:
				w="超级管理员";
				if(idn_nE.css("display")=="none"){
					$("#nav_set_module").show();
				}
				break;
			default:
				w="";
				PowerLevel='logout';
				idn_us.hide();
				if(idn_ba.css('display')=='none'){
					$("#header_login").show();
				}
				break;
		}
		$("#PowerLevel").val(PowerLevel);//权限等级
		PowerLevel_control();//权限
	};
	return {
		static_fig_click:static_fig_click,
		ten_check:ten_check,/*小于10 补0*/
		Air_create_label:Air_create_label,
		air_state_rule:air_state_rule,//文字颜色
		dev_state_rule:dev_state_rule,//状态文字
		echart_null_data:echart_null_data,//图表空数据
		tip_popwindow:tip_popwindow,//提示信息
		clearTimers:clearTimers,//清除所有定时器
		startTimer:startTimer,
		dataValidation:dataValidation,//add by雷音
		dataValidation_html:dataValidation_html,//判断数据不同
		ifNullData:ifNullData,//判断是否为空
		alarmNumValue:alarmNumValue,//告警数
		check_radio_init:check_radio_init,//单选框  多选框  动作初始化
		check_radio_state:check_radio_state,//单选框  多选框  状态初始化
		date_init:date_init,//日期初始化
		getAlarmName:getAlarmName,//获取事件等级
		getAlarmstate:getAlarmstate,//获取确认状态
		getAlarmcancel:getAlarmcancel,//获取恢复状态
		mainD_position_device:mainD_position_device,//获取来源
		gopage_addr_rule:gopage_addr_rule,
		openkeyBoard:openkeyBoard,//调用键盘
		socket_send:socket_send,//发送消息
		make_sure_create:make_sure_create,//告警确认弹窗
		check_browser_versions:check_browser_versions,//判断是否移动端 及 浏览器
		getNowFormatDate:getNowFormatDate,//获取现在时间
		getTimeNumber:getTimeNumber,//时间格式转换为时间戳
		getLocalTime:getLocalTime,//时间戳转换为时间格式
		validform_init:validform_init,//表单验证
		validform_wrong_tip:validform_wrong_tip,//验证提示
		timeout_validform:timeout_validform,//请求超时
		TimerArray_Lister:TimerArray_Lister,
		PowerLevel_control:PowerLevel_control,//权限
		mainchart_WH_init:mainchart_WH_init,
		Home_chart_init:Home_chart_init,//隐藏图表初始化--pc
		air_null_data:air_null_data,//判断图表数据是否为空
		user_level_rule:user_level_rule,//权限等级
		ie_CollectGarbage:ie_CollectGarbage//回收内存
	}
});

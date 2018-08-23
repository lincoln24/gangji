// JavaScript Document
define(["jquery","pc_public","PCtc"],function($,PCpub) {
    var sysTimeTicker;
    var TimeTicker;
    var sysTime=0;
    var index_init=function(){
        PCpub.FontListener();//文字大小自适应
        header_action();
        nav_action();
        nav();
        get_status_bar_info();//获取数据
        timeinterval();//循环获取数据
        // systimeinterval();//循环获取系统时间数据、循环告警图标

        index_heigtht();
        index_click_rule();
        PCpub.es_action();
        $(window).resize(function() {
            index_heigtht();
        });
    };
    var index_heigtht=function(){
        var h1 = $(window).outerHeight(true)- $("#index_header").height()- $("#index_footer").height();
        var h2=$(".nav").height();
        if(h1<h2){h1=h2}
        var idn_index=$("#index_main");
        idn_index.css("min-height",h1);
        var h3=idn_index.height();
        $(".aside_cotainer").height(h3-5).css("min-height",(h1-5)+"px");
        $(".loading_div").height(h3).css({"min-height":h1+"px","line-height":h1+"px"});
    };
    var index_click_rule=function(){
        $('#logout').click(function(){
            $.get("/index/index/logout", function(data){
                if (JSON.parse(data).code == -1) {                    
                    window.location.href = "/index/index/login";
                }
            });
        });
        $('#alarm_header_ico').click(function(){
            window.location.href = "/index/alarm";
        });
        $(document).ajaxError( function(e,xhr,opt){
            if(xhr.status==401){
                window.location.href = "/index/index/login";
            }
        });
    };
//创建签到弹窗
    var sign_create=function(){
        var html_table=
            '<table>'+
            '<tr>'+
            '<td></td>'+
            '<td style="text-align: left">'+
            '<input type="radio" name="sian_cur_status" id="cur_status_nor" value="0" checked>'+
            '<label for="cur_status_nor">'+normal+'</label>'+//正常
            '</td>'+
            '<td style="text-align: right">'+
            '<input type="radio" name="sian_cur_status" id="cur_status_abnor" value="1">'+
            '<label for="cur_status_abnor">'+abnormal+'</label>'+/*异常*/
            '</td>'+
            '</tr>'+
            '<tr>'+
            '<td valign="top" style=" padding-right:10px">'+HEAD_REMARK+'</td>'+//备 注
            '<td colspan="2">' +
            '<textarea id="signNote" class="ss_table_textarea" name="sian_memo_f" placeholder="' +SIGN_WARN+'" ></textarea>' +
            '</td>'+
            '</tr>'+
            '</table>';
        var html='<div style="padding: 0 30px;">'+html_table+'</div>';
        PCpub.pop_create_rule("detail_common_sign",html,HEAD_SIGN,2);/*"签到"*/
    };
    var get_status_bar_info=function(){
        $.ajax({
            type:"POST",
            url:"/index/info/get_status_bar_info",
            data:{},
            success:function(returnData){
                data = JSON.parse(returnData);
                var datetime=data.time.split(" ");
                sysTime=PCpub.getTimeNumber(data.time);
                var now = new Date(parseInt(sysTime) * 1000);
                $("#header_name").html(data.userName);
                $("#header_level").html(user_level_rule(data.userType));
                $(".header_date").html(datetime[0]);//系统日期
                getheaderTime(PCpub.getTimeNumber(data.time));//系统时间10:00:00
                // $(".header_day").html(getweekday(now.getDay()));//星期一
                if(data.alarm > 0){
                    $("#alarm_header_ico").show();
                }else{
                    $("#alarm_header_ico").hide();
                }
            }
        });
    };
    //系统日期
    var getheaderTime=function(t){
        var datetime=PCpub.getLocalTime(t).split(" ");
        $(".headerTime").html(datetime[1].substring(0,5));//只显示到分钟
    };
    // 0（周日） 到 6（周六）
    var getweekday=function(n){
        var w;
        switch(n){
            case 0:
                w=HEAD_SUN;//"星期日";
                break;
            case 1:
                w=HEAD_MON;//"星期一";
                break;
            case 2:
                w=HEAD_TUE;//"星期二";
                break;
            case 3:
                w=HEAD_WED;//"星期三";
                break;
            case 4:
                w=HEAD_THU;//"星期四";
                break;
            case 5:
                w=HEAD_FIR;//"星期五";
                break;
            case 6:
                w=HEAD_SAT;//"星期六";
                break;
        }
        return w;
    };
    //3 管理员，2 操作人员， 1 一般用户(只读用户)
    var user_level_rule=function(n){
        var w;
        switch(Number(n)){
            case 1:
                w=USER_USERLEVEL_NORMAL;//"一般用户";
                break;
            case 2:
                w=USER_USERLEVEL_OPERATOR;//"操作员";
                break;
            case 3:
                w=EMGENERAL_SYSTEM_CHARGER;//"管理员";
                break;
            case 9:
                w=COM_SUPER_MANAGER;//"超级管理员";
                break;
            default:
                break;
        }
        return w;
    };
    //签到日志数据交互
    var getSignAjax=function(memo_f){
        var cur_status=$("input[name=sian_cur_status]:checked").val();
        var data={"cur_status":cur_status,"memo_f":memo_f};
        data=JSON.stringify(data);
        $.ajax({
            type:"POST",
            url:pubicLocator+"Sign/sign",
            data:{
                "data":data
            },
            success:function(data){
                if(data.code==0){
                    //location.reload();
                    $("#detail_common_sign").hide();
                    $("#maskLayer").remove();
                }
            }
        });
    };
    var header_action=function(){
        $("#sign_header_ico").click(function(){
            sign_create();//创建签到弹窗
            PCpub.placeholder_ie();//placeholder属性兼容ie
            popWin("detail_common_sign");
            $("#detail_common_sign").find(".close1").bind("click",function(event){//确认
                var idn=$("textarea[name=sian_memo_f]");
                var mem_f='';
                if(idn.val()!=idn.attr("placeholder")){//防止提交提示语
                    mem_f=idn.val();
                }
                getSignAjax(mem_f);//保存数据
                $(this).unbind(event);
            });
        });
    };
    var nav_action=function(){
        $(".nav_span").find("a").bind("click",function(){
            var addr=$(this).attr('addr');
            if(addr != null){
                window.location.href = addr;
            }
        })
    };
    var nav_over=function(obj){
        // var s=$(obj).children().children("img").attr("src");
        $(obj).children(".nav_a").css("background","#367BB9");//紫色底部
        $(obj).children().children("p").css("color","#FFF");//白字
        $(obj).children("ul").show();
        if($(obj).hasClass("clicked")){
            // s=s;
            // $(obj).children().children("img").attr("src",s);
        }
        else{
            // s=s.split(".png");
            // $(obj).children().children("img").attr("src",s[0]+"_over.png");
        }
    };
    var nav_out=function(obj){
        // var s=$(obj).children().children("img").attr("src");
        if($(obj).hasClass("clicked")){
            $(obj).children(".nav_a").css("background","#367BB9");//紫色底部
            $(obj).children().children("p").css("color","#FFF");//白字
            $(obj).children("ul").show();
            // s=s;
            // $(obj).children().children("img").attr("src",s);
        }
        else{
            $(obj).children(".nav_a").css("background","#A8CDEC");//浅蓝底
            $(obj).children().children("p").css("color","#296AA5");//紫字
            $(obj).children("ul").hide();
            // s=s.replace(/_over/, "");
            // $(obj).children().children("img").attr("src",s);
        }
    };
   //有无通讯模块
    var nav_change=function(){
        $.ajax({
            type:"POST",
            url:pubicLocator+"EquipmessageMobileCommunication/get_dev_list",
            data:{},
            success:function(returndata){
                if(returndata==null || returndata=="" ){
                    $("#MobileModel").hide();
                }else{
                    $("#MobileModel").show();
                }
                PCpub.get_cur_user_level_ajax();
            },
            error:function(){
                PCpub.save_popready(0,PCpub.popwin_message_rule(1)+COMMOM_REQUEST_FAIL,function(){});//请求失败
            }
        });
    };
    var nav=function(){
        var idn_nav=$(".nav_span");
        // nav_change();
        idn_nav.hover(function(){
            nav_over(this);
        }, function(){
            nav_out(this);
            $(this).children("ul").hide();
        });
        idn_nav.click(function(){
            idn_nav.removeClass("clicked");
            $(this).addClass("clicked");
            idn_nav.each(function(){
                nav_out(this);
            });
        });
        $(".subnav").mouseleave(function(){
            $(".clicked").children("ul").hide();
        });
    };
    /**
     * 定时器实时获取最新顶部状态信息
     */
    var systimeinterval=function(){
        clearInterval(sysTimeTicker);
        sysTimeTicker=setInterval(function(){
            sysTime+=1;
            getheaderTime(sysTime);
            $("#header_alarm_img").fadeOut(500).fadeIn(500);
        },1000);
    };
    var timeinterval=function(){
        clearInterval(TimeTicker);
        TimeTicker=setInterval(function(){
            get_status_bar_info();
        },30000);
    };
    return {
        "index_init":index_init
    }
});
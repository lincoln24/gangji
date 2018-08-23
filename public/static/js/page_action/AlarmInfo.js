// JavaScript Document
require.config({
    baseUrl: "/static/js/",
    shim: {
        "md5":["jquery"],
        "Validform":["jquery"],//验证插件
        "PCtc":["jquery"],//弹窗插件

        "My97DatePicker":["jquery"], //时间插件
        "ajaxfileupload":["jquery"],//上传
        "jqpagination":["jquery"]//分页插件
    },
    paths: {
        "jquery": "./jquery-1.9.1",
        "md5":"md5",
        "Validform":"./Validform_v5.3.2_min",//验证插件
        "PCtc":"tc.all", //弹窗插件

        "ajaxfileupload":"./ajaxfileupload-2.1",//上传
        "jqpagination":"jquery.jqpagination.min", //分页插件
        "My97DatePicker":"My97DatePicker/WdatePicker", //日期插件
        "pc_public":"page_action/public_amd",//pc 公共函数
        "nav":"page_action/nav"
    }
});
define(["jquery","nav","pc_public","My97DatePicker",'jqpagination','ajaxfileupload'],function($,nav,PCpub){
    //搜索参量
    var search_status;
    var search_level;
    var search_start;
    var search_end;
    var search_from=0;
    var search_to=11;
    var pageNum = 12;
    var alarm_infor_init=function(){
        PCpub.begin_overdate_init("startTime","endTime");//初始化日期控件
        updateParams();
        search_start = null;
        search_end = null;
        getAlarmInformation(1);

    };
    var alarm_infor_action=function(){
        //初始化搜索按钮
        $('#searchButton').click(function(){
            updateParams();
            getAlarmInformation(1);
        });
        $("#export").click(function(){
            PCpub.mima_check_ajax(getDownloadFile);
        });
        //翻页
        $('.pagination').jqPagination({
            paged: function(page) {
                getAlarmInformation(page);// 分页事件
            }
        });
    };
    //同步页面参数
    var updateParams=function(){
        search_status = $('#search_status').val();
        search_level = $('#search_level').val();
        search_start = $('#startTime').val();
        search_end = $('#endTime').val();
    };
    /**
     * 异步获取时间内容
     * @param page
     */
    var getAlarmInformation=function(page){
        search_from = (page-1)*pageNum;
        search_to = page*pageNum;
        $.ajax({
            type:"POST",
            url:"/index/alarm/get_alarm_list",
            data:{
                "status":search_status,
                "level":search_level,
                "start":search_start,
                "end":search_end,
                "from":search_from,
                "to":search_to
            },
            success:function(returnData){
                data = JSON.parse(returnData);
                alarm_infor_table_create(data.data,search_from + 1);
                var pcout=Math.ceil(data.total/pageNum)>0?Math.ceil(data.total/pageNum):1;//总页数
                $('.pagination').jqPagination('option', 'current_page', page);
                $('.pagination').jqPagination('option', 'max_page', pcout);
                $(".all_page").html(pcout);//总页数
                // PCpub.get_cur_user_level_ajax();
            }
        })
    };

    //生成数据表格
    var alarm_infor_table_create=function(data,start){
        PCpub.ie_indexof();//兼容ie

        var AlarminforTable='';
        for(var i=0;i<data.length;i++){
            AlarminforTable+='<tr>'+
                '<td>'+(start+i)+'<input name="alarmID" type="hidden" value="'+data[i].id+'"></td>'+
                '<td>'+data[i].device+'</td>'+
                '<td>'+data[i].description+'</td>';
            if(data[i].level == 1){
                AlarminforTable+='<td class="text_red">'+FAULT+'</td>';
            }else if(data[i].level == 2){
                AlarminforTable+='<td class="text_orange">'+ALARM+'</td>';
            }else if(data[i].level == 3){
                AlarminforTable+='<td class="text_blue">'+EVENT+'</td>';
            }else{
                AlarminforTable+='<td>'+INFO+'</td>';
            }
            AlarminforTable+='<td>'+data[i].occurred+'</td>';
            if(data[i].canceled == null){
                AlarminforTable+='<td></td>';
            }else{
                AlarminforTable+='<td>'+data[i].canceled+'</td>';
            }
        }
        for(var j =0;j<12-data.length;j++){
            AlarminforTable+='<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>'
        }
        $("#alarm_infor_table").html(AlarminforTable);
        $('.plan_table tbody tr:even').css('background', '#F7F7F7');

        PCpub.checkbox_ready("input[type=checkbox]");
        PCpub.checkbox_ready_action("input[type=checkbox]");
    };
    /**
     * 异步保存表格数据
     */
    var setAlarmInfoData=function(){
        var itemList = $('#alarm_infor_table').find("tr");
        if(itemList.length == 0){
            return;
        }
        var dataList = new Array();
        for(var i =0;i<itemList.length;i++){
            dataList.push({
                id:itemList.eq(i).find("input[name='alarmID']").val(),
                is_repeat:itemList.eq(i).find("input[name='continue']").prop("checked")?1:0,
                check:itemList.eq(i).find("input[name='check']").length>0&&itemList.eq(i).find("input[name='check']").prop("checked")?1:0
            });
        }
        $.ajax({
            type:"POST",
            url:pubicLocator+"AlarmmanageInformationprocess/set_alarm",
            data:{
                "data":JSON.stringify(dataList)
            },
            success:function(data){
                if(data.code==0){
                    PCpub.save_popready(0,PCpub.popwin_message_rule(0)+COMMON_CONFIRM_SUCCESS,function(){
                        getAlarmInformation($(".pagination >input").val());
                        $.ajax({
                            type:"POST",
                            url:pubicLocator+"global/get_status_bar_info",
                            data:{},
                            success:function(data){
                                if(data.alarm==true){
                                    $("#alarm_header_ico").show();
                                }else{
                                    $("#alarm_header_ico").hide();
                                }
                            }
                        });
                    });
                }
            }
        })
    };
    /**
     * 下载对应条件的告警数据
     */
    var getDownloadFile=function(){
        var url =pubicLocator+"AlarmmanageInformationprocess/export_list";
        var data = {
            "status":search_status,
            "level":search_level,
            "start":search_start,
            "end":search_end
        };
        $.download(url,data);
    };
    /**
     * 导入告警信息处理
     */
    var fileSubmit=function(){
        $.ajaxFileUpload({
            url:pubicLocator+'AlarmmanageEventmanage/import_alarm_config',
            secureuri:false,
            fileElementId:'importFile',//file标签的id
            dataType: 'json',//返回数据的类型
            success: function (data) {
                if(data.code == 0){
                    PCpub.save_popready(0,PCpub.popwin_message_rule(0)+COMMOM_UPLOAD_FAIL,function(){});/*"上传成功"*/
                }else{
                    if(typeof(data.error) != 'undefined') {
                        if(data.error != '') {
                            PCpub.save_popready(0,PCpub.popwin_message_rule(1)+data.error,function(){});
                        } else {
                            PCpub.save_popready(0,PCpub.popwin_message_rule(1)+data.msg,function(){});
                        }
                    }
                }

            },
            error: function (data, status, e) {
                PCpub.save_popready(0,PCpub.popwin_message_rule(1)+e,function(){});
            }
        });
    };
    //运行
    nav.index_init();
    // PCpub.before_load(3);
    alarm_infor_init();
    alarm_infor_action();

});
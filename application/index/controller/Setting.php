<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Setting extends ControllerBase
{
    public function index()
    {
        return $this->fetch('system_set');
    }

    public function get_conf()
    {
        $system = model('CSysConf')->get_common_conf();

        $system = array(
            "name_f" => $system["name_f"],  //系统名称
            "contact_name" => $system["contact_name"],
            "contact_phone" => $system["contact_phone"],
            "lang_web" => "zh-cn",   //界面语言
            // "login_type" => $system["login_type"],      //网页登录方式 0:仅http 1:仅https 2:http和https
            // "default_net" => $defaultNet    // 系统默认网卡 1  [ 网卡1 ]     2 [  网卡2 ]
        );

        $datetime = Db::table('c_time')
        ->field('up_span_index,serv_type,serv_index,serv_addr_self,timezone_index')
        ->select();
        $datetime = $datetime[0];

        $autoTime = $datetime["up_span_index"] == 0 ? 0 : 1;
        $datetime = array(
            "auto_time" => $autoTime,     //是否使用网络时间
            "up_span_index" => $datetime["up_span_index"],   //自动更新间隔时间索引， 0表示不更新
            "serv_type" => $datetime["serv_type"],       //服务器类型 0网络 1自定义
            "serv_index" => $datetime["serv_index"],      //时间服务器索引
            "serv_addr_self" => $datetime["serv_addr_self"],     //自定义服务器
            "timezone_index" => $datetime["timezone_index"],      //时区索引
        );

        $conf = array(
            "system" => $system,
            "datetime" => $datetime,
            "current_time" => date("Y-m-d H:i:s", time()),
        );

        return json_encode($conf);
    }

    public function set_sys()
    {
        $input = request()->put();
        $conf = json_decode($input['config'], true);

        if ($conf["lang_web"] != "zh-cn" && $conf["lang_web"] != "en-us")
        {
            $conf["lang_web"] =  "zh-cn";
        }

        //即时切换语言，语言功能暂时没做
        // cookie('think_language',$conf["lang_web"]);
        // $conf["lang_web"] = get_lang_code_by_str($conf["lang_web"]);

        /*16-12-02: 服务器始终提供http和https连接，在php当中做反问限制和重定向,暂时没做*/
        // if ($curLoginType != $conf["login_type"])
        // {
        //     $this->msg_conf_change(MSG_CONF_TYPE_SYS_PARAM, 2);
        // }
        // else
        // {
        //     $this->msg_conf_change(MSG_CONF_TYPE_SYS_PARAM, 1);
        // }
        $result = model('CSysConf')->set_common_conf($conf);

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function set_datetime()
    {
        $input = request()->put();
        $datetime = json_decode($input['config'], true);

        $isAuto = ($datetime["auto_time"] == 1);
        $datetime["up_span_index"] = ($isAuto ? $datetime["up_span_index"] : 0);
        unset($datetime["auto_time"]);

        $manualTime = $datetime["current_time"];
        unset($datetime["current_time"]);
        $datetime["set_time"] = $manualTime;

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function get_expire_conf()
    {
        $data = model('CSysConf')->get_expire_conf();

        return $data;
    }

    public function set_expire_conf()
    {
        $input = request()->put();

        $loginExpire = $input["login_expire"];

        if ("" == $loginExpire)
        {
            return $this->ajaxReturnCode(CODE_FAILED, "expire time cannot be empty");
        }

        model('CSysConf')->set_expire_conf($loginExpire);

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }
}

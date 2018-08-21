<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Alarm extends ControllerBase
{
    public function index()
    {        
        return $this->fetch('record/currentalarm');
    }

    public function get_alarm_list()
    {
        $input = request()->put();

        $status = null;
        if($input['status'] == 1)// 告警事件处理状态 0:全部 1:发生中 2:已恢复
        {
            $status = 0;
        }
        else if($input['status'] == 2)
        {
            $status = 2;
        }

        $level = $input['level'];   // 告警事件等级 0:全部 1:故障 2:告警 3:事件
        $start = $input['start'];             // 告警事件起始时间
        $end = $input['end'];                 // 告警事件截止时间
        $offset = $input['from'];      // 列表查询偏移
        $range = $input['to'] - $input['from']; // 列表查询范围

        $returnData['data'] = model('DEventLog')->get_alarm_list($start, $end, $status, $level, $offset, $range);
        $returnData['count'] = model('DEventLog')->get_alarm_num($status, $start, $end, $level);

        return json_encode($returnData);
    }
    /**
     * 获取标题栏的信息，包括时间、告警状态和用户信息
     */
    public function get_status_bar_info()
    {
        $alarm = model('DEventLog')->get_alarm_num(EVENT_HAPPEN);

        $sysConf = model("CSysConf")->get_common_conf();
        $sysName = $sysConf["name_f"];

        $data = array(
            "system_name" => $sysName,
            "time" => date('Y-m-d H:i:s',time()),
            "userType" => Session::get('userLevel'),
            "userName" => Session::get("userName"),
            "alarm" => $alarm,
        );

        return json_encode($data);
    }
}

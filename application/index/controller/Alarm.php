<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Alarm extends ControllerBase
{
    public function index()
    {        
        return $this->fetch('record/alarm_record');
    }

    public function get_alarm_list()
    {
        $input = request()->put();

        $status = $input['status'];
        $dev_type = $input['dev_type'];
        $dev_index = $input['dev_index'];
        $zone_id = $input['zone_id'];
        $level = $input['level'];   // 告警事件等级 0:全部 1:故障 2:告警 3:事件
        $start = $input['start'];             // 告警事件起始时间
        $end = $input['end'];                 // 告警事件截止时间
        $offset = $input['from'];      // 列表查询偏移
        $range = $input['to'] - $input['from']; // 列表查询范围

        $returnData['data'] = model('DEventLog')->get_alarm_list($status, $dev_type, $dev_index, $zone_id, $level, $start, $end, $offset, $range);
        $returnData['count'] = model('DEventLog')->get_alarm_num($status, $dev_type, $dev_index, $zone_id, $start, $end, $level);

        return $this->ajaxReturnCode(0,null,$returnData);
    }

    public function get_alarm_count()
    {
        $input = request()->put();

        $status = $input['status'];
        $dev_type = $input['dev_type'];
        $dev_index = $input['dev_index'];
        $zone_id = $input['zone_id'];
        $level = $input['level'];   // 告警事件等级 0:全部 1:故障 2:告警 3:事件
        $start = $input['start'];             // 告警事件起始时间
        $end = $input['end'];                 // 告警事件截止时间

        $AlarmCount = model('DEventLog')->get_alarm_num($status, $dev_type, $dev_index, $zone_id, $start, $end, $level);

        return $this->ajaxReturnCode(0,null,$AlarmCount);
    }
}

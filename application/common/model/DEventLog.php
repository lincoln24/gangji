<?php
namespace app\common\model;

use think\Db;
use think\Model;

class DEventLog extends Model
{
    public static function get_alarm_num($status)
    {
        $sqlToDo = "select count(1) as alarm_num FROM d_event_log WHERE status=" . $status;

        $result = Db::query($sqlToDo);

        return $result[0]["alarm_num"];
    }
}

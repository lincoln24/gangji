<?php
namespace app\common\model;

use think\Db;
use think\Model;

class DEventLog extends Model
{
    public static function get_alarm_num($status, $start=null, $end=null, $level=null)
    {
        $sqlToDo = "select count(1) as alarm_num FROM d_event_log WHERE status<3";
        if($status != null)
        {
            $sqlToDo .= " AND status=" . $status;
        }
        if($level > null)
        {
            $sqlToDo .= " AND alarm_level=" . $level;
        }
        if($start != null)
        {
            $sqlToDo .= " AND occur_time>='" . $start . "'";
        }
        if($end != null)
        {
            $sqlToDo .= " AND occur_time<='" . $end . "'";
        }
        // dump($sqlToDo);

        $result = Db::query($sqlToDo);

        return $result[0]["alarm_num"];
    }

    public static function get_alarm_list($start=null, $end=null, $status=null, $level=0, $offset=0, $range=0)
    {
        $sqlToDo = "select event.id as id,conf.name as device,event.event_id as description";
        $sqlToDo .= ",event.alarm_level as level,event.occur_time as occurred,event.cancel_time as canceled";
        $sqlToDo .= " FROM d_event_log event inner join c_sensor conf on event.dev_type=conf.sensor_type and event.dev_index=conf.sensor_id";
        $sqlToDo .= " WHERE status<3";
        if($status != null)
        {
            $sqlToDo .= " AND status=" . $status;
        }
        if($level > 0)
        {
            $sqlToDo .= " AND alarm_level=" . $level;
        }
        if($start != null)
        {
            $sqlToDo .= " AND occur_time>='" . $start . "'";
        }
        if($end != null)
        {
            $sqlToDo .= " AND occur_time<='" . $end . "'";
        }
        $sqlToDo .= " limit " . $offset . "," . $range;

        // dump($sqlToDo);
        $result = Db::query($sqlToDo);

        return $result;
    }
}


<?php
namespace app\common\model;

use think\Db;
use think\Model;

class DEventLog extends Model
{
    public function get_alarm_num($status=null, $dev_type=0, $dev_index=0, $zone_id=0, $level=0, $start=null, $end=null)
    {
        $sqlToDo = "select count(1) as alarm_num FROM d_event_log WHERE status<3";

        $sqlToDo = "select count(1) as alarm_num FROM d_event_log event inner join c_sensor conf";
        $sqlToDo .= " on event.dev_type=conf.sensor_type and event.dev_index=conf.sensor_id";
        $sqlToDo .= " WHERE event.status<3";
        if(($status != null) && ($status >= 0))
        {
            $sqlToDo .= " AND event.status=" . $status;
        }
        if($dev_type > 0)
        {
            $sqlToDo .= " AND event.dev_type=" . $dev_type;
        }
        if($dev_index > 0)
        {
            $sqlToDo .= " AND event.dev_index=" . $dev_index;
        }
        if($zone_id > 0)
        {
            $sqlToDo .= " AND conf.zone_id=" . $zone_id;
        }
        if($level > 0)
        {
            $sqlToDo .= " AND event.alarm_level=" . $level;
        }
        if($start != null)
        {
            $sqlToDo .= " AND event.occur_time>='" . $start . "'";
        }
        if($end != null)
        {
            $sqlToDo .= " AND event.occur_time<='" . $end . "'";
        }
        // dump($sqlToDo);

        $result = Db::query($sqlToDo);

        return $result[0]["alarm_num"];
    }

    public function get_alarm_list($status=null, $dev_type=0, $dev_index=0, $zone_id=0, $level=0, $start=null, $end=null, $offset=0, $range=0)
    {
        $sqlToDo = "select event.id as id,conf.name as device,event.event_id as description";
        $sqlToDo .= ",event.alarm_level as level,event.occur_time as occurred,event.cancel_time as canceled";
        $sqlToDo .= " FROM d_event_log event inner join c_sensor conf on event.dev_type=conf.sensor_type and event.dev_index=conf.sensor_id";
        $sqlToDo .= " WHERE event.status<3";
        if(($status != null) && ($status >= 0))
        {
            $sqlToDo .= " AND event.status=" . $status;
        }
        if($dev_type > 0)
        {
            $sqlToDo .= " AND event.dev_type=" . $dev_type;
        }
        if($dev_index > 0)
        {
            $sqlToDo .= " AND event.dev_index=" . $dev_index;
        }
        if($zone_id > 0)
        {
            $sqlToDo .= " AND conf.zone_id=" . $zone_id;
        }
        if($level > 0)
        {
            $sqlToDo .= " AND event.alarm_level=" . $level;
        }
        if($start != null)
        {
            $sqlToDo .= " AND event.occur_time>='" . $start . "'";
        }
        if($end != null)
        {
            $sqlToDo .= " AND event.occur_time<='" . $end . "'";
        }
        if($offset != null) 
        {
            $sqlToDo .= " limit " . $offset;
            if($range != null) 
            {
                $sqlToDo .= "," . $range;
            }
        }

        // dump($sqlToDo);
        $result = Db::query($sqlToDo);

        return $result;
    }
}


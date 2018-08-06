<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Vibration extends ControllerBase
{
    public function index()
    {
        return $this->fetch('realtimedata/vibration');
    }

    public function get_vibration_data()
    {
        $input = request()->put();//传来的数据一定要带有content-type:application/json的头

        $sqlToDo = "select s.sensor_id as SensorId,s.name as Name,t.status as Status";
        $sqlToDo .= " FROM c_sensor s inner join d_vibration_data t on s.sensor_id=t.sensor_id where s.sensor_type=" . TYPE_VIBRATION_SENSOR;

        if (isset($input['sensor_id']))
        {
            $sqlToDo .= " AND s.sensor_id = " . $input['sensor_id'];
        }
        if (isset($input['zone_id']))
        {
            $sqlToDo .= " AND s.zone_id = " . $input['zone_id'];
        }
        // dump($sqlToDo);
        $result = Db::query($sqlToDo);
        // dump($result);
        if($result == null)
        {
            return $result; 
        }
        else
        {
            return json_encode($result);
        }
    }
}

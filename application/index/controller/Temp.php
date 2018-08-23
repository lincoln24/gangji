<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Temp extends ControllerBase
{
    public function index()
    {
        return $this->fetch('realtimedata/temp');
    }

    public function get_temp_sensor_data()
    {
        $input = request()->put();//传来的数据一定要带有content-type:application/json的头

        $sqlToDo = "select s.sensor_id as SensorId,s.name as Name,t.temp as Temp,t.status";
        $sqlToDo .= " FROM c_sensor s inner join d_temp_data t on s.sensor_id=t.sensor_id where s.sensor_type=" . TYPE_TEMP_SENSOR;

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
            $result = $this->add_status($result);
            return json_encode($result);
        }
    }

    public function get_temp_sensor_his_data()
    {
        $input = request()->put();

        $where = 'node_id = '. $input['node_id'] .
                ' and sensor_id = ' . $input['sensor_id'] .
                ' and time_f >= "' . $input['start'] .
                '" and time_f <= "' . $input['end'] . '"';

        $result = Db::table('his_sensor_data')
        ->field('time_f,temp')
        ->where($where)
        ->select();

        if($result == null)
        {
            return json_encode($this->ajaxReturnCode(CODE_FAILED)); 
        }
        else
        {
            return json_encode($result);
        }
    }

    public function get_conf()
    {
        $input = request()->put();
        $result = model('CSensor')->get_conf(TYPE_TEMP_SENSOR, $input);

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return json_encode($result);
        }
    }

    public function set_conf()
    {
        $input = request()->put();
        $config = json_decode($input['config'], true);

        $where = array('sensor_id' => $input['devID'],
                      'sensor_type' => TYPE_TEMP_SENSOR);

        $result = model('CSensor')->set_conf($config, $where);

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS); 
        }
    }

    protected function add_status($result)
    {
        foreach ($result as $key => $value)
        {
            $result[$key]["Temp"] = [$value["Temp"], $value["status"]];
            unset($result[$key]["status"]);
        }
        return $result;
    }
}

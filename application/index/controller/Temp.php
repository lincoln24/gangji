<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Temp extends ControllerBase
{
    public function index()
    {
        return $this->fetch('temp');
    }

    public function get_temp_sensor_data()
    {
        $input = request()->put();

        $result = Db::table('sensor_list_table')
        ->where(array(
            'node_id' => $input['node_id'],
            'sensor_id' => $input['sensor_id']))
        ->select();

        if($result == null)
        {
            return json_encode($this->ajaxReturnCode(CODE_FAILED)); 
        }
        else
        {
            return json_encode($result[0]);
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
}

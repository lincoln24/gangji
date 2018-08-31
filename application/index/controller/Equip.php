<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Equip extends ControllerBase
{
    public function index()
    {
        return $this->fetch('setting/equip_manage');
    }

    public function detail_manage()
    {
        return $this->fetch('setting/detail_manage');
    }

    public function history()
    {
        return $this->fetch('record/data_record_select');
    }

    public function his_data()
    {
        return $this->fetch('record/data_record');
    }

    public function get_conf()
    {
        $input = request()->put();
        $result = model('CSensor')->get_conf($input);

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS,null,$result);
        }
    }

    public function set_conf()
    {
        $input = request()->put();
        $config = json_decode($input['config'], true);

        $where = array('sensor_id' => $input['devID'],
                      'sensor_type' => $input['type']);

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

    public function delete()
    {
        $input = request()->put();
        $list = json_decode($input['list'], true);

        foreach ($list as $item)
        {
            if (null != $item["index"])
            {
                $ret = model('CSensor')
	                ->where(array(
	                	"sensor_id" => $item["index"],
	                	"sensor_type" => $input["type"]))
	                ->delete();
            }
        }

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function get_his_data()
    {
        $input = request()->put();

        $table = '';

        switch ($input['dev_type']) 
        {
            case TYPE_TEMP_SENSOR:
                $table = 'd_his_temp';
                break;
            case TYPE_VIBRATION_SENSOR:
                $table = 'd_his_vibration';
                break;
            default:
                $table = 'd_his_temp';
                break;
        }
        switch ($input['interval']) 
        {
            case 1:
                $table .= '_realtime';
                break;
            case 2:
                $table .= '_day';
                break;
            case 3:
                $table .= '_month';
                break;
            case 4:
                $table .= '_quarter';
                break;
            default:
                $table = '_day';
                break;
        }

        $where = 'dev_index=' . $input['dev_index'];
        if($input['start'] != null)
        {
            $where .= ' AND time_f >= "' . $input['start'] . '"';
        }
        if($input['end'] != null)
        {
            $where .= ' AND time_f <= "' . $input['end'] . '"';
        }

        $result = Db::table($table)->field('id,time_f,dev_index,temp as dev_data')
                            ->where($where)
                            ->order('time_f')
                            ->select();

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS,null,$result);
        }
    }
}

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
            return json_encode($result);
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
}

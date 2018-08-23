<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class Zone extends ControllerBase
{
    public function index()
    {
        return $this->fetch('setting/zone_manage');
    }

    public function detail_manage()
    {
        return $this->fetch('setting/detail_manage');
    }

    public function delete_zone()
    {
        $input = request()->put();
        $list = json_decode($input['list'], true);

        foreach ($list as $item)
        {
            if (null != $item["index"])
            {
                $ret = model('CZone')->delete_zone($item["index"]);
            }
        }

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function get_conf()
    {
        $input = request()->put();
        $index = $input['dev_id'];

        $ret = model('CZone')->get_zone_detail($index);

        return json_encode($ret);
    }

    public function set_conf()
    {
        $input = request()->put();
        $config = json_decode($input['config'], true);

        $data = array('zone_desc' => $config['Name'],
                      'zone_stat' => STAT_NORMAL);//默认正常
        $result = model('CZone')->set_zone($input['devID'],$data);

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS); 
        }
    }
}

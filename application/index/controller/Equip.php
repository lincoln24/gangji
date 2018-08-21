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

    public function add()
    {
        $config = input('request.config');
        $config = json_decode($config, true);

        $data = array('zone_desc' => $config['name'],
                      'zone_stat' => STAT_NORMAL);//默认正常
        $zoneId = model('Czone')->add_zone($data);

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function delete_zone()
    {
        $input = request()->put();
        $list = json_decode($input['list'], true);

        foreach ($list as $item)
        {
            if (null != $item["index"])
            {
                $ret = model('Czone')->delete_zone($item["index"]);
            }
        }

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function get_conf()
    {
        $input = request()->put();
        $index = $input['devID'];

        $ret = model('Czone')->get_zone_detail($index);

        return json_encode($ret);
    }
}

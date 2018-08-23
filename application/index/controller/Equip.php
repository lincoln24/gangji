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
}

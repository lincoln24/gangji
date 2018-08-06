<?php
namespace app\index\controller;

use app\common\controller\ControllerBase;

class Index extends ControllerBase
{
    public function index()
    {
        return $this->fetch('user/login');
    }

    public function hello($name = 'ThinkPHP5')
    {
        return 'hello,' . $name;
    }
}

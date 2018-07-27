<?php
namespace app\index\controller;

use think\Db;
use app\common\controller\ControllerBase;

class User extends ControllerBase
{
    public function index()
    {
    }

    public function user_log_in()
    {
        $input = request()->put();

        $result = Db::table('c_user')
        ->where(array(
            'user_name' => $input['user_name'],
            'user_passwd' => $input['user_passwd']))
        ->select();

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return json_encode($result[0]);
        }
    }
}

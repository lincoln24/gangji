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
       $name = input('request.name');
       $password = input('request.password');


        $result = Db::table('c_user')
        ->field('id')
        ->where(array(
            'user_name' => $name,
            'user_passwd' => $password))
        ->select();

        if($result == null)
        {       
            return $result; 
        }
        else
        {
            return json_encode($result);
        }
    }

    public function get_zone_list()
    {
        $input = request()->put();

        $result = model('Czone')->get_zone_list($input['user_id']);

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED); 
        }
        else
        {
            return json_encode($result);
        }
    }
}

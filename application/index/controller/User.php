<?php
namespace app\index\controller;

use think\Db;
use think\Controller;

class User extends Controller
{
    public function index()
    {
    }

    public function user_log_in()
    {
        $input = request()->put();
        $name = $input['user_name'];
        $password = $input['user_passwd'];

        $result = Db::table('c_user')
        ->field('id as UserId')
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
            return json_encode($result[0]);
        }
    }

    public function get_zone_list()
    {
        $input = request()->put();

        $result = model('CZone')->get_zone_list($input['user_id']);

        if($result == null)
        {
            return $result; 
        }
        else
        {
            return json_encode($result);
        }
    }
}

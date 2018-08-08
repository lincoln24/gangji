<?php
namespace app\index\controller;

use think\Db;
use think\facade\Session;
use think\Controller;

class Index extends Controller
{
    public function index()
    {
        return $this->fetch('login');
    }

    public function login()
    {
        $name = input('request.name');
        $password = input('request.password');

        $result = Db::table('c_user')
        ->field('id,priv')
        ->where(array(
            'user_name' => $name,
            'user_passwd' => $password))
        ->select();

        if($result == null)
        {       
            return $this->fetch('login'); 
        }
        else
        {
        	Session::set('login_time',time());
        	Session::set('userName',$name);
        	Session::set('userID',$result[0]['id']);
        	Session::set('userLevel',$result[0]['priv']);

	        //添加登陆记录,暂时未做
	        // add_login_record($user_id);

            header(strtolower("location:/index/info"));
            exit();
            // return 'wfefdfsdf'; 
        }
    }
}

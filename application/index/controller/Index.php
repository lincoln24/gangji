<?php
namespace app\index\controller;

use think\Db;
use think\facade\Session;
use think\Controller;

require __DIR__ . '/../../common/common.php';

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
            return 'error'; 
        }
        else
        {
        	Session::set('login_time',time());
        	Session::set('userName',$name);
        	Session::set('userID',$result[0]['id']);
        	Session::set('userLevel',$result[0]['priv']);

	        //添加登陆记录,暂时未做
	        // add_login_record($user_id);

            // header(strtolower("location:/index/info"));
            // exit();
            return 'success'; 
        }
    }
    /**
     * 用户登出后台
     */
    public function logout()
    {
        if (Session::has('userName') && ("" != Session::get('userName')))
        {
            //添加注销记录
            // D("DUserLogin")->add_logout_record($user_id);
            Session::delete('login_time');
            Session::delete('userName');
            Session::delete('userID');
            Session::delete('userLevel');
        }

        return (json_encode(array(
                "code" => get_auth_status(),
                "error" => "")));
    }
    //手机用户登陆
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
            return (json_encode(array(
                "code" => 1,
                "error" => 'user_name or password error',
                "data" => null)));
        }
        else
        {
            Session::set('login_time',time());
            Session::set('userName',$name);
            Session::set('userID',$result[0]['UserId']);
            Session::set('userLevel',1);

            return json_encode(array(
                "code" => 0,
                "error" => '',
                "data" => $result[0]));
        }
    }
}

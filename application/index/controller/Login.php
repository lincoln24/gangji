<?php
namespace app\index\controller;
use think\Db;
use think\Input;
use think\Request;
use think\Controller;

class Login extends Controller
{ 
    public function login(){
       $name = input('request.name');
       $password  = input('request.password');


        $result = Db::table('c_user')
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
       		header(strtolower("location:/index/temp"));
       		exit();
       	}
    }
}
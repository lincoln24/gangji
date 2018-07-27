<?php
namespace app\index\controller;
use think\Input;
use think\Controller;

class Login extends Controller
{ 
    public function login(){
    	return view('login');
      // return $this->fetch('login');
    }
}
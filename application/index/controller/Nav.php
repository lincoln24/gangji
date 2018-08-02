<?php
namespace Home\Controller;
use Think\Controller;

class Nav extends Controller
{
    public function index()
    {
        $this->fetch('nav');
    }
}
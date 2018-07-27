<?php
namespace app\index\controller;

use think\Controller;
use think\Db;

class Fatri extends Controller
{
    public function index()
    {
        return 'Hello,World！';
    }

    public function hello($name = 'ThinkPHP5')
    {
        return 'hello,' . $name;
    }

    public function add($a=0,$b=0)
    {
        return $a+$b;
    }

    public function addjson()
    {
        $input = request()->put();
        return $input['address']['street'];
    }

    public function getmysql()
    {
    	$result = Db::table('think_data')
			->field('id,data')
		    ->where('id', 2)
		    ->select();

		return $result[0]["data"];
    }
}

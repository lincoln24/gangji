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

    public function get_zone_list()
    {
        $input = request()->put();

        $result = Db::table('c_user')
        ->field('zone')
        ->where(array(
            'id' => $input['user_id']))
        ->select();

        $zoneList = explode(",",$result[0]["zone"]);
        // dump($zoneList);

        $sqlToDo = "select zone_id as ZoneId,zone_desc as ZoneDesc,zone_stat as ZoneStat";
        $sqlToDo .= " FROM c_zone WHERE 1=0";
        foreach ($zoneList as $key => $value) {
            $sqlToDo .= " OR zone_id=" . $value;
        }
        // dump($sqlToDo);

        $result = Db::query($sqlToDo);

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

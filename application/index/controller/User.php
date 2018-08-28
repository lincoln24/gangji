<?php
namespace app\index\controller;

use think\Db;
use think\facade\Session;
use app\common\controller\ControllerBase;

class User extends ControllerBase
{
    public function index()
    {
        return $this->fetch('setting/user_manage');
    }

    public function user_manage_detail()
    {
        return $this->fetch('setting/user_manage_detail');
    }

    public function get_user_detail()
    {
        $input = request()->put();
        $user_id = $input['user_id'];

        $result = Db::table('c_user')
        ->field('id,user_name,zone,priv,alarm_start,alarm_end,phone,email')
        ->where("id",$user_id)
        ->find();

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED,'get user fail');
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS,null,$result);
        }
    }

    public function set_user_detail()
    {
        $input = request()->put();
        $user_id = $input['user_id'];
        $config = json_decode($input['config'], true);

        $result = Db::table('c_user')
        ->field('id')
        ->where("id",$user_id)
        ->find();

        if($result == null)//id不存在
        {
            $result = Db::name('c_user')->insert($config);
        }
        else//id已存在
        {
           $result = Db::table('c_user')->where('id', $user_id)
                                    ->data($config)
                                    ->update();
        }

        if($result == null)
        {
            return $this->ajaxReturnCode(CODE_FAILED,'set user fail');
        }
        else
        {
            return $this->ajaxReturnCode(CODE_SUCCESS);
        }
    }

    public function delete_user()
    {
        $input = request()->put();
        $list = json_decode($input['list'], true);

        foreach ($list as $item)
        {
            if (null != $item["index"])
            {
                $result = Db::table('c_user')->where('id', $item["index"])->delete();
            }
        }

        return $this->ajaxReturnCode(CODE_SUCCESS);
    }

    public function get_user_list()
    {
        $input = request()->put();

        $sqlToDo = "select id,user_name,zone,priv,alarm_start,alarm_end,phone,email FROM c_user";
        $sqlToDo .= " WHERE 1=1";
        if($input['userType'] != null)
        {
            $sqlToDo .= " AND priv=" . $input['userType'];
        }
        if($input['name'] != null)
        {
            $sqlToDo .= " AND user_name=" . $input['name'];
        }

        $result = Db::query($sqlToDo);

        if($result == null)
        {
            return $this->ajaxReturnCode(1,'no user');
        }
        else
        {
            for ($i=0; $i < count($result); $i++) {
                $zonelist = model('CZone')->get_zone_list($result[$i]['id']);
                $zone = "";
                foreach ($zonelist as $key => $value) {
                    $zone .= $value["ZoneDesc"] . "/";
                }
                $result[$i]["zone"] = $zone;
            }
            return $this->ajaxReturnCode(0,null,$result);
        }
    }

    public function get_zone_list()
    {
        $user_id = Session::get('userID');
        // $result['name'] = Session::get('userName');

        // return $this->ajaxReturnCode(0,null,$result);
        if($user_id == null)//若session取不到，就从请求中获取
        {
            $input = request()->put();
            $user_id = $input['user_id'];
        }
        
        $result = model('CZone')->get_zone_list($user_id);

        if($result == null)
        {
            return $this->ajaxReturnCode(1,'no zone');
        }
        else
        {
            return $this->ajaxReturnCode(0,null,$result);
        }
    }
}

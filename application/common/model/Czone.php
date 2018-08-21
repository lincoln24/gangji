<?php
namespace app\common\model;

use think\Db;
use think\Model;

class Czone extends Model
{
    public static function get_zone_list($user_id)
    {
        $result = Db::table('c_user')
        ->field('zone')
        ->where(array(
            'id' => $user_id))
        ->select();

        $sqlToDo = "select zone_id as ZoneId,zone_desc as ZoneDesc,zone_stat as ZoneStat";

        if($result[0]["zone"] == "all")
        {
            $sqlToDo .= " FROM c_zone";//查出所有区域
        }
        else
        {
            $sqlToDo .= " FROM c_zone WHERE 1=0";
            $zoneList = explode(",",$result[0]["zone"]);  
            foreach ($zoneList as $key => $value) {
                $sqlToDo .= " OR zone_id=" . $value;
            }          
        }
        // dump($sqlToDo);

        $result = Db::query($sqlToDo);

        return $result;
    }

    public static function get_zone_detail($zone_id)
    {
        $result = Db::table('c_zone')
        ->field('zone_desc as name,zone_stat as ZoneStat')
        ->where(array(
            'zone_id' => $zone_id))
        ->select();

        return $result[0];
    }

    public static function add_zone($data)
    {
        Db::name('c_zone')
            ->data($data)
            ->insert();

        $zoneId = Db::name('c_zone')->getLastInsID();

        return $zoneId;
    }

    public static function delete_zone($zoneId)
    {
        $result = Db::table('c_zone')->where('zone_id',$zoneId)->delete();

        return $result;
    }
}

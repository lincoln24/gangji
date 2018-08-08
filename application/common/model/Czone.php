<?php
namespace app\common\model;

use think\Db;
use think\Model;

class Czone extends Model
{
    public static function get_zone($user_id)
    {
        $result = Db::table('c_user')
        ->field('zone')
        ->where(array(
            'id' => $user_id))
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

        return $result;
    }
}

<?php
namespace app\common\model;

use think\Db;
use think\Model;

class CZone extends Model
{
    public function get_zone_list($user_id)
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

    public function get_zone_detail($zone_id)
    {
        $result = $this->field('zone_desc as Name,zone_stat as ZoneStat')
                    ->where(array(
                        'zone_id' => $zone_id))
                    ->select();

        return $result[0];
    }

    public function set_zone($zone_id=0,$data)
    {
        $result = $this->field('zone_id')
                    ->where(array(
                        'zone_id' => $zone_id))
                    ->find();

        if($result == null)//id不存在
        {
            $result = $this->save($data);
        }
        else//id已存在
        {
           $result = $this->where('zone_id', $zone_id)
                        ->data($data)
                        ->update();
        }

        // $zoneId = Db::name('c_zone')->getLastInsID();

        return $result;
    }

    public function delete_zone($zoneId)
    {
        $result = $this->where('zone_id',$zoneId)->delete();

        return $result;
    }
}

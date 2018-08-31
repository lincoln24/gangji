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

        $sqlToDo = "select zone_id as ZoneId,zone_name as ZoneName,zone_desc as ZoneDesc,zone_stat as ZoneStat";

        if($result == null)
        {            
            return null;
        }

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

    public function get_zone_detail($zone_id = null)
    {
        if($zone_id != null)
        {
            $result = $this->field('zone_name as Name,zone_desc as Description,zone_stat as ZoneStat')
                    ->where(array(
                        'zone_id' => $zone_id))
                    ->select();
        }
        else
        {
            $result = $this->field('zone_name as Name,zone_desc as Description,zone_stat as ZoneStat')->select();
        }

        // dump($this->getLastSql());
        return $result;
    }

    public function get_devtype_list($zone_id = null)
    {        
        $sqlToDo = "select zone_id as ZoneId,zone_name as ZoneName,zone_stat as ZoneStat";
        $sqlToDo .= " FROM c_zone z inner join c_sensor s on select zone_id as ZoneId,zone_name as ZoneName,zone_stat as ZoneStat";
        if($zone_id != null)
        {
            $zoneList = $this->field('zone_id as ZoneId,zone_name as ZoneName,zone_stat as ZoneStat')
                    ->where(array(
                        'zone_id' => $zone_id))
                    ->select();
        }
        else
        {
            $zoneList = $this->field('zone_id as ZoneId,zone_name as ZoneName,zone_stat as ZoneStat')
                    ->select();
        }

        foreach ($zoneList as $key => $value) 
        {
            $typeList = Db::table('c_sensor')
                            ->field('sensor_type')
                            ->group('sensor_type')
                            ->where('zone_id',$value['ZoneId'])
                            ->select();

            $typeArr = array();
            foreach ($typeList as $tkey => $tvalue) {
                $typeArr[$tkey]['typeIndex'] = $tvalue['sensor_type'];
                //统计状态
                $sqlToDo = "select COUNT(1) as total,COUNT(status=1 or null) as abnormal";
                $sqlToDo .= " FROM c_sensor s inner join d_temp_data t on s.sensor_id=t.sensor_id";
                $sqlToDo .= " where s.sensor_type=" . $tvalue['sensor_type'] . " and s.zone_id=" . $value["ZoneId"];
                $statusNum = Db::query($sqlToDo);
                $typeArr[$tkey]["total"] = $statusNum[0]["total"];
                $typeArr[$tkey]["abnormal"] = $statusNum[0]["abnormal"];
                switch ($tvalue['sensor_type']) {
                    case TYPE_TEMP_SENSOR:
                        $typeArr[$tkey]['typeName'] = lang('_DEV_TEMP_SENSOR_');
                        break;
                    case TYPE_VIBRATION_SENSOR:
                        $typeArr[$tkey]['typeName'] = lang('_DEV_VIBRATION_SENSOR_');
                        break;
                }
            }
            $zoneList[$key]["devtype_list"] = $typeArr;
        }

        return $zoneList;
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

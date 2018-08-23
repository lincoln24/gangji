<?php
namespace app\common\model;

use think\Db;
use think\Model;

class CSensor extends Model
{
    // protected $table='c_sensor';

    public function get_conf($input)
    {
        $where = array();
        if (isset($input['type']))
        {
            $where['sensor_type'] = $input['type'];
        }
        if (isset($input['dev_id']))
        {
            $where['sensor_id'] = $input['dev_id'];
        }
        if (isset($input['zone_id']))
        {
            $where['zone_id'] = $input['zone_id'];
        }

        $result = $this->field(array('sensor_id' => 'SensorId',
                      'zone_id' => 'ZoneId',
                      'name' => 'Name',
                      'number' => 'Number',
                      'model_no' => 'Model',
                      'address' => 'Address',
                      'overtime' => 'Overtime',
                      'datasave_span' => 'DatasaveSpan',
                      'h_threshold' => 'Hthreshold',
                      'l_threshold' => 'Lthreshold'))
        ->where($where)
        ->select();

        return $result;
    }

    public function set_conf($config, $where)
    {
        $data = array('name' => $config['Name'],
                      'zone_id' => $config['ZoneId'],
                      'number' => $config['Number'],
                      'model_no' => $config['Model'],
                      'address' => $config['Address'],
                      'overtime' => $config['Overtime'],
                      'datasave_span' => $config['DatasaveSpan']);

        $result = $this->field('sensor_id')
                        ->where($where)
                        ->find();

        if($result == null)//id不存在
        {
            $devID = $this->get_dev_new_index($where['sensor_type']);
            $data['sensor_id'] = $devID;
            $data['sensor_type'] = $where['sensor_type'];
            $result = $this->save($data);
        }
        else//id已存在
        {
            $result = $this->where($where)
                        ->data($data)
                        ->update();
        }

        return $result;
    }

    public function get_dev_new_index($type)
    {
        $sqlToDo = "select a.sensor_id+1 as id"
            . " from c_sensor a left join c_sensor b on a.sensor_id+1=b.sensor_id and a.sensor_type=b.sensor_type"
            . " where a.sensor_type=" . $type . " and b.sensor_id is null limit 1";

        $result = Db::query($sqlToDo);

        return $result[0]["id"];
        // $i = 1;
        // for (; $i <= $max; $i++)
        // {
        //     $record = $this->field(array("dev_index"))
        //                     ->where(array(
        //                         "dev_type" => $type,
        //                         "dev_index" => $i,
        //                         "is_exists" => EXIST))
        //                     ->select();

        //     if (count($record) == 0)
        //     {
        //         break;
        //     }
        // }

       // return $i > $max ? 0 :$i;
    }
}

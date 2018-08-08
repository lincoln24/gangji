<?php
namespace app\index\controller;

use think\Db;
use think\facade\Session;
use app\common\controller\ControllerBase;

class Info extends ControllerBase
{
    public function index()
    {        
        $system = Db::table('c_sys_conf')
        ->field('name_f,contact_name,contact_phone,maintain_time')
        ->select();
        $system = $system[0];

        $sysStatus["hdd_vol"] = 20971520;
        $sysStatus["hdd_left"] = 10971520;

        $tempInfo = array(
            "total" => 10,
            "abnormal" => 2
        );
        $vibrationInfo = array(
            "total" => 8,
            "abnormal" => 3
        );

        $devLinkStatus = array(
            "temp" => $tempInfo,
            "vibration" => $vibrationInfo,
        );

        if ($fd = fopen("/proc/uptime", "rb"))
        {
            $fContent = trim(fgets($fd));
            $times = explode(" ", $fContent);
            if (null != $times[0])
            {
                $runtime = ceil($times[0]);
            }
        }

        $this->data = array(
            "system" => array(
                "name_f" => $system["name_f"],
                "contact_name" =>$system["contact_name"],
                "contact_phone" =>$system["contact_phone"],
                "run_time" =>$runtime, //单位秒
                "maintain_time" => date("Y-m-d H:i", strtotime($system["maintain_time"])),
            ),
            "storage" => array(
                "hard_disk" => array( //数据库单位GB，传给前台为MB
                    "used" => round(($sysStatus["hdd_vol"] - $sysStatus["hdd_left"]) / 1024 / 1024, 2),
                    "total" => round(($sysStatus["hdd_vol"]) / 1024 / 1024, 2),
                ),
                // "remain_store_time" => $sysStatus["store_time"], //剩余存储时间，单位月
            ),
            "deviceStatus" => $devLinkStatus,
        );
        $this->assign('data', $this->data);
        return $this->fetch('index/totalinfo');
    }

    public function get_zone_sensor_num()
    {
        $input = request()->put();
        $i = 0;

        $zoneList = model('Czone')->get_zone($input['user_id']);
        $sensorList = $zoneList;

        foreach ($zoneList as $key => $value) {
            //统计温度传感器
            $sqlToDo = "select COUNT(1) as total,COUNT(status=1 or null) as abnormal";
            $sqlToDo .= " FROM c_sensor s inner join d_temp_data t on s.sensor_id=t.sensor_id";
            $sqlToDo .= " where s.sensor_type=" . TYPE_TEMP_SENSOR . " and s.zone_id=" . $value["ZoneId"];
            $result = Db::query($sqlToDo);
            $sensorList[$key]["temp"]["total"] = $result[0]["total"];
            $sensorList[$key]["temp"]["abnormal"] = $result[0]["abnormal"];
            //统计振动传感器
            $sqlToDo = "select COUNT(1) as total,COUNT(status=1 or null) as abnormal";
            $sqlToDo .= " FROM c_sensor s inner join d_vibration_data t on s.sensor_id=t.sensor_id";
            $sqlToDo .= " where s.sensor_type=" . TYPE_VIBRATION_SENSOR . " and s.zone_id=" . $value["ZoneId"];
            $result = Db::query($sqlToDo);
            $sensorList[$key]["vibration"]["total"] = $result[0]["total"];
            $sensorList[$key]["vibration"]["abnormal"] = $result[0]["abnormal"];
        }
        // dump($sensorList);

        return json_encode($sensorList);
    }
    /**
     * 获取标题栏的信息，包括时间、告警状态和用户信息
     */
    public function get_status_bar_info()
    {
        $alarm = model('DEventLog')->get_alarm_num(EVENT_HAPPEN);

        $sysConf = model("CSysConf")->get_common_conf();
        $sysName = $sysConf["name_f"];

        $data = array(
            "system_name" => $sysName,
            "time" => date('Y-m-d H:i:s',time()),
            "userType" => Session::get('userLevel'),
            "userName" => Session::get("userName"),
            "alarm" => $alarm,
        );

        return json_encode($data);
    }
}

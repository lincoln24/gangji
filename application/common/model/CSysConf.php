<?php
namespace app\common\model;

use think\Db;
use think\Model;

class CSysConf extends Model
{
    public static function get_common_conf()
    {
        $system = Db::table('c_sys_conf')
        ->field('name_f,contact_name,contact_phone,lang_web')
        ->where("id=1")
        ->select();

        return $system[0];
    }

    public static function set_common_conf($conf)
    {
        $result = Db::name('c_sys_conf')
        ->where('id', 1)
        ->update([
            'name_f' => $conf["name_f"],
            'contact_name' => $conf["contact_name"],
            'contact_phone' => $conf["contact_phone"],
        ]);

        return $result;
    }

    public function get_expire_conf()
    {
        $data = Db::table('c_sys_conf')
        ->field('login_expire')
        ->where("id=1")
        ->select();

        return $data[0];
    }

    public function set_expire_conf($loginExpire)
    {
        $result = Db::name('c_sys_conf')
        ->where('id', 1)
        ->update([
            'login_expire' => $loginExpire,
        ]);

        return $result;
    }
}

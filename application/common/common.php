<?php

use think\facade\Session;

/* 错误码 */
define("CODE_FAILED", 1);
define("CODE_SUCCESS", 0);

/* 设备类型 */
define("TYPE_TEMP_SENSOR", 1);
define("TYPE_VIBRATION_SENSOR", 2);

/* 事件状态 */
define("EVENT_HAPPEN", 0);//事件发生
define("EVENT_CONFIRM", 1);//事件确认
define("EVENT_CANCEL", 2);//事件恢复
define("EVENT_USELESS", 3);//无效事件

define("STAT_NORMAL", 0);//正常
define("STAT_ABNORMAL", 1);//异常

define("LOGIN_EXPIRE", 20 * 60); //登陆超时时间，单位秒

define("VAL_NA", -9999);       // 数值中用来表示N/A的值
define("MAX_DATA_VALUE", 2147483647);    //判断NA的比较值
/**
 * 获取登陆超时时间，单位是秒
 * @return int  超时时间，单位是秒
 */
function get_login_expire()
{
    $data = Db::table('c_sys_conf')
    ->field('login_expire')
    ->limit(1)
    ->select();

    $expire = $data[0]["login_expire"];

    if (is_na($expire) || $expire < 0)
    {
        $expire = LOGIN_EXPIRE;
    }
    else if (0==$expire)
    {
        //永不超时，按100年算
        $expire = 3153600000;
    }
    else
    {
        //配置表里面存的是分钟, 转换成秒返回
        $expire = $expire * 60;
    }

    if (Session::get('login_expire') != $expire)
    {
        // TRACE_DEBUG("====login expire CHANGED from [" . $_SESSION["login_expire"] . "] to [$expire]");
        Session::set('login_expire',$expire);
    }

    return $expire;
}

/**
 * 获取当前用户登录状态
 * @return int 0:已登录 -1:未登录
 */
function get_auth_status()
{
    if (!Session::has("userName")
        || !Session::has("login_time")
        || time() - Session::get("login_time") > get_login_expire())
    {
        return -1;
    }

    return 0;
}

function is_na($value)
{
    if ($value == VAL_NA
        || null === $value
        || $value >= MAX_DATA_VALUE)
    {
        return true;
    }

    return false;
}
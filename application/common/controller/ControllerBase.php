<?php
namespace app\common\controller;

use think\facade\Session;
use think\Controller;

require __DIR__ . '/../common.php';

class ControllerBase extends Controller
{
    protected function initialize()
    {
        // http_access_ctrl();

        $restartTimer = true;
        // $uri = strtolower($_SERVER["REQUEST_URI"]);

        if (get_auth_status() != 0)
        {
            //TRACE_DEBUG("auth invalid in Home [" . $_SESSION["login_time"] . "] [" . time() ."]");
            Session::delete('userName');
            Session::delete('userID');
            Session::delete('userLevel');

            Session::set('login_time',time());
            
            header(strtolower("location:/index/index"));

            exit();
        }

        // if ($restartTimer)
        // {
        //     $list = C('LOGIN_TIMER_IGNORE_LIST');
        //     foreach($list as $item)
        //     {
        //         if (strpos($uri, strtolower($item)))
        //         {
        //             $restartTimer = false;
        //             break;
        //         }
        //     }
        // }

        if ($restartTimer)
        {
            Session::set('login_time',time());
            //TRACE_DEBUG("[restart] request [$uri] [$time]");
        }
    }
	 /**
	 * @param int $code 以JSON格式返回错误代码 (CODE_FAILED|CODE_SUCCESS|...)
	 */
    protected function ajaxReturnCode($code, $error="", $contentType='')
    {
        return (json_encode(array(
                "code" => $code,
                "error" => $error)));
    }
}

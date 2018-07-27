<?php
namespace app\common\controller;

use think\Controller;

require dirname(__FILE__) . "/../common.php";

class ControllerBase extends Controller
{
    public function index()
    {
        return 'Hello,World！';
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

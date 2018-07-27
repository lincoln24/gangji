<?php

return [
    'url_route_on'   => true,
   
    'URL_MODEL'=>2,
    // 'log'          => [
    //     'type' => 'trace',
    // ],
    'show_error_msg' => true,

    //本项目的配置
    "web_res_root"   => "/public/static/",
    "web_root"       => "/public/index.php/",
    'session' => [
        'auto_start' => true,
        'name' => 'login@',
        'expire' => 1800,                        /*时间长度*/
    ],

];

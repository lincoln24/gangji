
jQuery(document).ready(function() {
    $('.username').focus()

    $('#login_submit').click(function(){
        var username = $('.username').val();
        var password = $('.password').val();
        // if(username == '') {
        //     $('.error').fadeOut('fast', function(){
        //         $(this).css('top', '27px');
        //     });
        //     $('.error').fadeIn('fast', function(){
        //         $('.username').focus();
        //     });
        //     return false;
        // }
        // if(password == '') {
        //     $('.error').fadeOut('fast', function(){
        //         $(this).css('top', '96px');
        //     });
        //     $('.error').fadeIn('fast', function(){
        //         $('.password').focus();
        //     });
        //     return false;
        // }
        $.ajax({
            type: "POST",
            data: {"name": username,
                   "password": password},
            url: "/index/index/login",
            success: function (returnData) {
                if(returnData == 'success'){
                    window.location.href="/index/info";
                }else{
                    $('#error_msg').fadeIn('fast');
                }
            }
        });
    });

    $('.page-container form .username, .page-container form .password').keyup(function(){
        $(this).parent().find('.error').fadeOut('fast');
    });

});

function login_submit()
{
}
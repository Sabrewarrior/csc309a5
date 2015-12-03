$(document).ready(function () {
    $("#send").click(function () {
        var from = $('#email1').html();
        var to = $('#email2').html();
        var text = $('#body').val();
        var data = { from:from, to:to, text:text };
        $.ajax({
            url: '/' + from + '/message/'+ to,
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + from + '/message/' + to;
                }
            },
            error: function (data, status) {

            }
        });
    });
})
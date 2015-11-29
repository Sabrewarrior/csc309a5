$(document).ready(function () {
    //click on update profile
    $("#comment").click(function () {
        var id = $('#id').val();
        var rate = $('#rate').val();
        var body = $('#body').val();
        var email = $('#email').val();
        var data = { body: body, rate: rate, email:email };
        $.ajax({
            url: '/book/' + id,
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/book/' + id;
                }
            },
            error: function (data, status) {

            }
        });
    });
})
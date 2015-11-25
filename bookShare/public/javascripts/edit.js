$(document).ready(function () {
    var email = $('#email').html();
    var user = $('#user').html();

    //click on delete button
    $("#delete").click(function () {
        $.ajax({
            url: '/' + email + '/delete',
            type: 'post',
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + user + '/home';
                }
            },
            error: function (data, status) {

            }
        });
    });

    //click on assign admin
    $("#admin").click(function () {
        $.ajax({
            url: '/' + email + '/admin',
            type: 'post',
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + email + '/profile';
                }
            },
            error: function (data, status) {

            }
        });
    });

    //click on unassign admin
    $("#unadmin").click(function () {
        $.ajax({
            url: '/' + email + '/unadmin',
            type: 'post',
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + email + '/profile';
                }
            },
            error: function (data, status) {

            }
        });
    });

    //click on update profile
    $("#update").click(function () {
        var display_name = $('#display_name').val();
        var description = $('#description').val();
        var data = { display_name: display_name, description: description };
        $.ajax({
            url: '/' + email + '/profile',
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + email + '/profile';
                }
            },
            error: function (data, status) {

            }
        });
    });

    //click on change password
    $("#changePwd").click(function () {
        var current = $('#current').val();
        var newPwd = $('#new').val();
        var confirm = $('#confirm').val();
        if (newPwd != confirm) {
            alert('Password does not match');
        } else {
            var data = { current_password: current, new_password: newPwd };
            $.ajax({
                url: '/' + email + '/password',
                type: 'post',
                data: data,
                //if success, get profile page
                success: function (data, status) {
                    if (status == 'success') {
                        location.href = '/' + email + '/profile';
                    }
                },
                error: function (data, status) {
                    alert('Wrong current password');
                }
            });
        }
    });


});
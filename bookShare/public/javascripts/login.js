$(document).ready(function () {
    var loc;
    //get user location 
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loc = "Latitude: " + position.coords.latitude + "   "
            "Longitude: " + position.coords.longitude;
        });
    }

    //click on sign up button
    $("#register0").click(function () {
        location.href = 'register';
    });
    //click on login button
    $("#login0").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var data = { "uname": username, "upwd": password, "location": loc };
        $.ajax({
            url: '/login',
            type: 'post',
            data: data,
            //if success, get user home page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + username + '/home';
                }
            },
            error: function (data, status) {
                if (status == 'error') {
                    alert('Wrong password');
                    location.href = 'login';
                }
            }
        });
    });
});


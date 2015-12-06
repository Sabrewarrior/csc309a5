$(document).ready(function () {
    var loc;
    //get user lcoation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            loc = "Latitude: " + position.coords.latitude + "   "+
            "Longitude: " + position.coords.longitude;
        });
    }
    //click on sign up button
    $("#register1").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
        var password1 = $("#password1").val();
        var catalogvalue = [];
          $(':checkbox:checked').each(function(i){
            catalogvalue[i] = $(this).val();
          });
        if (password !== password1) {
            alert("passwords do not match");
        } else {
            var data = { "uname": username, "upwd": password, "location": loc , "catalog": catalogvalue};
            $.ajax({
                url: '/register',
                type: 'post',
                traditional: true,
                data: data,
                //if success, get user home page
                success: function (data, status) {
                    if (status == 'success') {
                        location.href = '/' + username + '/home';
                    }
                },
                error: function (data, err) {
                    alert('user exists');
                    location.href = 'register';
                }
            });
        }
    });

    //click on log in button
    $("#login").click(function () {
      location.href = "login";
    })
});

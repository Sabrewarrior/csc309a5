$(document).ready(function () {
    var email = $('#email').html();
    var user = $('#user').html();

    
    //click on update profile
    $("#share").click(function () {
        var title = $('#title').val();
        var author = $('#author').val();
        var description = $('#description').val();
        var data = { title: title, author: author, description:description };
        $.ajax({
            url: '/' + email + '/share',
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/' + email + '/home';
                }
            },
            error: function (data, status) {

            }
        });
    });

    
    


});
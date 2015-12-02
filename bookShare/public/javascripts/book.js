$(document).ready(function () {

    $("#comment").click(function () {
        var bookId = $('#bookId').html();
        var rate = $('#rate').val();
        var body = $('#body').val();
        var email = $('#email').html();
        var data = { body: body, rate: rate, email:email };
        $.ajax({
            url: '/book/' + bookId,
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/book/' + bookId;
                }
            },
            error: function (data, status) {

            }
        });
    });

    $("#borrow").click(function () {
        var bookId = $('#bookId').html();
        var email = $('#email').html();
        var data = {email: email };
        $.ajax({
            url: '/book/'+bookId+'/borrow',
            type: 'post',
            data: data,
            //if success, get profile page
            success: function (data, status) {
                if (status == 'success') {
                    location.href = '/'+email+'/library';
                }
            },
            error: function (data, status) {
              alert("You can't borrow your own book!");
              location.reload();
            }
        });
    });
})
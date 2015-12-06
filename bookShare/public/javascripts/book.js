$(document).ready(function () {
  $("#rated").click(function(){
    $("#t_rated").show();
    $("#t_ratea").hide();
    $("#t_timed").hide();
    $("#t_timea").hide();
  });
  $("#ratea").click(function(){
    $("#t_ratea").show();
    $("#t_rated").hide();
    $("#t_timed").hide();
    $("#t_timea").hide();
  });
  $("#timed").click(function(){
    $("#t_timed").show();
    $("#t_ratea").hide();
    $("#t_rated").hide();
    $("#t_timea").hide();
  });
  $("#timea").click(function(){
    $("#t_timea").show();
    $("#t_ratea").hide();
    $("#t_timed").hide();
    $("#t_rated").hide();
  });
  $("#comment").click(function () {
    var bookId = $('#bookId').html();
    var rate = $('#rate').val();
    var body = $('#body').val();
    var email = $('#email').html();
    var date = new Date();
    var data = { body: body, rate: rate, email: email, date: date };
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
});

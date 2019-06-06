$(document).ready(function(){

    $("#spinner").hide();
    $("#ok").hide();
    $('#ajax-btn').click(function() {

        $("#error").removeAttr("style");
        $("#temp").removeAttr("style");
        $("#city").removeAttr("style");

        let cityName = $('#input-city').val();
        $.ajax({
            url: '/api/get-weather',
            type: 'post',
            contentType: "application/json",
            // dataType: "json",
            data: JSON.stringify({
                city: cityName
            }),
            beforeSend: function() {
                $("#spinner").show();
            },
            success: function(response){
                $("#spinner").hide();
                if(response.message)
                {
                    
                    $("#error").text(response.message);
                    $("#temp").text("");
                    $("#city").text("");
                }
                else
                {
                
                    $("#error").text("");
                    $("#temp").text(response.temp);
                    $("#city").text(response.city);
                }
            },
            error: function(xhr){
                $("#spinner").hide();
            }
        });
    });

    $('#input-city').focus(function() {
        $("#error").fadeOut( 1000 );
        $("#temp").fadeOut( 1000 );
        $("#city").fadeOut( 1000 );
      });

    $('#password, #confirm-password').on('keyup', function () {
        if ($('#password').val() == $('#confirm-password').val() && $('#password').val() != '') {
            $("#ok").show();
        } else 
            $("#ok").hide();
    });

    $('#register-form').submit(function(e){
        if($('#password').val() != $('#confirm-password').val())
        {
            e.preventDefault();
            alert('invalid cofirm password'); 
        }       
    });
});
$(document).ready(function() {

    $(".loader").hide();
    $.post("/getaccount", function(data) {
        data.forEach(function(element) {
            $('.select-account').append($('<option>', {
                value: 1,
                text: element
            }));
        }, this);
    });
    $("#btn1").click(function() {
        if ($("#accounts option:selected").text() == "") {
            alert("There is no account selected !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/getresult", {
                account: $("#accounts option:selected").text()
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
                data.forEach((element)=>{
                    switch(element.args.inf){
                    case "confirm success":
                        $("#result").append('於 '+new Date(element.args.timestamp*1000).toDateString() + '  合約確認' + '</br>');
                        break;
                    case "revoke the contract":
                        $("#result").append('於 '+new Date(element.args.timestamp*1000).toDateString() + '  撤銷合約' + '</br>');
                    }
                })
            });
        }
    });

});
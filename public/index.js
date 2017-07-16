$(document).ready(function () {

    $(".loader").hide();
    $('#checkid').click(function () {
        $('.select-contracts').empty();
        //找合約
        $.post("/contracts",{
            id: $('#id').val()
        }, function (data) {
            data.forEach(function (element) {
                $('.select-contracts').append($('<option>', {
                    value: 1,
                    text: element.address
                }));
            }, this);
        });
    });

    $("#submit").click(function () {
        if ($("#contracts option:selected").text() == "") {
            alert("There is no contracts selected !");
        }
        else {
            $("#result").empty();
            $(".loader").show();
            $('button').prop('disabled', true);
            //找交易紀錄
            $.post("/getresult", {
                contracts: $("#contracts option:selected").text()
            }, function (data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
                data.forEach((element) => {
                    switch (element.args.inf) {
                        case "confirm success":
                            $("#result").append('於 ' + new Date(element.args.timestamp * 1000).toDateString() + '  合約確認' + '</br>');
                            break;
                        case "revoke the contract":
                            $("#result").append('於 ' + new Date(element.args.timestamp * 1000).toDateString() + '  撤銷合約' + '</br>');
                            break;
                        case "pay annuity":
                            $("#result").append('於 ' + new Date(element.args.timestamp * 1000).toDateString() + '  給付年金' + '</br>');
                            break;
                    }
                })
            });
        }
    });

});
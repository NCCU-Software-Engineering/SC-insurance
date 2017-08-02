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
                        case "success buy":
                            $("#result").append('於 '+ element.args.timestamp[0]+'年'+element.args.timestamp[1]+'月'+element.args.timestamp[2]+'日' +'  購買合約' + '</br><p>from:'+element.args.from+'<br>to:'+element.address+'<br>value:'+element.args.value+'</p>');
                            break;
                        case "success confirm":
                            $("#result").append('於 '+ element.args.timestamp[0]+'年'+element.args.timestamp[1]+'月'+element.args.timestamp[2]+'日' +'  合約確認' + '</br>');
                            break;
                        case "revoke the contract":
                            $("#result").append('於 '+ element.args.timestamp[0]+'年'+element.args.timestamp[1]+'月'+element.args.timestamp[2]+'日' +'  撤銷合約' + '</br>');
                            break;
                        case "pay annuity":
                            $("#result").append('於 '+ element.args.timestamp[0]+'年'+element.args.timestamp[1]+'月'+element.args.timestamp[2]+'日' +'  給付年金' + '</br><p>from:'+element.args.from+'<br>to:'+element.args.to+'<br>value:'+element.args.value+'</p>');
                            break;
                    }
                })
            });
        }
    });

});
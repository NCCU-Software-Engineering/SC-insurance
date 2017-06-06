$(document).ready(function() {

    $(".loader").hide();
    $('.trans').prop('disabled', true);
    $.post("/getaccount", function(data) {
        data.forEach(function(element) {
            $('.select-account').append($('<option>', {
                value: 1,
                text: element
            }));
        }, this);
    });
    $("#accounts1").change(() => {
        $('.trans').prop('disabled', true);
    });
    $("#compile").click(function() {
        $(".loader").show();
        $('button').prop('disabled', true);
        $.post("/compile", function(data) {
            $('button').prop('disabled', false);
            $('.trans').prop('disabled', true);
            $(".loader").hide();
        });
    });

    $("#deploy").click(function() {
        if ($("#accounts1 option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/deploy", {
                account: $("#accounts1 option:selected").text()
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });

    $("#trans1").click(function() {
        if ($("#accounts1 option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/trans", {
                account: $("#accounts1 option:selected").text(),
                time: 1
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });

    $("#trans2").click(function() {
        if ($("#accounts1 option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/trans", {
                account: $("#accounts1 option:selected").text(),
                time: 2
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });

    $("#accounts2").change(() => {
        $('#transhash').empty();
        if ($("#accounts2 option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/gettrans", {
                account: $("#accounts2 option:selected").text()
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
                for (x in data) {
                    $('#transhash').append($('<option>', {
                        value: 1,
                        text: data[x]
                    }));
                }
            });
        }

    });

    $("#btn1").click(function() {
        if ($("#transhash option:selected").text() == "") {
            alert("There is no hash code !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/getresult", {
                hash: $("#transhash option:selected").text()
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
                if (data.contractAddress != null) {
                    $("#result").html("Deploy a contract at " + data.contractAddress);
                }
                else {
                    $("#result").html("Contract Address : " + data.logs[0].address);
                }
            });
        }
    });

});
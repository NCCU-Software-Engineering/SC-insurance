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
    $("#accounts").change(() => {
        $('.trans').prop('disabled', true);
    });
    $("#transfer").click(function(){
        $.post('/transfer',{
            from: $("#accounts option:selected").text(),
            to: $("#target option:selected").text()
        })
    })
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
        if ($("#accounts option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/deploy", {
                account: $("#accounts option:selected").text()
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });

    $("#trans1").click(function() {
        if ($("#accounts option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/trans", {
                account: $("#accounts option:selected").text(),
                time: 1
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });

    $("#trans2").click(function() {
        if ($("#accounts option:selected").text() == "") {
            alert("Select one account !");
        }
        else {
            $(".loader").show();
            $('button').prop('disabled', true);
            $.post("/trans", {
                account: $("#accounts option:selected").text(),
                time: 2
            }, function(data) {
                $(".loader").hide();
                $('button').prop('disabled', false);
            });
        }
    });
});
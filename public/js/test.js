var adrress;

function update(data, status) {
    console.log(data);
    console.log(status);

    $("#status_body").html(
        "CompanyAddress : " + data.companyAddress + "<br>" +
        "InsurerAddress : " + data.insurerAddress + "<br>" +
        "Status : " + data.status + "<br>" +
        "合約時間 : " + data.nowTime + "<br>" +
        "契撤期限 : " + data.revocationPeriod + "<br>" +
        "年金給付 : " + data.payTime
    );

    $("#a").append(data.a);
    $("#b").append(data.b);

    $("#status").removeClass();
    switch (data.status) {
        case "unconfirmed":
            $("#status").addClass("panel panel-warning");
            $("#status_heading").html("合約狀態：合約未被確認");
            break;
        case "canBeRevoked":
            $("#status").addClass("panel panel-info");
            $("#status_heading").html("合約狀態：合約撤銷期內");
            break;
        case "confirmed":
            $("#status").addClass("panel panel-primary");
            $("#status_heading").html("合約狀態：合約確認 正式生效");
            break;
        case "end":
            $("#status").addClass("panel panel-success");
            $("#status_heading").html("合約狀態：合約給付結束");
            break;
        case "Revocation":
            $("#status").addClass("panel panel-danger");
            $("#status_heading").html("合約狀態：合約已被撤銷");
            break;
        default:
            $("#status").addClass("panel panel-default");
            $("#status_heading").html("合約狀態：未知狀態???");

    }
}

function reset() {

    $("#event_button").show();
    $("#status").removeClass();
    $("#status").addClass("panel panel-default");
    $("#status_heading").html("合約狀態");
    $("#status_body").html("");
    $("#a").html("");
    $("#b").html("");
}

$(document).ready(function () {

    $("#radio_group :radio").change(function () {

        reset();
        adrress = $(this).val();

        $.post("/button", {
            "type": "update",
            address: adrress
        }, update);
    });

});

$("#set_date").click(function () {
    console.log($("#ymd").attr('value'));
    var d = new Date($("#ymd").attr('value'));
    console.log(d.getFullYear());
    console.log(d.getMonth());
    console.log(d.getDate());
});

$("#next_day").click(function () {
    $.post("/button", {
        "type": "next_day",
        address: adrress,
    }, update);
});

$("#next_month").click(function () {
    $.post("/button", {
        type: "next_month",
        address: adrress
    }, update);
});

$("#next_year").click(function () {
    $.post("/button", {
        type: "next_year",
        address: adrress
    }, update);
});

$("#confirm").click(function () {
    $.post("/button", {
        type: "confirm",
        address: adrress
    }, update);
});

$("#revoke").click(function () {
    $.post("/button", {
        type: "revoke",
        address: adrress
    }, update);
});

$("#success").click(function () {
    $.post("/button", {
        type: "success",
        address: adrress
    }, update);
});

$("#failure").click(function () {
    $.post("/button", {
        type: "failure",
        address: adrress
    }, update);
});
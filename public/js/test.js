var adrress;
var email = false;
var letter = false;

$(document).ready(function () {

    $("#radio_group :radio").change(function () {
        reset();
        adrress = $(this).val();

        $.post("/button", {
            "type": "update",
            address: adrress
        }, update);
    });

    $("#email, #letter").change(function () {
        email = document.getElementById("email").checked;
        letter = document.getElementById("letter").checked;
        console.log(email, letter);
    });

});

function update(data, status) {
    console.log(data);

    $("#state_body").html(
        "companyAddress : " + data.companyAddress + "<br>" +
        "insurerAddress : " + data.insurerAddress + "<br>" +
        "state : " + data.state + "<br>" +
        "保費 : " + data.payment + "萬元<br>" +
        "保證期間 : " + data.guaranteePeriod + "年<br>" +
        "給付間格 : " + data.timeInterval + "年<br>" +
        "受益人 : " + data.beneficiarie + "<br>" +
        "死亡受益人 : " + data.deathBeneficiary + "<br>" +
        "部屬時間 : " + data.deployTime.toString().replace(/,/g, '-') + "<br>" +
        "合約時間 : " + data.nowTime.toString().replace(/,/g, '-') + "<br>" +
        "契撤期限 : " + data.revocationPeriod.toString().replace(/,/g, '-') + "<br>" +
        "年金給付 : " + data.paymentDate.toString().replace(/,/g, '-')
    );

    $("#a").append(data.a);
    $("#b").append(data.b);

    $("#state").removeClass();
    switch (data.state) {
        case '0':
            $("#state").addClass("panel panel-warning");
            $("#state_heading").html("合約狀態：等待付款");
            break;
        case '1':
            $("#state").addClass("panel panel-warning");
            $("#state_heading").html("合約狀態：合約未被確認");
            break;
        case '2':
            $("#state").addClass("panel panel-info");
            $("#state_heading").html("合約狀態：合約撤銷期內");
            break;
        case '3':
            $("#state").addClass("panel panel-primary");
            $("#state_heading").html("合約狀態：合約確認 正式生效");
            break;
        case '4':
            $("#state").addClass("panel panel-success");
            $("#state_heading").html("合約狀態：合約給付結束");
            break;
        case '5':
            $("#state").addClass("panel panel-danger");
            $("#state_heading").html("合約狀態：合約已被撤銷");
            break;
        case '6':
            $("#state").addClass("panel panel-danger");
            $("#state_heading").html("合約狀態：合約已被撤銷");
            break;
        default:
            $("#state").addClass("panel panel-default");
            $("#state_heading").html("合約狀態：未知狀態???");

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

$("button").click(function () {
    console.log();
    $.post("/button", {
        type: $(this).attr('id'),
        email: email,
        letter: letter,
        address: adrress,
    }, update);
});
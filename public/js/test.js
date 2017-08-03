var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var adrress;
var email = false;
var letter = false;
var testContract;

$(document).ready(function () {

    $("#radio_group :radio").change(function () {
        reset();
        testContract = web3.eth.contract(data.interface).at($(this).val());
        update()
    });

    $("#email, #letter").change(function () {
        email = document.getElementById("email").checked;
        letter = document.getElementById("letter").checked;
        console.log('email :　' + email);
        console.log('letter : ' + letter);
    });

    $('button').click(function () {
        console.log('button');

        let myDate = new Date();
        let contractTime = testContract.getNowTime();

        myDate.setFullYear(contractTime[0]);
        myDate.setMonth(contractTime[1] - 1);
        myDate.setDate(contractTime[2]);

        switch ($(this).attr('id')) {

            case "next_day":
                console.log("next_day");
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 1, {
                    from: web3.eth.coinbase,
                    gas: 4444444
                });
                break;
            case "next_month":
                console.log("next_month");
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 2, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                });
                break;
            case "next_year":
                console.log("next_year");
                testContract.time(myDate.getFullYear() + 1, myDate.getMonth() + 1, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                });
                break;

            case "confirm":
                console.log("confirm");
                testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate() + 11, {
                    from: web3.eth.coinbase,
                    gas: 4444444
                });
                break;

            case "revoke":
                console.log("revoke");
                testContract.revoke({
                    from: web3.eth.coinbase,
                    gas: 4444444
                });
                break;

            case "update":
                console.log("update");
                break;

            default:
                console.error("not fond");
        }
        update();
    });
});

function update() {

    let companyAddress = testContract.getCompanyAddress();
    let insurerAddress = testContract.getInsurerAddress();
    let state = testContract.getState();
    let payment_TWD = testContract.getPayment_TWD();
    let payment_wei = testContract.getPayment_wei();
    let guaranteePeriod = testContract.getGuaranteePeriod();
    let timeInterval = testContract.getTimeInterval();
    let beneficiarie = testContract.getBeneficiarie();
    let deathBeneficiary = testContract.getDeathBeneficiary();

    let deployTime = testContract.getDeployTime();
    let nowTime = testContract.getNowTime();
    let revocationPeriod = testContract.getRevocationPeriod();
    let paymentDate = testContract.getPaymentDate();

    setState(state.toString());

    $("#state_body").html(
        "companyAddress : " + companyAddress + "<br>" +
        "insurerAddress : " + insurerAddress + "<br>" +
        "state : " + state + "<br>" +
        "保費(新台幣) : " + payment_TWD + "元<br>" +
        "保費(以太幣) : " + payment_wei + "wei<br>" +
        "保證期間 : " + guaranteePeriod + "年<br>" +
        "給付間格 : " + timeInterval + "年<br>" +
        "受益人 : " + beneficiarie + "<br>" +
        "死亡受益人 : " + deathBeneficiary + "<br>" +
        "部屬時間 : " + slash(deployTime) + "<br>" +
        "合約時間 : " + slash(nowTime) + "<br>" +
        "契撤期限 : " + slash(revocationPeriod) + "<br>" +
        "年金給付 : " + slash(paymentDate)
    );

    let events = testContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
    events.get(function (error, logs) {
        console.log(logs);
        $("#event_body").html('');
        logs.forEach((element) => {
            $("#event_body").append('from : ' + element.args.from + '<br>');
            $("#event_body").append('inf : ' + element.args.inf + '<br>');
            $("#event_body").append('timestamp : ' + slash(element.args.timestamp) + '<br><hr>');
        })
    });
}

function setState(state) {
    $("#state").removeClass();
    switch (state) {
        case '0':
            $("#state").addClass("panel panel-default ");
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

function slash(date) {
    return date.toString().replace(/,/g, '/');
}
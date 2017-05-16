var fs = require('fs');
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var eth = web3.eth;

var source = fs.readFileSync(path.resolve(__dirname,'..','sol','contract.sol'))
var compiled = eth.compile.solidity(source.toString());
var bytecode = compiled.code;
var abi = compiled.info.abiDefinition;

var abiArray = [{"constant":true,"inputs":[],"name":"getVersion","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPayTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCompanyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getStatus","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"confirme","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"endAnnuity","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNowTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeployTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getInsurerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"revoke","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getRevocationPeriod","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"time","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"y","type":"uint256"},{"name":"m","type":"uint256"},{"name":"d","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"confirmeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"revokeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"payEvent","type":"event"}];

var contract;

function getCompanyAddress() {
    return contract.getCompanyAddress();
}

function getInsurerAddress() {
    return contract.getInsurerAddress();
}

function getStatus() {
    return contract.getStatus();
}

function getNowTime() {
    return contract.getNowTime();
}

function getRevocationPeriod() {
    return contract.getRevocationPeriod();
}

function getPayTime() {
    return contract.getPayTime();
}

function time(year, month, day) {
    contract.time(year, month, day, {
        from: eth.coinbase,
        gas: 3000000
    });
}

function confirme(year, month, day) {
    contract.confirme(year, month, day, {
        from: eth.coinbase,
        gas: 3000000
    });
}

function revoke() {
    contract.revoke({
        from: eth.coinbase,
        gas: 3000000
    });
}

//----------------------------------------------------------------------------------
var myDate = new Date();;

$(document).ready(function () {
    $("#radio_group :radio").change(function () {

        contract = web3.eth.contract(abiArray).at($(this).val());

        myDate.setFullYear(getNowTime()[0]);
        myDate.setMonth(getNowTime()[1] - 1);
        myDate.setDate(getNowTime()[2]);

        update();

        var confirmeEvent = contract.confirmeEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        });

        var revokeEvent = contract.revokeEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        });

        var payEvent = contract.payEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        });

        confirmeEvent.watch(function (error, result) {
            if (!error) {
                console.log(result);
                update();
            }
        });

        revokeEvent.watch(function (error, result) {
            if (!error) {
                console.log(result);
                update();
            }
        });

        payEvent.watch(function (error, result) {
            if (!error) {
                console.log(result);
                update();
            }
        });
    
    });
});

function update() {

    console.log("update");

    $("#status_body").html(
        "CompanyAddress : " + getCompanyAddress() + "<br>" +
        "InsurerAddress : " + getInsurerAddress() + "<br>" +
        "Status : " + getStatus() + "<br>" +
        "合約時間 : " + getNowTime() + "<br>" +
        "契撤期限 : " + getRevocationPeriod() + "<br>" +
        "年金給付 : " + getPayTime()
    );
    $("#status").removeClass();
    switch (getStatus()) {
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

$("#set_date").click(function () {
    console.log($("#ymd").attr('value'));
    var d = new Date($("#ymd").attr('value'));
    console.log(d.getFullYear());
    console.log(d.getMonth());
    console.log(d.getDate());
});

$("#update").click(function () {
    update();
});

$("#next_day").click(function () {
    myDate.setDate(myDate.getDate() + 1);
    time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate());
    update();
});
$("#next_month").click(function () {
    myDate.setMonth(myDate.getMonth() + 1);
    time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate());
    update();
});
$("#next_year").click(function () {
    myDate.setFullYear(myDate.getFullYear() + 1);
    time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate());
    update();
});

$("#confirme").click(function () {
    var tempDate = new Date(myDate);
    tempDate.setDate(tempDate.getDate() + 11);
    confirme(tempDate.getFullYear(), tempDate.getMonth() + 1, tempDate.getDate());
    update();
});

$("#revoke").click(function () {
    revoke();
    update();
});
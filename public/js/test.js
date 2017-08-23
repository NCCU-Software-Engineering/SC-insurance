let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let adrress
let email = false
let letter = false
let testContract
let myDate1 = new MyDate('#myDate1', '現在時間', 2017, 8, 17)
let myDate2 = new MyDate('#myDate2', '', 0, 0, 0)

let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xA4716ae2279E6e18cF830Da2A72E60FB9d9B51C6'

$(document).ready(function () {

    $('#money_company').text(web3.fromWei(web3.eth.getBalance(company)).toFixed(3))
    $('#money_your').text(web3.fromWei(web3.eth.getBalance(nidhogg5)).toFixed(3))

    //選擇合約
    $("#radio_group :radio").change(function () {
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
        let myDate = new Date();
        let contractTime = testContract.getNowTime();

        myDate.setFullYear(contractTime[0]);
        myDate.setMonth(contractTime[1] - 1);
        myDate.setDate(contractTime[2]);

        switch ($(this).attr('id')) {

            case "next_day":
                //console.log("next_day");
                myDate.setDate(myDate.getDate() + 1)
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break
            case "next_month":
                //console.log("next_month");
                myDate.setMonth(myDate.getMonth() + 1)
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break
            case "next_year":
                //console.log("next_year");
                myDate.setFullYear(myDate.getFullYear() + 1)
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break

            case "confirm":
                //console.log("confirm");
                myDate.setDate(myDate.getDate() + 11)
                testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break

            case "revoke":
                //console.log("revoke");
                testContract.revoke({
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break

            case "dead":
                //console.log("dead");
                testContract.endAnnuity({
                    from: web3.eth.coinbase,
                    gas: 4444444
                })
                break

            case "update":
                //console.log("update");
                break;

            default:
                console.error("not fond")
        }
        update();
    });
});

function update() {

    $('#money_company').text(web3.fromWei(web3.eth.getBalance(company)).toFixed(3))
    $('#money_your').text(web3.fromWei(web3.eth.getBalance(nidhogg5)).toFixed(3))

    setState(testContract.getState().toString())
    myDate1.setText('目前合約日期')
    myDate1.satDate(testContract.getNowTime())

    $("#companyAddress").text(testContract.getCompanyAddress())
    $("#insurerAddress").text(testContract.getInsurerAddress())
    $("#payment_TWD").text(testContract.getPayment_TWD() + ' 元')
    $("#payment_wei").text(testContract.getPayment_wei() + ' wei')
    $("#payTime").text(testContract.gatPayTime() + '次')
    $("#timeInterval").text(testContract.getTimeInterval() + '年')
    $("#beneficiarie").text(testContract.getBeneficiarie())
    $("#deathBeneficiary").text(testContract.getDeathBeneficiary())
    $("#deployTime").text(slash(testContract.getDeployTime()))
    $("#nowTime").text(slash(testContract.getNowTime()))
    $("#revocationPeriod").text(slash(testContract.getRevocationPeriod()))
    $("#paymentDate").text(slash(testContract.getPaymentDate()))

    let events = testContract.allEvents({ fromBlock: 0, toBlock: 'latest' });
    events.get(function (error, logs) {
        //console.log(logs)
        $("#event_body").html('')
        logs.forEach((element) => {

            switch (element.event) {
                case 'buyEvent':
                    $("#event_body").append('購買合約' + '<br>')
                    $("#event_body").append('來自 : ' + element.args.from + '<br>')
                    if(element.args.inf == 'success buy')
                        $("#event_body").append('資訊 : ' + '購買成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '購買失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')
                    break
                case 'confirmEvent':
                    $("#event_body").append('確認合約' + '<br>')
                    $("#event_body").append('來自 : ' + element.args.from + '<br>')
                    if(element.args.inf == 'success confirm')
                        $("#event_body").append('資訊 : ' + '確認成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '確認失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')
                    break
                case 'payEvent':
                    $("#event_body").append('給付年金通知' + '<br>')
                    $("#event_body").append('來自 : ' + element.args.from + '<br>')
                    if(element.args.inf == 'Notify the insurance company to pay')
                        $("#event_body").append('資訊 : ' + '通知成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '通知失敗' + '<br>')
                    $("#event_body").append('給付次數 :　第' + element.args.payTime + '次給付年金通知<br>')
                    $("#event_body").append('保險公司應給付金額 : ' + web3.fromWei(element.args.value) + 'eth<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')
                    console.log(element.args.payTime > testContract.gatPayTime())
                    if (element.args.payTime > testContract.gatPayTime()) {
                        console.log('companyPay')
                        testContract.companyPay({
                            from: '0x1ad59A6D33002b819fe04Bb9c9d0333F990750a4',
                            value: element.args.value,
                            gas: 4444444
                        })
                    }
                    break
                case 'companyPayEvent':
                    $("#event_body").append('給付年金完成' + '<br>')
                    $("#event_body").append('來自 : ' + element.args.from + '<br>')
                    if(element.args.inf == 'company pay success')
                        $("#event_body").append('資訊 : ' + '給付成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '給付失敗' + '<br>')
                    $("#event_body").append('給付次數 :　第' + element.args.payTime + '次給付年金完成<br>')
                    $("#event_body").append('保險公司給付金額 : ' + web3.fromWei(element.args.value) + 'eth<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')
                    break
                case 'revokeEvent':
                    $("#event_body").append('合約撤銷' + '<br>')
                    $("#event_body").append('來自 : ' + element.args.from + '<br>')
                    if(element.args.inf == 'revoke the contract')
                        $("#event_body").append('資訊 : ' + '撤銷成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '撤銷失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')
                    break
            }
        })
    });
}

function setState(state) {
    $("#state_panel").removeClass();
    switch (state) {
        case '0':
            $("#state_panel").addClass("panel panel-default ");
            $("#state_heading").html("合約狀態：等待付款")
            break;
        case '1':
            $("#state_panel").addClass("panel panel-warning");
            $("#state_heading").html("合約狀態：合約未被確認");
            break;
        case '2':
            $("#state_panel").addClass("panel panel-info");
            $("#state_heading").html("合約狀態：合約撤銷期內");
            myDate2.setText('契約撤銷期限')
            myDate2.satDate(testContract.getRevocationPeriod())
            break;
        case '3':
            $("#state_panel").addClass("panel panel-primary");
            $("#state_heading").html("合約狀態：合約確認 正式生效");
            myDate2.setText('下次年金給付日期')
            myDate2.satDate(testContract.getPaymentDate())
            break;
        case '4':
            $("#state_panel").addClass("panel panel-success");
            $("#state_heading").html("合約狀態：合約給付結束");
            myDate2.setText('')
            myDate2.satDate([0, 0, 0])
            break;
        case '5':
            $("#state_panel").addClass("panel panel-danger");
            $("#state_heading").html("合約狀態：合約已被撤銷");
            myDate2.setText('')
            myDate2.satDate([0, 0, 0])
            break;
        default:
            $("#state_panel").addClass("panel panel-default");
            $("#state_heading").html("合約狀態：未知狀態???");
    }
}

function slash(date) {
    if (date[0] == 0 && date[1] == 0 && date[2] == 0) {
        return '未訂'
    }
    else {
        return date[0] + '年' + date[1] + '月' + date[2] + '日'
    }
}
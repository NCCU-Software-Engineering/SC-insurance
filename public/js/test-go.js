let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let adrress
let testContract
let myDate1 = new MyDate('#myDate1', 2017, 8, 17, '模擬智能合約目前日期(Time Travel)')
let myDate2 = new MyDate('#myDate2', 0, 0, 0, '契約撤銷期限')
let autoRun

let buy_date
let dead_date

let money_company = 1000
let money_your = 1000
let money_dead = 1000

let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'
let deathBeneficiary = '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
let timeServer = '0x90353894b5edddcf49978b029f16bbed8e7e9355'

$(document).ready(function () {

    testContract = web3.eth.contract(data.interface).at(getQueryVariable('address'))

    buy_date = getQueryVariable('buy').split(',')
    dead_date = getQueryVariable('dead').split(',')
    buy_date[0] = parseInt(buy_date[0])
    buy_date[1] = parseInt(buy_date[1])
    buy_date[2] = 1
    dead_date[0] = parseInt(dead_date[0])
    dead_date[1] = parseInt(dead_date[1])
    dead_date[2] = 1

    initTimeLine()
    updateMoney()
    update()

    $('button').click(function () {

        $('button').attr('disabled', 'true')
        setTimeout(() => { $('button').removeAttr('disabled') }, 1000)

        let contractTime = testContract.getNowTime()
        let myDate = new Date(contractTime[0], contractTime[1] - 1, contractTime[2])
        nowBlock = web3.eth.blockNumber

        switch ($(this).attr('id')) {

            case 'auto':
                console.log('auto')
                auto()
                break

            case 'stop':
                console.log('stop')
                clearTimeout(autoRun)
                break

            default:
                console.error("not fond")
        }
        update()
    })
})

function auto() {
    let tarDate = myDate2.getDateArr()
    if (tarDate != [0, 0, 0]) {
        if (tarDate[0] < dead_date[0] ||
            (tarDate[0] == dead_date[0] && tarDate[1] < dead_date[1]) ||
            (tarDate[0] == dead_date[0] && tarDate[1] == dead_date[1] && tarDate[2] < dead_date[2])) {

            testContract.time(tarDate[0], tarDate[1], tarDate[2], {
                from: timeServer,
                gas: 4444444
            })
            update()
            autoRun = setTimeout(auto, 2000)
        }
        else {
            testContract.time(dead_date[0], dead_date[1], dead_date[2], {
                from: timeServer,
                gas: 4444444
            })
            testContract.endAnnuity({
                from: company,
                gas: 4444444
            })
            update()
        }
    }
}

function update() {

    updateMoney()
    setState(testContract.getState().toString())
    myDate1.satDate(testContract.getNowTime())
    $('#timeline #dates #d' + testContract.getNowTime()[0]).click()

    $("#company").text('正大人壽')
    $("#insurer").text(testContract.getBeneficiarie())
    $("#payment").text(web3.fromWei(testContract.getPayment()) + ' eth')
    $("#payTime").text(testContract.gatPayTime() + '次')
    $("#timeInterval").text(testContract.getTimeInterval() + '年')
    $("#isGuarantee").text(testContract.getGuarantee() ? '是' : '否')
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
        reTimeLine()

        logs.forEach((element, index) => {
            $("#event_body").append(logs.length - index + '.')
            switch (element.event) {

                case 'buyEvent':
                    $('#timeline #issues #' + element.args.timestamp[0]).append('購買合約：')
                    if (element.args.inf == 'success buy')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('購買成功')
                    else
                        $('#timeline #issues #' + element.args.timestamp[0]).append('付款金額不足')

                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                    break

                case 'confirmEvent':
                    $('#timeline #issues #' + element.args.timestamp[0]).append('確認合約：')
                    if (element.args.inf == 'success confirm')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('確認成功')
                    else
                        $('#timeline #issues #' + element.args.timestamp[0]).append('確認失敗')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                    break

                case 'revokeEvent':
                    $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷合約：')
                    if (element.args.inf == 'revoke the contract')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷成功')
                    else
                        $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷失敗 不在可撤銷期間內')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                    break

                case 'payEvent':

                    $('#timeline #issues #' + element.args.timestamp[0]).append('通知保險公司給付年金：')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('第' + element.args.payTime + '次給付年金通知')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                    if (parseInt(element.args.payTime) > parseInt(testContract.gatPayTime())) {
                        console.log('companyPay')
                        testContract.companyPay({
                            from: company,
                            value: element.args.value,
                            gas: 4444444
                        })
                        update()
                    }
                    break

                case 'companyPayEvent':
                    $('#timeline #issues #' + element.args.timestamp[0]).append('保險公司年金給付：')
                    if (element.args.inf == 'company pay success')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('給付被保人 ' + web3.fromWei(element.args.value) + '以太幣')
                    else if (element.args.inf == 'company pay deathBeneficiary success')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('給付身故受益人 ' + web3.fromWei(element.args.value) + '以太幣')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                    break

                case 'deathEvent':

                    $('#timeline #issues #' + element.args.timestamp[0]).append('被保人去世：')
                    if (element.args.inf == 'death in waitingForPayment')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('付款前去世')
                    else if (element.args.inf == 'death in unconfirmed')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('確認前去世 保費返還被保人')
                    else if (element.args.inf == 'death in canBeRevoked(guarantee)')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷期間內去世 退還保費給身故受益人')
                    else if (element.args.inf == 'death in canBeRevoked(no guarantee)')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷期間內去世 結束保單')
                    else if (element.args.inf == 'death in confirmd')
                        $('#timeline #issues #' + element.args.timestamp[0]).append('結束保單')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')

                    if (parseInt(element.args.payTime) > parseInt(testContract.gatPayTime())) {
                        console.log('companyPay')
                        testContract.companyPay({
                            from: company,
                            value: element.args.value,
                            gas: 4444444
                        })
                        update()
                    }
                    break
            }
        })
    })
}

function updateMoney() {

    let money_company_dif = (web3.fromWei(web3.eth.getBalance(company)) - money_company).toFixed(3)
    let money_your_dif = (web3.fromWei(web3.eth.getBalance(nidhogg5)) - money_your).toFixed(3)
    let money_dead_dif = (web3.fromWei(web3.eth.getBalance(deathBeneficiary)) - money_dead).toFixed(3)

    if (money_company_dif >= 0) {
        $('#money_company-dif').text('(+' + money_company_dif + ')')
        $('#money_company-dif').css('color', 'green')
    }
    if (money_your_dif >= 0) {
        $('#money_your-dif').text('(+' + money_your_dif + ')')
        $('#money_your-dif').css('color', 'green')
    }
    if (money_dead_dif >= 0) {
        $('#money_dead-dif').text('(+' + money_dead_dif + ')')
        $('#money_dead-dif').css('color', 'green')
    }

    if (money_company_dif < 0) {
        $('#money_company-dif').text('(' + money_company_dif + ')')
        $('#money_company-dif').css('color', 'red')
    }
    if (money_your_dif < 0) {
        $('#money_your-dif').text('(' + money_your_dif + ')')
        $('#money_your-dif').css('color', 'red')
    }
    if (money_dead_dif < 0) {
        $('#money_dead-dif').text('(' + money_dead_dif + ')')
        $('#money_dead-dif').css('color', 'red')
    }

    money_company = web3.fromWei(web3.eth.getBalance(company))
    money_your = web3.fromWei(web3.eth.getBalance(nidhogg5))
    money_dead = web3.fromWei(web3.eth.getBalance(deathBeneficiary))

    $('#money_company').text(money_company.toFixed(3))
    $('#money_your').text(money_your.toFixed(3))
    $('#money_dead').text(money_dead.toFixed(3))
}

function reTimeLine() {
    $('#timeline #issues li').each(function (index) {
        $(this).empty()
    })
}

function initTimeLine() {

    for (var i = 2017; i < 2100; i++) {
        $('#timeline #dates').append('<li><a href="#' + i + '" id="d' + i + '">' + i + '</a></li>')
        $('#timeline #issues').append('<li id="' + i + '"></li>')
    }

    $().timelinr({
        orientation: 'horizontal',
        // value: horizontal | vertical, default to horizontal
        containerDiv: '#timeline',
        // value: any HTML tag or #id, default to #timeline
        datesDiv: '#dates',
        // value: any HTML tag or #id, default to #dates
        datesSelectedClass: 'selected',
        // value: any class, default to selected
        datesSpeed: 'normal',
        // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to normal
        issuesDiv: '#issues',
        // value: any HTML tag or #id, default to #issues
        issuesSelectedClass: 'selected',
        // value: any class, default to selected
        issuesSpeed: 'fast',
        // value: integer between 100 and 1000 (recommended) or 'slow', 'normal' or 'fast'; default to fast
        issuesTransparency: 0.2,
        // value: integer between 0 and 1 (recommended), default to 0.2
        issuesTransparencySpeed: 500,
        // value: integer between 100 and 1000 (recommended), default to 500 (normal)
        arrowKeys: 'false',
        // value: true/false, default to false
        startAt: 1,
        // value: integer, default to 1 (first)
        autoPlay: 'false',
        // value: true | false, default to false
        autoPlayDirection: 'forward',
        // value: forward | backward, default to forward
        autoPlayPause: 2000
        // value: integer (1000 = 1 seg), default to 2000 (2segs)< });
    })
}

function setState(state) {
    $("#state_panel").removeClass();
    switch (state) {
        case '0':
            $("#state_panel").addClass("panel panel-default ");
            $("#state_heading").html("合約狀態：等待付款")
            break
        case '1':
            $("#state_panel").addClass("panel panel-warning");
            $("#state_heading").html("合約狀態：等待被保人確認中");
            break
        case '2':
            $("#state_panel").addClass("panel panel-info");
            $("#state_heading").html("合約狀態：保單可撤銷期內");
            myDate2.setText('契約撤銷期限')
            myDate2.satDate(testContract.getRevocationPeriod())
            break
        case '3':
            $("#state_panel").addClass("panel panel-primary");
            $("#state_heading").html("合約狀態：合約正式生效");
            myDate2.setText('下次年金給付日期')
            myDate2.satDate(testContract.getPaymentDate())
            break
        case '4':
            $("#state_panel").addClass("panel panel-success");
            $("#state_heading").html("合約狀態：合約給付結束");
            myDate2.setText('')
            myDate2.satDate([0, 0, 0])
            $('#dead').prop('disabled', true);
            break
        case '5':
            $("#state_panel").addClass("panel panel-danger");
            $("#state_heading").html("合約狀態：合約已被撤銷");
            myDate2.setText('')
            myDate2.satDate([0, 0, 0])
            break
        case '6':
            $("#state_panel").addClass("panel panel-danger");
            $("#state_heading").html("合約狀態：保證型保險 給付死亡受益人");
            myDate2.setText('')
            myDate2.satDate([0, 0, 0])
            break
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

function ethAddress(address) {
    switch (address.toString()) {
        case company:
            return '正大人壽'
        case nidhogg5:
            return '被保人'
        case deathBeneficiary:
            return '身故受益人'
        case timeServer:
            return '時間伺服器'
        default:
            return address
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}
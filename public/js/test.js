let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let adrress
let testContract
let myDate1 = new MyDate('#myDate1', 2017, 8, 17, '模擬智能合約目前日期(Time Travel)')
let myDate2 = new MyDate('#myDate2', 0, 0, 0, '契約撤銷期限')
let autoRun

let money_company = 1000
let money_your = 1000
let money_dead = 1000

let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'
let deathBeneficiary = '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
let timeServer = '0x90353894b5edddcf49978b029f16bbed8e7e9355'

$(document).ready(function () {

    $(".auto").click(function () {
        let date = {
            alias: '我的第一張保單',
            name: '賴晨禾',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '賴晨禾',
            'guarantee-type': 'y',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '123213123',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        console.log(date)
        $.post("deploy", date, (result) => {
            console.log(result)
        })
    })

    updateMoney()
    initTimeLine()

    //選擇合約
    $("select").change(function () {
        testContract = web3.eth.contract(data.interface).at($(this).val())
        initTimeLine()
        update()
    })

    $('button').click(function () {

        $('button').attr('disabled', 'true')
        setTimeout(() => { $('button').removeAttr('disabled') }, 1000);

        let contractTime = testContract.getNowTime()
        let myDate = new Date(contractTime[0], contractTime[1] - 1, contractTime[2])
        nowBlock = web3.eth.blockNumber

        switch ($(this).attr('id')) {

            case "next_day":
                console.log("next_day");
                myDate.setDate(myDate.getDate() + 1)
                console.log(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate())
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: timeServer,
                    gas: 4444444
                })
                break
            case "next_month":
                console.log("next_month");
                myDate.setMonth(myDate.getMonth() + 1)
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: timeServer,
                    gas: 4444444
                })
                break
            case "next_year":
                console.log("next_year");
                myDate.setFullYear(myDate.getFullYear() + 1)
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: timeServer,
                    gas: 4444444
                })
                break

            case "revoke":
                console.log("revoke");
                testContract.revoke({
                    from: nidhogg5,
                    gas: 4444444
                })
                break

            case "dead":
                console.log("dead");
                testContract.endAnnuity({
                    from: company,
                    gas: 4444444
                })
                break

            case 'go':
                console.log('go')
                myDate = new Date($('#datePicker').val())
                testContract.time(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
                    from: timeServer,
                    gas: 4444444
                })
                break

            case 'auto':
                console.log('auto')
                if (myDate2.getDateArr()[0]) {
                    $('#auto').hide()
                    $('#stop').show()
                    auto()
                }
                break

            case 'stop':
                console.log('stop')
                $('#auto').show()
                $('#stop').hide()
                clearTimeout(autoRun)
                break

            case "update":
                console.log("update")
                break

            default:
                console.error("not fond")
        }
        update()
    })

    $('#myDate2').click(function () {
        console.log('set')
        $('#datePicker').val(myDate2.getDate());
    })
})

function auto() {
    let tarDate = myDate2.getDateArr()
    console.log(tarDate)
    if (tarDate != [0, 0, 0]) {
        testContract.time(tarDate[0], tarDate[1], tarDate[2], {
            from: timeServer,
            gas: 4444444
        })
        update()
        autoRun = setTimeout(auto, 5000)
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

        logs.reverse().forEach((element, index) => {
            $("#event_body").append(logs.length - index + '.')
            switch (element.event) {
                case 'buyEvent':
                    $("#event_body").append('購買合約' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'success buy')
                        $("#event_body").append('資訊 : ' + '購買成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '購買失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('購買合約：' + slash(element.args.timestamp) + '<br>')
                    break
                case 'confirmEvent':
                    $("#event_body").append('確認合約' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'success confirm')
                        $("#event_body").append('資訊 : ' + '確認成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '確認失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('確認合約：' + slash(element.args.timestamp) + '<br>')
                    break
                case 'payEvent':
                    $("#event_body").append('給付年金通知' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'Notify the insurance company to pay')
                        $("#event_body").append('資訊 : ' + '通知成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '通知失敗' + '<br>')
                    $("#event_body").append('給付次數 :　第' + element.args.payTime + '次給付年金通知<br>')
                    $("#event_body").append('保險公司應給付金額 : ' + web3.fromWei(element.args.value) + 'eth<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('給付年金通知：' + slash(element.args.timestamp) + '<br>')
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
                    $("#event_body").append('給付年金完成' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'company pay success')
                        $("#event_body").append('資訊 : ' + '給付成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '給付失敗' + '<br>')
                    $("#event_body").append('給付次數 : 第' + element.args.payTime + '次給付年金完成<br>')
                    $("#event_body").append('保險公司給付金額 : ' + web3.fromWei(element.args.value) + 'eth<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('給付年金完成：' + slash(element.args.timestamp) + '<br>')
                    break
                case 'revokeEvent':
                    $("#event_body").append('合約撤銷' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'revoke the contract')
                        $("#event_body").append('資訊 : ' + '撤銷成功' + '<br>')
                    else
                        $("#event_body").append('資訊 : ' + '撤銷失敗' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('撤銷合約：' + slash(element.args.timestamp) + '<br>')
                    break
                case 'deathEvent':
                    $("#event_body").append('被保人死亡' + '<br>')
                    $("#event_body").append('來自 : ' + ethAddress(element.args.from) + '<br>')
                    if (element.args.inf == 'death')
                        $("#event_body").append('資訊 : ' + '被保人死亡' + '<br>')
                    $("#event_body").append('時間 : ' + slash(element.args.timestamp) + '<br><hr>')

                    $('#timeline #issues #' + element.args.timestamp[0]).prepend('被保人死亡：' + slash(element.args.timestamp) + '<br>')
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
    $('#timeline #dates').empty()
    $('#timeline #issues').empty()
    for (var i = 2017; i < 2050; i++) {
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

function emptyTimeLine() {
    for (var i = 2017; i < 2030; i++) {
        $('#timeline #issues #' + i).empty()
    }
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
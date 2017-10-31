let web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
let buy = [2017, 11]
let dead = [2023, 6]

$(function () {

    $('.drag').draggable({
        containment: '.container',
        axis: 'x',
        start: function () {
        },
        drag: function () {
            let num = parseInt($(this).css('left')) - 12
            $('#' + $(this).attr('name')).text(toDate(num, $(this).attr('name')))

            predict()
        },
        stop: function () {
            let num = parseInt($(this).css('left')) - 12
            $('#' + $(this).attr('name')).text(toDate(num, $(this).attr('name')))

            predict()
        }
    })

    $('#company_money').text(web3.fromWei(web3.eth.getBalance('0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'), "ether").toFixed(3))
    $('#user_money').text(web3.fromWei(web3.eth.getBalance('0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'), "ether").toFixed(3))
    $('#death_money').text(web3.fromWei(web3.eth.getBalance('0x68a874f2e8d20718af2ebb48dc10940ede50c080'), "ether").toFixed(3))

    //年齡
    init_age()
    //年齡變動 是否保證
    $('.20-75, .check1').change(function () {
        set_payment()
        predict()
    })
    //是否撤銷
    $('.check2').change(function () {
        predict()
    })

    $('#to_test').click(function () {
        let date = {
            alias: $('input[name=alias]').val(),
            name: '賴晨禾',
            age: $(".20-75 option:selected").val(),
            company: '正大人壽',
            payment: Number($('input[name=payment]').val()),
            annuity: '1',
            beneficiary: '賴晨禾',
            isGuarantee: $('.check1:checked').val(),
            paymentDate: '1',
            deathBeneficiary: '賴爸爸',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        $.post('auto_deploy', date, (result) => {
            if (result.type) {
                $.get('auto_payeth?address=' + result.address + '&ether=' + date.payment, function (result2) {
                    $.get('auto_confirm?address=' + result.address, function (result3) {
                        window.location = '/test-go?address=' + result.address + '&buy=' + buy.toString() + '&dead=' + dead.toString()
                    })
                })
            }
        })
    })

    predict()
})

function toDate(num, name) {
    num = num / 2 + 4
    let year = Math.floor(num / 6) + 2017
    let momth = Math.floor(num % 6) * 2 + 1
    if (name == 'buy') {
        buy = [year, momth]
    }
    else {
        dead = [year, momth]
    }
    return year + '年' + momth + '月'
}

function init_age() {
    for (let i = 20; i <= 75; i++) {
        $(".20-75").append($("<option></option>").attr("value", i).text(i))
    }
}

function set_payment() {
    if ($('.check1:checked').val() == '1') {
        $('input[name=payment]').val(trial[$(".20-75 option:selected").val()].premium_guarantee / 10)
        $('input[name=annuity]').val(trial[$(".20-75 option:selected").val()].annuity / 10)
    }
    else {
        $('input[name=payment]').val(trial[$(".20-75 option:selected").val()].premium_not_guarantee / 10)
        $('input[name=annuity]').val(trial[$(".20-75 option:selected").val()].annuity / 10)
    }
}

function predict() {
    let company = Number($('#company_money').text())
    let user = Number($('#user_money').text())
    let death = Number($('#death_money').text())
    let payment = Number($('input[name=payment]').val())
    let annuity = Number($('input[name=annuity]').val())
    let alias = $('input[name=alias]').val()

    let life = dead[0] - buy[0]
    if (dead[1] < buy[1])
        life--
    $('#life').text(life)
    $('#gain').text(life - payment)
    //有身故
    if ($('.check1:checked').val() == '1') {
        if (life < payment) {
            $('#dgain').text((payment - life) + '以太幣')
            $('#predict_company_money, #predict_company_money2').text(company)
            $('#predict_death_money, #predict_death_money2').text(death + payment - life)
        }
        else {
            $('#dgain').text('給付已超過保證金額')
            $('#predict_company_money, #predict_company_money2').text(company - life + payment)
            $('#predict_death_money, #predict_death_money2').text(death)
        }
    }
    //無身故
    else {
        $('#dgain').text('無保證型智能保單')
        $('#predict_company_money, #predict_company_money2').text(company - life + payment)
        $('#predict_death_money, #predict_death_money2').text(death)
    }

    $('#predict_user_money, #predict_user_money2').text(user + life - payment)

    $('#alias').text(alias)
    $('#premium').text(payment)
    $('#annuity').text(annuity)

    /*
    $('#predict_company_money').text(1)
    let year = $('[name=death-age] option:selected').val() - $('.20-75 option:selected').val()
    if ($('.check2:checked').val() == '1') {
        $('#predict_company_money').text(company)
        $('#predict_user_money').text(user)
        $('#predict_death_money').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'before-buy') {
        $('#predict_company_money').text(company)
        $('#predict_user_money').text(user)
        $('#predict_death_money').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'before-confirm') {
        $('#predict_company_money').text(company)
        $('#predict_user_money').text(user)
        $('#predict_death_money').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'after-confirm') {
        if ($('.check1:checked').val() == '0') {
            $('#predict_company_money').text(company + premium - annuity * year)
            $('#predict_user_money').text(user - premium + annuity * year)
            $('#predict_death_money').text(death)
        }
        else {
            console.log('4.2')
            $('#predict_company_money').text(company + ((premium - annuity * year) > 0 ? 0 : (premium - annuity * year)))
            $('#predict_user_money').text(user - premium + annuity * year)
            $('#predict_death_money').text(death + ((premium - annuity * year) > 0 ? (premium - annuity * year) : 0))
        }
    }
    */
}
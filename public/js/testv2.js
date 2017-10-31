$(function () {
    init()
    initTimeLine()
    update()
    setDeathAge()
    predict()
    change()
    $('#submit').click(function(){
        $.post('/getResult',{
            alias: $('input[name=alias]').val(),
            name: $('input[name=name]').val(),
            age: $('[name=age] option:selected').val(),
            payment: $('input[name=payment]').val(),
            annuity: $('input[name=annuity]').val(),
            beneficiary: $('input[name=beneficiary]').val(),
            isGuarantee: $('.check1:checked').val(),
            isRevokation: $('.check2:checked').val(),
            death_time: $('[name=death-time] option:selected').val(),
            death_age: $('[name=death-age] option:selected').val()
        },(result)=>{
            setTimeLine(result)
            resetBalane()
        })
    })
})
function init() {
    for (let i = 20; i <= 75; i++) {
        $(".20-75").append($("<option></option>").attr("value", i).text(i))
    }
}
function change() {
    $('.check1').change(function () {
        update()
        predict()
    })
    $('.check2').change(function () {
        predict()
    })
    $('.20-75').change(function () {
        update()
        setDeathAge()
        predict()
    })
    $('[name=death-time]').change(function () {
        setDeathAge()
        predict()
    })
    $('[name=death-age]').change(function () {
        predict()
    })
}
function setDeathAge() {
    $('[name=death-age]').empty()
    if ($('[name=death-time] option:selected').val() == 'after-confirm') {
        for (let i = $(".20-75 option:selected").val(); i <= 110; i++) {
            $('[name=death-age]').append($("<option></option>").attr("value", i).text(i))
        }
    }
    else {
        $('[name=death-age]').append($("<option></option>").attr("value", $(".20-75 option:selected").val()).text($(".20-75 option:selected").val()))
    }
}
function update() {
    if ($('.check1:checked').val() == '1') {
        $('input[name=payment]').val(trial[$(".20-75 option:selected").val()].premium_guarantee / 10)
        $('input[name=annuity]').val(trial[$(".20-75 option:selected").val()].annuity / 10)
    }
    else {
        $('input[name=payment]').val(trial[$(".20-75 option:selected").val()].premium_not_guarantee / 10)
        $('input[name=annuity]').val(trial[$(".20-75 option:selected").val()].annuity / 10)
    }
}
function resetBalane() {
    $.post('/getBalance',(result)=>{
        $('[id="company_money"]').text(result.company_money)
        $('[id="user_money"]').text(result.user_money)
        $('[id="death_money"]').text(result.death_money)
    })
}
function predict() {
    let company = Number($('#company_money').text())
    let user = Number($('#user_money').text())
    let death = Number($('#death_money').text())
    let premium = $('input[name=payment]').val()
    let annuity = $('input[name=annuity]').val()
    let year = $('[name=death-age] option:selected').val() - $('.20-75 option:selected').val()
    let alias = $('input[name=alias]').val()
    $('#alias').text(alias)
    $('#premium').text(premium)
    $('#annuity').text(annuity)
    if ($('.check2:checked').val() == '1') {
        $('[id="predict_company_money"]').text(company)
        $('[id="predict_user_money"]').text(user)
        $('[id="predict_death_money"]').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'before-buy') {
        $('[id="predict_company_money"]').text(company)
        $('[id="predict_user_money"]').text(user)
        $('[id="predict_death_money"]').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'before-confirm') {
        $('[id="predict_company_money"]').text(company)
        $('[id="predict_user_money"]').text(user)
        $('[id="predict_death_money"]').text(death)
    }
    else if ($('[name=death-time] option:selected').val() == 'after-confirm') {
        if ($('.check1:checked').val() == '0') {
            $('[id="predict_company_money"]').text(company + (premium - annuity * year))
            $('[id="predict_user_money"]').text(user - premium + annuity * year)
            $('[id="predict_death_money"]').text(death)
        }
        else {
            $('[id="predict_company_money"]').text(company + ((premium - annuity * year)>0?0:(premium - annuity * year)))
            $('[id="predict_user_money"]').text(user - premium + annuity * year)
            $('[id="predict_death_money"]').text(death + ((premium - annuity * year)>0?(premium - annuity * year):0))
        }
    }
}
function setTimeLine(logs){
    reTimeLine()
    logs.forEach((element, index) => {
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
                    $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷失敗<br>不在可撤銷期間內')
                $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                break
            case 'payEvent':
                $('#timeline #issues #' + element.args.timestamp[0]).append('通知保險公司給付年金：<br>')
                $('#timeline #issues #' + element.args.timestamp[0]).append('第' + element.args.payTime + '次給付年金通知')
                $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                break
            case 'companyPayEvent':
                if (element.args.inf == 'company pay success') {
                    $('#timeline #issues #' + element.args.timestamp[0]).append('保險公司年金給付：<br>')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('給付被保人 ' + element.args.value / 1000000000000000000 + '以太幣')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                }
                else if (element.args.inf == 'company pay deathBeneficiary success'){
                    $('#timeline #issues #' + element.args.timestamp[0]).append('保險公司年金給付：<br>')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('給付身故受益人 ' + element.args.value/1000000000000000000 + '以太幣')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                }
                break
            case 'deathEvent':
                $('#timeline #issues #' + element.args.timestamp[0]).append('被保人去世：')
                if (element.args.inf == 'death in waitingForPayment')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('付款前去世')
                else if (element.args.inf == 'death in unconfirmed')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('確認前去世<br>保費返還被保人')
                else if (element.args.inf == 'death in canBeRevoked(guarantee)')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷期間內去世<br>退還保費給身故受益人')
                else if (element.args.inf == 'death in canBeRevoked(no guarantee)')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('撤銷期間內去世<br>結束保單')
                else if (element.args.inf == 'death in confirmd')
                    $('#timeline #issues #' + element.args.timestamp[0]).append('結束保單')
                $('#timeline #issues #' + element.args.timestamp[0]).append('(' + slash(element.args.timestamp) + ')<br>')
                break
        }
    })
}
function reTimeLine() {
    $('#timeline #issues li').each(function (index) {
        $(this).empty()
    })
}
function initTimeLine() {
    for (var i = 2017; i < 2110; i++) {
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
function slash(date) {
    if (date[0] == 0 && date[1] == 0 && date[2] == 0) {
        return '未訂'
    }
    else {
        return date[0] + '年' + date[1] + '月' + date[2] + '日'
    }
}

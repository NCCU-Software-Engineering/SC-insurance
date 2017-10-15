$(function () {
    init()
    initTimeLine()
    update()
    setDeathAge()
    predict()
    change()
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
function predict() {
    let company = Number($('#company_money').text())
    let user = Number($('#user_money').text())
    let death = Number($('#death_money').text())
    let premium = $('input[name=payment]').val()
    let annuity = $('input[name=annuity]').val()
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
            $('#predict_company_money').text(company + ((premium - annuity * year)>0?0:(premium - annuity * year)))
            $('#predict_user_money').text(user - premium + annuity * year)
            $('#predict_death_money').text(death + ((premium - annuity * year)>0?(premium - annuity * year):0))
        }
    }
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

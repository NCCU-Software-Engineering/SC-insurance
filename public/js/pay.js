$(function () {
    let account
    let contract

    $.post("/getaccount", function (data) {
        account = data[0].account;
        $('#account').append(data[0].account)
    })

    $.post("/getcontracts", function (data) {
        contract = data
        data.forEach(function (element) {
            console.log(element)
            if (!element.isBuy) {
                $('#contracts').append($('<option>', {
                    value: 1,
                    text: '保單編號' + element.auto + ': ' + element.address
                }))
            }
        }, this)
    })

    $("select").change(function () {
        let tar = $("#contracts option:selected").text()
        contract.forEach(function (element) {
            if(tar == ('保單編號' + element.auto + ': ' + element.address)) {
                $("#money").val(element.payment)
            }
        })
    });

    $('#payeth').click(function () {
        $.get('/payeth', {
            address: $("#contracts option:selected").text().replace(/保單編號\d+\: /, ''),
            account: account,
            amount: $("#money").val()
        }, (result) => {
            window.location = '/'
        })
    })
});
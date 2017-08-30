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
                    text: addZero(element.auto) + '-' + element.alias
                }))
            }
        }, this)
    })

    $("select").change(function () {
        let tar = $("#contracts option:selected").text()
        contract.forEach(function (element) {
            if (tar == (addZero(element.auto) + '-' + element.alias)) {
                $("#money").val(element.payment)
            }
        })
    });

    $('#payeth').click(function () {
        $.get('/payeth', {
            address: $("#contracts option:selected").text().replace(/\d+(.*)\: /, ''),
            account: account,
            amount: $("#money").val()
        }, (result) => {
            window.location = '/'
        })
    })
    function addZero(n) {
		return (n < 10000 ? (n < 1000 ? (n < 100 ? (n < 10 ? "0000" : "000") : "00") : "0") : "")+n
	}
});
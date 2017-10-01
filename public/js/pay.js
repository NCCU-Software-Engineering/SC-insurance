$(function () {
    let contract
    let address

    $.post("/getContracts", function (data) {
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
                address = element.address
            }
        })
    });

    $('#payeth').click(function () {
        console.log(address);
        $.get('/payeth', {
            address: address,
            amount: $("#money").val()
        }, (result) => {
            swal({
                title: '付款成功',
                type: 'success',
            }).then(() => {
                window.location = '/'
            })
        })
    })
    function addZero(n) {
        return 'nccuin' + (n < 10000 ? (n < 1000 ? (n < 100 ? (n < 10 ? "0000" : "000") : "00") : "0") : "") + n
    }
});
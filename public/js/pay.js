$(function () {
    let account;
    $.post("/getaccount", function(data) {
        account = data[0].account;
        $('#account').append(data[0].account)
    });
    $.post("/getcontracts", function(data) {
        data.forEach(function(element) {
            $('#contracts').append($('<option>', {
                value: 1,
                text: element.address
            }));
        }, this);
    });
    $('#payeth').click(function () {
		$.get('/payeth',{
            address: $("#contracts option:selected").text(),
            account: account,
            amount: $("#money").val()
        })
	})
});
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
                text:'合約編號'+element.number+': '+ element.address
            }));
        }, this);
    });
    $('#payeth').click(function () {
		$.get('/payeth',{
            address: $("#contracts option:selected").text().replace(/合約編號\d+\: /,''),
            account: account,
            amount: $("#money").val()
        },(result)=>{
            window.location = '/';
        })
	})
});
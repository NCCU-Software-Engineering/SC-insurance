$(function () {
    let url = new URL(window.location.href)
    let address = url.searchParams.get('address')

    $('#eth').click(function () {
        $.post("/buyEmail", {
            type: 'eth',
            address: address,
        }, function () {
            window.location = '/'
        })
    })
})
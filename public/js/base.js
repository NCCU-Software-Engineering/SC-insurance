$(function () {
    //判斷是否登入
    if ($('#user_name').text()) {
        $('.sign').show()
        $('.unsign').hide()
    } else {
        $('.unsign').show()
        $('.sign').hide()
    }
})

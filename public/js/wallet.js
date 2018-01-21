$(function () {

    //顯示教學
    if(typeof mist == 'undefined') {
        $('#guide').show();
    }
    //顯示付款
    else {
        $('#wallet').show();
    }
})
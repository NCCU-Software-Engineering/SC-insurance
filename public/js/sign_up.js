$("#default").click(function () {
    $("#contact-id").val("test");
    $("#contact-password").val("1234");
    $("#contact-repassword").val("1234");
    $("#contact-name").val("測試用帳號");
    $("#contact-identity").val("AXXXXXXXXX");
    $("#contact-email").val("test@email.com");
    $("#contact-phone").val("0912254446");
    $("#contact-birthday").val("1990-01-01");
    $("#contact-address").val("台北市文山區指南路二段");
})

$("#test").click(function () {
    $.post("sign_up", $("#sign_up-form").serialize(), function (result) {
        if (result.type)
            swal({
                title: result.inf,
                text: '即將導向回首頁',
                type: 'success',
                closeOnConfirm: false
            }, () => { window.location = '/' })
        else {
            swal({
                title: result.inf,
                text: '請換一個帳號',
                type: 'warning',
            })
        }
    })
})

$("#test").click(function () {
    $.post("sign_in", $("#sign_in-form").serialize(), function(data) {
        alert(data.result);
        if(data.isSuccess) {
            window.location = '/'
        }
    });
})
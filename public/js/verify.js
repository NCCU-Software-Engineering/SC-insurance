$(document).ready(function () {
    $('#verify').click(() => {
        $.post('/verify', {
            code: $('#verifycode').val()
        }, (result) => {
            if (result == 'success') {
                alert('驗證成功')
                window.location = '/';
            }
            else {
                alert('驗證失敗')
                window.location = '/verify';
            }
        });
    })
    $('#create').click(() => {
        $.post('/createcode');
    })
})
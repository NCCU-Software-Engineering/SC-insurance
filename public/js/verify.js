$(document).ready(function () {
    $('#verify').click(() => {
        $.post('/verify', {
            code: $('#verifycode').val()
        }, (result) => {
            if (result == 'success') {
                swal({
                    title: '驗證成功',
                    type: 'success',
                    closeOnConfirm: false
                }, () => { window.location = '/' })
            }
            else {
                swal({
                    title: '驗證失敗',
                    type: 'error'
                })
            }
        });
    })
    $('#create').click(() => {
        $.post('/createcode');
    })
})
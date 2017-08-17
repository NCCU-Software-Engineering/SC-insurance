$(document).ready(function () {
    $('#verify').click(()=>{
        $.post('/verify',{
            code:$('#verifycode').val()
        },(result)=>{
            console.log(result);
        });
    })
    $('#create').click(()=>{
        $.post('/createcode');
    })
})
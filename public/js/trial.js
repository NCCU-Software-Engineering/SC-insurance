$(function () {
    $('#main button').click(() => {

        let pay = $('#pay').val() * 10000
        let year = $('#year').val()

        $('.cont').remove()

        pay = Math.round(pay * 1.0125) - 33
        
        for (let i = 2; i <= year; i++) {
            let cont = ''
            cont += '<tr style="font-size:1.7rem;" class="cont">'
            cont += '<td>' + i + '</td>'
            cont += '<td>' + pay + '</td>'
            cont += '</tr>'
            $('#target').append(cont)
            pay = Math.round(pay * 1.0255)
        }

        $('#money').text(pay)
    })
})
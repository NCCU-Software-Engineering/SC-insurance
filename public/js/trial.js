$(function () {
    for (var i = 20; i < 76; i++) {
        col = '<tr>' +
            '<th>'+i+'</th>' +
            '<th>'+trial[i].premium_guarantee+'</th>' +
            '<th>'+trial[i].premiun_not_guarantee+'</th>' +
            '<th>'+trial[i].annuity+'</th>' +
            '</tr>'
        $('#myTable').append(col);
    }
})
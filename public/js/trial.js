$(function () {
    for (var i = 20; i < 76; i++) {
        col = '<tr>' +
            '<th>'+i+'</th>' +
            '<th>'+trial[i].premium_guarantee/10+'</th>' +
            '<th>'+trial[i].premium_not_guarantee/10+'</th>' +
            '<th>'+trial[i].annuity/10+'</th>' +
            '</tr>'
        $('#myTable').append(col);
    }
})
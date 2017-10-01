$(document).ready(function () {
    $('.trial').click(function () {
        $('.overlay').show();
    })
    var $select = $(".20-75");
    for (i = 20; i <= 75; i++) {
        $select.append($('<option></option>').val(i).html(i))
    }
    $('#getResult').click(function () {
        let premium
        let annuity = trial[$('.20-75 :selected').val()].annuity / 10
        if ($('#isGuarantee :selected').val() == 'y')
            premium = trial[$('.20-75 :selected').val()].premium_guarantee / 10
        else
            premium = trial[$('.20-75 :selected').val()].premium_not_guarantee / 10
        $('#result').html('<label class="control-label">保費：</label>' + premium + ' 以太幣'
            + '<br><label class="control-label">年金：</label>' + annuity + ' 以太幣'
            + '<br>預計' + Math.ceil(premium / annuity) + '年後可拿回與保費等同之年金')
    })
})
function closeOverlay() {
    $('#result').html('')
    $('.overlay').hide();
}
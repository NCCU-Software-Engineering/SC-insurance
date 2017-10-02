$(function () {
    $(".revoke").hover(
        function () {
            $(".revoke").css('background-color', 'yellow')
            $('#traditional-contract-body').animate({
                scrollTop: $('#traditional-contract-body').scrollTop() - $('#traditional-contract-body').offset().top +$("#traditional-contract-body > .revoke").offset().top
            }, 1500);
            $('#parameter-body').animate({
                scrollTop: $('#parameter-body').scrollTop() - $('#parameter-body').offset().top +$("#parameter-body > .revoke").offset().top
            }, 1000);
        }, function () {
            $(".revoke").css('background-color', '')
            $('#traditional-contract-body').stop()
            $('#parameter-body').stop()
        })
    $(".death").hover(
        function () {
            $(".death").css('background-color', 'yellow')
            $('#traditional-contract-body').animate({
                scrollTop: $('#traditional-contract-body').scrollTop() - $('#traditional-contract-body').offset().top +$("#traditional-contract-body > .death").offset().top
            }, 1500);
            $('#parameter-body').animate({
                scrollTop: $('#parameter-body').scrollTop() - $('#parameter-body').offset().top +$("#parameter-body > .death").offset().top
            }, 1000);
        }, function () {
            $(".death").css('background-color', '')
            $('#traditional-contract-body').stop()
            $('#parameter-body').stop()
        })
    $(".pay").hover(
        function () {
            $(".pay").css('background-color', 'yellow')
            $('#traditional-contract-body').animate({
                scrollTop: $('#traditional-contract-body').scrollTop() - $('#traditional-contract-body').offset().top +$("#traditional-contract-body > .pay").offset().top
            }, 1500);
            $('#parameter-body').animate({
                scrollTop: $('#parameter-body').scrollTop() - $('#parameter-body').offset().top +$("#parameter-body > .pay").offset().top
            }, 1000);
        }, function () {
            $(".pay").css('background-color', '')
            $('#traditional-contract-body').stop()
            $('#parameter-body').stop()
        })
})
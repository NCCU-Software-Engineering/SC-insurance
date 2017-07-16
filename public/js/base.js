var customInterpolationApp = angular.module('customInterpolationApp', []);

customInterpolationApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

$(function () {
    if ($('#user_name').text()) {
        $('.sign').show();
        $('.unsign').hide();
    } else {
        $('.unsign').show();
        $('.sign').hide();
    }
})

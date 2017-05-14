var customInterpolationApp = angular.module('customInterpolationApp', []);

customInterpolationApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function go(num) {
    num = "#" + num;
    console.log(num);
    location.href = num;
}
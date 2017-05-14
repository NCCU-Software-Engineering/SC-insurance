var colerLightOn = "#CCFF33"
var colerLightOff = "#FFFFFF"

var customInterpolationApp = angular.module('customInterpolationApp', []);

customInterpolationApp.config(function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

function mouseOver(n){
    $('#t1').get(0).style.backgroundColor = colerLightOn;
    $('#s1').get(0).style.backgroundColor = colerLightOn;
}
function mouseOut(n){
    $('#t1').get(0).style.backgroundColor = colerLightOff;
    $('#s1').get(0).style.backgroundColor = colerLightOff;
}
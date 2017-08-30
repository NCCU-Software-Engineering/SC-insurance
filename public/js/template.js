var colerLightOn = "#CCFF33"
var colerLightOff = "#FFFFFF"

$.fn.scrollView = function () {
	return this.each(function () {
		$('#smart-contract').animate({
			scrollTop: $(this).offset().top
		}, 500)
	})
}

var customInterpolationApp = angular.module('customInterpolationApp', [])

customInterpolationApp.config(function ($interpolateProvider) {
	$interpolateProvider.startSymbol('[[')
	$interpolateProvider.endSymbol(']]')
});

function mouseOver(n) {
	$('#t' + n).get(0).style.backgroundColor = colerLightOn
	$('#s' + n).get(0).style.backgroundColor = colerLightOn
	$('#s' + n).scrollView()
}
function mouseOut(n) {
	$('#t' + n).get(0).style.backgroundColor = colerLightOff
	$('#s' + n).get(0).style.backgroundColor = colerLightOff
}



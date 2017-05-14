var colerLightOn = "#CCFF33"
var colerLightOff = "#FFFFFF"

function mouseOver(n){
    $('#t1').get(0).style.backgroundColor = colerLightOn;
    $('#s1').get(0).style.backgroundColor = colerLightOn;
}
function mouseOut(n){
    $('#t1').get(0).style.backgroundColor = colerLightOff;
    $('#s1').get(0).style.backgroundColor = colerLightOff;
}
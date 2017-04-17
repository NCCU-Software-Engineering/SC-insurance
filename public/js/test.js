var i = 25;
var myDate = new Date();

$( "#up" ).click(function() {
    console.log("增加一歲");
    i++;
    myDate.setFullYear(myDate.getFullYear() + 1);
    $( "#pyear" ).attr('style', 'width: '+i+'%;')
    $( "#year" ).html(i+'歲')
    $( "#date" ).html("今天日期是 " + myDate.getFullYear()+ " 年 " + (myDate.getMonth()+1) + " 月 " + myDate.getDate() + " 日")
});
$( "#reset" ).click(function() {
    console.log("重設");
});

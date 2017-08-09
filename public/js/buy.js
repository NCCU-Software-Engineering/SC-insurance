$(function () {
    console.log($('#address').text());
    $('#payeth').click(function(){
        $.get('/payeth',{address:$('#address').text()})
    })
});

/*function one(){
    console.log("one");

    $("#step1").addClass("active");
    $("#step2").removeClass("active");
    $("#step3").removeClass("active");

    $("#basic").get(0).style.display = "block";
    $("#insured").get(0).style.display = "none";
    $("#payment").get(0).style.display = "none";
}
function two(){
    console.log("two");

    $("#step1").removeClass("active");
    $("#step2").addClass("active");
    $("#step3").removeClass("active");
    
    $("#basic").get(0).style.display = "none";
    $("#insured").get(0).style.display = "block";
    $("#payment").get(0).style.display = "none";
}
function three(){
    console.log("three");

    $("#step1").removeClass("active");
    $("#step2").removeClass("active");
    $("#step3").addClass("active");

    $("#basic").get(0).style.display = "none";
    $("#insured").get(0).style.display = "none";
    $("#payment").get(0).style.display = "block";
}*/
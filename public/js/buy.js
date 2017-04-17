$("#basic_bt").click(function () {
    $("#basic").get(0).style.display = "none";
    $("#insured").get(0).style.display = "block";

    $("#step1").css("background-color", "white");
    $("#step2").css("background-color", "yellow");
});

$("#insured_bt").click(function () {
    $("#insured").get(0).style.display = "none";
    $("#payment").get(0).style.display = "block";

    $("#step2").css("background-color", "white");
    $("#step3").css("background-color", "yellow");
});
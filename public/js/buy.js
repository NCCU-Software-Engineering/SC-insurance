$("#basic_bt").click(function () {
    $("#basic").get(0).style.display = "none";
    $("#insured").get(0).style.display = "block";

    $("#step1").removeClass("active");
    $("#step2").addClass("active");
});

$("#insured_bt").click(function () {
    $("#insured").get(0).style.display = "none";
    $("#payment").get(0).style.display = "block";

    $("#step2").removeClass("active");
    $("#step3").addClass("active");
});
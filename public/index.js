$("#btn1").click(function () {
    $.post("/gettrans", {
        hash: $("#transhash").val()
    }, function (data) {
        console.log(data)
        $("#result").html(JSON.stringify(data))
    });
})
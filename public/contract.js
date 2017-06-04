$( "#compile" ).click(function() {
    $.post("/compile",function(data){
        console.log(data)
    });
});
$( "#deploy" ).click(function() {
    $.post("/deploy",function(data){
        console.log(data)
    });
});
$( "#trans" ).click(function() {
    $.post("/trans",function(data){
        console.log(data)
    });
});
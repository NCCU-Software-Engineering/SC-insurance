function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

$(function () {
    var user = getCookie("ID");
    if (user == "") {
        console.log("not log in");
        $(".sign").css("display", "none");
    } else {
        console.log(user);
        $("#ID").text(user);
        $(".unsign").css("display", "none");
    }
})
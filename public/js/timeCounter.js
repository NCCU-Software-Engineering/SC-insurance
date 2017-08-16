var countDown = function (theSelector, year, month, day) {
	var output = "";
	var dTime = Date.parse(time);
	var theDate = Date.parse(new Date());
	var difference = dTime - theDate;
	var milliseconds = difference % 1000;

	function addZero(number) {
		if (number <= 9) {
			number = "0" + number;
		}
		return number;
	}

	output += "<span class='year'>" + year + "<small>year</small></span>";
	output += "<span class='month'>" + month + "<small>month</small></span>";
	output += "<span class='day'>" + day + "<small>day</small></span>";
	document.querySelector(theSelector).innerHTML = output;
}
class MyDate {
	constructor(year, month, day) {
		$('.jcountTimer .year div').text(this.year = year)
		$('.jcountTimer .month div').text(this.month = month)
		$('.jcountTimer .day div').text(this.day = day)
	}
	satDate(year, month, day) {
		if (this.year != year) {
			this.year = year
			run('.jcountTimer .year', year)
		}
		if (this.month != month) {
			this.month = month
			run('.jcountTimer .month', month)
		}
		if (this.day != day) {
			this.day = day
			run('.jcountTimer .day', day)
		}
	}
}

function run(select, val) {
	$(select + ' div').text(val)
	$(select).removeClass('run-animation');
	setTimeout(function () {
		$(select).addClass('run-animation');
	}, 1)
}

class MyDate {
	constructor(select, text, year, month, day) {
		this.select = select;
		$(select + ' p').text(text)
		$(select + ' .year div').text(this.year = year)
		$(select + ' .month div').text(this.month = month)
		$(select + ' .day div').text(this.day = day)
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

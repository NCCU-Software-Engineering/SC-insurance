class MyDate {
	constructor(select, text, year, month, day) {
		this.select = select;
		$(this.select + ' p').text(text)
		$(this.select + ' .year div').text(this.year = year)
		$(this.select + ' .month div').text(this.month = month)
		$(this.select + ' .day div').text(this.day = day)
	}
	satDate(val) {
		function run(select, val) {
			$(select + ' div').text(val)
			$(select).removeClass('run-animation');
			setTimeout(function () {
				$(select).addClass('run-animation');
			}, 1)
		}

		if (this.year != val[0]) {
			run(this.select + ' .year', this.year = Number(val[0]))
		}
		if (this.month != val[1]) {
			run(this.select + ' .month', this.month = Number(val[1]))
		}
		if (this.day != val[2]) {
			run(this.select + ' .day', this.day = Number(val[2]))
		}
	}
	setText(val) {
		$(this.select + ' p').text(val)
	}
}

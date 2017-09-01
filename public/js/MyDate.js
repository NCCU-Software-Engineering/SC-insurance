class MyDate {
	constructor(select, year, month, day, text) {
		this.select = select;
		$(select + ' .year div').text(this.year = year)
		$(select + ' .month div').text(this.month = month)
		$(select + ' .day div').text(this.day = day)
		if (text) {
			$(select + ' p').text(text)
		}
	}
	getDate() {
		function padLeft(str, len) {
			str = '' + str;
			if (str.length >= len) {
				return str;
			} else {
				return padLeft("0" + str, len);
			}
		}
		return this.year + '-' + padLeft(this.month, 2) + '-' + padLeft(this.day, 2)
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

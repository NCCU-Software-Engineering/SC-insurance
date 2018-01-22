let width = 0
let data = false

$(function () {

	$('.check').change(function () {
		$('#guarantee').toggle()
		if ($('.check:checked').val() == '0') {
			$('input[name=payment]').val($('input[name=payment]').val() / 2)
		}
		else {
			$('input[name=payment]').val($('input[name=payment]').val() * 2)
		}
	})

	$('#deploy').click(function () {
		swal({
			title: "確認送出嗎?",
			text: "送出後即無法修改",
			type: "info",
			confirmButtonColor: "#5cb85c",
			confirmButtonText: "送出",
		}).then(() => {
			widthCount()
			$.post("deploy", $('form').serialize(), (result) => {
				console.log('部屬成功')
				data = result
			})
		}).catch()
	})

})

function showSwal() {
	if (data) {
		swal({
			title: '智能保單部署成功',
			html: '保單編號：' + paddingLeft(data.number, 6) + '<br>保單名稱：' + data.alias + '<br>保單對應智能合約地址：<br>' + data.address,
			type: 'success',
			closeOnConfirm: false
		}).then(() => {
			window.location = '/buy?address=' + data.address
		})
	}
	else {
		setTimeout(showSwal, 5000)
	}
}

function widthCount() {
	width += 1;
	$('#progress').css('width', width + '%')
	if (width < 100) {
		setTimeout(widthCount, 500)
	}
	else {
		setTimeout(showSwal, 500)
	}
}

function paddingLeft(str, lenght) {
	if (str.length >= lenght)
		return 'nccuIS_' + str
	else
		return paddingLeft('0' + str, lenght);
}
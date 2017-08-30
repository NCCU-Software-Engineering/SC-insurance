$(function () {
	let width = 0
	let data
	$('#deploy').click(function () {
		swal({
			title: "確認送出嗎?",
			text: "送出後即無法修改",
			type: "info",
			confirmButtonColor: "#5cb85c",
			confirmButtonText: "送出",
			showCancelButton: true,
			closeOnConfirm: true
		}, () => {
			widthCount()
			$.post("deploy", $('form').serialize(), (result) => {
				data = result
			})
		});
	})
	function widthCount() {
		width += 5;
		$('#progress').css('width', width + '%')
		if (width < 100) {
			setTimeout(widthCount, 100)
		}
		else {
			setTimeout(showSwal, 500)
		}
	}
	function showSwal() {
		if (data.type) {
			swal({
				title: '部署成功',
				text: '保單編號：' + addZero(data.number) + '\n保單名稱：' + data.alias + '\n智能合約位址：\n' + data.address,
				type: 'success',
				closeOnConfirm: false
			}, () => { window.location = '/buy' })
		}
		else {
			swal({
				title: '部署失敗',
				text: data.inf,
				type: 'error',
			})
			width = 0
			$('#progress').css('width', '0%')
		}
	}
	function addZero(n) {
		return (n < 10000 ? (n < 1000 ? (n < 100 ? (n < 10 ? "0000" : "000") : "00") : "0") : "") + n
	}
})
$(function () {
	let width = 0
	let data
	$('#deploy').click(function () {
		widthCount()
		$.post("deploy", function (result) {
			data = result
		})
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
				text: '合約編號：'+data.number+'\n智能合約位址：\n' + data.address,
				type: 'success',
				closeOnConfirm: false
			}, () => { window.location = '/buy' })
		}
		else {
			swal({
				title: '部署失敗',
				type: 'error',
			})
		}
	}
})
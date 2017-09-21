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

	check();
	$('.check').click(function () {
		check();
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
				title: '智能保單部署成功',
				text: '保單編號：' + addZero(data.number) + '\n保單名稱：' + data.alias + '\n保單對應智能合約地址：\n' + data.address,
				type: 'success',
				closeOnConfirm: false
			}, () => { window.location = '/buy' })
		}
		else {
			swal({
				title: '智能保單部署失敗',
				text: data.inf,
				type: 'error',
			})
			width = 0
			$('#progress').css('width', '0%')
		}
	}
	function addZero(n) {
		return 'nccuin' + (n < 10000 ? (n < 1000 ? (n < 100 ? (n < 10 ? "0000" : "000") : "00") : "0") : "") + n
	}
	function check(){
		if ($('input[name="guarantee-type"]:checked').val() == 'n') {
			$('.guarantee').hide()
			$('input[name="isGuarantee"]').val(0)
			$('input[name="deathBeneficiary"]').val('')
			$('[name="deathBeneficiaryRelationship"]').val('')
			$('input[name="deathBeneficiaryIdentity"]').val('')
			$('input[name="deathBeneficiaryAddress"]').val('')
		}
		else if ($('input[name="guarantee-type"]:checked').val() == 'y') {
			$('.guarantee').show()
			$('input[name="isGuarantee"]').val(1)
			$('input[name="deathBeneficiary"]').val('')
			$('[name="deathBeneficiaryRelationship"]').val('直系血親：父子')
			$('input[name="deathBeneficiaryIdentity"]').val('A000000000')
			$('input[name="deathBeneficiaryAddress"]').val('0x68a874f2e8d20718af2ebb48dc10940ede50c080')
		}
	}
})
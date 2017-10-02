let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'
let deathBeneficiary = '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
let timeServer = '0x90353894b5edddcf49978b029f16bbed8e7e9355'

$(document).ready(function () {

    $(".manual").click(function () {
        console.log()
        window.location = '/test?address=' + $(this).attr('value') + '&alias=' + $(this).children('h3').text()
    })

    $("#y1").click(function () {
        let date = {
            alias: '保證型 付款前往生',
            name: '王小明',
            age: '28',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王小明',
            isGuarantee: '1',
            paymentDate: '1',
            deathBeneficiary: '王大明',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '合約直接結束'
            }
        })
    })

    $("#y2").click(function () {
        let date = {
            alias: '保證型 付款後、確認前往生',
            name: '王小明',
            age: '28',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王小明',
            isGuarantee: '1',
            paymentDate: '1',
            deathBeneficiary: '王大明',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '返還保費給被保人'
                })
            }
        })
    })

    $("#y3").click(function () {
        let date = {
            alias: '保證型 付款且卻認後、契約撤銷期內往生',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王小明',
            isGuarantee: '1',
            paymentDate: '1',
            deathBeneficiary: '王大明',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    $.get("auto_confirm?address=" + result.address, function (result3) {     
                        window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '因為是保證型合約 全部返還身故受益人'
                    })
                })
            }
        })
    })

    $("#y4").click(function () {
        let date = {
            alias: '保證型 給付年金未達保證金額',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王小明',
            isGuarantee: '1',
            paymentDate: '1',
            deathBeneficiary: '王大明',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    $.get("auto_confirm?address=" + result.address, function (result3) {     
                        window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '未達保證金額返還給身故受益人'
                    })
                })
            }
        })
    })

    $("#n1").click(function () {
        let date = {
            alias: '不保證型 付款前往生',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王大明',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '',
            deathBeneficiaryRelationship: '',
            deathBeneficiaryIdentity: '',
            deathBeneficiaryAddress: ''
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '合約直接結束'
                
            }
        })
    })

    $("#n2").click(function () {
        let date = {
            alias: '不保證型 付款後、確認前往生',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王大明',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '',
            deathBeneficiaryRelationship: '',
            deathBeneficiaryIdentity: '',
            deathBeneficiaryAddress: ''
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '返還保費給被保人'
                })
            }
        })
    })

    $("#n3").click(function () {
        let date = {
            alias: '不保證型 付款且卻認後、契約撤銷期內往生',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王大明',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '',
            deathBeneficiaryRelationship: '',
            deathBeneficiaryIdentity: '',
            deathBeneficiaryAddress: ''
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    $.get("auto_confirm?address=" + result.address, function (result3) {     
                        window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '合約直接結束 不返還保費' 
                    })
                })
            }
        })
    })

    $("#n4").click(function () {
        let date = {
            alias: '不保證型 給付年金未達保證金額',
            name: '王小明',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '王大明',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '',
            deathBeneficiaryRelationship: '',
            deathBeneficiaryIdentity: '',
            deathBeneficiaryAddress: ''
        }
        $.post("auto_deploy", date, (result) => {
            if (result.type) {
                $.get("auto_payeth?address=" + result.address, function (result2) {
                    $.get("auto_confirm?address=" + result.address, function (result3) {     
                        window.location = '/test?address=' + result.address + '&alias=' + result.alias + '&predict=預計結果：' + '因為未保證 直接結束合約'
                    })
                })
            }
        })
    })
})
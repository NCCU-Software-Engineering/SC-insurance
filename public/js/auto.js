let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'
let deathBeneficiary = '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
let timeServer = '0x90353894b5edddcf49978b029f16bbed8e7e9355'

$(document).ready(function () {

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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
            }
        })
    })

    $("#y3").click(function () {
        let date = {
            alias: '保證型 認後、契約撤銷期內往生',
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
            }
        })
    })

    $("#n3").click(function () {
        let date = {
            alias: '不保證型 確認後、契約撤銷期內往生',
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
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
        $.post("deploy", date, (result) => {
            if(result.type){
                window.location = '/test?address=' +　result.address
            }
        })
    })
})
$(document).ready(function () {
    $(".auto").click(function () {
        let date = {
            alias: '我的第一張保單',
            name: '賴晨禾',
            age: '28(27歲 7個月 0天)',
            company: '正大人壽',
            payment: '26',
            annuity: '1',
            beneficiary: '賴晨禾',
            'guarantee-type': 'y',
            isGuarantee: '0',
            paymentDate: '1',
            deathBeneficiary: '123213123',
            deathBeneficiaryRelationship: '直系血親：父子',
            deathBeneficiaryIdentity: 'AOOOOOOOOO',
            deathBeneficiaryAddress: '0x68a874f2e8d20718af2ebb48dc10940ede50c080'
        }
        console.log(date)
        $.post("deploy", date, (result) => {
            console.log(result)
        })
    })
})
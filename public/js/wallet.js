$(function () {

    //顯示教學
    if (typeof mist == 'undefined') {
        $('#guide').show()
    }
    //顯示付款
    else {
        $('#wallet').show()

        var myContract = new web3.eth.Contract(data.interface, '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe')
        let user = await mysql.getUserByID(req.session.user_ID)
        let policy = await mysql.getContractByAddress(req.query.address)
        web3 = new Web3(web3.currentProvider)

        $('#platform').html(mist.platform)

        web3.eth.getAccounts().then(accounts => {
            for (let i = 0; i < accounts.length; i++) {
                $('select').append(`<option>${accounts[i]}</option>`)
            }
        })

        $('select').change(function () {
            mist.sounds.bip()
            $('option').eq(0).attr('disabled', true)
            $('#account').html($(this).find(":selected").text())
            web3.eth.getBalance($('#account').html()).then(balance => $('#balance').html(balance))
        })

        mist.menu.clear()
        mist.menu.add('pay', {
            name: '付款',
            badge: '10eth',
            position: 1,
            selected: true,
        }, function () {
            console.log('我被按下了耶')
        })

        $('#buy').click({
            contract.buy({
                from: user.account,
                value: web3.toWei(policy.payment, "ether"),
                gas: 4444444
            })
        })
    }
})
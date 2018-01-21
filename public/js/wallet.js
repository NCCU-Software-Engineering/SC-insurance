$(function () {

    //顯示教學
    if (typeof mist == 'undefined') {
        $('#guide').show()
    }
    //顯示付款
    else {
        $('#wallet').show()

        web3 = new Web3(web3.currentProvider);

        $('#platform').html(mist.platform)

        mist.menu.add('tkrzU1', {
            name: 'My Meny Entry',
            badge: 50,
            position: 2,
            selected: true,
        }, function () {
            console.log('我被按下了耶')
        })

        $('#requestAccount').click(function () {
            mist.menu.update()
            mist.requestAccount(function (e, address) {
                if (e)
                    console.error(e)
                else
                    console.log('Added new account', address);
            })
        })

        $('#bip').click(function () {
            mist.sounds.bip()
        })
        $('#bloop').click(function () {
            mist.sounds.bloop()
        })
        $('#invite').click(function () {
            mist.sounds.invite()
        })
    }
})
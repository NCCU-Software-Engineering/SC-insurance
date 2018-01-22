$(function () {

    //顯示教學
    if (typeof mist == 'undefined') {
        $('#guide').show()
    }
    //顯示付款
    else {
        $('#wallet').show()

        if ($('#isGuarantee').html() == '不保證型保單') {
            $('#guarantee').hide()
        }

        let url = new URL(window.location.href)
        let address = url.searchParams.get('address')

        web3 = new Web3(web3.currentProvider)
        let myContract = new web3.eth.Contract(data.interface, address)

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
            update()
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

        $('#buy').click(function () {
            
            $('#send').show()

            myContract.methods.buy().send({
                from: $('select').find(":selected").text(),
                value: web3.utils.toWei('5', "ether"),
                gas: 4444444
            }).on('transactionHash', function(hash){
                $('#su').html('交易進行中')
                $('#hash').html(hash)
            }).on('confirmation', function(confirmationNumber, receipt){
                $('#confirmationNumber').html(confirmationNumber)
                console.log(confirmationNumber)
            }).on('receipt', function(receipt){
                $('#su').html('交易完成')
            })

            myContract.once('buyEvent', {
                fromBlock: 0
            }, function (error, event) {
                console.log(event)
                update()
            })
        })

        function update() {
            web3.eth.getBalance(
                $('#account').html()
            ).then(
                balance => $('#balance').html(web3.utils.fromWei(balance, 'ether'))
                )
            setState()
        }

        function setState() {
            myContract.methods.getState().call({
                from: $('select').find(":selected").text()
            }, function (error, result) {
                switch (result) {
                    case '0':
                        $("#state").html("等待付款")
                        break
                    case '1':
                        $("#state").html("付款成功，等待被保人確認中")
                        break
                    case '2':
                        $("#state").html("保單可撤銷期內")
                        break
                    case '3':
                        $("#state").html("保單正式生效")
                        break
                    case '4':
                        $("#state").html("保單給付結束")
                        break
                    case '5':
                        $("#state").html("保單已被撤銷");
                        break
                    case '6':
                        $("#state").html("保證型保險 給付死亡受益人")
                        break
                    default:
                        $("#state").html("未知狀態???")
                }
            })
        }
    }
})

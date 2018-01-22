$(function () {
    let address
    let web3 = new Web3();
    let contract = new web3.eth.Contract(data.interface)
    let datas = contract.methods.buy().encodeABI();
    let keyfile;
    $.post("/getContracts", function (data) {
        contract = data
        data.forEach(function (element) {
            if (!element.isBuy) {
                $('#contracts').append($('<option>', {
                    value: 1,
                    text: addZero(element.auto) + '-' + element.alias
                }))
            }
        }, this)
    })

    $("select").change(function () {
        let tar = $("#contracts option:selected").text()
        contract.forEach(function (element) {
            if (tar == (addZero(element.auto) + '-' + element.alias)) {
                $("#money").val(element.payment)
                address = element.address
            }
        })
    });

    $('#keyfile').change(function(event){
        var filelist = event.target.files;
        var file = filelist[0]
        var reader = new FileReader();
        reader.onload = function(event){
            keyfile = JSON.parse(event.target.result);
            console.log(keyfile);
        }
        reader.readAsText(file)
    })
    $('#payeth').click(function () {
        signTx(keyfile,$("#pwd").val(),address,$("#money").val())
        /*$.get('/payeth', {
            address: address,
            amount: $("#money").val()
        }, (result) => {
            swal({
                title: '付款成功',
                type: 'success',
            }).then(() => {
                window.location = '/'
            })
        })*/
    })
    function addZero(n) {
        return 'nccuin' + (n < 10000 ? (n < 1000 ? (n < 100 ? (n < 10 ? "0000" : "000") : "00") : "0") : "") + n
    }

    function signTx(keyfile,password,address,value){
        let account = web3.eth.accounts.decrypt(keyfile,password);
        console.log(account);
        let tx = account.signTransaction({
            to: address,
            value: web3.utils.toWei(value, 'ether'),
            gas: 2000000,
            gasPrice: '222222222222222',
            data: datas,
            nonce: 0,
            chainId: 1
        }, account.privateKey);
        console.log(tx.serialize());
    }
});
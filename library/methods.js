var web3 = require('./web3.js');
var data = require('./data.js');

var annuityContract = web3.eth.contract(data.interface);

function deploy(payment, annuity, isGuarantee, beneficiary, callback) {
    let date = new Date();
    annuityContract.new(
        '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        '0x68a874f2e8d20718af2ebb48dc10940ede50c080',
        [date.getFullYear(), date.getMonth() + 1, + date.getDate()],
        payment * 1000000000000000000,
        annuity * 1000000000000000000,
        1,
        (isGuarantee == 1),
        '正大人壽',
        beneficiary,
        '身故受益人',
        {
            from: '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4',
            data: data.bytecode,
            gas: 0x47E7C4
        }, function (e, contract) {
            if (typeof contract.address !== 'undefined') {
                callback(contract.address);
            }
            else {
            }
        })
}
function getContract(address) {
    return web3.eth.contract(data.interface).at(address)
}

function watch(testContract, type, email, newsletter) {
    let cont;
    let evevt;
    testContract.confirmEvent({ from: web3.coinbase }, { fromBlock: 1, toBlock: 'latest' });
    switch (type) {
        case "confirm":
            evevt = testContract.confirmEvent({ from: web3.coinbase }, { fromBlock: 1, toBlock: 'latest' });
            evevt.stopWatching();
            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();
                    if (result.args.inf == "confirm success") {
                    }
                    else if (result.args.inf == "not yet been confirmed") {
                    }
                }
            });
            break;
        case "revoke":
            evevt = testContract.revokeEvent({ from: web3.coinbase }, { fromBlock: 1, toBlock: 'latest' });
            evevt.stopWatching();
            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();
                    if (result.args.inf == "revoke the contract") {
                    }
                    else if (result.args.inf == "Can not be revoked") {
                    }
                }
            });
            break;
        case "pay":
            evevt = testContract.payEvent({ from: web3.coinbase }, { fromBlock: 1, toBlock: 'latest' });
            evevt.stopWatching();
            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();
                    if (result.args.inf == "pay annuity") {
                    }
                    else {
                    }
                }
            });
            break;
    }
}
function confirm(contract) {
    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 11)
    contract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
        from: web3.eth.coinbase,
        gas: 4444444
    })
}
function revoke(contract) {
    contract.revoke({
        from: web3.eth.coinbase,
        gas: 4444444
    })
}
function buy(contract, payment) {
    contract.buy({
        from: '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        value: web3.toWei(payment, "ether"),
        gas: 4444444
    })
}
function death(contract){
    contract.endAnnuity({
        from: web3.eth.coinbase,
        gas: 4444444
    })
}
function setTime(contract,date){
    contract.time(date.getFullYear(), date.getMonth() + 1, date.getDate(),{
        from: '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        gas: 4444444
    })
}
function companyPay(contract){
    contract.companyPay({
        from: '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        value: 1,
        gas: 4444444
    })
}

module.exports = {
    deploy: deploy,
    getContract: getContract,
    watch: watch,
    confirm: confirm,
    revoke: revoke,
    buy: buy,
    death: death,
    setTime: setTime,
    companyPay: companyPay
}

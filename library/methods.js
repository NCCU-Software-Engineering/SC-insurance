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

function watch(contract, callback) {
    let events = contract.allEvents({ fromBlock: 0, toBlock: 'latest' });
    events.get(function (error, logs) {
        callback(logs)
    })
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
async function death(contract,isGuarantee,money) {
    contract.endAnnuity({
        from: web3.eth.coinbase,
        gas: 4444444
    })
    if(isGuarantee == 1 && money > 0){
        contract.companyPay({
            from: '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4',
            value: web3.toWei(money),
            gas: 4444444
        })
    }
}
function setTime(contract, date) {
    contract.time(date.getFullYear(), date.getMonth() + 1, date.getDate(), {
        from: '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4',
        gas: 4444444
    })
}
function companyPay(contract) {
    contract.companyPay({
        from: '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4',
        value: web3.toWei(1),
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

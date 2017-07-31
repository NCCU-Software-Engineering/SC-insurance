var web3 = require('./web3.js');
var data = require('./data.js');

class AnnuityContract {

    constructor(adrress) {
        this.contract = web3.eth.contract(data.interface).at(adrress);
        this.number = web3.eth.blockNumber;
    }

    getCompanyAddress() {
        return this.contract.getCompanyAddress();
    }

    getInsurerAddress() {
        return this.contract.getInsurerAddress();
    }

    getStatus() {
        return this.contract.getStatus();
    }

    getNowTime() {
        return this.contract.getNowTime();
    }

    getRevocationPeriod() {
        return this.contract.getRevocationPeriod();
    }

    getPayTime() {
        return this.contract.getPayTime();
    }

    time(year, month, day) {
        this.contract.time(year, month, day, {
            from: eth.coinbase,
            gas: 3000000
        });
    }

    confirm(year, month, day) {
        this.contract.confirm(year, month, day, {
            from: eth.coinbase,
            gas: 3000000
        });
    }

    revoke() {
        this.contract.revoke({
            from: eth.coinbase,
            gas: 3000000
        });
    }
}

module.exports = TestContract;
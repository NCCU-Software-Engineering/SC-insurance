var web3 = require('./web3.js');
var eth = web3.eth;

var abiArray = [{"constant":true,"inputs":[],"name":"getTimeInterval","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPaymentDate","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCompanyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"payment","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"getGuaranteePeriod","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getBeneficiarie","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeathBeneficiary","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"endAnnuity","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNowTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"_state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeployTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getInsurerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"revoke","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"confirm","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPayment","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getRevocationPeriod","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"time","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"date","type":"uint256[3]"},{"name":"payment","type":"uint256"},{"name":"paymentDate","type":"uint256[3]"},{"name":"beneficiary","type":"string"},{"name":"deathBeneficiary","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"confirmEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"revokeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"payEvent","type":"event"}];

class TestContract {

    constructor(adrress) {
        this.contract = web3.eth.contract(abiArray).at(adrress);

        this.number = web3.eth.blockNumber;

        this.confirmEvent = this.contract.confirmEvent({
            from: web3.coinbase
        }, {
            fromBlock: this.number,
            toBlock: 'latest'
        });

        this.revokeEvent = this.contract.revokeEvent({
            from: web3.coinbase
        }, {
            fromBlock: this.number,
            toBlock: 'latest'
        });

        this.payEvent = this.contract.payEvent({
            from: web3.coinbase
        }, {
            fromBlock: this.number,
            toBlock: 'latest'
        });

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
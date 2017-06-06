//var fs = require('fs');
var path = require('path');
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var eth = web3.eth;

//var source = fs.readFileSync(path.resolve(__dirname,'..','sol','contract.sol'))
//var compiled = eth.compile.solidity(source.toString());
//var bytecode = compiled.code;
//var abi = compiled.info.abiDefinition;

var abiArray = [{"constant":true,"inputs":[],"name":"getVersion","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getPayTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCompanyAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getStatus","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"destroy","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"endAnnuity","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getNowTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getDeployTime","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getInsurerAddress","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"revoke","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"confirm","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getRevocationPeriod","outputs":[{"name":"","type":"uint256[3]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"year","type":"uint256"},{"name":"month","type":"uint256"},{"name":"day","type":"uint256"}],"name":"time","outputs":[],"payable":false,"type":"function"},{"inputs":[{"name":"y","type":"uint256"},{"name":"m","type":"uint256"},{"name":"d","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"confirmEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"revokeEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"inf","type":"string"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"payEvent","type":"event"}];

class TestContract {

    constructor(adrress) {
        this.contract = web3.eth.contract(abiArray).at(adrress);

        this.number = web3.eth.blockNumber;

        this.confirmEvent = this.contract.confirmEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        });

        this.revokeEvent = this.contract.revokeEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
            toBlock: 'latest'
        });

        this.payEvent = this.contract.payEvent({
            from: web3.coinbase
        }, {
            fromBlock: 0,
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
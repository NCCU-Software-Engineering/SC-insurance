var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var eth = web3.eth;

var abiArray = [{
    "constant": true,
    "inputs": [],
    "name": "getVersion",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getPayTime",
    "outputs": [{
        "name": "",
        "type": "uint256[3]"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getCompanyAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getStatus",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "version",
    "outputs": [{
        "name": "",
        "type": "string"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "destroy",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "year",
        "type": "uint256"
    }, {
        "name": "month",
        "type": "uint256"
    }, {
        "name": "day",
        "type": "uint256"
    }],
    "name": "confirme",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "endAnnuity",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getNowTime",
    "outputs": [{
        "name": "",
        "type": "uint256[3]"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getDeployTime",
    "outputs": [{
        "name": "",
        "type": "uint256[3]"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getInsurerAddress",
    "outputs": [{
        "name": "",
        "type": "address"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "revoke",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "getRevocationPeriod",
    "outputs": [{
        "name": "",
        "type": "uint256[3]"
    }],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [{
        "name": "year",
        "type": "uint256"
    }, {
        "name": "month",
        "type": "uint256"
    }, {
        "name": "day",
        "type": "uint256"
    }],
    "name": "time",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "constant": false,
    "inputs": [],
    "name": "finishPayment",
    "outputs": [],
    "payable": false,
    "type": "function"
}, {
    "inputs": [{
        "name": "y",
        "type": "uint256"
    }, {
        "name": "m",
        "type": "uint256"
    }, {
        "name": "d",
        "type": "uint256"
    }],
    "payable": false,
    "type": "constructor"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "PayEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "RevocationEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "RevocationMailEvent",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [],
    "name": "NotRevocationEvent",
    "type": "event"
}];
//var contractAddress = "0xf0f025a6c4a6343662c24912ae08b92c434fdf42";
//var contract = web3.eth.contract(abiArray).at(contractAddress);

function getCompanyAddress() {
    return contract.getCompanyAddress();
}

function getInsurerAddress() {
    return contract.getInsurerAddress();
}

function getStatus() {
    return contract.getStatus();
}

function getNowTime() {
    return contract.getNowTime();
}

function getRevocationPeriod() {
    return contract.getRevocationPeriod();
}

function getPayTime() {
    return contract.getPayTime();
}

function time(year, month, day) {
    contract.time(year, month, day, {
        from: eth.coinbase,
        gas: 3000000
    });
}

function confirme(year, month, day) {
    contract.confirme(year, month, day, {
        from: eth.coinbase,
        gas: 3000000
    });
}

function revoke() {
    contract.revoke({
        from: eth.coinbase,
        gas: 3000000
    });
}
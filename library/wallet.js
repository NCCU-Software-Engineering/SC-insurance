var web3 = require('../library/web3.js');
var contract = require('../library/contract.js');

let main = '0x5720c11041D8cD5a3E69F71e38475138D87FE71c';
let company = '0x1ad59A6D33002b819fe04Bb9c9d0333F990750a4';
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'
let testContract = new contract.getContract('0xb89c10bd0eb1841686b06b41a5075b317b5cf916');

testContract.payment({
    from: web3.eth.coinbase,
    value: 16706427965223897000,
    gas: 4444444
});

var a = [{'name': 'John', 'Age': 29},{'name': 'Mary', 'Age': 30}]
var b = a.clone();
b[0].name = 'J';
console.log(a, b)

eb3.eth.sendTransaction({ from: main, to: contract1, value: 100000000000000000000 })

console.log('main = ' + web3.eth.getBalance(main));
console.log('company = ' + web3.eth.getBalance(company));
console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
console.log('contract1 = ' + web3.eth.getBalance(contract1));

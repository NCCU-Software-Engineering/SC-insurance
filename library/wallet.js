var web3 = require('../library/web3.js');
var contract = require('../library/contract.js');

let main = '0x5720c11041D8cD5a3E69F71e38475138D87FE71c';
let company = '0x1ad59A6D33002b819fe04Bb9c9d0333F990750a4';
let nidhogg5 = '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6';
let personal = '0x4ed1098bBD3D742F311682782f823d66bCa0Be87';
let testContract = new contract.getContract('0x0fbe0cda386bc02a58ad5a279f60b99d3312144b');

testContract.buy({
    from: personal,
    value: 5000000000000000000,
    gas: 4444444
});


web3.eth.sendTransaction({ from: main, to: contract1, value: 100000000000000000000 })

console.log('main = ' + web3.eth.getBalance(main));
console.log('company = ' + web3.eth.getBalance(company));
console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
console.log('contract1 = ' + web3.eth.getBalance(contract1));

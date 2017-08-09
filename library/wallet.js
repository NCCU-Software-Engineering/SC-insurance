var web3 = require('../library/web3.js');
var contract = require('../library/contract.js');
let personal = '0x4ed1098bBD3D742F311682782f823d66bCa0Be87';

let testContract = new contract.getContract('0x6b0dfce68e13fc2bc9d9f1d404c1e97e8692983d');

testContract.buy({
    from: personal,
    value: 10000000000000000000,
    gas: 4444444
});


web3.eth.sendTransaction({ from: main, to: contract1, value: 100000000000000000000 })

console.log('main = ' + web3.eth.getBalance(main));
console.log('company = ' + web3.eth.getBalance(company));
console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
console.log('contract1 = ' + web3.eth.getBalance(contract1));

var web3 = require('./web3.js');
let main = '0xECeA71F82F583cE96b162Cc33fab42cdFF1f32ba';
let nidhogg5 = '0xa3F7522982C29C745D4D4a3e2D17c616a1fC4eF0';

//web3.eth.sendTransaction({ from: main, to: nidhogg5, value: 1 })

console.log('main = ' + web3.eth.getBalance(main));
console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
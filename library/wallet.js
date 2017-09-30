var web3 = require('../library/web3.js')
var contract = require('../library/contract.js')

let company = '0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'
let nidhogg5 = '0xA4716ae2279E6e18cF830Da2A72E60FB9d9B51C6'

let testContract = new contract.getContract('0x399cdecbfecf68927ff79107446e5c5c4a5594f3')

testContract.buy({
    from: nidhogg5,
    value: 7000000000000000000,
    gas: 4444444
})

testContract.companyPay({
    from: company,
    value: 500000000000000000,
    gas: 4444444
})

web3.eth.sendTransaction({ from: main, to: contract1, value: 100000000000000000000 })

console.log('main = ' + web3.eth.getBalance(main));
console.log('company = ' + web3.eth.getBalance(company));
console.log('nidhogg5 = ' + web3.eth.getBalance(nidhogg5));
console.log('contract1 = ' + web3.eth.getBalance(contract1));

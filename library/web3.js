var credentials = require('./credentials.js');
var Web3 = require('web3')

//testrpc
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))

//testnet
//var web3 = new Web3(new Web3.providers.HttpProvider(credentials.web3.HttpProvider))

module.exports = web3
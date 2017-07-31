var Web3 = require('web3')
var ip = require('./ip.js');
var web3 = new Web3(new Web3.providers.HttpProvider(ip.web3.HttpProvider))

module.exports = web3
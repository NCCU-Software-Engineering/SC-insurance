const Web3 = require('web3')
const setting = require('./setting.js')

var web3 = new Web3(new Web3.providers.HttpProvider(setting.web3_providers))

module.exports = web3
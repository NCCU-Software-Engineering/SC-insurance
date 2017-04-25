var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
var eth = web3.eth;

var abiArray = [{ "constant": true, "inputs": [], "name": "getCompanyAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStatus", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "FinishPayment", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "endAnnuity", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getInsurerAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "revoke", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "confirme", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "year", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "day", "type": "uint256" }], "name": "time", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "year", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "day", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "PayEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "RevocationEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "RevocationMailEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "NotRevocationEvent", "type": "event" }];
var contractAddress = "0xe03bda02efba0953e42072ff08d879a52e71f825";
var contract = web3.eth.contract(abiArray).at(contractAddress);

function getCompanyAddress() {
	return contract.getCompanyAddress();
}
function getInsurerAddress() {
	return contract.getInsurerAddress();
}
function getStatus() {
	return contract.getStatus();
}

function time(year, month, day) {
	contract.time(year, month, day, {
		from: eth.coinbase,
		gas: 3000000
	});
}

/*
function setPlayerBet(bet) {
	contract.setPlayerBet({
		from: eth.coinbase,
		value: web3.toWei(bet, 'ether'),
		gas: 3000000
	});
}
*/

$(function () {
	update();
});

function update() {
	console.log("update");
	$("#a");
	$("#b");
	$("#contract_status").html(
		"CompanyAddress : " + getCompanyAddress() + "<br>" +
		"InsurerAddress : " + getInsurerAddress() + "<br>" +
		"Status : " + getStatus()
	);
}

$("#reset").click(function () {
	console.log("reset");
	console.log(getCompanyAddress());
	console.log(getInsurerAddress());
	console.log(getStatus());
});

$("#reset").click(function () {
	console.log("reset");
	console.log(getCompanyAddress());
	console.log(getInsurerAddress());
	console.log(getStatus());
});

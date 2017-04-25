var web3 = require('./web3.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'leviathan5',
    database: 'smart'
});


var annuityContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "getCompanyAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStatus", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "time", "type": "uint256" }], "name": "time", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "FinishPayment", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "endAnnuity", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getInsurerAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "revoke", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "confirme", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "time", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [], "name": "PayEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "RevocationEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "RevocationMailEvent", "type": "event" }, { "anonymous": false, "inputs": [], "name": "NotRevocationEvent", "type": "event" }]);
class Contract {
    constructor() {
        this.time = Math.ceil(new Date().getTime() / 1000);
    }
    deploy() {
        this.annuity = annuityContract.new(
            this.time,
            {
                from: web3.eth.accounts[0],
                data: '0x606060405260006003556301e13380600e55341561001957fe5b604051602080610aaf833981016040528080519060200190919050505b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073e2320c12c71fb4a91d756d21507b33ee05f2f4c7600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060006008819055508060048190555080600581905550632598060060055401600781905550604060405190810160405280600b81526020017f756e636f6e6669726d65640000000000000000000000000000000000000000008152506009600060058110151561013857fe5b0160005b5090805190602001906101509291906102d8565b50604060405190810160405280600c81526020017f63616e42655265766f6b656400000000000000000000000000000000000000008152506009600160058110151561019857fe5b0160005b5090805190602001906101b09291906102d8565b50604060405190810160405280600981526020017f636f6e6669726d65640000000000000000000000000000000000000000000000815250600960026005811015156101f857fe5b0160005b5090805190602001906102109291906102d8565b50604060405190810160405280600381526020017f656e6400000000000000000000000000000000000000000000000000000000008152506009600360058110151561025857fe5b0160005b5090805190602001906102709291906102d8565b50604060405190810160405280600a81526020017f5265766f636174696f6e00000000000000000000000000000000000000000000815250600960046005811015156102b857fe5b0160005b5090805190602001906102d09291906102d8565b505b5061037d565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061031957805160ff1916838001178555610347565b82800160010185558215610347579182015b8281111561034657825182559160200191906001019061032b565b5b5090506103549190610358565b5090565b61037a91905b8082111561037657600081600090555060010161035e565b5090565b90565b6107238061038c6000396000f30060606040523615610097576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633944615c146100995780634e69d560146100eb5780635ced7d40146101845780637dc05140146101a457806383197ef0146101b6578063951093f9146101c8578063b16270fc146101da578063b6549f751461022c578063ba5c71be1461023e575bfe5b34156100a157fe5b6100a9610250565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100f357fe5b6100fb61027b565b604051808060200182810382528381815181526020019150805190602001908083836000831461014a575b80518252602083111561014a57602082019150602081019050602083039250610126565b505050905090810190601f1680156101765780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561018c57fe5b6101a26004808035906020019091905050610338565b005b34156101ac57fe5b6101b4610418565b005b34156101be57fe5b6101c661042d565b005b34156101d057fe5b6101d86104c1565b005b34156101e257fe5b6101ea610529565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561023457fe5b61023c610554565b005b341561024657fe5b61024e61062c565b005b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b6102836106e3565b600960085460058110151561029457fe5b0160005b508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561032d5780601f106103025761010080835404028352916020019161032d565b820191906000526020600020905b81548152906001019060200180831161031057829003601f168201915b505050505090505b90565b80600581905550600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561039c5760006000fd5b600160085414156103c2576006546005541015156103bd5760026008819055505b610414565b60026008541415610413576007546005541015156104125760026008819055507fb92b9f3b7da75c4d29af62e228d6a8212c2414d2d0d8f2e9062cf03d4c717b2660405180905060405180910390a15b5b5b5b50565b600e546007600082825401925050819055505b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156104be57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561051e5760006000fd5b60036008819055505b565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156105b15760006000fd5b60016008541415156105f2577f63ba734b2284e198028f5c4f5b1f13ec01a68754b572e13ed46e260c04b54fb260405180905060405180910390a160006000fd5b60046008819055507f6cef9787f18c5faa139827fe7c624f937d4432805a3667326ee810715a2fbe8d60405180905060405180910390a15b565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156106895760006000fd5b600060085414151561069b5760006000fd5b6001600881905550620d2f00600554016006819055507fee578fafe07eeabcdd18a1409e8daf0f64c95a2c3507a3ca99d30d4bf0263d3460405180905060405180910390a15b565b6020604051908101604052806000815250905600a165627a7a723058203f05d67109011f6c086f7e67ab2f3f525e7cc308c44746f5d398128cec4984960029',
                gas: '4700000'
            }, function (e, contract) {
                console.log(e, contract);
                if (typeof contract.address !== 'undefined') {
                    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);

                    //將contract加入mySQL
                    connection.connect();
                    connection.query('INSERT INTO smart.contract (ID, address) VALUES (\'nidhogg5\', \'' + contract.address + '\');', function (error) {
                        if (error) {
                            console.log('寫入資料失敗！');
                            throw error;
                        }
                    });
                    connection.end();
                }
            })
    }

}
module.exports = Contract
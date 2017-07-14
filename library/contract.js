var web3 = require('./web3.js');
var connection = require('./mysql.js');

var annuityContract = web3.eth.contract([{ "constant": true, "inputs": [], "name": "getPayTime", "outputs": [{ "name": "", "type": "uint256[3]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getCompanyAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getStatus", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "destroy", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "endAnnuity", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getNowTime", "outputs": [{ "name": "", "type": "uint256[3]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getDeployTime", "outputs": [{ "name": "", "type": "uint256[3]" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getInsurerAddress", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "revoke", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "year", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "day", "type": "uint256" }], "name": "confirm", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getRevocationPeriod", "outputs": [{ "name": "", "type": "uint256[3]" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "year", "type": "uint256" }, { "name": "month", "type": "uint256" }, { "name": "day", "type": "uint256" }], "name": "time", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "y", "type": "uint256" }, { "name": "m", "type": "uint256" }, { "name": "d", "type": "uint256" }, { "name": "money", "type": "uint256" }, { "name": "guaranteePeriod", "type": "uint256" }, { "name": "timeInterval", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "inf", "type": "string" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "confirmEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "inf", "type": "string" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "revokeEvent", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "name": "from", "type": "address" }, { "indexed": false, "name": "inf", "type": "string" }, { "indexed": false, "name": "timestamp", "type": "uint256" }], "name": "payEvent", "type": "event" }]);
class Contract {
    constructor() {

    }
    deploy(name, time, money, beneficiarie, callback) {
        this.annuity = annuityContract.new(
            new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), money, time, 1, beneficiarie, {
                from: web3.eth.accounts[0],
                data: '606060405234156200001057600080fd5b60405160c080620011bc833981016040528080519060200190919080519060200190919080519060200190919080519060200190919080519060200190919080519060200190919050505b336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555073e2320c12c71fb4a91d756d21507b33ee05f2f4c7600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555082600481905550816005819055508060068190555060006003819055506060604051908101604052808781526020018681526020018581525060079060036200013b92919062000394565b5060606040519081016040528087815260200186815260200185815250600a9060036200016a92919062000394565b506060604051908101604052806014880181526020018681526020018581525060109060036200019c92919062000394565b506040805190810160405280600b81526020017f756e636f6e6669726d656400000000000000000000000000000000000000000081525060136000600581101515620001e457fe5b0160005b509080519060200190620001fe929190620003d9565b506040805190810160405280600c81526020017f63616e42655265766f6b65640000000000000000000000000000000000000000815250601360016005811015156200024657fe5b0160005b50908051906020019062000260929190620003d9565b506040805190810160405280600881526020017f636f6e6669726d6400000000000000000000000000000000000000000000000081525060136002600581101515620002a857fe5b0160005b509080519060200190620002c2929190620003d9565b506040805190810160405280600381526020017f656e640000000000000000000000000000000000000000000000000000000000815250601360036005811015156200030a57fe5b0160005b50908051906020019062000324929190620003d9565b506040805190810160405280600a81526020017f5265766f636174696f6e00000000000000000000000000000000000000000000815250601360046005811015156200036c57fe5b0160005b50908051906020019062000386929190620003d9565b505b50505050505062000488565b8260038101928215620003c6579160200282015b82811115620003c5578251825591602001919060010190620003a8565b5b509050620003d5919062000460565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200041c57805160ff19168380011785556200044d565b828001600101855582156200044d579182015b828111156200044c5782518255916020019190600101906200042f565b5b5090506200045c919062000460565b5090565b6200048591905b808211156200048157600081600090555060010162000467565b5090565b90565b610d2480620004986000396000f300606060405236156100b8576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806323cd7613146100bd5780633944615c1461010f5780634e69d5601461016457806383197ef0146101f3578063951093f9146102085780639b819d381461021d578063a275ee1b1461026f578063b16270fc146102c1578063b6549f7514610316578063b9f394d91461032b578063e286364614610360578063e5fad55f146103b2575b600080fd5b34156100c857600080fd5b6100d06103e7565b6040518082600360200280838360005b838110156100fc5780820151818401525b6020810190506100e0565b5050505090500191505060405180910390f35b341561011a57600080fd5b610122610433565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561016f57600080fd5b61017761045d565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101b85780820151818401525b60208101905061019c565b50505050905090810190601f1680156101e55780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156101fe57600080fd5b61020661051a565b005b341561021357600080fd5b61021b6105ac565b005b341561022857600080fd5b6102306105b6565b6040518082600360200280838360005b8381101561025c5780820151818401525b602081019050610240565b5050505090500191505060405180910390f35b341561027a57600080fd5b610282610602565b6040518082600360200280838360005b838110156102ae5780820151818401525b602081019050610292565b5050505090500191505060405180910390f35b34156102cc57600080fd5b6102d461064e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561032157600080fd5b610329610679565b005b341561033657600080fd5b61035e60048080359060200190919080359060200190919080359060200190919050506107de565b005b341561036b57600080fd5b610373610973565b6040518082600360200280838360005b8381101561039f5780820151818401525b602081019050610383565b5050505090500191505060405180910390f35b34156103bd57600080fd5b6103e560048080359060200190919080359060200190919080359060200190919050506109bf565b005b6103ef610c57565b6010600380602002604051908101604052809291908260038015610428576020028201915b815481526020019060010190808311610414575b505050505090505b90565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b610465610c7f565b601360035460058110151561047657fe5b0160005b508054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561050f5780601f106104e45761010080835404028352916020019161050f565b820191906000526020600020905b8154815290600101906020018083116104f257829003601f168201915b505050505090505b90565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156105a9576000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff5b5b565b600380819055505b565b6105be610c57565b600a6003806020026040519081016040528092919082600380156105f7576020028201915b8154815260200190600101908083116105e3575b505050505090505b90565b61060a610c57565b6007600380602002604051908101604052809291908260038015610643576020028201915b81548152602001906001019080831161062f575b505050505090505b90565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690505b90565b600160035414151561072e577f1a9169fb4279bed88eb7ecb94af54097a367328b7d11a0c29912475f117bdb3f3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825260128152602001807f43616e206e6f74206265207265766f6b65640000000000000000000000000000815250602001935050505060405180910390a16107db565b60046003819055507f1a9169fb4279bed88eb7ecb94af54097a367328b7d11a0c29912475f117bdb3f3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825260138152602001807f7265766f6b652074686520636f6e747261637400000000000000000000000000815250602001935050505060405180910390a15b5b565b6000600354141515610893577f605670d1c219f30ccb3bb9e8578350f540fb5b6d8e01d55836f2d89a39e41e0b3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825260168152602001807f6e6f7420796574206265656e20636f6e6669726d656400000000000000000000815250602001935050505060405180910390a161096d565b600160038190555060606040519081016040528084815260200183815260200182815250600d9060036108c7929190610c93565b507f605670d1c219f30ccb3bb9e8578350f540fb5b6d8e01d55836f2d89a39e41e0b3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018381526020018281038252600f8152602001807f636f6e6669726d20737563636573730000000000000000000000000000000000815250602001935050505060405180910390a15b5b505050565b61097b610c57565b600d6003806020026040519081016040528092919082600380156109b4576020028201915b8154815260200190600101908083116109a0575b505050505090505b90565b60606040519081016040528084815260200183815260200182815250600a9060036109eb929190610c93565b5060016003541415610ac157600d6000600381101515610a0757fe5b0160005b5054831180610a4e5750600d6000600381101515610a2557fe5b0160005b505483148015610a4d5750600d6001600381101515610a4457fe5b0160005b505482115b5b80610aae5750600d6000600381101515610a6457fe5b0160005b505483148015610a8c5750600d6001600381101515610a8357fe5b0160005b505482145b8015610aad5750600d6002600381101515610aa357fe5b0160005b50548110155b5b15610abc5760026003819055505b610c51565b60026003541415610c505760106000600381101515610adc57fe5b0160005b5054831180610b23575060106000600381101515610afa57fe5b0160005b505483148015610b22575060106001600381101515610b1957fe5b0160005b505482115b5b80610b83575060106000600381101515610b3957fe5b0160005b505483148015610b61575060106001600381101515610b5857fe5b0160005b505482145b8015610b82575060106002600381101515610b7857fe5b0160005b50548110155b5b15610c4f5760065460106000600381101515610b9b57fe5b0160005b82825401925050819055507fd0b235785168022a3906f35111d580e40c268c8ef520502cbb3282a23afd59ac3342604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001806020018381526020018281038252600b8152602001807f70617920616e6e75697479000000000000000000000000000000000000000000815250602001935050505060405180910390a15b5b5b5b505050565b6060604051908101604052806003905b6000815260200190600190039081610c675790505090565b602060405190810160405280600081525090565b8260038101928215610cc2579160200282015b82811115610cc1578251825591602001919060010190610ca6565b5b509050610ccf9190610cd3565b5090565b610cf591905b80821115610cf1576000816000905550600101610cd9565b5090565b905600a165627a7a72305820c4e797512d6e568ebf07523f2a343c177bc40d24c4aa08ace0185983ec1ed3ab0029',
                gas: '4700000'
            },
            function (e, contract) {
                console.log(e, contract);
                if (typeof contract.address !== 'undefined') {
                    console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                    callback(contract.address);
                }
            })
    }

}

module.exports = Contract
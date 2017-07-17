var web3 = require('./web3.js');
var data = require('./data.js');
var send = require('./notice.js');

//var date = /* var of type uint256[3] here */ ;
//var payment = /* var of type uint256 here */ ;
//var paymentDate = /* var of type uint256[3] here */ ;
//var beneficiary = /* var of type string here */ ;
//var deathBeneficiary = /* var of type string here */ ;

var annuityContract = web3.eth.contract(data.interface);

function deploy(payment, paymentDate, beneficiary, deathBeneficiary, callback) {

    let date = [2017, 7, 17];
    let fullPaymentDate = [paymentDate, 7, 17];

    annuityContract.new(
        date,
        payment,
        fullPaymentDate,
        10,
        beneficiary,
        deathBeneficiary,
        {
            from: web3.eth.accounts[0],
            data: data.bytecode,
            gas: '4700000'
        }, function (e, contract) {
            console.log(e, contract);
            if (typeof contract.address !== 'undefined') {
                console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                callback(contract.address);
            }
        })
}

function getContract(adress) {
    return web3.eth.contract(data.interface).at(adress)
}

function watch(testContract, type) {

    var cont;
    var email = false;
    var newsletter = false;

    switch (type) {
        case "confirm":
            testContract.confirmEvent.watch(function (error, result) {
                if (!error) {
                    testContract.confirmEvent.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "confirm success") {

                        cont = "『根據本契約，於簽收保單後十日內得撤銷本契約，本公司將無息返還保險費。如於" + testContract.getRevocationPeriod() + "前，要執行本權利』"

                        if (email) {
                            send.email("nidhogg55555@gmail.com", "契約確認成功", cont);
                        }
                        if (newsletter) {
                            send.newsletter("0912254446", cont);
                        }
                    } else if (result.args.inf == "not yet been confirmed") {
                        console.log("111");
                    } else {
                        console.error("未知事件");
                    }
                }
            });

            break;

        case "revoke":
            testContract.revokeEvent.watch(function (error, result) {
                if (!error) {
                    testContract.revokeEvent.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "revoke the contract") {
                        cont = "『您與本公司簽訂之編號0000號保險契約已經撤銷成功，保費已退回您指定帳戶。日後若發生保險事故，本公司將不負保險責任』";

                        if (email) {
                            send.email("nidhogg55555@gmail.com", "契約撤銷成功", cont);
                        }
                        if (newsletter) {
                            send.newsletter("0912254446", cont);
                        }
                    } else if (result.args.inf == "Can not be revoked") {
                        console.log("222");
                    } else {
                        console.error("未知事件");
                    }
                }
            });
            break;
    }
}

module.exports = {
    deploy: deploy,
    getContract: getContract,
    watch: watch
}

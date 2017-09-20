var web3 = require('./web3.js');
var data = require('./data.js');
var send = require('./notice.js');
var credentials = require('./credentials.js');

var annuityContract = web3.eth.contract(data.interface);

function deploy(insuredAddress, deathBeneficiaryAddress, payment, annuity, paymentDate, isGuarantee, beneficiary, deathBeneficiary, callback) {

    let date = new Date();
    //web3.personal.unlockAccount(credentials.account.company, '', 300);

    annuityContract.new(
        insuredAddress,
        deathBeneficiaryAddress,
        [date.getFullYear(), date.getMonth() + 1, + date.getDate()],
        payment*1000000000000000000,
        annuity*1000000000000000000,
        paymentDate,
        isGuarantee,
        '正大人壽',
        beneficiary,
        deathBeneficiary,
        {
            from: credentials.account.company,
            data: data.bytecode,
            gas: 0x47E7C4
        }, function (e, contract) {
            console.log(e, contract);
            if (typeof contract.address !== 'undefined') {
                //console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
                callback(contract.address);
            }
            else {
                //console.log('contract.address undefined')
            }
        })
}

function getContract(adress) {
    return web3.eth.contract(data.interface).at(adress)
}

function watch(testContract, type, email, newsletter) {

    let cont;
    let evevt;

    testContract.confirmEvent({
        from: web3.coinbase
    }, {
            fromBlock: 1,
            toBlock: 'latest'
        });

    switch (type) {
        case "confirm":

            evevt = testContract.confirmEvent({
                from: web3.coinbase
            }, {
                    fromBlock: 1,
                    toBlock: 'latest'
                });

            evevt.stopWatching();

            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "confirm success") {

                        cont = "『根據本契約，於簽收保單後十日內得撤銷本契約，本公司將無息返還保險費。如於" + testContract.getRevocationPeriod() + "前，要執行本權利』"

                        if (email == 'true') {
                            send.email("nidhogg55555@gmail.com", "契約確認成功", cont);
                        }
                        if (newsletter == 'true') {
                            send.newsletter("0912254446", cont);
                        }
                    } else if (result.args.inf == "not yet been confirmed") {

                    } else {
                        console.error("未知事件");
                    }
                }
            });

            break;

        case "revoke":

            evevt = testContract.revokeEvent({
                from: web3.coinbase
            }, {
                    fromBlock: 1,
                    toBlock: 'latest'
                });

            evevt.stopWatching();

            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "revoke the contract") {
                        cont = "『您與本公司簽訂之編號0000號保險契約已經撤銷成功，保費已退回您指定帳戶。日後若發生保險事故，本公司將不負保險責任』";

                        if (email == 'true') {
                            send.email("nidhogg55555@gmail.com", "契約撤銷成功", cont);
                        }
                        if (newsletter == 'true') {
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

        case "pay":

            evevt = testContract.payEvent({
                from: web3.coinbase
            }, {
                    fromBlock: 1,
                    toBlock: 'latest'
                });

            evevt.stopWatching();

            evevt.watch(function (error, result) {
                if (!error) {
                    evevt.stopWatching();

                    console.log(result.args.inf);

                    if (result.args.inf == "pay annuity") {

                        cont = "『給付年金』"

                        if (email == 'true') {
                            console.log("發送電子郵件");
                            send.email("nidhogg55555@gmail.com", "給付年金", cont);
                        }
                        if (newsletter == 'true') {
                            console.log("發送簡訊");
                            send.newsletter("0912254446", cont);
                        }
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

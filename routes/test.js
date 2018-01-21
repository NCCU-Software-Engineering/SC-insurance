var express = require('express')

var router = express.Router()

//測試頁面
router.get('/test', async function (req, res, next) {
    res.render('test', { user_name: req.session.user_name, address: req.query.address, alias: req.query.alias, predict: req.query.predict })
})

//測試頁面v2
router.get('/testv2', async function (req, res, next) {
    let company_money = await web3.fromWei(web3.eth.getBalance('0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'), "ether").toFixed(3)
    let user_money = await web3.fromWei(web3.eth.getBalance('0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'), "ether").toFixed(3)
    let death_money = await web3.fromWei(web3.eth.getBalance('0x68a874f2e8d20718af2ebb48dc10940ede50c080'), "ether").toFixed(3)
    res.render('testv2', { user_name: req.session.user_name, company_money: company_money, user_money: user_money, death_money: death_money })
})

//測試頁面v3
router.get('/testv3', async function (req, res, next) {
    res.render('testv3', { user_name: req.session.user_name })
})

//自動環境
router.get('/auto', async function (req, res, next) {
    let contract = await mysql.getContract()
    let li = ''
    for (var i = 0; i < contract.length; i++) {
        li += format('<div class="col-md-3"><div class="manual green" value={}><h3>{}</h3><p>保費{}以太幣</p><p>{}</p></div></div>', contract[i].address, contract[i].alias, contract[i].payment, contract[i].isGuarantee ? '保證型智能保單' : '不保證型智能保單')
    }
    res.render('auto', { user_name: req.session.user_name, li: li })
})

//測試頁面v3執行畫面
router.get('/test-go', async function (req, res, next) {
    res.render('test-go', { user_name: req.session.user_name })
})

router.get('/verify', function (req, res, next) {
    res.render('verify', { user_name: req.session.user_name })
})

//部署合約
router.post('/deploy', async function (req, res, next) {
    console.log('deploy')
    console.log(req.body)
    if (req.body.payment != undefined && req.body.paymentDate != undefined) {
        let user = await mysql.getUserByID(req.session.user_ID)
        contract.deploy(user.account, req.body.deathBeneficiaryAddress, req.body.payment, req.body.annuity, req.body.paymentDate, req.body.isGuarantee, req.body.beneficiary, req.body.deathBeneficiary, async (address) => {
            await mysql.addContract(req.session.user_ID, address, req.body.alias, req.body.payment, req.body.paymentDate, req.body.isGuarantee, req.body.deathBeneficiary, req.body.deathBeneficiaryRelationship, req.body.deathBeneficiaryIdentity)
            let number = (await mysql.getContractByAddress(address)).auto
            res.json({ type: true, address: address, number: number, alias: req.body.alias })
        })
    }
    else {
        console.log('invalid')
        res.json({ type: false, inf: '不能留空' })
    }
})

//付款
router.get('/payeth', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.session.user_ID)
    let policy = await mysql.getContractByAddress(req.query.address)
    testContract.buy({
        from: user.account,
        value: web3.toWei(policy.payment, "ether"),
        gas: 4444444
    })
    mysql.buyContract(req.query.address)
    notice.confirmEmail(user.email, policy, req.query.address, req.session.user_ID)
    res.send('done')
})

//確認合約
router.get('/confirm', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)
    let policy = await mysql.getContractByAddress(req.query.address)
    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 11)
    testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
        from: web3.eth.coinbase,
        gas: 4444444
    })
    notice.revocationPeriodEmail(user.email, policy, myDate, req.query.address, req.query.id)
    res.redirect('/')
})

//撤銷合約
router.get('/revoke', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)

    testContract.revoke({
        from: web3.eth.coinbase,
        gas: 4444444
    })

    res.redirect('/')
})


//取得合約料表
router.post('/getContracts', async function (req, res, next) {
    let contract = await mysql.getContractByID(req.session.user_ID)
    res.send(contract)
})

//自動部署
router.post('/auto_deploy', async function (req, res, next) {
    contract.deploy('0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6', req.body.deathBeneficiaryAddress, req.body.payment, req.body.annuity, req.body.paymentDate, req.body.isGuarantee, req.body.beneficiary, req.body.deathBeneficiary, async (address) => {
        res.json({ type: true, address: address, alias: '測試情境：' + req.body.alias })
    })
})

//自動付款
router.get('/auto_payeth', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.session.user_ID)
    testContract.buy({
        from: '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        value: web3.toWei(req.query.ether, "ether"),
        gas: 4444444
    })
    res.send('done')
})

//自動確認合約
router.get('/auto_confirm', async function (req, res, next) {
    let testContract = new contract.getContract(req.query.address)
    let user = await mysql.getUserByID(req.query.id)
    let myDate = new Date()
    myDate.setDate(myDate.getDate() + 11)
    testContract.confirm(myDate.getFullYear(), myDate.getMonth() + 1, myDate.getDate(), {
        from: '0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6',
        gas: 4444444
    })
    res.redirect('/')
})
//取得帳戶餘額
router.post('/getBalance', async function (req, res, next) {
    let company_money = await web3.fromWei(web3.eth.getBalance('0x1ad59a6d33002b819fe04bb9c9d0333f990750a4'), "ether").toFixed(3)
    let user_money = await web3.fromWei(web3.eth.getBalance('0xa4716ae2279e6e18cf830da2a72e60fb9d9b51c6'), "ether").toFixed(3)
    let death_money = await web3.fromWei(web3.eth.getBalance('0x68a874f2e8d20718af2ebb48dc10940ede50c080'), "ether").toFixed(3)
    res.json({ company_money: company_money, user_money: user_money, death_money: death_money })
})
//取得v2結果
router.post('/getResult', async function (req, res, next) {
    const methods = require('../library/methods.js')
    let myContract
    let alias = req.body.alias
    let name = req.body.name
    let age = req.body.age
    let payment = req.body.payment
    let annuity = req.body.annuity
    let beneficiary = req.body.beneficiary
    let isGuarantee = req.body.isGuarantee
    let isRevokation = req.body.isRevokation
    let death_time = req.body.death_time
    let death_age = req.body.death_age
    await methods.deploy(payment, annuity, isGuarantee, beneficiary, async (address) => {
        myContract = await methods.getContract(address)
        if (isRevokation == '1') {
            await methods.buy(myContract, payment)
            await methods.confirm(myContract)
            await methods.revoke(myContract)
            await methods.watch(myContract, (logs) => {
                res.send(logs)
            })
        }
        else if (death_time == 'before-buy') {
            await methods.death(myContract)
            await methods.watch(myContract, (logs) => {
                res.send(logs)
            })
        }
        else if (death_time == 'before-confirm') {
            await methods.buy(myContract, payment)
            await methods.death(myContract)
            await methods.watch(myContract, (logs) => {
                res.send(logs)
            })
        }
        else {
            await methods.buy(myContract, payment)
            await methods.confirm(myContract)
            let myDate = new Date()
            for (let i = age; i < death_age; i++) {
                await myDate.setFullYear(myDate.getFullYear() + 1)
                await methods.setTime(myContract, myDate)
                await methods.companyPay(myContract)
                if (i == death_age - 1) {
                    await methods.death(myContract, isGuarantee, (payment - annuity * (death_age - age)) > 0 ? (payment - annuity * (death_age - age)) : 0)
                    await methods.watch(myContract, (logs) => {
                        res.send(logs)
                    })
                }
            }
        }
    })
})

module.exports = router
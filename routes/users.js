var express = require('express')
var router = express.Router()

var web3 = require('../library/web3.js')
var mysql = require('../library/mysql.js')

//登入頁面
router.get('/sign_in', function (req, res, next) {
    res.render('sign_in', { user_name: req.session.user_name })
})
//註冊頁面
router.get('/sign_up', function (req, res, next) {
    res.render('sign_up', { user_name: req.session.user_name })
})
//登出頁面
router.all('/sign_out', function (req, res, next) {
    req.session.destroy()
    res.redirect('/')
})

//登入post
router.post('/sign_in', async function (req, res, next) {
    console.log('sign_in-post')
    console.log(req.body)
    let result = await mysql.sing_in(req.body.ID, req.body.password)
    if (result.type === 1) {
        req.session.user_ID = result.ID
        req.session.user_name = result.name
    }
    res.json(result)
})
//註冊post
router.post('/sign_up', async function (req, res, next) {
    console.log('sign_up-post')
    console.log(req.body)
    let user = req.body
    let result = await mysql.sing_up(user.ID, user.password, user.name, user.identity, user.email, user.phone, user.birthday, user.address, user.account)
    if (result.type) {
        req.session.user_ID = user.ID
        req.session.user_name = user.name
    }
    res.json(result)
})

//產生驗證碼
router.post('/createcode', function (req, res, next) {
    let randomString = crypto.randomBytes(32).toString('hex').substr(0, 8);
    mysql.setVerification(req.session.user_ID, randomString)
    let cont = "您的驗證碼為: " + randomString
    send.newsletter("0912254446", cont)

    res.send('done')
})

//驗證驗證碼
router.post('/verify', function (req, res, next) {
    mysql.getVerification(req.session.user_ID, (result) => {
        if (req.body.code == result[0].verification) {
            mysql.setVerification(req.session.user_ID, 'true')
            res.send('success')
        }
        else {
            res.send('error')
        }
    })
})

module.exports = router

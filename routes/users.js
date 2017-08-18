var express = require('express')
var router = express.Router()

var web3 = require('../library/web3.js')
var mysql = require('../library/mysql.js')

//render
router.get('/sign_in', function (req, res, next) {
    res.render('sign_in', { user_name: req.session.user_name })
});
router.get('/sign_up', function (req, res, next) {
    res.render('sign_up', { user_name: req.session.user_name })
});

router.all('/sign_out', function (req, res, next) {
    req.session.destroy()
    res.redirect('/')
});

//post
router.post('/sign_in', async function (req, res, next) {
    console.log('sign_in-post')
    console.log(req.body)
    let result = await mysql.sing_in(req.body.ID, req.body.password)
    if (result.type === 1) {
        req.session.user_ID = result.ID
        req.session.user_name = result.name
    }
    res.json(result)
});

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
});

module.exports = router;

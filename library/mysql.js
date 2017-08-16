var mysql = require('mysql');
var web3 = require('../library/web3.js');
var credentials = require('./credentials.js');

var connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
});

async function sing_in(ID, password) {
    try {
        let user = await getUserByID(ID)

        if (!user) {
            return { type: 0, inf: '查無此帳號' }
        }
        else if (user.password != password) {
            return { type: 2, inf: '密碼錯誤' }
        }
        else if (user.password == password) {
            return { type: 1, inf: '登錄成功', ID: user.ID, name: user.name }
        }
    } catch (err) {
        console.error(err);
    }
}

async function sing_up(ID, password, name, identity, email, phone, birthday, address, account) {
    try {
        let user = await getUserByID(ID)
        let isHosted
        if (!user) {
            if (account) {
                isHosted = false
            } else {
                isHosted = true
                account = '0x1234'//web3.personal.newAccount("1234")}
            }
            let result = await addUser(ID, password, name, identity, email, phone, birthday, address, account, isHosted)
            return { type: true, inf: '註冊成功', account: account }
        }
        else {
            return { type: false, inf: '此帳號已有人註冊過' }
        }
    } catch (err) {
        console.error(err);
    }
}

function getUserByID(ID) {
    let cmd = "SELECT * FROM user WHERE ID = ?";
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        });
    })
}

function addUser(ID, password, name, identity, email, phone, birthday, address, account, isHosted) {
    let cmd = "INSERT INTO user (ID, password, name, identity, email, phone, birthday, address, account, isHosted) VALUES ?"
    let value = [
        [ID, password, name, identity, email, phone, birthday, address, account, isHosted]
    ];
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [value], (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

function getAccountCount() {
    let cmd = "SELECT count(account) FROM user";
    connection.query(cmd, (err, result) => {
        if (!err) {
            return result;
        }
        else {
            console.log(err);
        }
    })
}
function addContract(ID, address, callback) {
    let cmd = "INSERT INTO contract (ID, address) VALUES ?";
    let value = [
        [ID, address]
    ];
    connection.query(cmd, [value], (err, result) => {
        if (err) {
            console.error(err);
        }
    });
}

function getContract(ID, callback) {
    let cmd = "SELECT * FROM contract WHERE ID = ?";
    connection.query(cmd, [ID], (err, result) => {
        if (!err) {
            callback(result);
        } else {
            console.log(err);
        }
    });
}

module.exports = {
    connection: connection,
    sing_in: sing_in,
    sing_up: sing_up,
    getUserByID: getUserByID,
    addContract: addContract,
    getContract: getContract
}
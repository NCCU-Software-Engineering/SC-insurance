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
    let user = await getUserByID(ID)
    console.log('2 : ' + user[0].name);

    if (!user) {
        return { type: 0, inf: '查無此帳號' }
    }
    else if (user[0].password != password) {
        return { type: 2, inf: '密碼錯誤' }
    }
    else if (user[0].password == password) {
        return { type: 1, inf: '登錄成功' }
    }
}

function sing_up(ID, password, name, identity, email, phone, birthday, address, callback) {
    getUserByID(ID, (result) => {
        if (result == "") {
            addUser(ID, password, name, identity, email, phone, birthday, address, (isSuccess, result, account) => {
                callback(isSuccess, isSuccess ? '註冊成功\n' + account : '註冊失敗');
            })
        } else {
            callback(false, "此帳號已有人註冊過");
        }
    });
}

function getUserByID(ID) {
    let cmd = "SELECT * FROM user WHERE ID = ?";
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
            if (!err) {
                console.log('1 : ' + result[0].name);
                resolve(result)
            } else {
                reject(err)
            }
        });
    })
}

function addUser(ID, password, name, identity, email, phone, birthday, address, callback) {
    let account = web3.personal.newAccount("1234");
    console.log("create a new account : " + account);

    let cmd = "INSERT INTO user (ID, password, name, identity, email, phone, birthday, address, account) VALUES ?";
    let value = [
        [ID, password, name, identity, email, phone, birthday, address, account]
    ];
    connection.query(cmd, [value], (err, result) => {
        if (!err) {
            callback(true, result, account);
        } else {
            console.log(err);
            callback(false, result, account);
        }
    });
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
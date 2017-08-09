var mysql = require('mysql');
var web3 = require('../library/web3.js');
var credentials = require('./credentials.js');

var connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
});

function sing_in(ID, password, callback) {
    getUserByID(ID, (result) => {
        //找不到使用者
        if (result == "") {
            callback(false, "查無此帳號");
        } else {
            if (result[0].password == password) {
                callback(true, "登錄成功", result[0].name);
            } else {
                callback(false, "密碼無效");
            }
        }
    });
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
}

function getUserByID(ID, callback) {
    let cmd = "SELECT * FROM user WHERE ID = ?";
    connection.query(cmd, [ID], (err, result) => {
        if (!err) {
            callback(result);
        } else {
            console.log(err);
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
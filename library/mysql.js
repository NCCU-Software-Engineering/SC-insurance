var mysql = require('mysql');
var credentials = require('./credentials.js');

var connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
});

function sing_in(name, password, callback) {
    getUser(name, (result) => {
        //找不到使用者
        if (result == "") {
            callback(false, "查無此帳號");
        } else {
            if (result[0].password == password) {
                callback(true, "登錄成功");
            } else {
                callback(false, "密碼無效");
            }
        }
    });
}

function sing_up(name, password, email, callback) {
    getUser(name, (result) => {
        if (result == "") {
            addUser(name, password, email, (isSuccess, result) => {
                callback(isSuccess, isSuccess ? '註冊成功' : '註冊失敗');
            })
        } else {
            callback(false, "此帳號已有人註冊過");
        }
    });

    function addUser(name, password, email, callback) {
        let cmd = "INSERT INTO user (name, email, password) VALUES ?";
        let value = [
            [name, email, password]
        ];
        connection.query(cmd, [value], (err, result) => {
            if (!err) {
                callback(true, result);
            } else {
                console.log(err);
                callback(false, result);
            }
        });
    }
}

function getUser(name, callback) {
    var cmd = "SELECT * FROM user WHERE name = ?";
    connection.query(cmd, [name], (err, result) => {
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
}
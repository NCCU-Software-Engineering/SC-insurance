var mysql = require('mysql');
var credentials = require('./credentials.js');

var connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
});

function sing_in(ID, password, callback) {
    getUser(ID, (result) => {
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

function sing_up(ID, password, name, email, callback) {
    getUser(ID, (result) => {
        if (result == "") {
            addUser(ID, password, name, email, (isSuccess, result) => {
                callback(isSuccess, isSuccess ? '註冊成功' : '註冊失敗');
            })
        } else {
            callback(false, "此帳號已有人註冊過");
        }
    });

    function addUser(ID, password, name, email, callback) {
        let cmd = "INSERT INTO user (ID, password, name, email) VALUES ?";
        let value = [
            [ID, password, name, email]
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

function getUser(ID, callback) {
    var cmd = "SELECT * FROM user WHERE ID = ?";
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
}
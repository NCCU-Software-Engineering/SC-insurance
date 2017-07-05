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

function sing_up(name, email, password, callback) {
    getUser(name, (result) => {
        if (result == "") {
            addUser(name, email, password, (isSuccess, result) => {
                callback(isSuccess, isSuccess ? '註冊成功' : '註冊失敗');
            })
        } else {
            callback(false, "此帳號已有人註冊過");
        }
    });

    function addUser(name, email, password, callback) {
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

function aaa() {
    connection.query('SELECT address FROM smart.contract where id=\'' + req.cookies.ID + '\';', function (error, rows, fields) {
        if (error) {
            console.log('寫入讀取失敗！');
            throw error;
        }
        for (var i = 0; i < rows.length; i++) {
            li += "<li><input name=\"smart\" type=\"radio\" value=\"" + rows[i].address + "\">智能合約" + (i + 1) + ":" + rows[i].address + "</li>"
        }
        res.render('test', {
            radio: li
        });
    });
}

module.exports = {
    connection: connection,
    sing_in: sing_in,
    sing_up: sing_up,
}
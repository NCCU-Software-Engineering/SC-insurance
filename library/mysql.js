var mysql = require('mysql');
var web3 = require('../library/web3.js');
var credentials = require('./credentials.js');

var connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
});

function connect() {
    connection.connect((err) => {
        if (err) {
            console.log('error when connecting to db:', err)
            // 2秒後重新連線
            //setTimeout(handleDisconnect, 2000)
        }
        else {
            console.log('connecting to db')
        }
    })
}

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

async function sing_up(ID, password, name, identity, email, phone, birthday, address, account, deathaccount) {
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
            let result = await addUser(ID, password, name, identity, email, phone, birthday, address, account, isHosted, deathaccount)
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
async function addContract(ID, address, number, callback) {
    let cmd = "INSERT INTO contract (ID, address, number) VALUES ?";
    let value = [
        [ID, address, number]
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

function getContractCount(ID) {
    let cmd = "SELECT count(auto) FROM contract where ID = ?";
    return new Promise(function (resolve, reject) {
        connection.query(cmd,[ID], (err, result) => {
            if (!err) {
                resolve(result[0]['count(auto)'])
            } else {
                reject(err)
            }
        })
    })
}
function getAccountByID(ID, callback) {
    let cmd = "SELECT account FROM user WHERE ID = ?";
    connection.query(cmd, [ID], (err, result) => {
        if (!err) {
            callback(result);
        } else {
            console.log(err);
        }
    });
}

function setVerification(ID, code) {
    let cmd = "UPDATE user SET verification = '" + code + "' WHERE ID = '" + ID + "' ";
    connection.query(cmd);
}

function getVerification(ID, callback) {
    let cmd = "SELECT verification FROM user WHERE ID = ?";
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
    connect, connect,
    sing_in: sing_in,
    sing_up: sing_up,
    getUserByID: getUserByID,
    addContract: addContract,
    getContract: getContract,
    getContractCount: getContractCount,
    getAccountByID: getAccountByID,
    setVerification: setVerification,
    getVerification: getVerification
}
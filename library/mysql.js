const mysql = require('mysql')
const web3 = require('./web3')
const credentials = require('./credentials')

const connection = mysql.createConnection({
    host: credentials.mysql.host,
    user: credentials.mysql.user,
    password: credentials.mysql.password,
    database: 'smart'
})

function connect() {
    connection.connect((err) => {
        if (err) {
            console.log('error when connecting to db:', err)
            // 10秒後重新連線
            setTimeout(connect, 10000)
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
            return { type: 1, inf: '登入成功', ID: user.ID, name: user.name }
        }
    } catch (err) {
        console.error(err)
    }
}

async function sing_up(ID, password, name, identity, email, phone, birthday, address, account) {
    try {
        let user = await getUserByID(ID)
        if (!user) {
            let result = await addUser(ID, password, name, identity, email, phone, birthday, address, account)
            return { type: true, inf: '註冊成功' }
        }
        else {
            return { type: false, inf: '此帳號已有人註冊過' }
        }
    } catch (err) {
        console.error(err)
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
        })
    })
}

function addUser(ID, password, name, identity, email, phone, birthday, address, account, isHosted) {
    let cmd = "INSERT INTO user (ID, password, name, identity, email, phone, birthday, address, account) VALUES ?"
    let value = [
        [ID, password, name, identity, email, phone, birthday, address, account]
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
            return result
        }
        else {
            console.log(err)
        }
    })
}

async function addContract(ID, address, alias, payment, paymentDate, isGuarantee, deathBeneficiary, deathBeneficiaryRelationship, deathBeneficiaryIdentity) {
    let cmd = "INSERT INTO contract (ID, address, alias, payment, paymentDate, isGuarantee, deathBeneficiary, deathBeneficiaryRelationship, deathBeneficiaryIdentity) VALUES ?";
    let value = [
        [ID, address, alias, payment, paymentDate, isGuarantee, deathBeneficiary, deathBeneficiaryRelationship, deathBeneficiaryIdentity]
    ]
    connection.query(cmd, [value], (err, result) => {
        if (err) {
            console.error(err)
        }
    })
}

function getContractByID(ID) {
    let cmd = "SELECT * FROM contract WHERE ID = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

function getContract() {
    let cmd = "SELECT * FROM contract"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, (err, result) => {
            if (!err) {
                resolve(result)
            } else {
                reject(err)
            }
        })
    })
}

function getContractByAddress(address) {
    let cmd = "SELECT * FROM contract WHERE address = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [address], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        });
    })
}

function buyContract(address) {
    let cmd = "UPDATE contract SET isBuy = 1 WHERE address = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [address], (err, result) => {
            if (!err) {
                resolve(result[0])
            } else {
                reject(err)
            }
        });
    })
}

function getContractCount(ID) {
    let cmd = "SELECT auto FROM contract where ID = ?"
    return new Promise(function (resolve, reject) {
        connection.query(cmd, [ID], (err, result) => {
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
            callback(result)
        } else {
            console.log(err)
        }
    })
}

function setVerification(ID, code) {
    let cmd = "UPDATE user SET verification = '" + code + "' WHERE ID = '" + ID + "' "
    connection.query(cmd)
}

function getVerification(ID, callback) {
    let cmd = "SELECT verification FROM user WHERE ID = ?"
    connection.query(cmd, [ID], (err, result) => {
        if (!err) {
            callback(result)
        } else {
            console.log(err)
        }
    })
}

module.exports = {
    connection: connection,
    connect, connect,

    sing_in: sing_in,
    sing_up: sing_up,

    getUserByID: getUserByID,

    addContract: addContract,
    getContractByID: getContractByID,
    getContract: getContract,
    getContractByAddress: getContractByAddress,
    getContractCount: getContractCount,
    getAccountByID: getAccountByID,

    setVerification: setVerification,
    getVerification: getVerification,

    buyContract: buyContract
}
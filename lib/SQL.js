var mysql = require('mysql');
var credentials = require("./credentials.js")

var connection = mysql.createConnection({
    host: 'localhost',
    user: credentials.SQL.user,
    password: credentials.SQL.password,
    database: 'smart'
});

module.exports = connection;
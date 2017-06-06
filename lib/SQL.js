var mysql = require('mysql');
var credentials = require("./credentials.js")

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: credentials.SQL.password,
    database: 'smart'
});

module.exports = connection;
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'leviathan5',
    database: 'smart'
});

module.exports = connection;
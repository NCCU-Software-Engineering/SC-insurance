var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var credentials = require('./lib/credentials.js')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

//view engine setup
var handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 50000);

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'imgs', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser(credentials.cookieSecret));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404);
    res.render('404');
});

//error handler
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '\n' +
        'press Ctrl-C to terminate');
});

module.exports = app;
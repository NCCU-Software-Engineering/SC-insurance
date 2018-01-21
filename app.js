const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')

const credentials = require('./library/credentials')

const index = require('./routes/index')
const users = require('./routes/users')
const test = require('./routes/test')

const app = express()

//view engine setup
const handlebars = require('express-handlebars').create({
    defaultLayout: 'main',
    helpers: {
        section: function (name, options) {
            if (!this._sections) this._sections = {}
             this._sections[name] = options.fn(this)
            return null
        }
    }
})
app.engine('handlebars', handlebars.engine)
app.set('view engine', 'handlebars')

//uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'imgs', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

//cookie session
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
  secret: 'B54C9B842DD16',
  cookie: { maxAge: 60 * 100000 }
}))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'bower_components', 'tether', 'dist')))
app.use(express.static(path.join(__dirname, 'bower_components', 'bootstrap', 'dist')))
app.use(express.static(path.join(__dirname, 'bower_components', 'jquery', 'dist')))
app.use(express.static(path.join(__dirname, 'bower_components', 'jquery-ui')))
app.use(express.static(path.join(__dirname, 'bower_components', 'sweetalert2', 'dist')))

app.use('/', index)
app.use('/', test)
app.use('/users', users)

//catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404)
    res.render('404')
})

//error handler
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500)
    res.render('500')
})

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '\n' +
        'press Ctrl-C to terminate')
})

module.exports = app
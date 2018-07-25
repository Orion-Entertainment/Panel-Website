const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const config = require('../core/config.json');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, '../public')));
const hbs = require('hbs');
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper('formatNumber', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});
hbs.registerHelper("math", function(lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
        
    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

app.enable('trust proxy');
//app.use(favicon(path.join(__dirname,'../public', '/images/Favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    next();
});

const index = require('../routes/index'); app.use('/', index);

const auth = require('../routes/auth'); app.use('/auth', auth);
const steam = require('steam-login');
app.use(steam.middleware({
    realm: 'https://orion-entertainment.net/auth', 
    verify: 'https://orion-entertainment.net/auth/verify',
    apiKey: config.SteamAPI}
));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    return res.render('error', { error: err, message: err.message });
});

module.exports = app;
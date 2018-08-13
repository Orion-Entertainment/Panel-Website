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
});/*
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
    switch (operator) {
        case '==', '===', 'is':
            if (v1 == v2) return options.fn(this); else return options.inverse(this);
        case '!=', '!==':
            if (v1 != v2) return options.fn(this); else return options.inverse(this);
        case '<':
            if (v1 < v2) return options.fn(this); else return options.inverse(this);
        case '<=':
            if (v1 <= v2) return options.fn(this); else return options.inverse(this);
        case '>':
            if (v1 > v2) return options.fn(this); else return options.inverse(this);
        case '>=':
            if (v1 >= v2) return options.fn(this); else return options.inverse(this);
        case '&&', 'and':
            if (v1 && v2) return options.fn(this); else return options.inverse(this);
        case '||', 'or':
            if (v1 || v2) return options.fn(this); else return options.inverse(this);
        default:
            return options.inverse(this);
    }
});*/

hbs.registerHelper('formatNumber', function(value) {
    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
});
const moment = require('moment');
hbs.registerHelper('formatDate', function(date) {
    return moment(date).format('YYYY/MM/DD HH:mm:ss');
});
hbs.registerHelper('formatDateSmall', function(date) {
    return moment(date).format('YYYY/MM/DD HH:mm');
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
app.use(favicon(path.join(__dirname,'../public', '/images/Favicon.ico')));

/* Cloudflare to get IPs */
const cloudflare = require('cloudflare-express');
app.use(cloudflare.restore());

/* Sessions */
const mysql = require('promise-mysql');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const Sessions = mysql.createPool({
    host: config.Sessions.host,
    user: config.Sessions.user,
    password: config.Sessions.password,
    database: config.Sessions.database,
    port: config.Sessions.port,
    connectionLimit: config.Sessions.connectionLimit,
});

const sessionStore = new MySQLStore({
    checkExpirationInterval: config.Sessions.checkExpirationInterval, //Currently: 1 Min
    expiration: config.Sessions.expiration, //Currently: 1 Day
    createDatabaseTable: true,
}, Sessions);
app.use(session({
    name: 'Orion-Entertainment',
    secret: 'c792f47c6db87de6c57da882f6505737421eea56811ac0d72ab891ee9edda523',
    cookie: {
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 //7 Days
    },
    saveUninitialized: false,
    resave: true,
    store: sessionStore
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const APIKey = config.API;
app.use((req, res, next) => {
    req.APIKey = APIKey;
    req.WebTitle = "Orion-Entertainment Panel - ";
    if (req.query.ReturnURL !== undefined) 
        req.session.ReturnURL = req.query.ReturnURL;
    req.isLogin = () => {
        if (req.session.Account !== undefined) return true; else return false;
    }
    req.isStaff = () => {
        if (req.session.Account !== undefined) {
            if (req.session.Account.isStaff !== undefined) return true; else return false;
        } else return false;
    }
    
    next();
});

/* Index */
const index = require('../routes/index'); app.use('/', index);
/* Auth */
const auth = require('../routes/auth'); app.use('/auth', auth);
const steam = require('steam-login');
app.use(steam.middleware({
    realm: 'https://panel.orion-entertainment.net/auth', 
    verify: 'https://panel.orion-entertainment.net/auth/verify/steam',
    apiKey: config.SteamAPI}
));
/* Players */
const Players = require('../routes/Players'); app.use('/Players', Players);
/* Shop */
const Shop = require('../routes/Shop'); app.use('/Shop', Shop);

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
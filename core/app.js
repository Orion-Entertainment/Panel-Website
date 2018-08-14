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

const Footer = ''+
//'	<footer class="page-footer font-small blue pt-4">'+
'	<footer class="page-footer font-small unique-color-dark pt-4">'+
/*'		<div class="container-fluid text-center text-md-left">'+
'			<div class="row">'+
'				<div class="col-md-6 mt-md-0 mt-3">'+
'					<div class="mb-5 flex-center">'+
'						<a href="https://discord.gg/fbbAe3U"><i class="fab fa-discord fa-lg white-text mr-md-5 mr-3 fa-2x"></i></a>'+
'						<a href="ts3server://ts.orion-entertainment.net"><i class="fab fa-teamspeak fa-lg white-text mr-md-5 mr-3 fa-2x"></i></a>'+
'					</div>'+
'				</div>'+
''+
'				<hr class="clearfix w-100 d-md-none pb-3">'+
'				<div class="col-md-3 mb-md-0 mb-3">'+
'					<h5 class="text-uppercase">Community</h5>'+
'					<ul class="list-unstyled">'+
'						<li><a href="ts3server://ts.orion-entertainment.net">Teamspeak</a></li>'+
'						<li><a href="https://discord.gg/fbbAe3U ">Discord</a></li>'+
//'						<li><a href="#!">Link 3</a></li>'+
//'						<li><a href="#!">Link 4</a></li>'+
'					</ul>'+
'				</div>'+
''+
'				<div class="col-md-3 mb-md-0 mb-3">'+
'					<h5 class="text-uppercase">Information</h5>'+
'					<ul class="list-unstyled">'+
'						<li><a href="https://orion-entertainment.net/terms-of-service">Terms of Service</a></li>'+
'						<li><a href="https://orion-entertainment.net/privacy-policy!">Privacy Policy</a></li>'+
//'						<li><a href="#!">Link 3</a></li>'+
//'						<li><a href="#!">Link 4</a></li>'+
'					</ul>'+
'				</div>'+
'			</div>'+
'		</div>'+
''+*/
'		<div class="footer-copyright text-center py-3">© 2018 '+
'			<a href="https://orion-entertainment.net/">Orion-Entertainment.</a>'+
'		</div>'+
'	</footer>';
	

hbs.registerHelper('Footer', function() {
    return Footer;
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
    if (req.query.ReturnURL !== undefined) {req.session.ReturnURL = req.query.ReturnURL;}
    req.isLogin = function() {
        if (req.session.Account !== undefined) return true; else return false;
    };
    req.isStaff = function() {
        if (req.session.Account !== undefined) {
            if (req.session.Account.isStaff !== undefined) return true; else return false;
        } else return false;
    };
    
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
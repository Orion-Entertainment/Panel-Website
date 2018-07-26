const express = require('express'),
	router = express.Router(),
	steam = require('steam-login');

RequireLogin = function(redirect) {
	return function(req, res, next) {
		if(!req.login)
			return res.redirect(redirect);
		next();
	};
}

router.get('/', function(req, res) {
    console.log(req.session.SteamUser)
    return res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});
 
router.get('/login', steam.authenticate(), function(req, res) {
	return res.redirect('/');
});
 
router.get('/verify', steam.verify(), function(req, res) {
	req.session.Account = {SteamID:req.session.steamUser.steamid};
	req.user = null;
	delete req.session.steamUser;
	req.login = true;

	console.log(req.session.Account)
    return res.send(req.login).end();
});
 
router.get('/logout', RequireLogin('/'), function(req, res) {
	delete req.session.Account;
	req.login = null;
    return res.redirect('/');
});

module.exports = router;
module.exports.RequireLogin = RequireLogin;
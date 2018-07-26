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
    return res.send(req.login !== true ? 'Not Logged In' : 'Successfully Logged In: ' + req.session.Account).end();
});

router.get('/logout', RequireLogin('/'), function(req, res) {
	delete req.session.Account;
	req.login = null;
    return res.redirect('/');
});

router.get('/login/steam', steam.authenticate(), function(req, res) {
	return res.redirect('/');
});

router.get('/verify/steam', steam.verify(), function(req, res) {
	req.session.Account = {SteamID:req.session.steamUser.steamid};
	req.user = null;
	delete req.session.steamUser;
	req.login = true;

    return res.send(req.login).end();
});

module.exports = router;
module.exports.RequireLogin = RequireLogin;
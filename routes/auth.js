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


router.get('/logout', RequireLogin('/'), function(req, res) {
	delete req.session.Account;
	req.login = null;
    return res.redirect('/');
});

/* Steam Login */
router.get('/login/steam', steam.authenticate(), function(req, res) {
	if (req.session.ReturnURL !== undefined) {
		ReturnURL = req.session.ReturnURL;
		delete req.session.ReturnURL;
		return res.redirect(ReturnURL);
	} else {
		return res.redirect('/');
	}
});
router.get('/verify/steam', steam.verify(), function(req, res) {
	req.session.Account = {SteamID:req.session.steamUser.steamid};
	req.user = null;
	delete req.session.steamUser;
	req.login = true;

	if (req.session.ReturnURL !== undefined) {
		ReturnURL = req.session.ReturnURL;
		delete req.session.ReturnURL;
		return res.redirect(ReturnURL);
	} else {
		return res.redirect('/');
	}
});

module.exports = router;
module.exports.RequireLogin = RequireLogin;
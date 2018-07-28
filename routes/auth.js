const express = require('express'),
	router = express.Router(),
	steam = require('steam-login'),
	request = require('request');

RequireLogin = function(redirect) {
	return function(req, res, next) {
		if (req.session.Account == undefined)
			return res.redirect(redirect);
		next();
	};
}


router.get('/logout', RequireLogin('/'), function(req, res) {
	delete req.session.Account;
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
router.get('/verify/steam', steam.verify(), async function(req, res) {
	req.session.Check = {SteamID:req.session.steamUser.steamid};
	req.user = null;
	delete req.session.steamUser;

	//Check if user has account
	request.post(
		'https://panelapi.orion-entertainment.net/v1/login/verify',
		{ json: { 
			"client_id": await req.APIKey.client_id,
			"token": await req.APIKey.token,

			"Option": "Steam",
			"Steam64ID": req.session.Check.SteamID
		} },
		async function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if (body.Error !== undefined) return res.render('errorCustom', { error: "API: "+body.Error });
				else {
					if (body.Check == true) {
						req.session.Account.ID = body.ID;
						delete req.session.Check;
						if (req.session.ReturnURL !== undefined) {
							ReturnURL = req.session.ReturnURL;
							delete req.session.ReturnURL;
							return res.redirect(ReturnURL);
						} else return res.redirect('/');
					} else return res.render('register', { Option: "Steam", SteamID: req.session.Check.SteamID });
				}
			} else return res.render('errorCustom', { error: "API: Response Error" });
		}
	);
});

module.exports = router;
module.exports.RequireLogin = RequireLogin;
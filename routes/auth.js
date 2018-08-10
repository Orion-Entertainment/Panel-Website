const express = require('express'),
	router = express.Router(),
	steam = require('steam-login'),
	request = require('request');

RequireLogin = function(redirect, reqData) {
	return function(req, res, next) {
		console.log(req.originalUrl)
		if (req.session.Account == undefined) {
			//if (reqData !== undefined) return res.redirect(redirect+);
			return res.redirect(redirect);
		}
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
	req.session.Check = {Option:"Steam",SteamID:req.session.steamUser.steamid};
	req.user = null;
	delete req.session.steamUser;

	//Check if user has account
	request.post(
		'https://panelapi.orion-entertainment.net/v1/login/verify',
		{ json: { 
			"client_id": await req.APIKey.client_id,
			"token": await req.APIKey.token,

			"Option": req.session.Check,
			"IP": req.cf_ip
		} },
		async function (error, response, body) {
			if (!error && response.statusCode == 200) {
				if (body.Error !== undefined) return res.render('errorCustom', { error: "API: "+body.Error });
				else {
					if (body.Check == true) {
						req.session.Account = {ID: body.ID, SteamID: req.session.Check.SteamID};
						if (body.isStaff == true) req.session.Account.isStaff = true;
						delete req.session.Check;
						if (req.session.ReturnURL !== undefined) {
							ReturnURL = req.session.ReturnURL;
							delete req.session.ReturnURL;
							return res.redirect(ReturnURL);
						} else return res.redirect('/');
					} else return res.render('register', { Title: req.WebTitle+'Register', Option: req.session.Check });
				}
			} else return res.render('errorCustom', { error: "API: Response Error" });
		}
	);
});

module.exports = router;
module.exports.RequireLogin = RequireLogin;
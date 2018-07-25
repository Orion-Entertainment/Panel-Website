const express = require('express'),
    router = express.Router(),
    request = require('request-promise'),
    openid  = require('openid'),
    Promise = require('bluebird/js/main/promise')();

var relyingParty, apiKey, useSession = true;

function enforceLogin(redirect) {
	return function(req, res, next) {
		if(!req.user)
			return res.redirect(redirect);
		next();
	};
}

function verify() {
	return function(req, res, next) {
		relyingParty.verifyAssertion(req, function(err, result) {
			if(err)
				return next(err.message);
			if(!result || !result.authenticated)
				return next('Failed to authenticate user.');
			if(!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier))
				return next('Claimed identity is not valid.');
			fetchIdentifier(result.claimedIdentifier)
				.then(function(user) {
					req.user = user;
					if (useSession) {
						req.session.steamUser = req.user;
						req.logout = logout(req);
					}
					next();
				})
				.catch(function(err)
				{
					next(err);
				});
		});
	};
}

function authenticate() {
	return function(req, res, next) {
		relyingParty.authenticate('https://steamcommunity.com/openid', false, function(err, authURL) {
			if(err) 
			{
				console.log(err);
				return next('Authentication failed: ' + err);
			}
			if(!authURL)
				return next('Authentication failed.');
			res.redirect(authURL);
		});
	};
}

function fetchIdentifier(steamID) {
	// our url is http://steamcommunity.com/openid/id/<steamid>
	steamID = steamID.replace('https://steamcommunity.com/openid/id/', '');
	return request('https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key='+apiKey+'&steamids=' + steamID)
		.then(function(res) {
			var players = JSON.parse(res).response.players;
			if(players.length == 0)
				throw new Error('No players found for the given steam ID.');
			var player = players[0];
			return Promise.resolve({
				_json: player,
				steamid: steamID,
				username: player.personaname,
				name: player.realname,
				profile: player.profileurl,
				avatar: {
					small: player.avatar,
					medium: player.avatarmedium,
					large: player.avatarfull
				}
			});
		});
}

function logout(req) {
	return function() {
		delete req.session.steamUser;
		req.user = null;
	}
}


router.get('/', function(req, res) {
    console.log(req.session.SteamUser)
    return res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});
 
router.get('/login', authenticate(), function(req, res) {
    return res.redirect('/');
});
 
router.get('/verify', verify(), function(req, res) {
    return res.send(req.user["_json"].steamid).end();
});
 
router.get('/logout', enforceLogin('/'), function(req, res) {
    req.logout();
    return res.redirect('/');
});
module.exports = router;
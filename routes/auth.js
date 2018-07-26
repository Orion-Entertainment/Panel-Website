const express = require('express'),
	router = express.Router(),
	steam = require('steam-login');

router.get('/', function(req, res) {
    console.log(req.session.SteamUser)
    return res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});
 
router.get('/login', steam.authenticate(), function(req, res) {
	return res.redirect('/');
});
 
router.get('/verify', function(req, res) {
	console.log(req.body)
    return res.send(req.body).end();
});
 
router.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    return res.redirect('/');
});
module.exports = router;
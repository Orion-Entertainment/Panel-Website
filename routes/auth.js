const express = require('express'),
    router = express.Router(),
    request = require('request'),
    steam = require('steam-login');


router.get('/', function(req, res) {
    res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});
 
router.get('/authenticate', steam.authenticate(), function(req, res) {
    res.redirect('/');
});
 
router.get('/verify', steam.verify(), function(req, res) {
    res.send(req.user).end();
});
 
router.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;
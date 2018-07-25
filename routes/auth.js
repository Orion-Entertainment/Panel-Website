const express = require('express'),
    router = express.Router(),
    request = require('request'),
    steam = require('steam-login');


router.get('/', function(req, res) {
    return res.send(req.user == null ? 'not logged in' : 'hello ' + req.user.username).end();
});
 
router.get('/login', steam.authenticate(), function(req, res) {
    return res.redirect('/');
});
 
router.get('/verify', steam.verify(), function(req, res) {
    return res.send(req.user["_json"].steamid).end();
});
 
router.get('/logout', steam.enforceLogin('/'), function(req, res) {
    req.logout();
    return res.redirect('/');
});

module.exports = router;
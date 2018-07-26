const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('../auth').RequireLogin;

router.get('/Search', RequireLogin('/login'), async(req, res, next) => {
    try {
        return res.render('./Players/search', { title: req.WebTitle+'Players' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

module.exports = router;
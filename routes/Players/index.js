const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('../auth').RequireLogin;

router.get('/Search', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        return res.render('./Players/search', { title: req.WebTitle+'Players' });
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
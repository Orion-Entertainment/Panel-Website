const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/', async(req, res, next) => {
    try {
        return res.render('index', { title: req.WebTitle+'Home' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

router.get('/privacy-policy', async(req, res, next) => {
    try {
        return res.redirect('https://orion-entertainment.net/privacy-policy');
    } catch (error) {
        return res.render('error', { error: error });
    }
});

router.get('/terms-of-service', async(req, res, next) => {
    try {
        return res.redirect('https://orion-entertainment.net/terms-of-service');
    } catch (error) {
        return res.render('error', { error: error });
    }
});


router.get('/login', async(req, res, next) => {
    try {
        if (req.login) {
            if (req.session.ReturnURL !== undefined) {
                ReturnURL = req.session.ReturnURL;
                delete req.session.ReturnURL;
                return res.redirect(ReturnURL);
            } else {
                return res.redirect('/');
            }
        } else {
            return res.render('login', { title: req.WebTitle+'Login' });
        }
    } catch (error) {
        return res.render('error', { error: error });
    }
});


router.get('/killfeed', async(req, res, next) => {
    try {
        return res.render('killfeed', { title: req.WebTitle+'Kill Feed' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

module.exports = router;
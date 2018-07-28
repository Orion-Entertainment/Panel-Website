const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/', async(req, res, next) => {
    try {
        return res.render('index', { title: req.WebTitle+'Home', Login: req.Login });
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/privacy-policy', async(req, res, next) => {
    try {
        return res.redirect('https://orion-entertainment.net/privacy-policy');
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/terms-of-service', async(req, res, next) => {
    try {
        return res.redirect('https://orion-entertainment.net/terms-of-service');
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/login', async(req, res, next) => {
    try {
        if (req.session.Account == undefined) {
            return res.render('login', { title: req.WebTitle+'Login' });
        } else {
            if (req.session.ReturnURL !== undefined) {
                ReturnURL = req.session.ReturnURL;
                delete req.session.ReturnURL;
                return res.redirect(ReturnURL);
            } else {
                return res.redirect('/');
            }
        }
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.post('/register', async(req, res, next) => {
    try {
        if (req.session.Check == undefined) return error;

        switch (req.session.Check.Option) {
            case "Steam":
                if (req.body.Name == undefined | req.body.Steam64ID == undefined) return res.render('errorCustom', { error: "error" });
                if (req.body.Name == "") return res.render('errorCustom', { error: "Name Can't Be Empty" });

                const Data = JSON.stringify({
                    Name: req.body.Name,
                    Steam64ID: req.session.Check.SteamID
                });
                console.log(Data)
                return res.send('Done');
        }
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
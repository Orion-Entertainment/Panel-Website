const express = require('express');
const router = express.Router();
const request = require('request');

router.get('/', async(req, res, next) => {
    try {
        return res.render('index', { title: 'Orion-Entertainment' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

router.get('/privacy-policy', async(req, res, next) => {
    try {
        return res.render('privacypolicy', { title: 'Orion-Entertainment - Privacy Policy' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

router.get('/terms-of-service', async(req, res, next) => {
    try {
        return res.render('termsofservice', { title: 'Orion-Entertainment - Terms of Service' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});





router.get('/killfeed', async(req, res, next) => {
    try {
        return res.render('killfeed', { title: 'Orion-Entertainment' });
    } catch (error) {
        return res.render('error', { error: error });
    }
});

module.exports = router;
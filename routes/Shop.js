const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/', async(req, res, next) => {
    try {
        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {return res.render('errorCustom', { error: body.Error });} else {
                        return res.render('./Shop/index', { title: req.WebTitle+'Shop', Option: "Index", Data: body });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/:Category', async(req, res, next) => {
    try {
        if (req.params.Category == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Category == "") {const err = new Error('Not Found');err.status = 404;next(err); return;}

        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/category',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,
                "Category": req.params.Category
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {
                        if (body.Error == "Category Not Found") {const err = new Error('Not Found');err.status = 404;next(err); return;}
                        else {return res.render('errorCustom', { error: body.Error });}
                    } else {
                        return res.render('./Shop/index', { title: req.WebTitle+'Shop - '+req.params.Category, Option: "Category", Category: req.params.Category, Data: body });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
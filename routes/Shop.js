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
                        return res.render('./Shop/index', { title: req.WebTitle+'Shop', Option: "Index", Data: body, Login: await req.Login(), Admin: await req.isStaff() });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/Purchases', RequireLogin(), async(req, res, next) => {
    try {
        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/purchases',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "WID": req.session.Account.ID
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {return res.render('errorCustom', { error: body.Error });}
                    else {
                        return res.render('./Shop/purchases', { title: req.WebTitle+'Shop - Purchases', Data: body.Info, Admin: await req.isStaff() });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.post('/CancelSubscription', RequireLogin(), async(req, res, next) => {
    try {
        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/cancel',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "ID": req.body.id,
                "WID": req.session.Account.ID
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.json({Error: body.Error})
                    else {
                        return res.send(body);
                    }
                } else return res.json({Error: "API: Response Error"})
            }
        );
    } catch (error) {
        return res.json({Error: error})
    }
});

router.post('/buy', RequireLogin(), async(req, res, next) => {
    try {
        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/BuyItem',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "Category": req.body.Category,
                "Item": req.body.Item,
                "ItemID": req.body.ItemID,

                "WID": req.session.Account.ID
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.json({Error: body.Error})
                    else {
                        req.session.Account.Buying = body.Data;
                        return res.send(body.URL);
                    }
                } else return res.json({Error: "API: Response Error"})
            }
        );
    } catch (error) {
        return res.json({Error: error})
    }
});

router.get('/Success', RequireLogin(), async(req, res, next) => {
    try {
        if (req.session.Account.Buying == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/bought',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "buytoken": req.query.token,
                "payerid": req.query.PayerID,

                "Buying": req.session.Account.Buying,

                "WID": req.session.Account.ID
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {return res.render('errorCustom', { error: body.Error });}
                    else {
                        delete req.session.Account.Buying;
                        return res.render('./Shop/success', { title: req.WebTitle+'Shop - Success', Data: body, Admin: await req.isStaff() });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/Cancel', RequireLogin(), async(req, res, next) => {
    try {
        return res.redirect('/Shop');
    } catch (error) {
        return res.json({Error: error})
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
                        return res.render('./Shop/index', { title: req.WebTitle+'Shop - '+req.params.Category, Option: "Category", Category: req.params.Category, Data: body, Login: await req.Login(), Admin: await req.isStaff() });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/:Category/:Item', RequireLogin(), async(req, res, next) => {
    try {
        if (req.params.Category == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Category == "") {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Item == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Item == "" | isNaN(req.params.Item)) {const err = new Error('Not Found');err.status = 404;next(err); return;}

        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/item',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,
                "Category": req.params.Category,
                "Item": req.params.Item
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {
                        if (body.Error == "Category Not Found") {const err = new Error('Not Found');err.status = 404;next(err); return;}
                        else {return res.render('errorCustom', { error: body.Error });}
                    } else {
                        if (body.Item == false) {const err = new Error('Not Found');err.status = 404;next(err); return;}
                        else {return res.render('./Shop/item', { title: req.WebTitle+'Shop - '+req.params.Category, Category: req.params.Category, Item: req.params.Item, Data: body.Item, Admin: await req.isStaff() });}
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
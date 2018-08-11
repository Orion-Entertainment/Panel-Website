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

router.get('/:Category/:Item', async(req, res, next) => {
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
                        else {return res.render('./Shop/item', { title: req.WebTitle+'Shop - '+req.params.Category, Category: req.params.Category, Item: req.params.Item, Data: body.Item });}
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/:Category/:Item/Buy', RequireLogin(), async(req, res, next) => {
    try {
        if (req.params.Category == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Category == "") {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Item == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.Item == "" | isNaN(req.params.Item)) {const err = new Error('Not Found');err.status = 404;next(err); return;}

        request.post(
            'https://panelapi.orion-entertainment.net/v1/shop/buy',
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
                        else {return res.render('./Shop/buy', { title: req.WebTitle+'Shop - '+req.params.Category, Category: req.params.Category, Item: req.params.Item, Data: body.Item });}
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});



var paypal = require('paypal-rest-sdk');

var clientId = 'AV-4DyvKAAaXllJA3zxB1yOtxGc9Sx-wXPHTDAq2U97ebpyH0n92uWTHwSPu3zNxpSqWxq25QfJF1eyZ';
var secret = 'EAP-_kApLTQcXCjiKKIpmsELdrc4ZFt0xfruOPG_C0s82jPd71nCSaqAC6_lWFgJ2oD9F0kRYRwYbtRd';

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': clientId,
  'client_secret': secret
});

var billingPlanAttribs = {
    "name": "Food of the World Club Membership: Standard",
    "description": "Monthly plan for getting the t-shirt of the month.",
    "type": "fixed",
    "payment_definitions": [{
        "name": "Standard Plan",
        "type": "REGULAR",
        "frequency_interval": "1",
        "frequency": "MONTH",
        "cycles": "11",
        "amount": {
            "currency": "USD",
            "value": "19.99"
        }
    }],
    "merchant_preferences": {
        "setup_fee": {
            "currency": "USD",
            "value": "1"
        },
        "cancel_url": "https://panel.orion-entertainment.net/Shop/cancel", ///////////////////////////////////////////////
        "return_url": "https://panel.orion-entertainment.net/Shop/processagreement", ///////////////////////////////////////////////
        "max_fail_attempts": "0",
        "auto_bill_amount": "YES",
        "initial_fail_amount_action": "CONTINUE"
    }
};

var billingPlanUpdateAttributes = [{
    "op": "replace",
    "path": "/",
    "value": {
        "state": "ACTIVE"
    }
}];

paypal.billingPlan.create(billingPlanAttribs, function (error, billingPlan){
    if (error){
        console.log(error);
        throw error;
    } else {
        // Activate the plan by changing status to Active
        paypal.billingPlan.update(billingPlan.id, billingPlanUpdateAttributes, 
            function(error, response){
            if (error) {
                console.log(error);
                throw error;
            } else {
                console.log(billingPlan.id);
            }
        });
    }
});

router.get('/createagreement', async(req, res, next) => {
    try {
        var billingPlan = req.query.plan;

        var isoDate = new Date();
        isoDate.setSeconds(isoDate.getSeconds() + 4);
        isoDate.toISOString().slice(0, 19) + 'Z';

        var billingAgreementAttributes = {
            "name": "Standard Membership",
            "description": "Food of the World Club Standard Membership",
            "start_date": isoDate,
            "plan": {
                "id": billingPlan
            },
            "payer": {
                "payment_method": "paypal"
            },
            "shipping_address": {
                "line1": "W 34th St",
                "city": "New York",
                "state": "NY",
                "postal_code": "10001",
                "country_code": "US"
            }
        };

        // Use activated billing plan to create agreement
        paypal.billingAgreement.create(billingAgreementAttributes, function (
            error, billingAgreement){
            if (error) {
                console.error(error);
                throw error;
            } else {
                //capture HATEOAS links
                var links = {};
                billingAgreement.links.forEach(function(linkObj){
                    links[linkObj.rel] = {
                        'href': linkObj.href,
                        'method': linkObj.method
                    };
                })

                //if redirect url present, redirect user
                if (links.hasOwnProperty('approval_url')){
                    res.redirect(links['approval_url'].href);
                } else {
                    console.error('no redirect URI present');
                }
            }
        });
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/processagreement', function(req, res){
    var token = req.query.token;

    paypal.billingAgreement.execute(token, {}, function (error, 
        billingAgreement) {
        if (error) {
            console.error(error);
            throw error;
        } else {
            console.log(JSON.stringify(billingAgreement));
            res.send('Billing Agreement Created Successfully');
        }
    });
});

module.exports = router;
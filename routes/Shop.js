const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
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
                        return res.render('./Shop/index', { title: req.WebTitle+'Shop', Data: body });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
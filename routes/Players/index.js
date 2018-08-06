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
router.post('/Search', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        if (req.body.SearchVal == undefined) return res.json({Error: "SearchVal Undefined"})

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/search',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "SearchVal": req.body.SearchVal
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

router.get('/:PlayerID', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        //Look into returning to playerid page if not logged
        if (req.params.PlayerID == undefined) return res.redirect('/Players/Search');
        else if (req.params.PlayerID == "" | isNaN(req.params.PlayerID)) return res.render('errorCustom', { error: "Invalid PlayerID" });

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "PlayerID": req.params.PlayerID
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.render('errorCustom', { error: body.Error });
                    else {
                        return res.render('./Players/player', { title: req.WebTitle+'Players', Info: body.Info });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.post('/:PlayerID/Info', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        if (req.params.PlayerID == undefined) return res.redirect('/Players/Search');
        else if (req.params.PlayerID == "" | isNaN(req.params.PlayerID)) return res.render('errorCustom', { error: "Invalid PlayerID" });
        else if (req.body.Option == undefined) return res.json({Error: "Option Undefined"})
        else if (req.body.Option == "") return res.json({Error: "Option Invalid"})

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "Option": req.body.Option,
                "Option2": req.body.Option2
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.json({Error: body.Error})
                    else {return res.send(body);}
                } else return res.json({Error: "API: Response Error"})
            }
        );
    } catch (error) {
        return res.json({Error: error})
    }
});

module.exports = router;
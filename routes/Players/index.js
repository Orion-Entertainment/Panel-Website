const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('../auth').RequireLogin;

router.get('/Search', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        return res.render('./Players/search', { title: req.WebTitle+'Players - Search' });
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

router.get('/TopCharts', RequireLogin('/login?ReturnURL=/Players/TopCharts'), async(req, res, next) => {
    try {
        return res.render('./Players/topcharts', { title: req.WebTitle+'Players - Top Charts' });
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});
router.post('/TopCharts', RequireLogin('/login?ReturnURL=/Players/TopCharts'), async(req, res, next) => {
    try {
        if (req.body.Category == undefined) return res.json({Error: "Category Undefined"})
        else if (req.body.Category == "") return res.json({Error: "Category Invalid"})

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/topcharts',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "Server": req.body.Server,
                "Category": req.body.Category,
                "Option": req.body.Option
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

router.get('/:PlayerID', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        //Look into returning to playerid page if not logged
        if (req.params.PlayerID == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.PlayerID == "" | isNaN(req.params.PlayerID)) {const err = new Error('Not Found');err.status = 404;next(err); return;}

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
        if (req.params.PlayerID == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.PlayerID == "" | isNaN(req.params.PlayerID)) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.body.Option == undefined) return res.json({Error: "Option Undefined"})
        else if (req.body.Option == "") return res.json({Error: "Option Invalid"})

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "PlayerID": req.params.PlayerID,
                "Option": req.body.Option,
                "Option2": req.body.Option2,
                "Option3": req.body.Option3
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
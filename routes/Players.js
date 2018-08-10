const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/Search', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        if (req.query.q !== undefined) Query = req.query.q; else Query = false;
        return res.render('./Players/search', { title: req.WebTitle+'Players - Search', Query: Query });
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

router.get('/KillFeed', RequireLogin('/login?ReturnURL=/Players/KillFeed'), async(req, res, next) => {
    try {
        return res.render('./Players/killfeed', { title: req.WebTitle+'Players - Kill Feed' });
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});
router.post('/KillFeed', RequireLogin('/login?ReturnURL=/Players/KillFeed'), async(req, res, next) => {
    try {
        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/killfeed',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token
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

router.get('/:PlayerID', RequireLogin('/login?ReturnURL=/Players/'+req.params.PlayerID), async(req, res, next) => {
    try {
        //Look into returning to playerid page if not logged
        if (req.params.PlayerID == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.PlayerID == "" | isNaN(req.params.PlayerID)) {const err = new Error('Not Found');err.status = 404;next(err); return;}

        if (req.session.Account.SteamID !== undefined) SteamID = req.session.Account.SteamID; else SteamID = false;

        /* UPDATE LATER */
        if (req.session.Account.isStaff !== undefined) SteamID = true;
        if (req.session.Account.isStaff !== undefined) Staff = true; else Staff = false; //sendperms
        //if (req.session.Account.isStaff !== undefined) sPermissions = req.session.Account.Staff.Permissions; else sPermissions = false;
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "PlayerID": req.params.PlayerID,
                "Private": SteamID,
                "Staff": Staff
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

        if (req.session.Account.SteamID !== undefined) SteamID = req.session.Account.SteamID; else SteamID = false;

        /* UPDATE LATER */
        if (req.session.Account.isStaff !== undefined) SteamID = true;
        if (req.session.Account.isStaff !== undefined) Staff = true; else Staff = false; //sendperms
        //if (req.session.Account.isStaff !== undefined) sPermissions = req.session.Account.Staff.Permissions; else sPermissions = false;
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "PlayerID": req.params.PlayerID,
                "Private": SteamID,
                "Staff": Staff,
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

router.get('/:PlayerID/:Page', RequireLogin('/login?ReturnURL=/Players/Search'), async(req, res, next) => {
    try {
        if (req.params.PlayerID == undefined | req.params.Page == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        else if (req.params.PlayerID == "" | req.params.Page == "") {const err = new Error('Not Found');err.status = 404;next(err); return;}

        if (req.session.Account.SteamID !== undefined) SteamID = req.session.Account.SteamID; else SteamID = false;
        /* UPDATE LATER */
        if (req.session.Account.isStaff !== undefined) SteamID = true;
        if (req.session.Account.isStaff !== undefined) Staff = true; else Staff = false; //sendperms
        //if (req.session.Account.isStaff !== undefined) sPermissions = req.session.Account.Staff.Permissions; else sPermissions = false;
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/players/info',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "PlayerID": req.params.PlayerID,
                "Private": SteamID,
                "Staff": Staff,
                "Option": "Get",
                "Option2": req.params.Page,
                "Option3": ""
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) {
                        if (body.Error == "Invalid Option2") {
                            const err = new Error('Not Found');err.status = 404;next(err); return;
                        } else return res.render('errorCustom', { error: body.Error });
                    } else {
                        const Data = body[req.params.Page];
                        return res.render('./Players/playerPage', { title: req.WebTitle+'Players '+req.params.Page, Data: Data, Page: req.params.Page, PID: req.params.PlayerID });
                    }
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
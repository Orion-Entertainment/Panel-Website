const express = require('express');
const router = express.Router();
const request = require('request');
const RequireLogin = require('./auth').RequireLogin;

router.get('/', async(req, res, next) => {
    try {
        return res.render('index', { title: req.WebTitle+'Home', Login: await req.isLogin() });
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

router.get(['/login','/register'], async(req, res, next) => {
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
        if (req.session.Check == undefined) return res.render('errorCustom', { error: "Check undefined" });

        switch (req.session.Check.Option) {
            case "Steam":
                if (req.body.Name == undefined | req.body.Steam64ID == undefined) return res.render('errorCustom', { error: "Name/Steam64ID Undefined" });
                else if (req.body.Name == "") return res.render('errorCustom', { error: "Name Can't Be Empty" });
                else if (req.body.Email !== undefined) email = req.body.Email; else email = false;

                const Data = JSON.stringify({
                    Name: req.body.Name,
                    Email: email,
                    Steam64ID: req.session.Check.SteamID
                });

                //Check if user has account
                request.post(
                    'https://panelapi.orion-entertainment.net/v1/login/register',
                    { json: { 
                        "client_id": await req.APIKey.client_id,
                        "token": await req.APIKey.token,

                        "Option": req.session.Check.Option,
                        "Data": Data,
                        "IP": req.cf_ip
                    } },
                    async function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            if (body.Error !== undefined) return res.render('errorCustom', { error: "API: "+body.Error });
                            else {
                                if (body === "Already Registered") return res.render('errorCustom', { error: Data.Steam64ID+": Already linked to an account" });
                                else {
                                    req.session.Account = {ID: body.ID};
                                    delete req.session.Check;

                                    if (req.session.ReturnURL !== undefined) {
                                        ReturnURL = req.session.ReturnURL;
                                        delete req.session.ReturnURL;
                                        return res.redirect(ReturnURL);
                                    } else {
                                        return res.redirect('/');
                                    }
                                }
                            }
                        } else return res.render('errorCustom', { error: "API: Response Error" });
                    }
                );
        }
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

router.get('/Changelog', async(req, res, next) => {
    try {
        /* UPDATE LATER */
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.render('errorCustom', { error: body.Error });
                    else return res.render('./Changelog/Index', { title: req.WebTitle+'Changelog', Login: await req.isLogin(), Admin:await req.isStaff(), Data: JSON.stringify(body) });
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});
router.get('/Changelog/Admin', RequireLogin(), async(req, res, next) => {
    try {
        /* UPDATE LATER */
        if (await req.isStaff() == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog/admin',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.render('errorCustom', { error: body.Error });
                    else return res.render('./Changelog/Admin', { title: req.WebTitle+'Changelog Admin', Data: JSON.stringify(body) });
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});
router.post('/Changelog/Admin', RequireLogin(), async(req, res, next) => {
    try {
        /* UPDATE LATER */
        if (await req.isStaff() == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog/create',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "Name": req.body.Name,
                "Category": req.body.Category,
                "Time": req.body.Time,
                "Data": req.body.Data
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
router.get('/Changelog/Admin/:id', RequireLogin(), async(req, res, next) => {
    try {
        /* UPDATE LATER */
        if (await req.isStaff() == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog/view',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "ID": req.params.id
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.render('errorCustom', { error: body.Error });
                    else return res.render('./Changelog/Edit', { title: req.WebTitle+'Changelog Admin', Data:body });
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.json({Error: error})
    }
});
router.post('/Changelog/Admin/:id', RequireLogin(), async(req, res, next) => {
    try {
        /* UPDATE LATER */
        if (await req.isStaff() == undefined) {const err = new Error('Not Found');err.status = 404;next(err); return;}
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog/edit',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "Option": req.body.Option,
                "ID": req.params.id,
                "Name": req.body.Name,
                "Data": req.body.Data
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

router.get('/Changelog/:id', async(req, res, next) => {
    try {
        /* UPDATE LATER */
        /* UPDATE LATER */

        request.post(
            'https://panelapi.orion-entertainment.net/v1/changelog/view',
            { json: { 
                "client_id": await req.APIKey.client_id,
                "token": await req.APIKey.token,

                "ID": req.params.id
            } },
            async function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body.Error !== undefined) return res.render('errorCustom', { error: body.Error });
                    else return res.render('./Changelog/View', { title: req.WebTitle+'Changelog', Login: await req.isLogin(), Admin:await req.isStaff(), Data:body });
                } else return res.render('errorCustom', { error: "API: Response Error" });
            }
        );
    } catch (error) {
        return res.render('errorCustom', { error: error });
    }
});

module.exports = router;
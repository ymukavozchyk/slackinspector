'use strict';

var express = require('express');
var https = require('https');
var cryptography = require('../services/cryptography');
var router = express.Router();

module.exports = function (app) {
    router.route('/login')
        .post(function (req, res) {

            if (req.body.code !== undefined) {
                https.get({
                    host: 'slack.com',
                    path: '/api/oauth.access?client_id=' + process.env.SLACK_CLIENT_ID + '&client_secret=' + process.env.SLACK_CLIENT_SECRET + '&code=' + req.body.code
                }, function (response) {
                    var body = '';
                    response.on('data', function (d) {
                        body += d;
                    });
                    response.on('end', function () {
                        var parsed = JSON.parse(body);
                        if (parsed.ok) {
                            global.__token = parsed.access_token;
                            return res.json({
                                ok: true,
                                encrypted_token: cryptography.encrypt(parsed.access_token)
                            });
                        }
                        return res.json({ ok: false, error: parsed.error });
                    });
                });
            }
            else {
                return res.json({ ok: false, error: 'code is undefined' });
            }
        });

    router.route('/verify')
        .post(function (req, res) {
            try {
                if (req.body.encrypted_token !== undefined) {
                    global.__token = cryptography.decrypt(req.body.encrypted_token);
                }
                else {
                    return res.json({ ok: false });
                }
            }
            catch (error) {
                return res.json({ ok: false });
            }

            return res.json({ ok: true });
        });

    router.route('/revoke')
        .get(function (req, res) {

            if (global.__token !== undefined) {
                https.get({
                    host: 'slack.com',
                    path: '/api/auth.revoke?token=' + global.__token
                }, function (response) {
                    var body = '';
                    response.on('data', function (d) {
                        body += d;
                    });
                    response.on('end', function () {
                        var parsed = JSON.parse(body);
                        if (parsed.ok) {
                            global.__token = null;
                            return res.json({ ok: true });
                        }
                        return res.json({ ok: false, error: parsed.error });
                    });
                });
            }
            else {
                return res.json({ ok: false, error: 'token is undefined' });
            }
        });

    app.use('/api/auth', router);
};
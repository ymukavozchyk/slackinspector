'use strict';

var express = require('express');
var https = require('https');
var cryptography = require('../services/cryptography');
var router = express.Router();

module.exports = function (app) {
    router.route('/login')
        .post(function (req, res) {

            if (req.body.code === undefined) {
                return res.status(400).json({ ok: false, error_type: 'internal', error: 'code is undefined' });
            }

            var path = '/api/oauth.access?client_id=' +
                process.env.SLACK_CLIENT_ID +
                '&client_secret=' +
                process.env.SLACK_CLIENT_SECRET +
                '&code=' + req.body.code;

            https.get({
                host: 'slack.com',
                path: path
            }, function (response) {
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    var parsed = JSON.parse(body);
                    if (parsed.ok) {
                        return res.json({
                            ok: true,
                            encrypted_token: cryptography.encrypt(parsed.access_token)
                        });
                    }
                    return res.status(500).json({ ok: false, error_type: 'slack', error: parsed.error });
                });
            });
        });

    router.route('/verify')
        .post(function (req, res) {

            if (req.body.encrypted_token === undefined) {
                return res.status(400).json({
                    ok: false, error_type: 'internal',
                    error: 'encrypted token is undefined'
                });
            }

            var decryptedToken;
            try {
                decryptedToken = cryptography.decrypt(req.body.encrypted_token);
            }
            catch (error) {
                return res.status(500).json({
                    ok: false, error_type: 'internal',
                    error: 'was not able to decrypt token'
                });
            }

            https.get({
                host: 'slack.com',
                path: '/api/auth.test?token=' + decryptedToken
            }, function (response) {
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    var parsed = JSON.parse(body);
                    if (parsed.ok) {
                        return res.json({ ok: true });
                    }
                    return res.status(500).json({ ok: false, error_type: 'slack', error: parsed.error });
                });
            });
        });

    router.route('/revoke')
        .post(function (req, res) {

            if (req.body.encrypted_token === undefined) {
                return res.status(400).json({
                    ok: false, error_type: 'internal',
                    error: 'encrypted token is undefined'
                });
            }

            var decryptedToken;
            try {
                decryptedToken = cryptography.decrypt(req.body.encrypted_token);
            }
            catch (error) {
                return res.status(500).json({
                    ok: false, error_type: 'internal',
                    error: 'was not able to decrypt token'
                });
            }

            https.get({
                host: 'slack.com',
                path: '/api/auth.revoke?token=' + decryptedToken
            }, function (response) {
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    var parsed = JSON.parse(body);
                    if (parsed.ok) {
                        return res.json({ ok: true });
                    }
                    return res.status(500).json({ ok: false, error_type: 'slack', error: parsed.error });
                });
            });
        });

    app.use('/api/auth', router);
};
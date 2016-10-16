'use strict';

var express = require('express');
var https = require('https');
var analysis = require('../services/analysis');
var cryptography = require('../services/cryptography');
var usageData = require('../services/usageData');
var router = express.Router();

module.exports = function (app) {

    router.route('/channels')
        .post(function (req, res) {

            if (req.body.encrypted_token === undefined || req.body.encrypted_token === '') {
                return res.status(400).json({ ok: false, error_type: 'internal', error: 'encrypted token is undefined or empty' });
            }

            var decryptedToken;
            try {
                decryptedToken = cryptography.decrypt(req.body.encrypted_token);
            }
            catch (error) {
                return res.status(500).json({ ok: false, error_type: 'internal', error: 'was not able to decrypt token' });
            }

            https.get({
                host: 'slack.com',
                path: '/api/channels.list?token=' + decryptedToken
            }, function (response) {
                var body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    var parsed = JSON.parse(body);
                    if (parsed.ok) {
                        var channels = [];
                        parsed.channels.forEach(function (channel) {
                            channels.push({
                                id: channel.id,
                                name: channel.name
                            });
                        });

                        return res.json({ ok: true, channels: channels });
                    }
                    return res.status(500).json({ ok: false, error_type: 'slack', error: parsed.error });
                });
            });
        });

    router.route('/analysis')
        .post(function (req, res) {

            if (req.body.encrypted_token === undefined || req.body.encrypted_token === '') {
                return res.status(400).json({ ok: false, error_type: 'internal', error: 'encrypted token is undefined or empty' });
            }

            if (req.body.channel === undefined || req.body.channel === '') {
                return res.status(400).json({ ok: false, error_type: 'internal', error: 'channel is undefined or empty' });
            }

            var decryptedToken;
            try {
                decryptedToken = cryptography.decrypt(req.body.encrypted_token);
            }
            catch (error) {
                return res.status(500).json({ ok: false, error_type: 'internal', error: 'was not able to decrypt token' });
            }

            var fromTs = null;
            var toTs = null;
            var saveUsageData = false;

            if (req.body.save_usage_data !== undefined) {
                if (req.body.save_usage_data === 'false' || req.body.save_usage_data === 'true') {
                    saveUsageData = req.body.save_usage_data;
                }
                else {
                    return res.status(400).json({ ok: false, error_type: 'internal', error: 'save_usage_data should be a valid boolean (true or false)' });
                }
            }

            if (req.body.from_ts !== undefined) {
                fromTs = req.body.from_ts;
            }
            if (req.body.to_ts !== undefined) {
                toTs = req.body.to_ts;
            }

            var performAnalysis = analysis.setup(decryptedToken, req.body.channel, saveUsageData, res);
            performAnalysis(fromTs, toTs);
        });

    router.route('/usage/tone')
        .get(function (req, res) {
            usageData.toneAggregation(res);
        });

    app.use('/api/core', router);
};
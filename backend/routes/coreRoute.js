'use strict';

var express = require('express');
var https = require('https');
var analysis = require('../services/analysis');
var router = express.Router();

module.exports = function (app) {

    router.route('/channels')
        .get(function (req, res) {

            if (global.__token !== undefined) {
                https.get({
                    host: 'slack.com',
                    path: '/api/channels.list?token=' + global.__token
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
                        return res.json({ ok: false, error: parsed.error });
                    });
                });
            }
            else {
                return res.json({ ok: false, error: 'token is undefined' });
            }
        });

    router.route('/analysis')
        .post(function (req, res) {
            if (global.__token !== undefined) {

                if (req.body.channel === undefined) {
                    return res.json({ ok: false, error: 'channel is required' });
                }

                var fromTs = null;
                var toTs = null;
                var saveUsageData = false;

                if (req.body.saveUsageData !== undefined) {
                    if (req.body.saveUsageData === 'false' || req.body.saveUsageData === 'true') {
                        saveUsageData = req.body.saveUsageData;
                    }
                    else {
                        return res.json({ ok: false, error: 'saveUsageData should be a valid boolean (true or false)' });
                    }
                }

                if (req.body.fromTs !== undefined) {
                    fromTs = req.body.fromTs;
                }
                if (req.body.toTs !== undefined) {
                    toTs = req.body.toTs;
                }

                var performAnalysis = analysis.setup(saveUsageData, res);
                performAnalysis(req.body.channel, fromTs, toTs);
            }
            else {
                return res.json({ ok: false, error: 'token is undefined' });
            }
        });

    app.use('/api/core', router);
};
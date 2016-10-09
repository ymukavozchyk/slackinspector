'use strict';

var watson = require('../services/watson');
var helper = require('../services/messageHelper');
var https = require('https');

module.exports = {
    setup: setupAnalysis
};

function setupAnalysis(token, channel, saveUsageData, res) {
    var messages = [];

    return function fetch(fromTs, toTs) {

        var url = '/api/channels.history?token=' + token + '&channel=' + channel + '&count=1000';

        if (toTs !== null) {
            url += '&latest=' + toTs;
        }
        if (fromTs !== null) {
            url += '&oldest=' + fromTs;
            if (toTs === null) {
                url += '&latest=' + ((new Date).getTime() + 60 * 30);
            }
        }

        https.get({
            host: 'slack.com',
            path: url
        }, function (response) {
            var body = '';
            response.on('data', function (d) {
                body += d;
            });
            response.on('end', function () {
                var parsed = JSON.parse(body);
                if (parsed.ok) {

                    parsed.messages.forEach(function (message) {
                        if (message.type === 'message' && message.subtype === undefined) {
                            var cleanMessage = message.text.trim();
                            var messageObject = {
                                author: message.user,
                                text: cleanMessage + helper.getSuffix(cleanMessage)
                            };
                            messages.unshift(messageObject);
                        }
                    });

                    if (parsed.has_more) {
                        var resFromTs = null;
                        var resToTs = null;

                        if (parsed.oldest !== undefined) {
                            resFromTs = parsed.oldest;
                        }
                        if (parsed.latest !== undefined) {
                            resToTs = parsed.latest;
                        }

                        if (resFromTs !== null && resToTs !== null) {
                            resToTs = parsed.messages.pop().ts;
                        }
                        else if (resFromTs === null && resToTs !== null) {
                            resToTs = parsed.messages.pop().ts;
                        }
                        else {
                            resToTs = parsed.messages.pop().ts;
                        }
                        fetch(resFromTs, resToTs);
                    }
                    else {
                        //todo perform statistical analysis
                        watson.performAnalysis(saveUsageData, messages, res);
                    }
                }
                else {
                    return res.json({ ok: false, error: parsed.error });
                }
            });
        });
    };
};
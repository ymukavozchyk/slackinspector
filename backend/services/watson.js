'use strict';

var usageData = require('../services/usageData');
var ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');

var tone_analyzer = new ToneAnalyzerV3({
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD,
    version_date: '2016-05-19'
});

module.exports = {
    performAnalysis: function (saveUsageData, messages, res) {
        var allMessages = '';

        messages.forEach(function (message) {
            allMessages += message.text + ' ';
        });

        tone_analyzer.tone({
            text: allMessages,
            sentences: false,
            isHTML: true
        },
            function (err, tone) {
                if (err) {
                    return res.status(500).json({ ok: false, error_type: 'watson', error: err });
                }
                else {
                    if (saveUsageData) {
                        usageData.storeTone(tone);
                    }
                    return res.json({ ok: true, message_count: messages.length, tone: tone });
                }
            });
    }
};
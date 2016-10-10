'use strict';

var ToneData = require('../models/toneData');

module.exports = {
    storeTone: storeTone,
    toneAggregation: toneAggregation
};

function storeTone(toneResult) {

    var tonesToInsert = [];

    toneResult.document_tone.tone_categories.forEach(function (toneCategory) {
        toneCategory.tones.forEach(function (tone) {
            tonesToInsert.push({
                tone_id: tone.tone_id,
                score: tone.score
            });
        });
    });

    ToneData.collection.insert(tonesToInsert);
};

function toneAggregation(res) {
    ToneData.aggregate([
        {
            $group: {
                _id: '$tone_id',
                avgScore: {
                    $avg: '$score'
                }
            }
        }
    ], function (err, aggregationResult) {
        if (err) {
            return res.json({ ok: false, error: 'was not able to aggregate tone data' });
        }
        return res.json({ ok: false, result: aggregationResult });
    });
};
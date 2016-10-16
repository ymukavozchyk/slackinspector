'use strict';

var ToneData = require('../models/toneData');

module.exports = {
    storeTone: storeTone,
    toneAggregation: toneAggregation
};

function storeTone(toneResult) {

    var tonesToInsert = [];

    toneResult.document_tone.tone_categories.forEach(function (toneCategory) {
        var model = {
            category_id: toneCategory.category_id,
            category_name: toneCategory.category_name,
            tones: []
        };

        toneCategory.tones.forEach(function (tone) {
            model.tones.push({
                tone_id: tone.tone_id,
                tone_name: tone.tone_name,
                score: tone.score
            });
        });

        tonesToInsert.push(model);
    });

    ToneData.collection.insert(tonesToInsert);
};

function toneAggregation(res) {
    ToneData.aggregate([
        { $unwind: '$tones' },
        {
            $group: {
                '_id': {
                    'category_id': '$category_id',
                    'category_name': '$category_name',
                    'tone_id': '$tones.tone_id',
                    'tone_name': '$tones.tone_name'
                },
                'average_value': { '$avg': '$tones.score' }
            }
        },
        {
            $group: {
                '_id': {
                    'category_id': '$_id.category_id',
                    'category_name': '$_id.category_name',
                },
                'tones': {
                    '$push': {
                        'tone_id': '$_id.tone_id',
                        'tone_name': '$_id.tone_name',
                        'average_value': '$average_value'
                    }
                }
            }
        }
    ], function (err, aggregationResult) {
        if (err) {
            return res.status(500).json({ ok: false, error_type: 'internal', error: 'was not able to aggregate tone data' });
        }
        return res.json({ ok: true, result: aggregationResult });
    });
};
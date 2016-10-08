'use strict';

var ToneData = require('../models/toneData');

module.exports = {
    storeTone: storeTone
};

function storeTone(toneResult) {

    var tonesToInsert = [];

    toneResult.document_tone.tone_categories.forEach(function(toneCategory){
        toneCategory.tones.forEach(function(tone){
            tonesToInsert.push({
                tone_id: tone.tone_id,
                score: tone.score
            });
        });
    });

    ToneData.collection.insert(tonesToInsert);
};
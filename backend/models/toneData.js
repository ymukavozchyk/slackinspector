'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var toneDataSchema = new Schema({
    category_id: String,
    category_name: String,
    tones: [
        {
            tone_id: String,
            tone_name: String,
            score: Number
        }
    ]
});

module.exports = mongoose.model('ToneData', toneDataSchema);
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var toneDataSchema = new schema({
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
var mongoose = require('mongoose');
var schema = mongoose.Schema;

var toneDataSchema = new schema({
    tone_id: String,
    score: Number
});

module.exports = mongoose.model('ToneData', toneDataSchema);
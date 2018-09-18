var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// User Mongoose Schema
var player = new Schema({
    imageLink:{ type: String, required: true},
    playerName: { type: String, required: true},
    Position: { type: String, required: true},
    Height: { type: String, required: true},
    Weight: { type: String, required: true},
    DOB: { type: String, required: true},
    Debut: { type: String, required: true},
    Games: { type: String, required: true},
    Goals: { type: String, required: true},
    Cards: { type: String, required: false},
    point: { type: Number, required: false},
});
module.exports = mongoose.model('Player',player);


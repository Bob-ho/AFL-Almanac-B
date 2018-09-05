var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// User Mongoose Schema
var collection = new Schema({
    username: { type: String, required: true},
    playerID: { type: String, required: true},
    
    
});

module.exports = mongoose.model('Collection',collection);

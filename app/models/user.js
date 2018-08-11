var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt-nodejs");
// User Mongoose Schema
var UserSchema = new Schema({
    username: { type: String, lowercase: true, required: true, unique: true},
    password: { type: String, required: true},
    email: { type: String, required: true, lowercase: true},
});
UserSchema.pre('save', function(next) {
    var user = this;
    //using bcriypt to encript the password
    bcrypt.hash(user.password, null, null, function(err, hash) {
        user.password = hash;
         
    next();
    });
  });
  //Compare the password if it is match
  UserSchema.methods.ComparePassword = function(passwordToCompare)
  {
      return bcrypt.compareSync(passwordToCompare,this.password);
  }


module.exports = mongoose.model('User',UserSchema);
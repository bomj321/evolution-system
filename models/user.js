'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var UserSchema = Schema({
    fullName: String,
    email: String,
    password: String,
}, { versionKey: false });

UserSchema.methods.toJSON = function(){
    let obj = this.toObject();
    delete obj.password;
    return obj;
}


module.exports = mongoose.model('User', UserSchema);
//lowercase and pluralize User => users
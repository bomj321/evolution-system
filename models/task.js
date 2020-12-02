'use strict'

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');
var Schema = mongoose.Schema;

var TaskSchema = Schema({
    title: String,
    content: String,
    exp: Date,
    priority: String,
    user: { type: Schema.ObjectId, ref: 'User' },
});

//Load pagination in Schema

TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema);
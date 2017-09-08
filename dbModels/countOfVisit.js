var mongoose  = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var cookieSchema =  new Schema({
    countMe: ObjectId,
    countOfVisit : Number,
    date: {type: Date, default: Date.now}
});

var Cookie = mongoose.model('CountOfVisit', cookieSchema);
module.exports = Cookie;
var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var headerSchema =  new Schema({
    requestUrl: String,
    requestMethod: String,
    remoteAddress: String,
    userAgent: String,
    host: String,
    cookie: String,
    date: {type: Date, default: Date.now}
});

var Header = mongoose.model('Header', headerSchema);
module.exports = Header;
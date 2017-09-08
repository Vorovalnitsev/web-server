var mongoose  = require('mongoose');

var Schema = mongoose.Schema;

var headerSchema =  new Schema({
    login: String,
    password: String,
    date: {type: Date, default: Date.now}
});

var Account = mongoose.model('Account', headerSchema);
module.exports = Account;
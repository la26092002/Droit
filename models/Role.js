const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const RoleSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('role', RoleSchema);
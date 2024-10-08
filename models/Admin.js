const mongoose = require('mongoose');
//const Schema = mongoose.Schema;
const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    numberPhone: {
        type: String,
        require: true
    },
    status: {
        type: Date,
        require: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Admin', AdminSchema);
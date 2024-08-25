const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        require: true
    },
    firstPersonName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    numberPhone: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('company', CompanySchema);

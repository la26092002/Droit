const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ConsultationSchema = new mongoose.Schema({
    name: {
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
    contentName: {
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

module.exports = mongoose.model('consultation', ConsultationSchema);

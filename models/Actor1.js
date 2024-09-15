const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Acor1Schema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
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
    birthday: {
        type: String,
        require: true
    },
    numberPhone: {
        type: String,
        require: true
    },
    professionalCardNumber: {
        type: String,
        require: true
    },
    judicialCouncil: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'judicialCouncil'
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role'
    },
    status: {
        type: Boolean,
        default: false,
    },
    subscribes: [
        {
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date,
                required: true
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('actor1', Acor1Schema);
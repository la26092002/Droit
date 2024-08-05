const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const judicialCouncilSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    willaya: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Product = mongoose.model('judicialCouncil', judicialCouncilSchema);
const mongoose = require('mongoose')

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

module.exports = mongoose.model('judicialCouncil', judicialCouncilSchema);
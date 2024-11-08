const mongoose = require('mongoose');
//const config = require('config');
require('dotenv').config();
const db = process.env.mongoURI;
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000, // Increase timeout to 30 seconds
          })

        //console.log("Mongo URI:", db);

        console.log('MongoDB Connected...')
    } catch (err) {
        console.error(err.message)
        //Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB

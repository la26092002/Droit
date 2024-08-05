const express = require('express');
const dotenv = require('dotenv')
const connectDB = require('./config/db');
const cors = require('cors')
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');



const app = express();
dotenv.config();

// Connect Database
connectDB();

// Enable CORS
app.use(cors());

// Body parser middleware
app.use(express.json());

app.use(helmet());


//rateLimit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);


// Define Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/DataInserted', require('./routes/api/insertedData'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`));
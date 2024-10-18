const express = require('express');

const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. Middleware
app.use(morgan('dev'));

app.use(express.json());


// 2. Route Handlers







// 3. Routes

    app.use('/api/v1/tours', tourRouter);
    app.use('/api/v1/users', userRouter);

module.exports = app;
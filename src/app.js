const express = require('express');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
require('./db/mongoose'); // CONNECT TO DATABASE

const app = express();

// MIDDLEWARES
app.use(express.json()); // body-parser

// ROUTES
app.use('/users', userRouter);
app.use('/tasks', taskRouter);

module.exports = app;

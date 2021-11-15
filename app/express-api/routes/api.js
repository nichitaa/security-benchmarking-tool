const express = require('express');
const fileRouter = require('./file');
const regeditRouter = require('./regeditRouter');
const authRouter = require('./auth')

const app = express();

app.use('/file/', fileRouter);

app.use('/regedit/', regeditRouter);

app.use('/auth/', authRouter)

module.exports = app;

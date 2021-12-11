const express = require('express');
const fileRouter = require('./file');
const regeditRouter = require('./regeditRouter');
const authRouter = require('./auth');
const emailVerificationRouter = require('./emailVerification')

const app = express();

app.use('/file/', fileRouter);

app.use('/regedit/', regeditRouter);

app.use('/auth/', authRouter);

app.use('/email/', emailVerificationRouter);

module.exports = app;

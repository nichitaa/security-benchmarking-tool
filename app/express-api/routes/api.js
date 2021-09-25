const express = require('express');
const fileRouter = require('./file');
const regeditRouter = require('./regeditRouter')

const app = express();

app.use('/file/', fileRouter);

app.use('/regedit/', regeditRouter);

module.exports = app;

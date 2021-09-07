const express = require('express');
const fileRouter = require('./file');

const app = express();

app.use('/file/', fileRouter);

module.exports = app;

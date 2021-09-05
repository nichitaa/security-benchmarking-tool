const express = require('express');
const fileRouter = require('./fileUploadRounter');

const app = express();

app.use('/fileUpload/', fileRouter);

module.exports = app;

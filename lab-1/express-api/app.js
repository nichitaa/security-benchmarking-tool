const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// api
const apiRouter = require('./routes/api');

// config
require("dotenv").config();

// db
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require('mongoose');
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
	//don't show the log when it is test
	if(process.env.NODE_ENV !== "test") {
		console.log("Connected to %s", MONGODB_URL);
		console.log("Express app is running on PORT: 8080");
	}
})
	.catch(err => {
		console.error("App starting error:", err.message);
		process.exit(1);
	});
const db = mongoose.connection;

// express
const app = express();

//don't show the log when it is test
if(process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}

// middleware
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(cors());

// api route
app.use("/api/", apiRouter);

// default 404
app.all("*", function(_, res) {
	return res.send(404);
});

module.exports = app;

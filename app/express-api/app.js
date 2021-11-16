const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const apiRouter = require('./routes/api');

// config
require('dotenv').config();

// db
const MONGODB_URL = process.env.MONGODB_URL;
const mongoose = require('mongoose');
console.log(MONGODB_URL);
mongoose.connect(MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        //don't show the log when it is test
        if (process.env.NODE_ENV !== 'test') {
            console.log('Connected to %s', MONGODB_URL);
            console.log('Express app is running on PORT: 8080');
        }
    })
    .catch(err => {
        console.error('App starting error:', err.message);
        process.exit(1);
    });
const db = mongoose.connection;

// express
const app = express();

//don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

// middleware
app.use(cookieSession({
    name: 'session',
    keys: ['secred'],
    maxAge: 24 * 60 * 60 * 100
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}));

// passport auth strategies [github, google, twitter]
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));
passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback'
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }
));
passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: '/api/auth/twitter/callback',
        includeEmail: true
    },
    (token, tokenSecret, profile, done) => {
        console.log(
            'profile: ', profile
        );
        done(null, profile);
    }
));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


// api route
app.use('/api/', apiRouter);

// default 404
app.all('*', function (_, res) {
    return res.send(404);
});

module.exports = app;

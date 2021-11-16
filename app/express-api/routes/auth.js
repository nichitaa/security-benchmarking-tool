const express = require('express');
const passport = require('passport');
const router = express.Router();


/**
 * General passport auth endpoints
 */
router.get('/login/failed', (req, res, next) => {
    res.redirect('http://localhost:3000');
});
router.get('/login/success', (req, res, next) => {
    if (req.user) {
        res.json({isSuccess: true, user: req.user, cookies: req.cookies}).status(401);
    } else res.json({isSuccess: false, message: 'Failed to login!'}).status(401);
});
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('http://localhost:3000');
});

/**
 * Google
 */
router.get('google/logout');
router.get('/google', passport.authenticate('google', {scope: ['profile']}));
router.get('/google/callback', passport.authenticate('google', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/login/failed'
}));

/**
 * Github
 */
router.get('github/logout');
router.get('/github', passport.authenticate('github', {scope: ['profile']}));
router.get('/github/callback', passport.authenticate('github', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/login/failed'
}));

/**
 * Twitter
 */
router.get('twitter/logout');
router.get('/twitter', passport.authenticate('twitter', {scope: ['profile']}));
router.get('/twitter/callback', passport.authenticate('twitter', {
    successRedirect: 'http://localhost:3000',
    failureRedirect: '/login/failed'
}));

module.exports = router;
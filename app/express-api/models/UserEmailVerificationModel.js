const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserEmailVerification = new Schema({
    email: {type: String},
    token: {
        iv: {type: String},
        content: {type: String}
    },
    isVerified: {type: Boolean}
}, {timestamps: true});

const UserEmailVerificationModel = mongoose.model('UserEmailVerification', UserEmailVerification)

module.exports = {UserEmailVerificationModel};

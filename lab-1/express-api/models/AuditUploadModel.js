const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuditUploadSchema = new Schema({
    fileName: { type: String, required: false },
    fileData: { type: Buffer, required: false }
}, { timestamps: true });

module.exports = mongoose.model('AuditUpload', AuditUploadSchema);

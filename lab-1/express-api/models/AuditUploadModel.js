const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuditUploadSchema = new Schema({
    fileName: { type: String, required: false },
    auditFile: {
        data: Buffer,
        contentType: String
    }
}, { timestamps: true });

module.exports = mongoose.model('AuditUpload', AuditUploadSchema);

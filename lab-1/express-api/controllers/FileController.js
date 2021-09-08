const AuditUpload = require('../models/AuditUploadModel');
const fs = require('fs');
const path = require('path');

class FileController {

    async uploadFile(req, res, next) {
        const obj = {
            fileName: req.file.originalname,
            auditFile: {
                data: fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.originalname)),
                contentType: 'audit'
            }
        };
        // parse file content (xml - like text)

        AuditUpload.create(obj, (err, item) => {
            if (err) {
                console.log('error: ', err);
                res.status(500).json({
                    isSuccess: false
                });
            } else {
                console.log('success: ');
                res.send({
                    isSuccess: true
                });
            }
        });
    }

    async getAllFiles(req, res, next) {
        await AuditUpload.find({}, (err, items) => {
            console.log('items: ', items);
            if (err) {
                res.status(500).send({
                    isSuccess: false
                });
            } else {
                res.send({
                    isSuccess: true,
                    files: items
                });
            }
        });
    }

    async fileExistsByName(req, res, next) {
        const filename = req.params.filename;
        const found = await AuditUpload.findOne({ fileName: filename });
        console.log('found: ', found);
        if (found !== null) {
            res.send({
                exists: true
            });
        } else {
            res.send({
                exists: false
            });
        }
    }

    async downloadFileByName(req, res, next) {
        const filename = req.params.filename;
        const filepath = path.join(__dirname + '/../uploads/' + filename);
        fs.readFile(filepath, (err, data) => {
            if (err) return next(err);
            res.setHeader('Content-Disposition', 'attachment: filename="' + '"');
            res.send(data);
        });
    }

    async deleteFileByName(req, res, next) {
        const filename = req.params.filename;
        const filepath = path.join(__dirname + '/../uploads/' + filename);
        await fs.unlinkSync(filepath);
        AuditUpload.findOneAndRemove({ fileName: filename }, (err) => {
            if (err) {
                res.status(500).json({
                    isSuccess: false,
                    error: err.message
                });
            } else {
                res.send({
                    isSuccess: true,
                    message: 'file was deleted'
                });
            }
        });
    }
}

module.exports = FileController;


const express = require('express');
const AuditUpload = require('../models/AuditUploadModel');
const router = express.Router();

// TODO: handle with controller
router.post('/', async (req, res, next) => {
    const body = req.body;
    const file = body.file;
    const fileName = body.fileName;
    if (file && fileName) {
        let buffer = new Buffer(file, 'base64');
        try {
            await AuditUpload.create({
                fileName: fileName,
                fileData: buffer
            });
            res.send({
                isSuccess: true,
                message: 'Audit file saved successfully!'
            });
        } catch (e) {
            res.send({
                isSuccess: false,
                error: e.message
            });
        }
    }

});

router.get('/', async (req, res, next) => {
    const data = await AuditUpload.find({})
    res.send({
        isSuccess: true,
        data: data
    })
})

module.exports = router;

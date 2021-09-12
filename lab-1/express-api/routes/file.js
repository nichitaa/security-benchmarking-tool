const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FileController = require('../controllers/FileController');

const router = express.Router();
const controller = new FileController;

const createUploadsFolder = () => {
    const dir = path.join(__dirname + '/../uploads/');
    !fs.existsSync(dir) && fs.mkdirSync(dir);
};
createUploadsFolder();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// upload file
router.post('/', upload.single('file'), controller.uploadFile.bind(controller));

// delete file
router.delete('/:filename', controller.deleteFileByName);

// gets all files
router.get('/', controller.getAllFiles);

// return true/false if file exists
router.get('/exists/:filename', controller.fileExistsByName);

// download file
router.get('/download/:filename', controller.downloadFileByName);

// test parse
router.post('/parse', controller.parseAuditFile);

// insert new audit
router.post('/insert', controller.insertAudit);


module.exports = router;

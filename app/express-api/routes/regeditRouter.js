const express = require('express');
const AuditRegeditController = require('../controllers/AuditRegeditController');

const router = express.Router();
const controller = new AuditRegeditController();


router.post('/', controller.testPolicy);

// single item
router.post('/enforce', controller.enforcePolicy);

router.post('/batch_enforce', controller.batchEnforce);

router.post('/backup', controller.backupRegistry);

module.exports = router;
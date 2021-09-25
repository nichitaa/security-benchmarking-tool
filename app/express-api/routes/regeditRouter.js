const express = require('express');
const fs = require('fs');
const path = require('path');
const AuditRegeditController = require('../controllers/AuditRegeditController')

const router = express.Router();
const controller = new AuditRegeditController()


router.post('/', controller.testPolicy)

module.exports = router;
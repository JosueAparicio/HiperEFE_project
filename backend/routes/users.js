'use strict'

var express = require('express');
const controller = require('../controllers/users');


var router = express.Router();

//rutas
router.get('/sendWelcomeEmail/:email', controller.sendWelcomeEmail);
router.get('/sendReportedEmail/:email', controller.sendReportedEmail);
router.post('/revImage', controller.revImage);

router.get('/sendDeleteEmail/:email/:teacher/:reason/:nameRoom', controller.sendDeleteEmail);



module.exports = router;

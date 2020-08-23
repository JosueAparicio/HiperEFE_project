'use strict'

var express = require('express');
const controller = require('../controllers/users');


var router = express.Router();

//rutas
router.get('/sendWelcomeEmail/:email', controller.sendWelcomeEmail);



module.exports = router;



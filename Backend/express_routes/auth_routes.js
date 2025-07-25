const express = require('express');
const router = express.Router();
const authController = require('../express_controller/auth_controller');

router.post('/login', authController.loginUser);

router.get('/logout', authController.logoutUser);

module.exports = router;

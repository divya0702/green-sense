const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUser } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/forgot-password', updateUser);


module.exports = router;

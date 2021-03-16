const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/add_projeto', authController.add_projeto);
router.post('/add_naver', authController.add_naver);


module.exports = router;
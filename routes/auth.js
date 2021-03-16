const express = require("express");
const authController = require("../controllers/auth");
const {createTokens, validateToken} = require("../JWT.js");

const router = express.Router();





router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/add_projeto', validateToken, authController.add_projeto);
router.post('/add_naver', validateToken, authController.add_naver);
router.get('/list_navers', validateToken, authController.list_navers)
router.get('/list_projetos', validateToken, authController.list_projetos)

module.exports = router;
const express = require("express");
const authController = require("../controllers/auth");
const {createTokens, validateToken} = require("../JWT.js");

const router = express.Router();



// router.get('/teste', authController.teste);


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/add_projeto', validateToken, authController.add_projeto);
router.post('/add_naver', validateToken, authController.add_naver);

router.get('/list_navers', validateToken, authController.list_navers);
router.put('/list_navers_by_id/:field', validateToken, authController.list_navers_by_id);
router.put('/list_navers_by_id_projeto/:field', validateToken, authController.list_navers_by_id_projeto);

router.get('/list_projetos', validateToken, authController.list_projetos);
router.put('/list_projetos_by_id/:field', validateToken, authController.list_projetos_by_id);
router.put('/list_projetos_by_id_naver/:field', validateToken, authController.list_projetos_by_id_naver);


router.put('/update_projeto/:id_projeto', validateToken, authController.update_projeto);
router.put('/update_naver', validateToken, authController.update_naver);

router.delete('/delete_projeto/:id_projeto', validateToken, authController.delete_projeto);
router.delete('/delete_naver/', validateToken, authController.delete_naver);



module.exports = router;
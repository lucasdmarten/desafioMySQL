const express = require("express");
const authController = require("../controllers/auth");
const {createTokens, validateToken} = require("../JWT.js");

const router = express.Router();



// router.get('/teste', authController.teste);


router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/add_project', validateToken, authController.add_project);
router.post('/add_naver', validateToken, authController.add_naver);

router.get('/list_navers', validateToken, authController.list_navers);
// router.put('/list_navers_by_id/:field', validateToken, authController.list_navers_by_id);
// router.put('/list_navers_by_id_project/:field', validateToken, authController.list_navers_by_id_projeto);

router.get('/list_projects', validateToken, authController.list_projects);
// router.put('/list_projects_by_id/:field', validateToken, authController.list_projects_by_id);
// router.put('/list_projects_by_id_naver/:field', validateToken, authController.list_projects_by_id_naver);


router.put('/update_project/:id_project', validateToken, authController.update_project);
router.put('/update_naver', validateToken, authController.update_naver);

router.delete('/delete_project/:id_project', validateToken, authController.delete_project);
router.delete('/delete_naver/', validateToken, authController.delete_naver);



module.exports = router;
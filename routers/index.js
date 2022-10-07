import { Router } from "express";
import { body } from "express-validator";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
const router = new Router();

router.post('/auth/register',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  userController.registration);

router.post('/auth/login', userController.login);
router.post('/auth/logout', userController.logout);
router.post('/user/getitem', userController.getUserItem);
router.post('/createCases', userController.createCases);
router.get('/activate/:link', userController.activate);
router.get('/refresh',userController.refresh);
router.get('/users',  userController.getUsers);
router.get('/', userController.loginSt);
router.get('/auth/user', userController.getUser);
router.get('/casesList', userController.getCasesList);
//router.get('/user/steam', userController.getUserInfoSteam);


export default router
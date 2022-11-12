import { Router } from "express";
import { body } from "express-validator";
import adminController from "../controllers/admin-controller.js";
import userController from "../controllers/user-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = new Router();

router.get('/auth/logout', userController.logout);
router.post('/user/getitem', userController.getUserItem);
router.post('/createCases', userController.createCases);
router.post('/openCases/:id', userController.openCase);

router.get('/users',  userController.getUsers);
router.get('/auth/user', userController.getUser);
router.get('/casesList', userController.getCasesList);
router.get('/casesItem/:id', userController.getCasesItem);


//AdminDashboard
router.get('/admin/product/weapon', adminController.getWeaponList);
router.post('/admin/product/addCases', adminController.addCases);

export default router
import userService from "../config/user-service.js";
import { validationResult } from "express-validator"
import ApiError from "../exceptions/api-error.js";
import api from 'steam-js-api'
import caseService from "../config/case-service.js";

class UserController {

  

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async loginSteam(req, res, next) {
    try {
      const steamData = req.user;
      const cookieHeader = req.cookies.sessionAuth;

      const userData = await userService.loginSteam(steamData, cookieHeader);

      res.cookie('sessionAuth', cookieHeader, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

      return res.redirect('http://localhost:3000');

    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    
    try {
      res.clearCookie('sessionAuth');


      return res.json({
        logout: true
      });

    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { sessionAuth } = req.cookies;
      const user = await userService.getUserData(sessionAuth);
      res.json(user);
    } catch (error) {
      //next(error)
      return res.status(401).json({
        message: 'Пользователь не авторизован'
      })
    }
  }

 /* async getUserInfoSteam(req, res, next) {
    api.setKey('9929C73FDB244A3B7C60D880D19F88EE');
    //const steam = new steamApi('9929C73FDB244A3B7C60D880D19F88EE');
    const moreInfo = true;
    let result
    try {
      result = await api.getOwnedGames("76561199127994838", 730, moreInfo);
      res.json(result);
    } catch (error) {
      next(error)
      return res.status(401).json({
        message: 'Пользователь не авторизован'
      })
    }
  }*/

  async getUserItem(req, res, next) {
    try {
      const items = req.body;
      const userData = await userService.getUserItem(items);
      return res.status(200).json({
        message: 'Успешно'
      })
    } catch (error) {
      next(error)
    }

  }

  async createCases(req, res, next) {
    try {
      const items = req.body;
      const casesData = await caseService.createCases(items);
      return res.status(200).json({
        message: 'Успешно'
      })
    } catch (error) {
      next(error)
    }
  }

  async getCasesList(req, res, next) {
    try {
      const casesData = await caseService.getAllCases();
      res.json(casesData);
    } catch (error) {
      next(error)
    }
  }

  async getCasesItem(req, res, next) {
    const {id} = req.params
    try {
      const casesData = await caseService.getCase(id);
      res.json(casesData);
    } catch (error) {
      next(error)
    }
  }

  async openCase(req, res, next) {
    const {id} = req.params
    const {user} = req.body
    try {
      const casesOpen = await caseService.openCase(user, id);
      res.json(casesOpen);
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController();
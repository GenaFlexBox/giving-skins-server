import userService from "../config/user-service.js";
import { validationResult } from "express-validator"
import ApiError from "../exceptions/api-error.js";
import api from 'steam-js-api'
import caseService from "../config/case-service.js";

class UserController {

  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
      }

      const {email, name, password} = req.body;
      const userData = await userService.registration(email, name, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true,})

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true,})

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true,})

      return res.json(userData);
      
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const {steamID} = req.cookies;
      console.log(steamID, 'cookie');
      res.clearCookie('steamID');
      return res.json()
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async loginSt(req, res, next) {
    try {
      const steamData = req.user;
      const userData = await userService.loginSteam(steamData);
      res.cookie('steamID', userData.user.steamID, {maxAge: 30 * 24 * 60 * 60 *1000, httpOnly: true,})
      return res.redirect('http://localhost:3000')
    } catch (error) {
      next(error);
    }
  }

  async getUser(req, res, next) {
    try {
      const { steamID } = req.cookies;
      const user = await userService.getUserData(steamID);
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
}

export default new UserController();
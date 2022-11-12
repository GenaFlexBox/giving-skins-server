import bcrypt from "bcrypt";
import userModel from "../model/userModel.js";
import { v4 as uuidv4 } from 'uuid';
import tokenService from "./token-service.js";
import ApiError from "../exceptions/api-error.js";
import userSteam from "../model/userSteam.js";
import UserDto from "../dtos/userDtos.js";
import UserDtoSteam from "../dtos/userDtosSteam.js";

const URL = "http://localhost:5000"

class UserService {

  async getAllUsers() {
    const users = await userSteam.find();
    return users;
  }

  async loginSteam(steamData, key) {
  
    if (steamData?.id === undefined) {
      throw ApiError.UnauthorizedError();
    }
    
    const steamID  = steamData.id

    const userFind = await userSteam.findOne({steamID});

    if(userFind) {
      const userDto = new UserDtoSteam(userFind)
      const updateSessionKey  = await userSteam.updateOne({ steamID: steamID}, {sessionKey: key})
      return {
        user: userDto
      }
    } 

    const user = await userSteam.create({
      steamID: steamData.id,
      identifier: steamData.identifier,
      profilestate: steamData._json.profilestate,
      profileurl: steamData._json.profileurl,
      displayName: steamData.displayName,
      photos: steamData.photos[0].value,
      sessionKey: key
    });
  
    const userDto = new UserDtoSteam(user)
  
    return {
      user: userDto
    }
  }

  async userLogout() {
    
  }

  async getUserData(sessionKey) {

    if (!sessionKey) {
      throw ApiError.UnauthorizedError();
    }
    const userSessionKey = sessionKey;

    const userData = await userSteam.findOne({sessionKey: userSessionKey});
    
    if (!userData) {
      throw ApiError.UnauthorizedError();
    }

    return userData;
  }

  async getUserItem(item) {
    const {user, id, name, image, rare} = item;

    if (!user) {
      throw ApiError.UnauthorizedError();
    }

    const userSteamID = user;
    const obj = {
      status: 'storage',
      id,
      name,
      image,
      rare
    }
    const userdat = await userSteam.updateOne({steamID: userSteamID}, {$push: {inventarySite: obj}});
    
  
    if (!userdat) {
      throw ApiError.UnauthorizedError();
    }

    return userdat;
  }

}

export default new UserService();
import bcrypt from "bcrypt";
import userModel from "../model/userModel.js";
import { v4 as uuidv4 } from 'uuid';
import tokenService from "./token-service.js";
import mailService from "./mail-service.js";
import ApiError from "../exceptions/api-error.js";
import userSteam from "../model/userSteam.js";
import UserDto from "../dtos/userDtos.js";
import UserDtoSteam from "../dtos/userDtosSteam.js";



const URL = "http://localhost:5000"

class UserService {

  async registration(email, name, password) {
    
    const candidate = await userModel.findOne({email});

    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
    }
    
    const hashPassowrd =  await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await userModel.create({email, name, password: hashPassowrd, activationLink});
    await mailService.sendActivationLink(email, `${URL}/api/activate/${activationLink}`);

    const userDto = new UserDto(user)
    const tokens = tokenService.genarateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async activate(activationLink) {
    const user = await userModel.findOne({activationLink})

    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }

    user.isActivated = true;
    await user.save();
  }

  async login(email, password) {
    const user = await userModel.findOne({email})
    if (!user) {
      throw ApiError.BadRequest('Неверный email или пароль')
    }

    const  isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Неверный email или пароль')
    }

    const userDto = new UserDto(user);
    const tokens = tokenService.genarateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFindDb = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFindDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await userModel.findById(userData.id)
    const userDto = new UserDto(user);
    const tokens = tokenService.genarateToken({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto
    }
  }

  async getAllUsers() {
    const users = await userSteam.find();
    return users;
  }

  async loginSteam(steamData) {
    const steamID  = steamData.id
    
    const userFind = await userSteam.findOne({steamID});

    if(userFind) {
      const userDto = new UserDtoSteam(userFind)
      
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
      photos: steamData.photos,
    });
  
    const userDto = new UserDtoSteam(user)
  
    return {
      user: userDto
    }
  }

  async getUserData(steamId) {
    //console.log(steamId);
    if (!steamId) {
      throw ApiError.UnauthorizedError();
    }
    const userSteamID = steamId;
    const userData = await userSteam.findOne({steamID: userSteamID});
    //console.log(userData, 'steam id get');
    
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
import tokenService from "../config/token-service.js";
import ApiError from "../exceptions/api-error.js";

export default function(req, res, next) {
  try {
    const authtorizationHeader = req.headers.authorization;
    if (!authtorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
  /*
    const accessToken = authtorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
  */
    req.user = userData;
    next();

  } catch (error) {
    next(error)
  }
}
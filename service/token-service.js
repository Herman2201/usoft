import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/api-error.js';

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '30d',
    });
    return accessToken;
  }

  generateTokensResetPassword(payload) {
    const resetToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '15m',
    });
    return resetToken;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      throw ApiError.TokenKiller('token invalid, authorization repeat pleas');
    }
  }
}

export default new TokenService();

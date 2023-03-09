import User from '../models/User.js';
import encrypt from '../encrypt.js';
import SendMail from '../service/send-mail.js';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error.js';
import UserDto from '../dtos/user-dto.js';
import TokenService from '../service/token-service.js';

class Authorization {
  async authRegister(req, res, next) {
    try {
      const { login, password, email } = req.body;
      const sendMassege = new SendMail();
      const enpryptPassword = encrypt(password);
      const token = TokenService.generateTokens({
        login,
        password: enpryptPassword,
        email,
      });
      const fixToken = token.split('.').join('~');
      sendMassege.send(email, fixToken, 'activate').then(() => {
        res.json({ massage: 'Confirm mail' });
      });
    } catch (err) {
      next(err);
    }
  }
  async authLogin(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { login, password } = req.body;
      const enpryptPassword = encrypt(password);
      const userData = await User.initUser('login', login);
      if (userData.password !== enpryptPassword) {
        next(ApiError.IncorrectData('Username or password is incorrect'));
      }
      const userDto = new UserDto(userData);

      const accessToken = TokenService.generateTokens({ ...userDto });
      User.saveToken(accessToken, login);
      res.status(200);
      res.json({
        massage: 'You authorization, welcome!',
        accessToken,
        currentUser: userDto,
      });
    } catch (err) {
      next(err);
    }
  }
  async authLogout(req, res, next) {
    try {
      const { token } = req.params;
      const user = TokenService.validateAccessToken(token);
      await User.logout(user.id);
      res.status(200);
      res.json({
        massage: `${user.login} logout, see you later`,
      });
    } catch (err) {
      next(err);
    }
  }
  async authSendPasswordReset(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Bad request', errors.array()));
      }
      const { email } = req.body;
      const sendMassage = new SendMail();
      const user = await User.initUser('email', email);
      const token = TokenService.generateTokensResetPassword({ ...user });
      console.log(user);
      await User.saveToken(token, user.login);
      const fixToken = token.split('.').join('~');
      sendMassage.send(email, fixToken, 'reset').then(() => {
        res.json({ massage: 'Send massage reset' });
      });
    } catch (err) {
      next(err);
    }
  }
  async authPasswordResetToken(req, res, next) {
    try {
      const errors = validationResult(req);
      const { resetPassword, resetConfirmPassword } = req.body;
      if (resetPassword !== resetConfirmPassword) {
        errors.errors.push({
          value: 'password',
          msg: 'Passwords do not match',
          param: 'password',
          location: 'body',
        });
      }
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Validation error', errors.array()));
      }
      const { token } = req.params;
      const enpryptPassword = encrypt(resetPassword);
      const { id } = TokenService.validateAccessToken(token);
      await User.resetPassword(id, 'password', enpryptPassword);
      await User.deleteToken(id);
      res.json({ massage: 'password reset' });
    } catch (err) {
      next(err);
    }
  }

  async authActiveEmail(req, res, next) {
    try {
      const { token } = req.params;
      const tokenData = TokenService.validateAccessToken(token);
      await User.saveUser(tokenData);
      res.status(201);
      res.json({
        massage: 'gmail active, thanks for creating account',
      });
    } catch (err) {
      next(err);
    }
  }
  async validToken(req, res, next) {
    try {
      const { token } = req.params;
      const { id } = TokenService.validateAccessToken(token);
      const userToken = await User.getValue(id, 'token');
      if (userToken.token !== token) {
        next(ApiError.TokenKiller('token invalid, authorization repeat pleas'));
      }
      res.json({ massage: 'OK' });
    } catch (err) {
      next(err);
    }
  }
}

export default Authorization;

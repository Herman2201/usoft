import User from '../models/User.js';
import encrypt from '../encrypt.js';
import SendMail from '../service/send-mail.js';
import jwt from 'jsonwebtoken';
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
      sendMassege.send(email, token, 'activate');
      res.json({ massage: 'send mail' });
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

      const accsessToken = TokenService.generateTokens({ ...userDto });
      User.saveToken(accsessToken, login);
      res.status(200);
      res.json({
        massage: 'You authorization, welcome!',
        accsessToken,
      });
    } catch (err) {
      next(err);
    }
  }
  authLogout(req, res, next) {
    try {
      const { token } = req.params;
      const user = TokenService.validateAccessToken(token);
      User.logout(user.id);
      res.status(200);
      res.locals.active = false;
      res.json({
        massage: 'User logout, see you later',
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
      sendMassage.send(email, token, 'reset');
      res.json({ massage: 'send massage reset' });
    } catch (err) {
      next(err);
    }
  }
  async authPasswordResetToken(req, res, next) {
    try {
      const errors = validationResult(req);
      const { reset_password, reset_confirm_password } = req.body;
      if (reset_password !== reset_confirm_password) {
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
      const enpryptPassword = encrypt(reset_password);
      const { id } = TokenService.validateAccessToken(token);
      await User.resetPassword(id, 'password', enpryptPassword);
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
}

export default Authorization;

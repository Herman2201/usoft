import ApiError from '../exceptions/api-error.js';
import User from '../models/User.js';
import TokenService from '../service/token-service.js';
import { validationResult } from 'express-validator';

export default async (req, _res, next) => {
  try {
    const errors = validationResult(req);
    const { id, token } = req.params;
    const userEmail = await User.getValue(id, 'email');
    const dataToken = TokenService.validateAccessToken(token);
    if (id !== dataToken.id) {
      next(ApiError.AccessDenied("Нou can't update another user's data"));
    }
    const { login, email, password, passwordConfirm } = req.body;
    if (email !== userEmail.email) {
      if (await User.isEqualEmail(email)) {
        errors.errors.push({
          value: email,
          msg: 'Already exist',
          param: 'email',
          location: 'body',
        });
      }
    }
    if (login !== dataToken.login) {
      if (await User.isEqualLogin(login)) {
        errors.errors.push({
          value: login,
          msg: 'Already exist',
          param: 'login',
          location: 'body',
        });
      }
    }
    if (password !== passwordConfirm) {
      errors.errors.push({
        value: 'password',
        msg: 'Passwords do not match',
        param: 'password',
        location: 'body',
      });
    }

    if (!errors.isEmpty()) {
      next(ApiError.BadRequest('Bad Request', errors.array()));
    }
    next();
  } catch (err) {
    next(err);
  }
};

import ApiError from '../exceptions/api-error.js';
import Category from '../models/Category.js';
import { validationResult } from 'express-validator';

export default async (req, _res, next) => {
  const errors = validationResult(req);
  const { title } = req.body;
  const { id } = req.params;
  const category = await Category.findCategoryId(id);
  if ((await Category.isEqualCategory(title)) && category.title !== title) {
    errors.errors.push({
      value: title,
      msg: 'This category already exists',
      param: 'title',
      location: 'body',
    });
  }
  if (!errors.isEmpty()) {
    next(ApiError.BadRequest('Bad request', errors.array()));
  }
  next();
};

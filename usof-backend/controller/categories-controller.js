import Category from '../models/Category.js';
import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';
import { validationResult } from 'express-validator';
import Post from '../models/Post.js';

class Categories {
  async getAllCategory(_req, res) {
    const categories = await Category.getAllCategory();
    res.status(200);
    res.json({ massage: 'complete', categories: categories || 'Empty' });
  }
  async getCategoryById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findCategoryId(id);
      res.status(200);
      res.json({ massage: 'Category found', category });
    } catch (err) {
      next(err);
    }
  }
  async getAllPostByCategoryId(req, res) {
    const { id } = req.params;
    res.status(200);
    res.json({
      massage: 'complete',
      allPost: await Category.getAllPostByCategoryId(id),
    });
  }
  async createCategory(req, res, next) {
    try {
      const { title, description } = req.body;
      if (await Category.isEqualCategory(title)) {
        throw ApiError.AccessDenied('Category exists');
      }
      const infoCategory = await Category.saveCategory({ title, description });
      res.status(200);
      res.json({
        massage: `Create category ${title}`,
        infoCategory,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateCategoryData(req, res, next) {
    try {
      const data = req.body;
      const { id } = req.params;
      await Category.updateCategory(id, data);
      res.status(200);
      res.json({ massage: 'update category' });
    } catch (err) {
      next(err);
    }
  }
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.params;
      await Category.deleteCategory(id);
      res.status(200);
      res.json({ massage: 'delete category' });
    } catch (err) {
      next(err);
    }
  }
}

export default Categories;

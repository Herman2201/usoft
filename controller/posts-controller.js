import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import Like from '../models/Like.js';
import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';
import { validationResult } from 'express-validator';

class Posts {
  async getAllPosts(req, res) {
    const { page } = req.query;
    const parsedPage = page ? Number(page) : 1;
    const perPage = 10;
    const allPages = await Post.getAllPosts();
    const totalPages = Math.ceil(allPages.length / perPage);
    const usersFilter = allPages.slice(
      parsedPage * perPage - perPage,
      parsedPage * perPage
    );

    res.json({
      meta: { page: Number(page), perPage: Number(perPage), totalPages },
      data: usersFilter,
    });
  }
  async getPostsById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findPostId(id);
      res.json({ post });
    } catch (err) {
      next(err);
    }
  }
  async getCommentsByPostId(req, res, next) {
    try {
      const { id } = req.params;
      const comments = await Comment.getAllCommentPost(id);
      res.status(200);
      res.json({ massage: 'complete', comments: comments || 'Empty' });
    } catch (err) {
      next(err);
    }
  }
  async createComment(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Invalid ti', errors.array()));
      }
      const { comment } = req.body;
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      await Comment.createComment(author.id, id, comment);
      res.status(201);
      res.json({
        massage: 'create comment post',
      });
    } catch (err) {
      next(err);
    }
  }
  async getAllCategoriesByPostId(req, res) {
    const { id } = req.params;
    res.json({ category: await Post.getCategoriesPost(id) });
  }
  async getPostLike(req, res) {
    const { id } = req.params;
    const like = await Like.getPostLike(id);
    res.status(200);
    res.json({
      massage: 'complete',
      countLike: like.length,
      like: like.length !== 0 ? like : 'Empty',
    });
  }

  loadPicturePost(req, res) {
    const picture = req.file?.path;
    res.status(203);
    res.json({ massage: 'load picture', path: picture });
  }

  async createPost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Bad request', errors.array()));
      }
      const { title, content, picture, ...category } = req.body;
      await Post.isEqualTitlePost(title);
      const { token } = req.params;
      const { id } = TokenService.validateAccessToken(token);
      const idPost = await Post.createPost({
        id,
        title,
        content,
        picture,
      });
      await Post.addCategoryPost(idPost.id, category);
      res.status(201);
      res.json({ massage: 'create post' });
    } catch (err) {
      next(err);
    }
  }

  async createLikePost(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      await Like.createLikePost(id, author.id);
      res.status(201);
      res.json({ massage: 'Create like post' });
    } catch (err) {
      next(err);
    }
  }
  async updatePost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Bad request', errors.array()));
      }
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      const post = await Post.findPostId(id);
      if (post.id !== author.id) {
        next(ApiError.AccessDenied('Access denied, your ne tot Users'));
      }
      const { title, content, picture, ...category } = req.body;
      if (post.title !== title) {
        await Post.isEqualTitlePost(title);
      }
      await Post.updatePost({
        id,
        title,
        content,
      });
      await Post.updateCategoryPost(id, category);
      res.status(201);
      res.json({ massage: 'create post' });
    } catch (err) {
      next(err);
    }
  }
  async deletePost(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      const { author_id } = await Post.findPostId(id);
      if (author_id !== author.id) {
        next(ApiError.AccessDenied('Access denied, your ne tot User'));
      }
      await Post.deletePost(id);
      res.status(200);
      res.json({ massage: 'complete delete post' });
    } catch (err) {
      throw err;
    }
  }
  async deleteLikePost(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      await Like.deteleLikePost(id, author.id);
      res.status(200);
      res.json({ massage: 'Like delete' });
    } catch (err) {
      next(err);
    }
  }
}

export default Posts;

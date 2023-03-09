import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Like from '../models/Like.js';
import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';
import { validationResult } from 'express-validator';
import isEmpty from 'lodash/isEmpty.js';
import moment from 'moment';

class Posts {
  async getAllPosts(req, res) {
    const { page, ...params } = req.query;
    const parsedPage = page ? Number(page) : 1;
    const perPage = 10;
    const allPages = await Post.getAllPosts(params);
    const sortPages = allPages.sort(
      (a, b) =>
        moment(b.publish_date, 'DD.MM.YY, h:mm:ss') -
        moment(a.publish_date, 'DD.MM.YY, h:mm:ss')
    );

    const totalPages = Math.ceil(sortPages.length / perPage);
    const usersFilter = sortPages.slice(
      parsedPage * perPage - perPage,
      parsedPage * perPage
    );
    setTimeout(() => {
      res.json({
        meta: { page: Number(page), perPage: Number(perPage), totalPages },
        data: { ...usersFilter },
        filter: !isEmpty(params),
      });
    }, 2000);
  }
  async getPostsById(req, res, next) {
    try {
      const { id } = req.params;
      const post = await Post.findPostId(id);
      setTimeout(() => {
        res.json({ post });
      }, 2000);
    } catch (err) {
      next(err);
    }
  }
  async getCommentsByPostId(req, res, next) {
    try {
      const { id } = req.params;
      const comments = await Comment.getAllCommentPost(id);
      res.status(200);
      res.json({
        massage: 'complete',
        postId: id,
        countComments: comments.length,
        comments: comments || 'Empty',
      });
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
      const idComment = await Comment.createComment(author.id, id, comment);
      res.status(201);
      res.json({
        massage: 'create comment post',
        id_comment: idComment,
      });
    } catch (err) {
      next(err);
    }
  }
  async getAllCategoriesByPostId(req, res) {
    const { id } = req.params;
    res.json({ postId: id, category: await Post.getCategoriesPost(id) });
  }
  async getPostLike(req, res) {
    const { id } = req.params;
    const like = await Like.getPostLike(id);
    res.status(200);
    res.json({
      massage: 'complete',
      postId: id,
      countLike: like.length,
      like: like.length !== 0 ? like : 'Empty',
    });
  }

  loadPicturePost(req, res) {
    const picture = req.file?.filename;
    res.status(203);
    res.json({ massage: 'load picture', path: picture });
  }

  async createPost(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        next(ApiError.BadRequest('Bad request', errors.array()));
      }
      const { title, content, picture, ...categories } = req.body;
      await Post.isEqualTitlePost(title);
      const { token } = req.params;
      const user = TokenService.validateAccessToken(token);
      const { id } = await Post.createPost({
        id: user.id,
        title,
        content,
        picture,
      });
      await Post.addCategoryPost(id, categories);
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
      const { author_id } = await Post.findPostId(id);
      await Like.createLikePost(id, author.id);
      await User.updateRating(author_id, 1);
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
      if (post.author_id !== author.id) {
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
        picture,
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
      next(err);
    }
  }
  async deleteLikePost(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      const { author_id } = await Post.findPostId(id);
      await Like.deteleLikePost(id, author.id);
      await User.updateRating(author_id, -1);
      res.status(200);
      res.json({ massage: 'Like delete' });
    } catch (err) {
      next(err);
    }
  }
}

export default Posts;

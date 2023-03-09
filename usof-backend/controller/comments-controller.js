import Comment from '../models/Comment.js';
import Like from '../models/Like.js';
import User from '../models/User.js';
import ApiError from '../exceptions/api-error.js';
import TokenService from '../service/token-service.js';

class Сomments {
  async getCommentById(req, res, next) {
    try {
      const { id } = req.params;
      res.status(200);
      res.json({
        massage: 'complete',
        comment: await Comment.findCommentId(id),
      });
    } catch (err) {
      next(err);
    }
  }
  async getLikedCommentById(req, res) {
    try {
      const { id } = req.params;
      const like = await Like.getCommentLike(id);
      res.status(200);
      res.json({
        massage: 'complete',
        counterLike: like.length,
        like: like,
      });
    } catch (err) {
      next(err);
    }
  }
  async createLikeByComment(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      await Like.createLikeComment(id, author.id);
      await User.updateRating(author.id, 1);
      res.status(201);
      res.json({ massage: 'create like comment' });
    } catch (err) {
      next(err);
    }
  }
  async updateCommentData(req, res, next) {
    try {
      const { id, token } = req.params;
      const { content } = req.body;
      const author = TokenService.validateAccessToken(token);
      const { author_id } = await Comment.findCommentId(id);
      if (author_id !== author.id) {
        next(ApiError.AccessDenied('Access denied, your ne tot User'));
      }
      await Comment.updateComment(id, content);
      res.status(200);
      res.json({ massage: 'complete, update comment' });
    } catch (err) {
      next(err);
    }
  }
  async deleteComment(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      const { author_id } = await Comment.findCommentId(id);
      if (author_id !== author.id) {
        next(ApiError.AccessDenied('Access denied, your ne tot User'));
      }
      await Comment.deleteComment(id);
      res.status(200);
      res.json({ massage: 'delete comment' });
    } catch (err) {
      next(err);
    }
  }
  async deleteLikeByComment(req, res, next) {
    try {
      const { id, token } = req.params;
      const author = TokenService.validateAccessToken(token);
      await Like.deteleLikeComment(id, author.id);
      await User.updateRating(author.id, -1);
      res.status(200);
      res.json({ massage: 'delete like comment' });
    } catch (err) {
      next(err);
    }
  }
}

export default Сomments;

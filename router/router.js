import Express from 'express';
import { body } from 'express-validator';
import Users from '../controller/users-controller.js';
import Posts from '../controller/posts-controller.js';
import Category from '../controller/categories-controller.js';
import Authorization from '../controller/authentication-controller.js';
import Comment from '../controller/comments-controller.js';
import { uploadAvatar, uploadPost } from '../middlewares/upload-file.js';
import checkValidation from '../middlewares/check-validation.js';
import checkAccessDenied from '../middlewares/check-access-enied.js';
import isAdmin from '../middlewares/is-admin.js';
import checkUpdateData from '../middlewares/check-update-data.js';
import validationCotegories from '../middlewares/validation-cotegories.js';

const users = new Users();
const post = new Posts();
const categories = new Category();
const auth = new Authorization();
const comments = new Comment();

const router = Express.Router();

router.post(
  '/auth/register/',
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').isLength({ min: 8 }).trim(),
  body('passwordConfirm').isLength({ min: 8 }).trim(),
  body('email').isEmail().normalizeEmail().trim(),
  checkValidation,
  auth.authRegister
);
router.post(
  '/auth/login/',
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').not().isEmpty().trim(),
  auth.authLogin
);
router.post('/auth/logout/:token', auth.authLogout);
router.post(
  '/auth/password-reset',
  body('email').isEmail().normalizeEmail().trim(),
  auth.authSendPasswordReset
);
router.get('/auth/password-reset/:token', (req, res) => {
  res.send(`<div>
  <form action="http://localhost:8080/api/auth/password-reset/${req.params.token}" method="POST">
      <p>
          You requested for reset password, kindly use this to reset your password
      </p>
      <input type="password" name="reset_password">
      <input type="password" name="reset_confirm_password">
      <input type="submit" value="reset">
      </form>
  </div>`);
});
router.post(
  '/auth/password-reset/:token',
  body('reset_password').not().isEmpty().trim(),
  body('reset_confirm_password').not().isEmpty().trim(),
  auth.authPasswordResetToken
);
router.get('/auth/active/:token', auth.authActiveEmail);

// AUTH

router.get('/users/:token', checkAccessDenied, users.getAllUsers);
router.get('/users/:id/:token', checkAccessDenied, users.getUserById);
router.post(
  '/users/:token',
  checkAccessDenied,
  isAdmin,
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').isLength({ min: 8 }).trim(),
  body('passwordConfirm').isLength({ min: 8 }).trim(),
  body('email').isEmail().normalizeEmail().trim(),
  body('role').not().isEmpty().trim(),
  checkValidation,
  users.createUser
);
router.patch(
  '/users/avatar/:token',
  checkAccessDenied,
  uploadAvatar.single('image'),
  users.uploadUserAvata
);
router.patch(
  '/users/:id/:token',
  checkAccessDenied,
  body('login').isLength({ min: 6, max: 30 }).trim(),
  body('password').isLength({ min: 8 }).trim(),
  body('passwordConfirm').isLength({ min: 8 }).trim(),
  body('email').isEmail().normalizeEmail().trim(),
  checkUpdateData,
  users.updateUserData
);
router.delete('/users/:id/:token', checkAccessDenied, users.deleteUser);

// URERS

router.get('/posts', post.getAllPosts);
router.get('/posts/:id', post.getPostsById);
router.get('/posts/:id/comments', post.getCommentsByPostId);
router.post(
  '/posts/:id/comments/:token',
  checkAccessDenied,
  body('comment').not().isEmpty().escape().trim(),
  post.createComment
);
router.post(
  '/posts/image/:token',
  checkAccessDenied,
  uploadPost.single('image'),
  post.loadPicturePost
);
router.post(
  '/posts/:token',
  checkAccessDenied,
  body('title').isLength({ min: 3 }).trim(),
  body('content').not().isEmpty().trim().escape(),
  post.createPost
);
router.get('/posts/:id/categories', post.getAllCategoriesByPostId);
router.get('/posts/:id/like', post.getPostLike);
router.post('/posts/:id/like/:token', checkAccessDenied, post.createLikePost);
router.patch(
  '/posts/:id/:token',
  checkAccessDenied,
  body('title').isLength({ min: 3 }).trim(),
  body('content').not().isEmpty().trim().escape(),
  post.updatePost
);

router.delete('/posts/:id/:token', checkAccessDenied, post.deletePost);
router.delete('/posts/:id/like/:token', checkAccessDenied, post.deleteLikePost);

// POSTS

router.get('/cotegories/:token', checkAccessDenied, categories.getAllCategory);
router.get(
  '/cotegories/:id/:token',
  checkAccessDenied,
  categories.getCategoryById
);
router.get('/categories/:id/posts', categories.getAllPostByCategoryId);
router.post(
  '/cotegories/:token',
  checkAccessDenied,
  body('title').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  categories.createCategory
);

router.patch(
  '/cotegories/:id/:token',
  checkAccessDenied,
  body('title').not().isEmpty().trim().escape(),
  body('description').not().isEmpty().trim().escape(),
  isAdmin,
  validationCotegories,
  categories.updateCategoryData
);

router.delete(
  '/cotegories/:id/:token',
  checkAccessDenied,
  isAdmin,
  categories.deleteCategory
);

// CATEGORIES

router.get('/comments/:id', comments.getCommentById);
router.get('/comments/:id/like', comments.getLikedCommentById);
router.post(
  '/comments/:id/like/:token',
  checkAccessDenied,
  comments.createLikeByComment
);
router.patch(
  '/comments/:id/:token',
  checkAccessDenied,
  comments.updateCommentData
);
router.delete(
  '/comments/:id/:token',
  checkAccessDenied,
  comments.deleteComment
);
router.delete(
  '/comments/:id/like/:token',
  checkAccessDenied,
  comments.deleteLikeByComment
);

export default router;

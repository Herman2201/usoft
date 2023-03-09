const apiPath = 'http://localhost:8080/api';
const originPath = 'http://localhost:8080';

export default {
  checkValid: (token) => [apiPath, 'check-token', token].join('/'),
  // auth
  loginPath: () => [apiPath, 'auth', 'login'].join('/'),
  registerPath: () => [apiPath, 'auth', 'register'].join('/'),
  logoutPath: (token) => [apiPath, 'auth', 'logout', token].join('/'),
  sendMailResetPassword: () => [apiPath, 'auth', 'password-reset'].join('/'),
  resetPassword: (token) =>
    [apiPath, 'auth', 'password-reset', token].join('/'),
  confirmEmail: (token) => [apiPath, 'auth', 'active', token].join('/'),
  validToken: (token) => [apiPath, 'check-token', token].join('/'),
  // posts
  allPost: (page, params) => [apiPath, `posts?page=${page}${params}`].join('/'),
  allUser: (token) => [apiPath, 'users', token].join('/'),
  createPostcomment: (id, token) =>
    [apiPath, 'posts', id, 'comments', token].join('/'),
  //categories
  allCategory: () => [apiPath, 'cotegories'].join('/'),
  createCategory: (token) => [apiPath, 'cotegories', token].join('/'),
  // post
  getPostsById: (id) => [apiPath, 'posts', id].join('/'),
  createPost: (token) => [apiPath, 'posts', token].join('/'),
  categoriesPost: (id) => [apiPath, 'posts', id, 'categories'].join('/'),
  likesPost: (id) => [apiPath, 'posts', id, 'like'].join('/'),
  commentsPost: (id) => [apiPath, 'posts', id, 'comments'].join('/'),
  updateDataPost: (id, token) => [apiPath, 'posts', id, token].join('/'),
  uploadFilePost: () => [apiPath, 'posts', 'upload', 'image'].join('/'),
  createPostLike: (id, token) =>
    [apiPath, 'posts', id, 'like', token].join('/'),
  deletePostLike: (id, token) =>
    [apiPath, 'posts', id, 'like', token].join('/'),
  deletePost: (id, token) => [apiPath, 'posts', id, token].join('/'),
  // user
  getUserById: (id) => [apiPath, 'users', 'info', id].join('/'),
  getAllUsers: () => [apiPath, 'users'].join('/'),
  updateDataUser: (id, token) => [apiPath, 'users', id, token].join('/'),
  deleteProfile: (id, token) => [apiPath, 'users', id, token].join('/'),
  // comment
  getLikeComment: (id) => [apiPath, 'comments', id, 'like'].join('/'),
  createCommentLike: (id, token) =>
    [apiPath, 'comments', id, 'like', token].join('/'),
  deleteCommentLike: (id, token) =>
    [apiPath, 'comments', id, 'like', token].join('/'),
  updateComment: (id, token) => [apiPath, 'comments', id, token].join('/'),
  deleteComment: (id, token) => [apiPath, 'comments', id, token].join('/'),
  // photo
  getPhoto: (name) => [originPath, 'avatars', name].join('/'),
  getPhotoPost: (name) => [originPath, 'picture-post', name].join('/'),
};

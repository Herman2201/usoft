import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './postsSlice.js';
import usersReducer from './usersSlice.js';
import cotegoriesReducer from './cotegoriesSlice.js';
import commentReducer from './commentSlice.js';

export default configureStore({
  reducer: {
    posts: postsReducer,
    users: usersReducer,
    categories: cotegoriesReducer,
    comments: commentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

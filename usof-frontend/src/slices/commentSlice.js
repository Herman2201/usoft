import {
  createAsyncThunk,
  createSlice,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';
import _ from 'lodash';

export const fetchAllCommentPost = createAsyncThunk(
  'comment/allCommentPost',
  async (id) => {
    const response = await axios.get(routes.commentsPost(id));
    return response.data;
  }
);

export const fetchLikeComment = createAsyncThunk(
  'comment/likeComment',
  async (id) => {
    const response = await axios.get(routes.getLikeComment(id));
    return { data: response.data, commentId: id };
  }
);

const commentAdapter = createEntityAdapter();

const initialState = commentAdapter.getInitialState({
  error: null,
  loading: true,
  commentLike: {},
  countLike: 0,
});

const commentSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addComment: commentAdapter.addOne,
    updateComment: commentAdapter.updateOne,
    deleteComment: commentAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCommentPost.fulfilled, (state, { payload }) => {
        commentAdapter.addMany(state, payload.comments);
      })
      .addCase(fetchLikeComment.fulfilled, (state, { payload }) => {
        state.commentLike[payload.commentId] = payload.data.like;
        state.countLike = payload.data.counterLike;
      });
  },
});

export const { actions } = commentSlice;

export const selectorsComment = commentAdapter.getSelectors(
  (state) => state.comments
);
export const getFetchStatus = (state) => state.comments.loading;

export default commentSlice.reducer;

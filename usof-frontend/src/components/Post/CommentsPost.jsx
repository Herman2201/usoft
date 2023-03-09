import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostComments } from '../../slices/postsSlice.js';

const CommentsPost = ({ id }) => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.posts.postComments);
  useEffect(() => {
    dispatch(fetchPostComments(id));
  }, []);
  return (
    comments[id] && (
      <span className="mb-1 text-center text-xs text-gray-500">{comments[id].countComments}</span>
    )
  );
};

export default CommentsPost;

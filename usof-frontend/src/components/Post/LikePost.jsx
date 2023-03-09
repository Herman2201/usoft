import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLike } from '../../slices/postsSlice.js';

const LikePost = ({ id }) => {
  const dispatch = useDispatch();
  const likes = useSelector((state) => state.posts.postLikes);
  useEffect(() => {
    dispatch(fetchPostLike(id));
  }, []);
  return (
    likes[id] && <span className="mb-1 text-center text-xs text-gray-500">{likes[id].countLike}</span>
  );
};

export default LikePost;

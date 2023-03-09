import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  fetchInfoPost,
  getFetchStatus,
  fetchPostLike,
} from '../slices/postsSlice.js';
import {
  fetchAllCategory,
  selectorsCategoty,
} from '../slices/cotegoriesSlice.js';
import Spinner from './Spinner.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import routes from '../routes.js';
import CategoryPost from './Post/CategoryPost.jsx';
import he from 'he';
import CreateCommentPost from './CreateCommentPost.jsx';
import {
  fetchAllCommentPost,
  selectorsComment,
} from '../slices/commentSlice.js';
import { fetchUsers } from '../slices/usersSlice.js';
import EditPost from './EditPost.jsx';

import CommentsPost from './CommentsPost.jsx';
function HtmlEncode(s) {
  const decodeStr = he.decode(s);
  return decodeStr;
}

const createLikePost = async (id, token, setLike, like) => {
  await axios.post(routes.createPostLike(id, token));
  setLike(like + 1);
};
const deleteLikePost = async (id, token, setLike, like) => {
  await axios.delete(routes.deletePostLike(id, token));
  setLike(like - 1);
};

const UserPost = ({ t }) => {
  const { token, currentUser } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const postId = useParams();
  const post = useSelector((state) => state.posts.entities[postId.id]);
  const users = useSelector((state) => state.users.entities);
  const comments = useSelector(selectorsComment.selectAll);
  const error = useSelector((state) => state.posts.error);
  const postLike = useSelector((state) => state.posts.postLikes);
  const categories = useSelector(selectorsCategoty.selectAll);
  const isLoading = useSelector(getFetchStatus);
  const [isLike, setLike] = useState(false);
  const [likes, setCountLike] = useState(0);
  const [isEdite, setEdite] = useState(false);
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllCategory());
    dispatch(fetchInfoPost(postId.id));
    dispatch(fetchAllCommentPost(postId.id));
    dispatch(fetchPostLike(postId.id));
  }, []);

  useEffect(() => {
    const isUserLike = postLike[postId.id];
    if (isUserLike && isUserLike.likeInfo !== 'Empty') {
      const a = isUserLike.likeInfo.find(
        (item) => item.author_id === currentUser.id
      );
      if (a) {
        setLike(true);
      }
    }
    setCountLike(postLike[postId.id]?.countLike);
  }, [postLike]);

  useEffect(() => {}, [post, comments]);
  const deletePost = async () => {
    try {
      await axios.delete(routes.deletePost(postId.id, token));
      navigate('/?page=1');
    } catch (err) {
      toast.error("You can't delete this post");
    }
  };
  return isLoading ? (
    <Spinner />
  ) : error ? (
    <NotFoundPage />
  ) : (
    <div className="mt-10 px-4 max-w-screen-xl mx-auto px-8 pt-6">
      <div className="items-center border drop-shadow-2xl px-4 lg:flex lg:px-8">
        <div className="w-full rounded-lg">
          {!isEdite ? (
            <>
              <div className="flex justify-center">
                <img
                  className={`border-none rounded-t-lg h-30 ${
                    post.content_picture ? 'block' : 'hidden'
                  }`}
                  src={routes.getPhotoPost(post.content_picture)}
                />
              </div>
              <p className="text-2xl text-center font-bold uppercase mt-10">
                {post.title}
              </p>
              <p className="mt-1 font-medium text-gray-600">
                {t('body.posts-page.post.author')}{' '}
                <a href={`/profile/${post.author_id}`}>
                  {users[post.author_id].login}
                </a>
              </p>
              <CategoryPost
                id={post.id}
                isMt={false}
                t={t('body.post-page.category.description')}
              />
              <div className="my-10 text-justify">
                <p style={{ whiteSpace: 'pre-wrap' }}>
                  {HtmlEncode(post?.content)}
                </p>
                {currentUser.id === users[post?.author_id]?.id ? (
                  !isEdite ? (
                    <div className="w-full flex justify-end">
                      <button
                        className="py-2 px-10 rounded bg-orange-400 border border-orange-400 text-white ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-600"
                        onClick={() => setEdite(true)}
                      >
                        {t('body.post-page.btn-edit')}
                      </button>
                      <button
                        className="ml-4 py-2 px-10 rounded bg-orange-800 border border-orange-800 text-white ease-in duration-300 hover:border-orange-800 hover:bg-white hover:text-orange-800"
                        onClick={() => deletePost()}
                      >
                        {t('body.post-page.btn-delete')}
                      </button>
                    </div>
                  ) : null
                ) : null}
              </div>
            </>
          ) : (
            <EditPost
              t={t}
              id={post.id}
              edit={setEdite}
              title={post.title}
              content={HtmlEncode(post.content)}
              categories={categories}
              postPicture={post.content_picture}
            />
          )}
          <div className="flex">
            {isLike ? (
              <button
                className="inline-flex items-center px-1 -ml-1 flex-column"
                onClick={() => {
                  setLike(!isLike);
                  deleteLikePost(postId.id, token, setCountLike, likes);
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </button>
            ) : (
              <button
                className="inline-flex items-center px-1 -ml-1 flex-column"
                onClick={() => {
                  setLike(!isLike);
                  createLikePost(postId.id, token, setCountLike, likes);
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  ></path>
                </svg>
              </button>
            )}
            <p>{likes}</p>
          </div>
          <CreateCommentPost postId={postId.id} t={t} />
          {comments.length !== 0 ? (
            <div className="border p-4">
              <ul>
                {users &&
                  comments.map((comment) => {
                    return (
                      <li key={comment.id}>
                        <CommentsPost
                          idComment={comment.id}
                          comment={comment}
                          users={users}
                        />
                      </li>
                    );
                  })}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserPost;

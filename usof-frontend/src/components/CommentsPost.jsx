import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import routes from '../routes.js';
import moment from 'moment';
import axios from 'axios';
import { actions, fetchLikeComment } from '../slices/commentSlice.js';
import he from 'he';
const createLikeComment = async (id, token, setLike, like) => {
  await axios.post(routes.createCommentLike(id, token));
  setLike(like + 1);
};
const deleteLikeComment = async (id, token, setLike, like) => {
  await axios.delete(routes.deleteCommentLike(id, token));
  setLike(like - 1);
};

const CommentsPost = ({ idComment, comment, users }) => {
  const { currentUser, token } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const dispatch = useDispatch();
  const commentLike = useSelector((state) => state.comments.commentLike);
  const countLike = useSelector((state) => state.comments.countLike);
  const [countLikes, setCountLike] = useState(0);
  const [isLike, setLike] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [updateData, setUpdate] = useState('');
  useEffect(() => {
    dispatch(fetchLikeComment(idComment));
    setUpdate(he.decode(comment.content));
  }, []);

  useEffect(() => {
    const isUserLike = commentLike[idComment];
    if (isUserLike && isUserLike.like !== 'Empty') {
      isUserLike;
      const a = isUserLike.find((item) => item.author_id === currentUser.id);
      if (a) {
        setLike(true);
      }
    }
    setCountLike(commentLike[idComment]?.length);
  }, [commentLike]);

  const deleteComment = async () => {
    await axios.delete(routes.deleteComment(idComment, token));
    dispatch(actions.deleteComment(idComment));
  };

  const hendleForm = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(routes.updateComment(idComment, token), {
        content: updateData,
      });
      dispatch(
        actions.updateComment({
          id: idComment,
          changes: { content: updateData },
        })
      );
      setEdit(false);
    } catch (e) {
      e;
    }
  };

  return !commentLike ? null : (
    <div className="flex-col w-full py-4 mx-auto mt-3 bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm md:w-10/12">
      <div className="flex flex-row md-10">
        <a className="w-12 h-12" href={`/profile/${currentUser.id}`}>
          <img
            className=" border-2 border-gray-300 rounded-full"
            alt="Anonymous's avatar"
            src={
              users[comment.author_id]?.profile_pic
                ? routes.getPhoto(users[comment.author_id].profile_pic)
                : '/avatars/default.png'
            }
          />
        </a>
        <div className="w-6/12 flex-col mt-1">
          <div className="flex items-center flex-1 px-4 font-bold leading-tight">
            <p>{users ? users[comment.author_id]?.login : null}</p>
            <span className="ml-2 text-xs font-normal text-gray-500">
              {moment(comment.publish_date).fromNow()}
            </span>
          </div>
          {isEdit ? (
            <div className="w-full flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">
              <form
                className="w-full flex flex-col items-start justify-center"
                onSubmit={hendleForm}
              >
                <textarea
                  style={{ height: '60px' }}
                  className="w-full text-sm border border-orange-300"
                  value={updateData}
                  onChange={(e) => setUpdate(e.target.value)}
                />{' '}
                <div className="flex justify-between w-full">
                  <button className="px-3 text-white border border-orange-300 bg-orange-400 mt-1 rounded ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-400">
                    Edit
                  </button>
                  <label
                    className="px-3 text-white border border-orange-300 bg-orange-400 mt-1 cursor-pointer rounded ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-400"
                    onClick={() => setEdit(false)}
                  >
                    Close
                  </label>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">
                <p>{he.decode(comment.content)}</p>
              </div>
              <div className="flex">
                {isLike ? (
                  <button
                    className="inline-flex items-center px-1 -ml-1 flex-column"
                    onClick={() => {
                      setLike(!isLike);
                      deleteLikeComment(
                        comment.id,
                        token,
                        setCountLike,
                        countLikes
                      );
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
                      createLikeComment(
                        comment.id,
                        token,
                        setCountLike,
                        countLikes
                      );
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
                <p className="text-gray-500">{countLikes}</p>
              </div>
            </>
          )}
        </div>
        {users[comment.author_id].id === currentUser.id ? (
          <div className="flex items-end">
            {!isEdit ? (
              <>
                <button
                  className="ml-3 px-3 text-white bg-orange-400 mt-1 border bg-orange-500 text-white font-bold rounded ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-400"
                  onClick={() => setEdit(true)}
                >
                  Edit
                </button>
                <button
                  className="px-3 text-white bg-orange-800 mt-1 border bg-orange-500 text-white font-bold rounded ease-in duration-300 hover:border-orange-800 hover:bg-white hover:text-orange-800"
                  onClick={() => deleteComment()}
                >
                  delete
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommentsPost;

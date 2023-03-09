import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserInfo } from '../slices/usersSlice.js';
import { fetchPosts, selectors } from '../slices/postsSlice.js';
import { useParams, useNavigate } from 'react-router-dom';
import Post from './Post/Post.jsx';
import { isNull } from 'lodash';
import routes from '../routes.js';
import NotFoundPage from './NotFoundPage.jsx';
import axios from 'axios';
import Spinner from './Spinner.jsx';
const Profile = ({ t }) => {
  const { token, currentUser } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector((state) => state.users.entities);
  const posts = useSelector(selectors.selectAll);
  const error = useSelector((state) => state.users.error);
  const postsUser = posts.filter((post) => post.author_id === id);
  const heightPage = document.documentElement.scrollHeight;
  const [isLoad, setLoad] = useState(true);
  useEffect(() => {
    dispatch(fetchUserInfo(id));
    dispatch(fetchPosts(1));
    setTimeout(() => setLoad(false), 2000);
  }, []);
  const deleteProfile = async () => {
    try {
      await axios.delete(routes.deleteProfile(id, token));
      localStorage.removeItem('currentUser');
      navigate('/?page=1');
    } catch (err) {
      toast.error("You can't delete this account");
    }
  };
  return isLoad ? (
    <Spinner />
  ) : error ? (
    <NotFoundPage />
  ) : (
    user[id] && (
      <div className="bg-white">
        <div className="container mx-auto my-5 p-5">
          <div className="md:flex no-wrap md:-mx-2">
            <div
              className="w-full md:w-3/12 md:mx-2"
              style={{ height: heightPage - 300 + 'px' }}
            >
              <div className="bg-white p-3 border-t-4 border-orange-400 sticky top-20">
                <div className="image overflow-hidden">
                  <img
                    className="h-auto w-full mx-auto border"
                    src={
                      !isNull(user[id].profile_pic)
                        ? routes.getPhoto(user[id].profile_pic)
                        : '/avatars/default.png'
                    }
                    alt=""
                  />
                </div>
                <h1 className="text-gray-900 font-bold text-xl leading-8 my-1">
                  {user[id].login}
                </h1>
                <h3 className="text-gray-600 font-lg text-semibold leading-6">
                  {t('body.profile.attribution')}
                </h3>

                <ul className="bg-gray-100 text-gray-600 hover:text-gray-700 hover:shadow py-2 px-3 mt-3 divide-y rounded shadow-sm">
                  <li className="flex items-center py-3">
                    <span>{t('body.profile.rating')}</span>
                    <span className="ml-auto">
                      <span
                        className={`${
                          user[id].rating < 0
                            ? 'bg-orange-800'
                            : 'bg-orange-500'
                        }  py-1 px-2 rounded text-white text-sm`}
                      >
                        {user[id].rating}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-center py-3">
                    <span>{t('body.profile.member')}</span>
                    <span className="ml-auto">Nov 07, 2016</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full md:w-9/12 mx-2 h-64">
              <div className="bg-white p-3 shadow-sm rounded-sm">
                <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
                  <span clas="text-green-500">
                    <svg
                      className="h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>
                  <span className="tracking-wide">
                    {t('body.profile.title')}
                  </span>
                </div>
                <div className="text-gray-700">
                  <div className="flex flex-col md:grid-cols-2 text-sm">
                    <div className="flex">
                      <div className="px-4 py-2 font-semibold">
                        {t('body.profile.info.fullname')}
                      </div>
                      <div
                        className={`py-2 ${
                          !user[id].full_name ? 'text-gray-500' : null
                        }`}
                      >
                        {user[id].full_name || 'not added'}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="px-4 py-2 font-semibold">
                        {t('body.profile.info.login')}
                      </div>
                      <div className="pl-7 py-2">{user[id].login}</div>
                    </div>
                    <div className="flex">
                      <div className="px-4 py-2 font-semibold">
                        {t('body.profile.info.email')}
                      </div>
                      <div className="pl-7 py-2">
                        <a
                          className="text-blue-800"
                          href={`mailto:${user[id].email}`}
                        >
                          {user[id].email}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                {id === currentUser.id ? (
                  <div className="flex justify-between">
                    <button
                      onClick={() => navigate(`/edit-profile/${id}`)}
                      className="w-4/12 ease-in duration-150 bg-orange-400 text-white block w-full border hover:border-orange-400 hover:text-orange-400 hover:bg-white text-sm font-semibold rounded-lg p-3 my-4"
                    >
                      {t('body.profile.btn-edit')}
                    </button>
                    <button
                      onClick={() => deleteProfile()}
                      className="w-4/12 ease-in duration-150 bg-orange-800 text-white block w-full border hover:border-orange-800 hover:text-orange-800 hover:bg-white text-sm font-semibold rounded-lg p-3 my-4"
                    >
                      {t('body.profile.btn-del')}
                    </button>
                  </div>
                ) : null}
              </div>

              <div className="my-4"></div>

              <div className="bg-white p-3 shadow-sm rounded-sm">
                <ul className="list-group">
                  {postsUser.map((post) => (
                    <li key={post.id}>
                      <Post post={post} users={user} isProfile={true} t={t} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;

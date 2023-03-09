import React, { useEffect, useState } from 'react';
import CategoryPost from './CategoryPost.jsx';
import LikePost from './LikePost.jsx';
import CommentsPost from './CommentsPost.jsx';
import isNull from 'lodash/isNull';
import routes from '../../routes.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostLike } from '../../slices/postsSlice.js';
import he from 'he';

const normalizaDate = (date) => {
  const currentDate = new Date(date);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${currentDate.getDate()} ${
    monthNames[currentDate.getMonth()]
  }, ${currentDate.getFullYear()}`;
};

const readingTime = (text) => {
  let countWord = text.split(/\s/).length;
  if (countWord < 160) {
    return '1 > minutes';
  }
  let minutes = 0;
  while (countWord) {
    minutes += 1;
    countWord -= 160;
  }
  return `${minutes} minutes`;
};

const hiddenText = (text) => {
  const newText = text.length > 140 ? text.slice(0, 140) + '...' : text;
  return newText;
};

const Post = ({ post, users, t, isProfile = false }) => {
  const dispatch = useDispatch();
  const { currentUser } = JSON.parse(localStorage.getItem('currentUser'));
  const photoUser = users[post.author_id]?.profile_pic || null;
  const postLike = useSelector((state) => state.posts.postLikes);
  const [isLike, setLike] = useState(false);
  useEffect(() => {
    dispatch(fetchPostLike(post.id));
  }, []);

  useEffect(() => {
    const isUserLike = postLike[post.id];
    if (isUserLike && isUserLike.likeInfo !== 'Empty') {
      const a = isUserLike.likeInfo.find(
        (item) => item.author_id === currentUser.id
      );
      console.log(a);
      if (a) {
        setLike(true);
      }
    }
  }, [postLike]);

  return (
    <div
      className={`items-center px-4 max-w-screen-xl mx-auto lg:flex ${
        !isProfile ? 'lg:px-8 ' : null
      } py-6`}
    >
      <div className="rounded-lg w-full border flex border-orange-200">
        <div className={`${!isNull(photoUser) ? 'w-8/12' : 'w-full'} p-8`}>
          <div className="justify-between sm:flex">
            <div>
              <div className="flex">
                <h5 className="text-xl font-bold text-gray-900">
                  {post.title}
                </h5>

                <CategoryPost
                  id={post.id}
                  t={t('body.post-page.category.description')}
                />
              </div>

              <p className="mt-1 text-xs font-medium text-gray-600">
                {t('body.posts-page.post.author')}{' '}
                <a href={`/profile/${post.author_id}`}>{post.author}</a>
              </p>
            </div>
          </div>

          <div className="my-10 sm:pr-8">
            <p className="text-sm text-gray-500">
              {post.content.length < 329
                ? he.decode(post.content)
                : hiddenText(he.decode(post.content))}
            </p>
          </div>

          <dl className="mt-6 flex justify-between flex-col sm:flex-row">
            <div className="flex flex-row items-end">
              <div className="flex flex-col-reverse">
                <dt className="text-sm font-medium text-gray-600 sm:pt-1">
                  {t('body.posts-page.post.publish')}
                </dt>
                <dd className="text-xs text-gray-500">
                  {normalizaDate(post.publish_date)}
                </dd>
              </div>

              <div className="ml-3 flex flex-col-reverse sm:ml-6">
                <dt className="text-sm font-medium text-gray-600 sm:pt-1">
                  {t('body.posts-page.post.reading-time')}
                </dt>
                <dd className="text-xs text-gray-500">
                  {readingTime(post.content)}
                </dd>
              </div>
              <div className="flex space-x-2 text-sm dark:text-gray-400">
                <div className="ml-3 flex flex-col sm:ml-6">
                  <CommentsPost id={post.id} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    aria-label="Number of comments"
                    className="w-5 h-5 fill-current dark:text-gray-600"
                  >
                    <path d="M448.205,392.507c30.519-27.2,47.8-63.455,47.8-101.078,0-39.984-18.718-77.378-52.707-105.3C410.218,158.963,366.432,144,320,144s-90.218,14.963-123.293,42.131C162.718,214.051,144,251.445,144,291.429s18.718,77.378,52.707,105.3c33.075,27.168,76.861,42.13,123.293,42.13,6.187,0,12.412-.273,18.585-.816l10.546,9.141A199.849,199.849,0,0,0,480,496h16V461.943l-4.686-4.685A199.17,199.17,0,0,1,448.205,392.507ZM370.089,423l-21.161-18.341-7.056.865A180.275,180.275,0,0,1,320,406.857c-79.4,0-144-51.781-144-115.428S240.6,176,320,176s144,51.781,144,115.429c0,31.71-15.82,61.314-44.546,83.358l-9.215,7.071,4.252,12.035a231.287,231.287,0,0,0,37.882,67.817A167.839,167.839,0,0,1,370.089,423Z"></path>
                    <path d="M60.185,317.476a220.491,220.491,0,0,0,34.808-63.023l4.22-11.975-9.207-7.066C62.918,214.626,48,186.728,48,156.857,48,96.833,109.009,48,184,48c55.168,0,102.767,26.43,124.077,64.3,3.957-.192,7.931-.3,11.923-.3q12.027,0,23.834,1.167c-8.235-21.335-22.537-40.811-42.2-56.961C270.072,30.279,228.3,16,184,16S97.928,30.279,66.364,56.206C33.886,82.885,16,118.63,16,156.857c0,35.8,16.352,70.295,45.25,96.243a188.4,188.4,0,0,1-40.563,60.729L16,318.515V352H32a190.643,190.643,0,0,0,85.231-20.125,157.3,157.3,0,0,1-5.071-33.645A158.729,158.729,0,0,1,60.185,317.476Z"></path>
                  </svg>
                </div>
                <div className="ml-3 flex flex-col-reverse sm:pl-4 sm:ml-6">
                  {!isLike ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      aria-label="Number of likes"
                      className="w-5 h-5 fill-current dark:text-gray-600"
                    >
                      <path d="M126.638,202.672H51.986a24.692,24.692,0,0,0-24.242,19.434,487.088,487.088,0,0,0-1.466,206.535l1.5,7.189a24.94,24.94,0,0,0,24.318,19.78h74.547a24.866,24.866,0,0,0,24.837-24.838V227.509A24.865,24.865,0,0,0,126.638,202.672ZM119.475,423.61H57.916l-.309-1.487a455.085,455.085,0,0,1,.158-187.451h61.71Z"></path>
                      <path d="M494.459,277.284l-22.09-58.906a24.315,24.315,0,0,0-22.662-15.706H332V173.137l9.573-21.2A88.117,88.117,0,0,0,296.772,35.025a24.3,24.3,0,0,0-31.767,12.1L184.693,222.937V248h23.731L290.7,67.882a56.141,56.141,0,0,1,21.711,70.885l-10.991,24.341L300,169.692v48.98l16,16H444.3L464,287.2v9.272L396.012,415.962H271.07l-86.377-50.67v37.1L256.7,444.633a24.222,24.222,0,0,0,12.25,3.329h131.6a24.246,24.246,0,0,0,21.035-12.234L492.835,310.5A24.26,24.26,0,0,0,496,298.531V285.783A24.144,24.144,0,0,0,494.459,277.284Z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                    </svg>
                  )}
                  <LikePost id={post.id} />
                </div>
              </div>
            </div>
            <div className="pt-5 sm:pt-0 flex items-end">
              <a
                type="submit"
                className="ease-in duration-300 rounded-md border border-transparent bg-orange-600 py-1 px-4 text-sm font-medium text-white hover:border-orange-600 hover:bg-white hover:text-orange-600"
                href={`/post/${post.id}`}
              >
                {t('body.posts-page.post.btn-read')}
              </a>
            </div>
          </dl>
        </div>
        {!isNull(photoUser) ? (
          <div
            className="ml-3 w-4/12 hidden rounded-lg sm:flex items-center"
            style={{
              maxHeight: '252px',
            }}
          >
            <a className="" href={`/profile/${post.id}`}>
              <img
                className="rounded-lg"
                src={routes.getPhoto(photoUser)}
                alt=""
                style={{
                  maxHeight: '252px',
                }}
              />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Post;

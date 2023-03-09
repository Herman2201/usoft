import React, { useEffect, useState, useContext } from 'react';
import {
  actions,
  fetchPosts,
  selectors,
  getFetchStatus,
} from '../slices/postsSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from './Spinner.jsx';
import Post from './Post/Post.jsx';
import { fetchUsers } from '../slices/usersSlice.js';
import {
  fetchAllCategory,
  selectorsCategoty,
} from '../slices/cotegoriesSlice.js';
import createPages from '../../create-pages.js';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contex/authContext.js';

const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: 'rgb(249 115 22)',
    // backgroundColor: ,
    borderTop: '.1px solid',
    height: '100%',
  }),
  control: (base, state) => ({
    ...base,
    borderColor: 'rgb(254 215 170)',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: 'white',
  }),
};

export default ({ t }) => {
  const { currentUser } = JSON.parse(localStorage.getItem('currentUser'));
  const navigate = useNavigate();
  const posts = useSelector(selectors.selectAll);
  const users = useSelector((state) => state.users.entities);
  const currentPage = useSelector((state) => state.posts.currentPage);
  const totalCount = useSelector((state) => state.posts.totalCount);
  const perPage = useSelector((state) => state.posts.perPage);
  const categories = useSelector(selectorsCategoty.selectAll);
  const isLoading = useSelector(getFetchStatus);
  const [values, setValues] = useState([]);
  const [isLong, setLong] = useState();
  const dispatch = useDispatch();
  const { open } = useContext(AuthContext);
  const page = [];
  createPages(page, totalCount, currentPage);
  const params = new URLSearchParams(location.search);
  const item = Number(params.get('page')) || 1;
  const filter = params.getAll('filter');
  useEffect(() => {
    dispatch(actions.setCurrentPage(item));
    const filterString = filter && filter.map((p) => `&filter=${p}`).join('');
    dispatch(fetchPosts({ item, filterString }));
    dispatch(fetchUsers());
    dispatch(fetchAllCategory());
  }, [item, values, categories]);
  useEffect(() => {
    if (values.length >= 3) {
      setLong(true);
    } else {
      setLong(false);
    }
  }, [values]);
  const options = categories.map((item) => {
    return {
      value: item.id,
      label: item.title,
    };
  });

  return isLoading ? (
    <Spinner />
  ) : (
    posts && (
      <>
        <div className="mt-3">
          <div className="flex justify-between items-center px-4 max-w-screen-xl mx-auto lg:flex px-8 pt-6">
            <div className="flex flex-col w-3/12">
              <p className={`${isLong ? 'block' : 'hidden'}`}>stack</p>
              <Select
                className={`${
                  isLong ? 'border-orange-600' : 'border-red-600'
                } w-full`}
                styles={customStyles}
                closeMenuOnSelect={false}
                isMulti
                options={options}
                onChange={(catigories) => {
                  isLong ? null : setValues(catigories);
                  if (catigories.length === 2 || catigories.length === 0) {
                    setValues(catigories);
                  }
                  const filter = catigories
                    .map(({ _, value }) => `&filter=${value}`)
                    .join('');
                  navigate(`/?page=${item}${filter}`);
                }}
                onBlur={false}
                value={values}
              />
            </div>
            {currentUser?.role === 'admin' ? (
              <button
                className="ease-out duration-300 border border-orange-600 bg-orange-600 px-5 py-2 text-white hover:bg-white hover:text-orange-600 cursor-pointer"
                onClick={() => open()}
              >
                {t('body.posts-page.btn-category.name')}
              </button>
            ) : null}
          </div>
          <ul className="list-group">
            {posts.map((post) => (
              <li key={post.id}>
                <Post post={post} users={users} t={t} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center ">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              onClick={() => navigate(`/?page=${item - 1}`)}
              disabled={item === 1}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <ul className="flex">
              {page.map((page, index) => (
                <li key={index}>
                  <button
                    aria-current="page"
                    className={`relative z-10 inline-flex items-center border ${
                      item === page
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 bg-white text-gray-500'
                    }  px-4 py-2 text-sm font-medium  focus:z-20`}
                    onClick={() => navigate(`/?page=${page}`)}
                  >
                    {page}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              onClick={() => {
                navigate(`/?page=${item + 1}`);
              }}
              disabled={item === page[page.length - 1]}
            >
              <span className="sr-only">Next</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
        </div>
      </>
    )
  );
};

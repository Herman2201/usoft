import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostCategory, selectors } from '../../slices/postsSlice.js';

const MassageCategory = ({ category, isMt, t }) => {
  const [isShow, setShow] = useState(false);
  return (
    <>
      <span
        onMouseOver={() => setShow(!isShow)}
        onMouseOut={() => setShow(!isShow)}
        className={`${
          isMt ? 'ml-4' : null
        } px-3 py-1 text-xs text-white uppercase bg-orange-400 rounded-full dark:bg-range-400 dark:text-black`}
      >
        {category.title}
      </span>
      <div
        className={`ml-10 mt-1 p-1 border bg-orange-400 rounded-lg h-20 w-32 absolute ${
          isShow ? 'block' : 'hidden'
        }`}
      >
        <p className="text-sm text-white font-semibold">{t}</p>
        <p className="text-sm text-white font-normal pl-2">
          {category.description}
        </p>
      </div>
    </>
  );
};

const CategoryPost = ({ id, t, isMt = true }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.posts.postCategories);

  useEffect(() => {
    dispatch(fetchPostCategory(id));
  }, []);
  useEffect(() => {}, [categories]);
  return (
    categories[id] && (
      <ul className={`flex ${!isMt ? 'mt-3' : null}`}>
        {' '}
        {categories[id].map((category) => (
          <li key={category.id}>
            <MassageCategory category={category} isMt={isMt} t={t} />
          </li>
        ))}
      </ul>
    )
  );
};

export default CategoryPost;

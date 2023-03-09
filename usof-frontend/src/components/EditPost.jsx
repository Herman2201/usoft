import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import Loading from './Loading.jsx';
import Select from 'react-select';
import UploadImage from './UploadImage.jsx';
import { actions, fetchPostCategory } from '../slices/postsSlice.js';

const validationRegister = yup.object({
  title: yup.string().required('Cannot be blank').trim(),
  content: yup.string().required('Cannot be blank').trim(),
  categories: yup
    .array()
    .min(1, 'Pick at least 1 tags')
    .max(3, 'Up to 3 pieces')
    .of(
      yup.object().shape({
        label: yup.string().required(),
        value: yup.string().required(),
      })
    ),
});

const EditPost = ({ edit, title, content, id, categories, postPicture, t }) => {
  const dispatch = useDispatch();
  const postCategories = useSelector((state) => state.posts.postCategories);
  const amogus = categories;
  const inputRef = useRef();
  const [file, setFile] = useState('');
  const [isLoading, setLoading] = useState(false);
  const options = categories.map((item) => {
    return {
      value: item.id,
      label: item.title,
    };
  });

  const filterCategories = Object.values(postCategories)[0].map(
    (item) => options[item.id - 1]
  );

  useEffect(() => {
    inputRef.current?.focus();
    dispatch(fetchPostCategory(id));
  }, []);
  const formik = useFormik({
    initialValues: {
      title,
      content,
      categories: [],
      picture: '',
      picture2: '',
    },
    validationSchema: validationRegister,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async ({ categories, title, content }) => {
      const picture = file ? file : postPicture;
      const { token } = JSON.parse(localStorage.getItem('currentUser'));
      const normalizeCategories = categories.reduce((acc, category) => {
        return {
          ...acc,
          [category.label]: category.value,
        };
      }, {});
      const data = { title, content, picture, ...normalizeCategories };
      setLoading(true);
      try {
        const response = await axios.patch(
          routes.updateDataPost(id, token),
          data
        );
        toast.info(response.data.massage);
        dispatch(
          actions.updatePost({
            id,
            changes: {
              title,
              content,
              content_picture: picture,
            },
          })
        );
        dispatch(
          actions.updateCategoryPost({
            postId: id,
            category: categories.map((item) => amogus[item.value - 1]),
          })
        );
        edit(false);
        setLoading(false);
      } catch (err) {
        if (err.isAxiosError && err.response.status === 400) {
          const responseErrors = err.response.data.errors.errors;
          setLoading(false);
          responseErrors.map((err) => toast.error(`${err.param}: ${err.msg}`));
          inputRef.current?.select();
          return;
        }
        throw err;
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('categories', filterCategories);
  }, []);

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
      borderColor: formik.errors.content
        ? 'rgb(244 63 94)'
        : 'rgb(254 215 170)',
      padding: '0.5rem',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'white',
    }),
  };

  return (
    <form onSubmit={formik.handleSubmit} className="p-8 mt-6 mb-0 space-y-4">
      <div className="flex">
        <div className="flex flex-col w-6/12">
          <div className="mb-4">
            <div className="flex items-center justify-between max-w-md">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <span className="font-medium tracking-wide text-red-500 text-xs">
                {formik.errors.title ? formik.errors.title : null}
              </span>
            </div>
            <div className="relative mt-1 max-w-md">
              <input
                id="title"
                className={`border-orange-200 w-full p-4 pr-12 text-sm border rounded-lg shadow-sm ${
                  formik.errors.title ? 'border-rose-500' : null
                }`}
                name="title"
                placeholder="Enter title"
                ref={inputRef}
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between max-w-md">
              <label htmlFor="caregories" className="text-sm font-medium">
                Сhoose categories (up to 3 pieces)
              </label>{' '}
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {formik.errors.categories ? formik.errors.categories : null}
              </span>
            </div>
            <div className="relative mt-1 max-w-md">
              <Select
                styles={customStyles}
                closeMenuOnSelect={false}
                isMulti
                options={options}
                onChange={(categories) => {
                  formik.setFieldValue('categories', categories);
                }}
                onBlur={formik.handleBlur}
                value={formik.values.categories}
              />
            </div>
          </div>
        </div>
        <UploadImage formik={formik} nameFile={{ file, setFile }} t={t}/>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-lg font-medium">
            Content
          </label>
          <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
            {formik.errors.content ? formik.errors.content : null}
          </span>
        </div>
        <div className="relative mt-1 max-h-full">
          <textarea
            id="content"
            className={`w-full pr-12 p-4 text-sm border border-orange-200 rounded-lg shadow-sm ${
              formik.errors.content ? 'border-rose-500' : null
            } h-60`}
            name="content"
            type="text"
            placeholder="Enter content"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex w-full justify-between mt-2">
          <button
            className="py-2 px-10 rounded bg-orange-400 border border-orange-400 text-white ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-600"
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : 'Edit post'}
          </button>
          <lable
            className="cursor-pointer py-2 px-10 rounded bg-orange-400 border border-orange-400 text-white ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-600"
            onClick={() => edit(false)}
          >
            Cancel
          </lable>
        </div>
      </div>
    </form>
  );
};
export default EditPost;

{
  /* <>
                <form onChange={editePost}>
                  <textarea
                    id="content"
                    style={{ height: '200px' }}
                    className={`w-full text-sm border border-orange-200 
                  
                    formik.errors.content ? 'border-rose-500' : null
                  
                  h-60`}
                    name="content"
                    type="text"
                    placeholder="Enter comment"
                    onChange={(e) => setEditData(e.target.value)}
                    value={editData}
                  />
                  
                </form>
              </> */
}

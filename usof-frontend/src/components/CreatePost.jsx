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
import {
  fetchAllCategory,
  selectorsCategoty,
} from '../slices/cotegoriesSlice.js';
import UploadImage from './UploadImage.jsx';
import Spinner from './Spinner.jsx';

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

const CreatePost = ({ t }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectorsCategoty.selectAll);
  const inputRef = useRef();
  const [file, setFile] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [isLoad, setLoad] = useState(true);
  const navigate = useNavigate();
  const options = categories.map((item) => {
    return {
      value: item.id,
      label: item.title,
    };
  });

  useEffect(() => {
    inputRef.current?.focus();
    dispatch(fetchAllCategory());
    setTimeout(() => setLoad(false), 2000);
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
      categories: [],
      picture: '',
      picture2: '',
    },
    validationSchema: validationRegister,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async ({ categories, title, content }) => {
      const picture = file ? file : null;
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
        const response = await axios.post(routes.createPost(token), data);
        toast.info(response.data.massage);
        setLoading(false);
        navigate('/');
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

  return isLoad ? (
    <Spinner />
  ) : (
    <div className="px-4 py-6 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
      <div className="max-w-screen-lg mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 mt-6 mb-0  shadow-2xl space-y-4"
        >
          <p className="text-2xl font-bold text-center text-orange-600 sm:text-3xl">
            {t('body.create-post.title')}
          </p>
          <div className="flex">
            <div className="flex flex-col w-6/12">
              <div className="mb-4">
                <div className="flex items-center justify-between max-w-md">
                  <label htmlFor="title" className="text-sm font-medium">
                    {t('body.create-post.fields.title.title')}
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
                    placeholder={t('body.create-post.fields.title.placeholder')}
                    ref={inputRef}
                    onChange={formik.handleChange}
                    value={formik.values.title}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between max-w-md">
                  <label htmlFor="caregories" className="text-sm font-medium">
                    {t('body.create-post.fields.categories.title')}
                  </label>{' '}
                  <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                    {formik.errors.categories ? formik.errors.categories : null}
                  </span>
                </div>
                <div className="relative mt-1 max-w-md">
                  <Select
                    styles={customStyles}
                    closeMenuOnSelect={false}
                    placeholder={t(
                      'body.create-post.fields.categories.placeholder'
                    )}
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
            <UploadImage formik={formik} nameFile={{ file, setFile }} t={t} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="text-lg font-medium">
                {t('body.create-post.fields.content.title')}
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
                placeholder={t('body.create-post.fields.content.placeholder')}
                onChange={formik.handleChange}
                value={formik.values.content}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="group relative flex max-w-sm w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white ease-in duration-300  hover:border-orange-600 hover:bg-white hover:text-orange-600"
              disabled={isLoading}
            >
              {isLoading ? <Loading /> : t('body.create-post.btn-create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;

import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import Loading from './Loading.jsx';

const validationRegister = yup.object({
  title: yup.string().required('Cannot be blank').trim(),
  description: yup.string().required('Cannot be blank').trim(),
});

const CreateCategory = (props) => {
  const dispatch = useDispatch();
  const { token } = JSON.parse(localStorage.getItem('currentUser'));
  const inputRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: validationRegister,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(routes.createCategory(token), values);
        const { infoCategory } = response.data;
        toast.info(response.data.massage);
        setLoading(false);
        props.setActive(false);
        dispatch(actions.addCategory(infoCategory));
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
  return (
    <div
      className={`${
        props.isActive ? 'opacity-1' : 'opacity-0 pointer-events-none'
      } ease-in duration-300 fixed w-full h-full bg-black/50 z-50`}
      onClick={() => props.setActive(false)}
    >
      <div
        className="max-w-lg mx-auto mt-36"
        onClick={(e) => e.stopPropagation()}
      >
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 mb-0 rounded-lg shadow-2xl space-y-4 bg-white"
        >
          <p className="text-2xl font-bold text-center text-orange-600 sm:text-3xl">
            {props.t('body.create-category.title')}
          </p>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="title" className="text-sm font-medium">
                {props.t('body.create-category.fields.title.title')}
              </label>
              <span className="font-medium tracking-wide text-red-500 text-xs">
                {formik.errors.title ? formik.errors.title : null}
              </span>
            </div>
            <div className="relative mt-1">
              <input
                id="title"
                className={`w-full p-4 pr-12 text-sm border border-orange-200 rounded-lg shadow-sm ${
                  formik.errors.title ? 'border-rose-500' : null
                }`}
                name="title"
                placeholder={props.t(
                  'body.create-category.fields.title.placeholder'
                )}
                ref={inputRef}
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="description" className="text-sm font-medium">
                {props.t('body.create-category.fields.description.title')}
              </label>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {formik.errors.description ? formik.errors.description : null}
              </span>
            </div>
            <div className="relative mt-1">
              <input
                id="description"
                className={`w-full p-4 pr-12 text-sm border border-orange-200 rounded-lg shadow-sm ${
                  formik.errors.description ? 'border-rose-500' : null
                }`}
                name="description"
                placeholder={props.t(
                  'body.create-category.fields.description.placeholder'
                )}
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </div>
          </div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loading />
            ) : (
              props.t('body.create-category.btn-create')
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
export default CreateCategory;

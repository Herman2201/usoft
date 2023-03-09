import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import Loading from './Loading.jsx';
import Spinner from './Spinner.jsx';

const validationPassword = yup.object({
  resetPassword: yup.string().required('Cannot be blank').trim(),
  resetConfirmPassword: yup
    .string()
    .required('Cannot be blank')
    .trim()
    .oneOf([yup.ref('resetPassword')], 'Passwords do not match'),
});

const NewPassword = ({ t }) => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [isInvalidToken, setInvalidToken] = useState(false);
  const accessToken = useParams().token.split('~').join('.');
  useEffect(() => {
    inputRef.current?.focus();
    const fetch = async () => {
      try {
        await axios.get(routes.validToken(accessToken));
        setLoadingData(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setLoadingData(false);
        setInvalidToken(true);
      }
    };
    fetch();
  }, []);
  const formik = useFormik({
    initialValues: {
      resetPassword: '',
      resetConfirmPassword: '',
    },
    validationSchema: validationPassword,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          routes.resetPassword(accessToken),
          values
        );
        toast.info(response.data.massage);
        setLoading(false);
        localStorage.removeItem('resetPasswordToken');
        navigate('/?page=1');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 400) {
          const responseErrors = err.response.data.errors.errors;
          responseErrors.map((err) => toast.error(`${err.param}: ${err.msg}`));
          inputRef.current?.select();
          setLoading(false);
          return;
        }
        throw err;
      }
    },
  });

  return loadingData ? (
    <Spinner />
  ) : isInvalidToken ? (
    <div className="px-4 pt-20 pb-12 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="p-8 mt-6 mb-0 rounded-lg shadow-2xl space-y-4">
          <h1 className="text-3xl font-medium title-font text-gray-900 mb-12 text-center">
            {t('body.new-password.invalid-token.title')}
          </h1>
          <div className="flex justify-center flex-wrap -m-4">
            <div className="p-4 w-full">
              <div className="h-full bg-gray-100 p-8 rounded">
                <p className="leading-relaxed mb-6">
                  {t('body.new-password.invalid-token.text')}
                </p>
                <a className="inline-flex items-center">
                  <img
                    alt="testimonial"
                    src="/editor.jpeg"
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center "
                  />
                  <span className="flex-grow flex flex-col pl-4">
                    <span className="title-font font-medium text-gray-900">
                      {t('body.comfirm-email.developer.name')}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {t('body.comfirm-email.developer.profession')}
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="px-4 pt-20 pb-12 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 mt-6 mb-0 rounded-lg shadow-2xl space-y-4"
        >
          <p className="text-2xl font-bold text-center text-orange-600 sm:text-3xl">
            {t('body.new-password.title')}
          </p>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                {t('body.new-password.fields.password.title')}
              </label>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {formik.errors.resetPassword
                  ? formik.errors.resetPassword
                  : null}
              </span>
            </div>

            <div className="relative mt-1">
              <input
                id="password"
                className={`w-full p-4 pr-12 text-sm border border-orange-200 rounded-lg shadow-sm ${
                  formik.errors.resetPassword ? 'border-rose-500' : null
                }`}
                name="resetPassword"
                placeholder={t('body.new-password.fields.password.placeholder')}
                ref={inputRef}
                onChange={formik.handleChange}
                value={formik.values.resetPassword}
                autoComplete="password"
                type="password"
              />

              <span className="absolute inset-y-0 inline-flex items-center right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium">
                {t('body.new-password.fields.comfirm-password.title')}
              </label>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {formik.errors.resetConfirmPassword
                  ? formik.errors.resetConfirmPassword
                  : null}
              </span>
            </div>
            <div className="relative mt-1">
              <input
                id="confirm-password"
                className={`w-full p-4 pr-12 text-sm border border-orange-200 rounded-lg shadow-sm ${
                  formik.errors.resetConfirmPassword ? 'border-rose-500' : null
                }`}
                name="resetConfirmPassword"
                placeholder={t(
                  'body.new-password.fields.comfirm-password.title'
                )}
                onChange={formik.handleChange}
                value={formik.values.resetConfirmPassword}
                type="password"
              />

              <span className="absolute inset-y-0 inline-flex items-center right-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : t('body.new-password.btn-send')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;

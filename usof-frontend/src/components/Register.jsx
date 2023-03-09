import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import Loading from './Loading.jsx';
import SvgLogin from './SvgLogin.jsx';
import Spinner from './Spinner.jsx';

const validationRegister = yup.object({
  email: yup.string().required('Cannot be blank').trim().email(),
  login: yup
    .string()
    .required('Cannot be blank')
    .trim()
    .min(3, 'login short')
    .max(30, 'login long'),
  password: yup
    .string()
    .required('Cannot be blank')
    .trim()
    .min(6, 'password short'),
  passwordConfirm: yup
    .string()
    .required('Cannot be blank')
    .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const Register = ({ t }) => {
  const inputRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isLoad, setLoad] = useState(true);
  useEffect(() => {
    inputRef.current?.focus();
    setTimeout(() => setLoad(false), 2000);
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      login: '',
      password: '',
      passwordConfirm: '',
      terms: false,
    },
    validationSchema: validationRegister,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      if (values.terms !== true) {
        toast.warning(`You didn't agree with the terms and conditions of use!`);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(routes.registerPath(), values);
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
  return isLoad ? (
    <Spinner />
  ) : (
    <div className="mx-auto container flex items-center" id="nav">
      <div className="w-full pt-2 p-4">
        <div className="mx-auto md:w-9/12 lg:p-6 lg:w-8/12 xl:w-1/2">
          <div className="flex flex-wrap justify-between item-center">
            <h1 className="text-2xl text-orange-500 hover:text-orange-500 transition duration-500 p-4">
              <i className="fas fa-sign-in-alt fa-fw fa-lg"></i>
              {t('body.register.title')}
            </h1>
            <a
              href="/"
              className="mt-8 text-orange-400 hover:text-orange-600 transition duration-500"
            >
              <svg
                className=" w-6 h-6 inline-block align-bottom"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              {t('body.register.btn-home')}
              <i className="fas fa-chevron-circle-left fa-fw"></i>
            </a>
          </div>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-8">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <span className="text-red-500 pr-1">&nbsp;*</span>
                  {t('body.register.fields.email.title')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <SvgLogin />
                  </div>
                  <input
                    id="email"
                    className={`block pr-10 shadow appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out ${
                      formik.errors.email
                        ? 'border-rose-500'
                        : 'border-orange-100'
                    }`}
                    placeholder={t('body.register.fields.email.placeholder')}
                    name="email"
                    ref={inputRef}
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                </div>
                <strong className="text-red-500 text-xs italic">
                  {formik.errors.email ? formik.errors.email : null}
                </strong>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="login"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <span className="text-red-500 pr-1">&nbsp;*</span>
                  {t('body.register.fields.login.title')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <input
                    id="login"
                    className={`block pr-10 shadow appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out ${
                      formik.errors.login
                        ? 'border-rose-500'
                        : 'border-orange-100'
                    }`}
                    placeholder={t('body.register.fields.login.placeholder')}
                    name="login"
                    onChange={formik.handleChange}
                    value={formik.values.login}
                  />
                </div>
                <strong className="text-red-500 text-xs italic">
                  {formik.errors.login ? formik.errors.login : null}
                </strong>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <span className="text-red-500 pr-1">&nbsp;*</span>
                  {t('body.register.fields.password.title')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    className={`block pr-10 shadow appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out ${
                      formik.errors.login
                        ? 'border-rose-500'
                        : 'border-orange-100'
                    }`}
                    type="password"
                    placeholder={t('body.register.fields.password.placeholder')}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                  />
                </div>
                <strong className="text-red-500 text-xs italic">
                  {formik.errors.password ? formik.errors.password : null}
                </strong>
              </div>

              <div className="mb-8">
                <label
                  htmlFor="password-confirm"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <span className="text-red-500 pr-1">&nbsp;*</span>
                  {t('body.register.fields.comfirm-password.title')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <input
                    id="password-confirm"
                    name="passwordConfirm"
                    className={`block pr-10 shadow appearance-none border-2  rounded w-full py-2 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-orange-500 transition duration-500 ease-in-out ${
                      formik.errors.passwordConfirm
                        ? 'border-rose-500'
                        : 'border-orange-100'
                    }`}
                    type="password"
                    placeholder={t(
                      'body.register.fields.comfirm-password.placeholder'
                    )}
                    onChange={formik.handleChange}
                    value={formik.values.passwordConfirm}
                  />
                </div>
                <strong className="text-red-500 text-xs italic">
                  {formik.errors.passwordConfirm
                    ? formik.errors.passwordConfirm
                    : null}
                </strong>
              </div>

              <div className="mb-6">
                <label
                  className="flex items-center text-sm block text-gray-500 font-bold"
                  htmlFor="remember"
                >
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 mr-1 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 light:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    onChange={formik.handleChange}
                    checked={formik.values.terms}
                  />
                  <span
                    htmlFor="terms"
                    className="font-light text-gray-500 light:text-gray-300"
                  >
                    {t('body.register.conditions.item1')}{' '}
                    <a
                      className="text-orange-600 transition ease-in-out delay-50 hover:opacity-75"
                      href="#"
                    >
                      {t('body.register.conditions.item2')}
                    </a>
                  </span>
                </label>
              </div>

              <div className="mb-4 text-center">
                <button
                  className="flex border w-full items-center justify-center bg-orange-600 text-white font-bold py-2 rounded ease-in duration-300  hover:border-orange-600 hover:bg-white hover:text-orange-600"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : 'Sing in'}
                </button>
              </div>
              <hr />
              <div className="mt-8">
                <p className="text-sm text-center text-gray-500">
                {t('body.register.sing-in.item1')}
                  <a
                    className="text-orange-500 transition ease-in-out delay-50 hover:opacity-75 ml-2"
                    href="/login"
                  >
                    {t('body.register.sing-in.item2')}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;

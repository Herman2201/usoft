import React, { useRef, useEffect, useState, useContext } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading.jsx';
import routes from '../routes.js';
import axios from 'axios';
import AuthContext from '../contex/authContext.js';
import Spinner from './Spinner.jsx';

const validationLogin = yup.object({
  login: yup.string().required('Login is required').trim(),
  password: yup.string().required('Cannot be blank').trim(),
});

const Login = ({ t }) => {
  const inputRef = useRef();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [isLoad, setLoad] = useState(true);
  useEffect(() => {
    inputRef.current?.focus();
    setTimeout(() => setLoad(false), 2000);
  }, []);
  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: validationLogin,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(routes.loginPath(), values);
        const currentUser = {
          token: response.data.accessToken,
          currentUser: response.data.currentUser,
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        toast.info(response.data.massage);
        setLoading(false);
        login();
        navigate('/?page=1');
      } catch (err) {
        if (err.isAxiosError) {
          const responseErrors = err.response.data.message;
          setLoading(false);
          toast.error(responseErrors);
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
          <div className="flex flex-wrap justify-between justify-end">
            <h1 className="text-2xl text-orange-500 hover:text-orange-500 transition duration-500 p-4">
              <i className="fas fa-sign-in-alt fa-fw fa-lg"></i>
              {t('body.login.title')}
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
              {t('body.login.btn-home')}
              <i className="fas fa-chevron-circle-left fa-fw"></i>
            </a>
          </div>

          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-8">
                <label
                  htmlFor="login"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  <span className="text-red-500 pr-1">&nbsp;*</span>
                  {t('body.login.fields.login.title')}
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
                    placeholder={t('body.login.fields.login.placeholder')}
                    name="login"
                    ref={inputRef}
                    onChange={formik.handleChange}
                    value={formik.values.login}
                    autoComplete="login"
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
                  {t('body.login.fields.password.title')}
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
                    placeholder={t('body.login.fields.password.placeholder')}
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    autoComplete="current-password"
                  />
                </div>
                <strong className="text-red-500 text-xs italic">
                  {formik.errors.password ? formik.errors.password : null}
                </strong>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      className="block text-gray-500 font-bold"
                      htmlFor="remember"
                    >
                      <input
                        className="ml-2 mr-1 leading-tight"
                        type="checkbox"
                        id="remember"
                        name="remember"
                      />
                      <span className="text-sm">
                        {t('body.login.remember')}
                      </span>
                    </label>
                  </div>
                  <div>
                    <a
                      className="font-bold text-sm text-orange-500 ease-in-out duration-300 hover:opacity-50"
                      href="/reset-password"
                    >
                      {t('body.login.forgot-pass')}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-4 text-center">
                <button
                  className="flex w-full border items-center justify-center bg-orange-500 text-white font-bold py-2 rounded ease-in duration-300  hover:border-orange-600 hover:bg-white hover:text-orange-600"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? <Loading /> : 'Sing in'}
                </button>
              </div>
              <hr />
              <div className="mt-8">
                <p className="text-sm">
                  {t('body.login.no-account')}
                  <a
                    className="ml-1 font-bold text-sm text-orange-500 ease-in-out duration-300 hover:opacity-50"
                    href="/register"
                  >
                    {t('body.login.register')}
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
export default Login;

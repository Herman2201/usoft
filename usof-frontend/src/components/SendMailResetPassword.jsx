import React, { useRef, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from './Loading.jsx';
import axios from 'axios';
import routes from '../routes.js';
import NewPassword from './NewPassword.jsx';
import Spinner from './Spinner.jsx';
const validationPassword = yup.object({
  email: yup.string().required('Cannot be blank').trim().email(),
});

const SendMailResetPassword = ({ t }) => {
  const inputRef = useRef();
  const [isSendMassage, setSendMassage] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: validationPassword,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoadingStatus(true);
      try {
        const response = await axios.post(
          routes.sendMailResetPassword(),
          values
        );
        toast.info(response.data.massage);
        toast.info(
          'Please do not close this page, it is waiting for you to follow the link'
        );
        setSendMassage(true);
        setLoadingStatus(false);
      } catch (err) {
        toast.error(
          'You entered a non-existent email, please check your details!'
        );
        setLoadingStatus(false);
      }
    },
  });

  return isSendMassage ? (
    'a'
  ) : (
    <div className="px-4 py-6 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <form
          onSubmit={formik.handleSubmit}
          className="p-8 mt-6 mb-0 rounded-lg shadow-2xl space-y-4"
        >
          <p className="text-2xl font-bold text-center text-orange-600 sm:text-3xl">
            {t('body.reset-password.title')}
          </p>
          <div className="pb-8 pt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="email" className="text-sm font-medium">
                {t('body.reset-password.field.email.title')}
              </label>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {formik.errors.email ? formik.errors.email : null}
              </span>
            </div>

            <div className="relative mt-1">
              <input
                id="email"
                className={`w-full p-4 pr-12 text-sm border border-orange-200 rounded-lg shadow-sm ${
                  formik.errors.email ? 'border-rose-500' : null
                }`}
                name="email"
                placeholder={t('body.reset-password.field.email.placeholder')}
                ref={inputRef}
                onChange={formik.handleChange}
                value={formik.values.email}
                autoComplete="password"
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
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={loadingStatus}
          >
            {loadingStatus ? <Loading /> : t('body.reset-password.btn-send')}
          </button>
          <p className="text-sm text-gray-500">
            {t('body.reset-password.back-page.item1')}
            <a
              className="text-orange-600 transition ease-in-out delay-50 hover:opacity-75 ml-1"
              href="/login"
            >
              {t('body.reset-password.back-page.item2')}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
export default SendMailResetPassword;

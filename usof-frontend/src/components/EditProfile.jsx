import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import routes from '../routes.js';
import Loading from './Loading.jsx';
import UploadImage from './UploadImage.jsx';
import { fetchUserInfo } from '../slices/usersSlice.js';

const validationRegister = yup.object({
  login: yup.string().required('Cannot be blank').trim(),
  fullName: yup.string().required('Cannot be blank').trim(),
});

const EditProfile = ({ t }) => {
  const { token, currentUser } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [file, setFile] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userData = useSelector((state) => state.users.entities);

  useEffect(() => {
    inputRef.current?.focus();
    dispatch(fetchUserInfo(currentUser.id));
  }, []);

  const formik = useFormik({
    initialValues: {
      login: userData[currentUser.id]?.login,
      fullName: userData[currentUser.id]?.full_name,
      email: userData[currentUser.id]?.email,
      picture: '',
      picture2: '',
    },
    validationSchema: validationRegister,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async ({ login, fullName, email }) => {
      const picture = file ? file : userData[currentUser.id]?.profile_pic;

      const data = { login, fullName, email, picture };
      setLoading(true);
      try {
        const response = await axios.patch(
          routes.updateDataUser(currentUser.id, token),
          data
        );
        toast.info(response.data.massage);
        setLoading(false);
        navigate(`/profile/${currentUser.id}`);
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
  useEffect(() => {}, [userData]);
  return (
    userData && (
      <div className="px-4 py-6 mx-auto max-w-screen-xl sm:px-6 lg:px-8">
        <div className="max-w-screen-lg mx-auto">
          <form
            onSubmit={formik.handleSubmit}
            className="p-8 mt-6 mb-0  shadow-2xl space-y-4"
          >
            <p className="text-2xl font-bold text-center text-orange-600 sm:text-3xl">
              {t('body.edit-user.title')}
            </p>
            <div className="flex">
              <div className="flex flex-col w-6/12">
                <div className="mb-4">
                  <div className="flex items-center justify-between max-w-md">
                    <label htmlFor="login" className="text-sm font-medium">
                    {t('body.edit-user.fields.login.title')}
                    </label>
                    <span className="font-medium tracking-wide text-red-500 text-xs">
                      {formik.errors.login ? formik.errors.login : null}
                    </span>
                  </div>
                  <div className="relative mt-1 max-w-md">
                    <input
                      id="login"
                      className={`border-orange-200 w-full p-4 pr-12 text-sm border rounded-lg shadow-sm ${
                        formik.errors.login ? 'border-rose-500' : null
                      }`}
                      name="login"
                      placeholder={t('body.edit-user.fields.login.placeholder')}
                      ref={inputRef}
                      onChange={formik.handleChange}
                      value={formik.values.login}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between max-w-md">
                    <label htmlFor="fullName" className="text-sm font-medium">
                    {t('body.edit-user.fields.full-name.title')}
                    </label>
                    <span className="font-medium tracking-wide text-red-500 text-xs">
                      {formik.errors.fullName ? formik.errors.fullName : null}
                    </span>
                  </div>
                  <div className="relative mt-1 max-w-md">
                    <input
                      id="fullName"
                      className={`border-orange-200 w-full p-4 pr-12 text-sm border rounded-lg shadow-sm ${
                        formik.errors.fullName ? 'border-rose-500' : null
                      }`}
                      name="fullName"
                      placeholder={t('body.edit-user.fields.full-name.placeholder')}
                      onChange={formik.handleChange}
                      value={formik.values.fullName}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between max-w-md">
                    <label htmlFor="fullName" className="text-sm font-medium">
                    {t('body.edit-user.fields.email.title')}
                    </label>
                    <span className="font-medium tracking-wide text-red-500 text-xs">
                      {formik.errors.email ? formik.errors.email : null}
                    </span>
                  </div>
                  <div className="relative mt-1 max-w-md">
                    <input
                      id="email"
                      className={`border-orange-200 w-full p-4 pr-12 text-sm border rounded-lg shadow-sm ${
                        formik.errors.email ? 'border-rose-500' : null
                      }`}
                      name="email"
                      placeholder={t('body.edit-user.fields.email.placeholder')}
                      onChange={formik.handleChange}
                      value={formik.values.email}
                    />
                  </div>
                </div>
              </div>
              <UploadImage formik={formik} nameFile={{ file, setFile }} t={t}/>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="group relative flex max-w-sm w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white ease-in duration-300  hover:border-orange-600 hover:bg-white hover:text-orange-600"
                disabled={isLoading}
              >
                {isLoading ? <Loading /> : t('body.edit-user.btn-edit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
export default EditProfile;

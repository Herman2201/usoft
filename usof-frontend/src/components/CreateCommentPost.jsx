import React, { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import Loading from './Loading.jsx';
import routes from '../routes.js';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';
import { actions } from '../slices/commentSlice.js';

const validationComment = yup.object({
  content: yup.string().required("comment can't be empty").trim(),
});

const CreateCommentPost = ({ postId, t }) => {
  const dispatch = useDispatch();
  const { currentUser, token } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const inputRef = useRef();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: validationComment,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          routes.createPostcomment(postId, token),
          { comment: values.content }
        );
        toast.info(response.data.massage);
        setLoading(false);
        const publish_date = new Date();
        const author_id = currentUser.id;
        const post_id = postId;
        dispatch(
          actions.addComment({
            id: response.data.id_comment.id,
            post_id,
            author_id,
            ...values,
            publish_date,
          })
        );
        formik.values.content = '';
      } catch (err) {
        if (err.isAxiosError) {
          const responseErrors = err.response.data.message;
          setLoading(false);
          toast.error(responseErrors);
          return;
        }
        throw err;
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <label htmlFor="content" className="text-lg font-medium">
              {t('body.post-page.create-comment.title')}
            </label>
            <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
              {formik.errors.content ? formik.errors.content : null}
            </span>
          </div>
          <textarea
            id="content"
            style={{ height: '80px' }}
            className={`w-full text-sm border border-orange-200 ${
              formik.errors.content ? 'border-rose-500' : null
            } h-60`}
            name="content"
            type="text"
            placeholder="Enter comment"
            onChange={formik.handleChange}
            value={formik.values.content}
          />
        </div>
        <div className="my-4 text-center">
          <button
            className="flex border items-center justify-center bg-orange-500 text-white font-bold p-2 rounded ease-in duration-300 hover:border-orange-600 hover:bg-white hover:text-orange-600"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loading /> : t('body.post-page.create-comment.btn-create')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCommentPost;

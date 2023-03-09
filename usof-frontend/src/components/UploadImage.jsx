import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import routes from '../routes.js';

const UploadImage = ({ formik, nameFile, t }) => {
  const [drap, setDrag] = useState(false);
  const [isDisabled, setDisabled] = useState(false);

  const hendlerStartDrag = (e) => {
    e.preventDefault();
    setDrag(true);
  };

  const uploadFile = async () => {
    try {
      var formData = new FormData();
      formData.append('image', nameFile.file);
      const response = await axios.post(routes.uploadFilePost(), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const fileName = response.data.path;
      nameFile.setFile(fileName);
      toast.info(response.data.massage);
      setDisabled(true);
    } catch (err) {
      // toast.error(err);
    }
  };

  const hendlerLeaveDrag = (e) => {
    e.preventDefault();
    setDrag(false);
  };
  const hendlerFile = (e) => {
    e.preventDefault();
    if (e.target.localName !== 'div') {
      nameFile.setFile(e.target.files[0]);
    } else {
      nameFile.setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-6/12">
      <label htmlFor="content" className="text-sm font-medium">
        {t('body.create-post.picture.title')}
      </label>
      <div className="relative h-36">
        {drap ? (
          <div
            className="h-full border-2 border-orange-400 flex items-center pl-5"
            onDragStart={(e) => hendlerStartDrag(e)}
            onDragLeave={(e) => hendlerLeaveDrag(e)}
            onDragOver={(e) => hendlerStartDrag(e)}
            onDrop={(e) => hendlerFile(e)}
          >
            <p className="pl-2 absolute text-orange-400">
              <span className="text-orange-800 underline">{t('body.create-post.picture.upload.item1')}</span> {t('body.create-post.picture.upload.item2')}{' '}
              {nameFile.file ? nameFile.file.name : ''}{' '}
            </p>
            <input
              id="picture2"
              name="picture2"
              type="file"
              className="opacity-0 cursor-pointer"
              onChange={(e) => {
                formik.handleChange(e);
                hendlerFile(e);
                setDrag(true);
              }}
              value={formik.values.picture2}
            />
            <a
              className="border border-orange-600 absolute bottom-0 right-1/3 px-14 cursor-pointer hover:bg-orange-600 hover:text-white ease-in duration-300"
              onClick={() => (isDisabled ? null : uploadFile())}
            >
              {t('body.create-post.picture.link-upload')}
            </a>
          </div>
        ) : (
          <div className="h-full border-2 border-dashed border-orange-400">
            <div
              className="flex items-center h-full pl-5"
              onDragStart={(e) => hendlerStartDrag(e)}
              onDragLeave={(e) => hendlerLeaveDrag(e)}
              onDragOver={(e) => hendlerStartDrag(e)}
            >
              <p className="pl-2 absolute">
                <span className="text-orange-600">{t('body.create-post.picture.dowland.item1')}</span> {t('body.create-post.picture.dowland.item2')}
              </p>
              <input
                id="picture"
                name="picture"
                type="file"
                className="opacity-0 cursor-pointer"
                onChange={(e) => {
                  formik.handleChange(e);
                  hendlerFile(e);
                  setDrag(true);
                }}
                value={formik.values.picture}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadImage;

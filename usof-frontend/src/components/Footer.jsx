import React from 'react';
import Logo from '../assets/logo.svg';

export default ({ t, transBtn }) => {
  return (
    <footer className="border bottom-0 w-full mt-5">
      <div className="max-w-screen-xl px-4 py-4 mx-auto sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <a href="/">
              <img src="/logo.png" width={100} height={150} alt="Logo" />
            </a>
          </div>
          <div className="flex flex-col">
            <div className="flex mb-2 items-center">
              <p className="text-sm text-orange-500">{t('footer.language')}</p>
              {transBtn}{' '}
              <a
                className="text-orange-400 underline mx-2"
                href="/rozbiynik"
                onClick={() =>
                  localStorage.setItem(
                    'isNormal',
                    JSON.stringify({ rozbinik: true })
                  )
                }
              >
                ru
              </a>
            </div>
            <p className="mt-4 text-sm text-center text-orange-500 lg:text-right lg:mt-0">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

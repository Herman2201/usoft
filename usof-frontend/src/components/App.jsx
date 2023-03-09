import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';
import Forum from './Forum.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import SendMailResetPassword from './SendMailResetPassword.jsx';
import NewPassword from './NewPassword.jsx';
import AuthContext from '../contex/authContext.js';
import NotFoundPage from './NotFoundPage.jsx';
import ComfirmEmail from './ComfirmEmail.jsx';
import CreatePost from './CreatePost.jsx';
import CreateCategory from './CreateCategory.jsx';
import Profile from './Profile.jsx';
import EditProfile from './EditProfile.jsx';
import Post from './UserPost.jsx';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation, Trans } from 'react-i18next';
import Rozbiynik from './Rozbiynik.jsx';

const lngs = {
  en: {
    nativeName: 'en',
  },
  ua: {
    nativeName: 'ua',
  },
};

const App = () => {
  const { t, i18n } = useTranslation();
  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ currentUser: 'guest' })
    );
  }
  const buttonTranslate = Object.keys(lngs).map((lng) => {
    return (
      <button
        type="submit"
        key={lng}
        className={`mx-2 text-white ${
          i18n.resolvedLanguage === lng ? 'text-orange-800' : 'text-orange-400'
        } ${i18n.resolvedLanguage === lng ? null : 'underline'}`}
        onClick={() => i18n.changeLanguage(lng)}
        disabled={i18n.resolvedLanguage === lng}
      >
        {lngs[lng].nativeName}
      </button>
    );
  });

  const { currentUser } = JSON.parse(localStorage.getItem('currentUser'));

  const [isLogin, setLogin] = useState(currentUser !== 'guest');
  const [active, setActive] = useState(false);

  const open = () => setActive(!active);
  const login = () => setLogin(true);
  const logout = () => setLogin(false);

  return !localStorage.getItem('isNormal') ? (
    <AuthContext.Provider value={{ login, logout, open }}>
      <div className="min-h-screen flex flex-col">
        <BrowserRouter>
          <CreateCategory isActive={active} setActive={setActive} t={t} />
          <Navbar isLogin={isLogin} t={t} />
          <div className="flex-auto">
            <Routes>
              <Route path="/" element={<Forum t={t} />} />
              <Route path="/create-post" element={<CreatePost t={t} />} />
              <Route path="/edit-profile/:id" element={<EditProfile t={t} />} />
              <Route path="/profile/:id" element={<Profile t={t} />} />
              <Route path="/post/:id" element={<Post t={t} />} />
              <Route path="/login" element={<Login t={t} />} />
              <Route path="/register" element={<Register t={t} />} />
              <Route
                path="/comfirm-email/:token"
                element={<ComfirmEmail t={t} />}
              />
              <Route
                path="/reset-password/:token"
                element={<NewPassword t={t} />}
              />
              <Route
                path="/reset-password"
                element={<SendMailResetPassword t={t} />}
              />
              <Route path="*" element={<NotFoundPage t={t} />} />
            </Routes>
          </div>
          <Footer t={t} transBtn={buttonTranslate} />
        </BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          limit={2}
          theme="light"
          transition={Zoom}
        />
      </div>
    </AuthContext.Provider>
  ) : (
    <BrowserRouter>
      <Routes>
        <Route path="/rozbiynik" element={<Rozbiynik />} />
        <Route
          path="*"
          element={
            <>
              <p className="absolute bottom-10 right-0 text-white text-6xl">Тобі тут немае, що робити!</p>
              <img
                className="w-full h-screen"
                src="https://focus.ua/static/storage/thumbs/920x465/0/11/e5df5ca7-6815e1147f2e6da081e654ef2cc74110.jpg?v=5965_1"
              />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

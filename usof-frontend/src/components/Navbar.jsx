import { useRef, useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import routes from '../routes.js';
import { toast } from 'react-toastify';
import AuthContext from '../contex/authContext.js';
import { fetchUserInfo } from '../slices/usersSlice.js';

const logoutUser = async (token, logout) => {
  try {
    const response = await axios.post(routes.logoutPath(token));
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ currentUser: 'guest' })
    );
    logout();
    toast.info(response.data.massage);
  } catch (err) {}
};

export default (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.users.entities);
  const { logout } = useContext(AuthContext);
  const { isLogin } = props;
  const [state, setState] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [isPressButton, setPressBytton] = useState(false);
  const navRef = useRef();
  const { currentUser, token } = JSON.parse(
    localStorage.getItem('currentUser')
  );
  const genericHamburgerLine = `h-1 w-6 my-0.5 rounded-full bg-black transition ease transform duration-300`;
  useEffect(() => {
    const validUser = async () => {
      if (currentUser !== 'guest') {
        dispatch(fetchUserInfo(currentUser.id));
        try {
          await axios.get(routes.checkValid(token));
        } catch (err) {
          toast.error(
            "Someone logged into your account, I'm sorry to log you out"
          );
          logoutUser(token, logout);
        }
      }
    };

    validUser();
  }, []);
  return (
    <header className="h-20">
      <nav ref={navRef} className="bg-white fixed top-0 w-full z-20 border">
        <div className="items-center px-4 max-w-screen-xl mx-auto lg:flex lg:px-8">
          <div className="flex items-center justify-between lg:block">
            <a href="/?page=1">
              <img src="/logo.png" width={100} height={150} alt="Logo" />
            </a>
            <div className="lg:hidden">
              <button
                className="flex flex-col h-10 w-10 rounded justify-center items-center group"
                onClick={() => {
                  setState(!state);
                  setIsOpen(!isOpen);
                }}
              >
                <div
                  className={`${genericHamburgerLine} ${
                    isOpen
                      ? '-rotate-45 translate-y-2 opacity-50 group-hover:opacity-100'
                      : 'opacity-50 group-hover:opacity-100'
                  }`}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    isOpen ? 'opacity-0' : 'opacity-50 group-hover:opacity-100'
                  }`}
                />
                <div
                  className={`${genericHamburgerLine} ${
                    isOpen
                      ? 'rotate-45 -translate-y-2 opacity-50 group-hover:opacity-100'
                      : 'opacity-50 group-hover:opacity-100'
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="flex-1 justify-between flex-row-reverse lg:overflow-visible lg:flex lg:pb-0 lg:pr-0 lg:h-autox hidden ld:block">
            <div>
              <ul className="flex flex-col-reverse space-x-0 lg:space-x-6 lg:flex-row">
                {isLogin ? (
                  <li className="mt-4 lg:mt-0">
                    <div className="relative flex">
                      <img
                        className="w-10 h-10 rounded-full mt-2 mr-4"
                        src={
                          userData[currentUser.id]?.profile_pic
                            ? routes.getPhoto(
                                userData[currentUser.id].profile_pic
                              )
                            : '/avatars/default.png'
                        }
                      />
                      <button
                        className="space-x-2 w-full mt-2 text-sm font-semibold text-left bg-transparent"
                        onClick={() => setPressBytton(!isPressButton)}
                        onBlur={() =>
                          setTimeout(() => setPressBytton(false), 300)
                        }
                      >
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          className={`${
                            isPressButton ? 'rotate-180' : 'rotate-0'
                          } inline w-4 h-4 transition-transform duration-200 transform text-orange-500`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <div
                        className={`${
                          isPressButton
                            ? 'opacity-1'
                            : 'opacity-0 pointer-events-none'
                        } ease-in duration-300 absolute right-0 w-full mt-14 origin-top-right rounded-md shadow-lg md:w-48`}
                      >
                        <div className="pt-2 bg-white text-orange-500 text-sm rounded-sm border border-main-color shadow-sm">
                          <span className="block px-4 font-bold pb-2 mt-2 text-sm bg-white md:mt-0">
                            {currentUser.login}
                          </span>
                          <div className="border-b"></div>
                          <a
                            className="block px-4 py-2 mt-2 text-sm bg-white hover:bg-orange-200"
                            href={`/profile/${currentUser.id}`}
                          >
                            {props.t('header.list.item1')}
                          </a>
                          <a
                            className="block px-4 py-2 my-2 text-sm bg-white hover:bg-orange-200"
                            href={`/edit-profile/${currentUser.id}`}
                          >
                            {props.t('header.list.item2')}
                          </a>
                          <a
                            className="block px-4 py-2 my-2 text-sm bg-white hover:bg-orange-200"
                            href={`/create-post`}
                          >
                            {props.t('header.list.item3')}
                          </a>
                          <div className="border-b"></div>
                          <button
                            className="flex items-start w-full px-4 py-2 text-sm bg-white hover:bg-orange-200"
                            onClick={async () =>
                              await logoutUser(token, logout)
                            }
                          >
                            {props.t('header.list.item4')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <>
                    <li className="mt-4 lg:mt-0">
                      <a
                        href="/login"
                        className="py-3 px-6 rounded-md text-center border border-orange-500 text-orange-500 hover:bg-orange-500 ease-in duration-300 hover:text-white"
                      >
                        {props.t('header.login')}
                      </a>
                    </li>
                    <li className="mt-8 lg:mt-0">
                      <a
                        href="/register"
                        className="py-3 px-4 text-center text-white border border-orange-500 rounded-md bg-orange-500 ease-in duration-300 hover:text-orange-600 hover:bg-white"
                      >
                        {props.t('header.register')}
                      </a>
                    </li>
                    {props.transBtn}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`fixed top-0 w-6/12 md:w-6/12 h-full transition duration-200 ease-in z-30 pt-2 bg-white text-orange-500 text-sm rounded-sm border border-main-color shadow-sm lg:hidden ${
          state ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {isLogin ? (
          <li className="lg:mt-0">
            <div className="flex flex-col">
              <div className="flex items-center py-2">
                <img
                  className="inline h-10 w-10 ml-4 rounded-full"
                  src={
                    userData[currentUser.id]?.profile_pic
                      ? routes.getPhoto(userData[currentUser.id].profile_pic)
                      : '/avatars/default.png'
                  }
                />
                <span className="block px-4 font-bold text-sm bg-white">
                  {currentUser.login}
                </span>
              </div>
              <div className="border-b"></div>
              <a
                className="block px-4 py-2 mt-2 text-sm bg-white hover:bg-orange-200"
                href={`/profile/${currentUser.id}`}
              >
                {props.t('header.list.item1')}
              </a>
              <a
                className="block px-4 py-2 my-2 text-sm bg-white hover:bg-orange-200"
                href={`/profile/edit/${currentUser.id}`}
              >
                {props.t('header.list.item2')}
              </a>
              <a
                className="block px-4 py-2 my-2 text-sm bg-white hover:bg-orange-200"
                href={`/create-post`}
              >
                {props.t('header.list.item3')}
              </a>
              <div className="border-b"></div>
              <button
                className="flex items-start w-full px-4 py-2 text-sm bg-white hover:bg-orange-200"
                onClick={async () => await logoutUser(token, logout)}
              >
                {props.t('header.list.item4')}
              </button>
            </div>
          </li>
        ) : (
          <>
            <li className="mt-4 lg:mt-0">
              <a
                href="/login"
                className="py-3 px-4 text-center border text-orange-500 hover:text-orange-700 rounded-md block lg:inline lg:border-0"
              >
                Login
              </a>
            </li>
            <li className="mt-8 lg:mt-0">
              <a
                href="/register"
                className="py-3 px-4 text-center text-white bg-orange-500 hover:bg-orange-700 rounded-md shadow block lg:inline"
              >
                Sign Up
              </a>
            </li>
          </>
        )}
      </div>
    </header>
  );
};

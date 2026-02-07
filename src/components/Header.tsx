import { useState, useRef, useEffect } from 'react';
import { Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../images/LogoUra.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isJoinOpenMobile, setIsJoinOpenMobile] = useState(false);

  const langRef = useRef(null);
  const joinRef = useRef(null);

  const location = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !(langRef.current as HTMLElement).contains(e.target as Node)) {
        setIsLangOpen(false);
      }
      if (joinRef.current && !(joinRef.current as HTMLElement).contains(e.target as Node)) {
        setIsJoinOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { key: 'header.home', path: '/' },
    { key: 'header.about', path: '/about-us' },
    { key: 'header.groups', path: '/groups' },
    { key: 'header.gallery', path: '/gallery' },
    { key: 'header.blog', path: '/blog' },
    { key: 'header.sponsors', path: '/sponsors' },
    { key: 'header.partner', path: '/partner' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <header className="bg-[#a51e28] text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20 lg:h-24 relative">
          <Link to="/" className="flex-shrink-0 z-50 lg:z-auto">
            <img src={Logo} alt="URA Logo" className="h-12 sm:h-14 lg:h-16 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center px-8">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`relative font-medium py-2 px-3 xl:px-4 text-[15px] transition duration-300 hover:text-red-200 font-myfont whitespace-nowrap ${
                    isActive ? 'after:opacity-100' : 'after:opacity-0'
                  } after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-white after:transition-opacity after:duration-300 hover:after:opacity-100`}
                >
                  {t(item.key)}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 py-2 px-3 font-medium hover:text-red-200 transition duration-300 font-myfont"
                aria-label="Change language"
              >
                <Globe size={18} />
                <ChevronDown size={16} className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLangOpen && (
                <div className="absolute left-0 mt-2 bg-white text-[#a51e28] shadow-lg rounded-xl text-sm z-50 min-w-max overflow-hidden font-myfont">
                  <button
                    onClick={() => changeLanguage('de')}
                    className="flex items-center w-full px-4 py-2.5 hover:bg-red-50 transition duration-150 whitespace-nowrap text-left"
                  >
                    <span className="mr-2">🇨🇭</span> Deutsch
                  </button>
                  <button
                    onClick={() => changeLanguage('sq')}
                    className="flex items-center w-full px-4 py-2.5 hover:bg-red-50 transition duration-150 whitespace-nowrap text-left border-t border-red-100"
                  >
                    <span className="mr-2">🇦🇱</span> Shqip
                  </button>
                </div>
              )}
            </div>

            <div className="relative" ref={joinRef}>
              <button
                onClick={() => setIsJoinOpen(!isJoinOpen)}
                className="bg-white text-[#a51e28] font-semibold py-2.5 px-5 rounded-xl hover:bg-red-50 transition duration-300 flex items-center gap-2 font-myfont shadow-sm"
              >
                {t('header.join')}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isJoinOpen ? 'rotate-180' : ''}`} />
              </button>
              {isJoinOpen && (
                <div className="absolute right-0 mt-2 bg-white text-[#a51e28] shadow-lg rounded-xl z-50 text-sm min-w-max overflow-hidden font-myfont">
                  <Link
                    to="/join-us"
                    className="block px-5 py-2.5 hover:bg-red-50 transition duration-150 text-right whitespace-nowrap"
                    onClick={() => setIsJoinOpen(false)}
                  >
                    {t('header.joinMember')}
                  </Link>
                  <Link
                    to="/sponsor-contact"
                    className="block px-5 py-2.5 hover:bg-red-50 transition duration-150 text-right whitespace-nowrap border-t border-red-100"
                    onClick={() => setIsJoinOpen(false)}
                  >
                    {t('header.joinVolunteer')}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 z-50 hover:bg-red-800 rounded-lg transition duration-200"
            aria-label="Menu toggle"
          >
            {isMenuOpen ? <X size={24} className="sm:w-6 sm:h-6" /> : <Menu size={24} className="sm:w-6 sm:h-6" />}
          </button>
        </nav>

        <div
          className={`lg:hidden absolute top-0 left-0 w-full bg-[#a51e28] transition-all duration-300 overflow-hidden shadow-lg ${
            isMenuOpen ? 'max-h-screen py-20 sm:py-24 px-4 sm:px-6' : 'max-h-0 py-0 px-0'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`block py-3 px-4 rounded-xl text-base transition duration-200 text-center font-myfont ${
                    isActive ? 'bg-red-900 shadow-sm' : 'hover:bg-red-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-red-700/50">
              <button
                onClick={() => setIsJoinOpenMobile(!isJoinOpenMobile)}
                className="bg-white text-[#a51e28] font-semibold py-3 px-4 rounded-xl hover:bg-red-50 transition duration-300 flex items-center justify-center gap-2 w-full text-base font-myfont shadow-sm"
              >
                {t('header.join')}
                <ChevronDown size={16} className={`transition-transform duration-200 ${isJoinOpenMobile ? 'rotate-180' : ''}`} />
              </button>
              {isJoinOpenMobile && (
                <div className="mt-3 space-y-2 font-myfont">
                  <Link
                    to="/join-us"
                    className="block bg-white text-[#a51e28] font-medium py-2.5 rounded-xl hover:bg-red-50 transition duration-150 shadow-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsJoinOpenMobile(false);
                    }}
                  >
                    {t('header.joinMember')}
                  </Link>
                  <Link
                    to="/sponsor-contact"
                    className="block bg-white text-[#a51e28] font-medium py-2.5 rounded-xl hover:bg-red-50 transition duration-150 shadow-sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsJoinOpenMobile(false);
                    }}
                  >
                    {t('header.joinVolunteer')}
                  </Link>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-3 pt-4 border-t border-red-700/50 font-myfont">
              <button
                onClick={() => {
                  changeLanguage('de');
                  setIsMenuOpen(false);
                }}
                className="flex items-center bg-white text-[#a51e28] px-4 py-2.5 rounded-xl hover:bg-red-50 transition duration-150 text-sm shadow-sm"
              >
                <span className="mr-1.5">🇨🇭</span> Deutsch
              </button>
              <button
                onClick={() => {
                  changeLanguage('sq');
                  setIsMenuOpen(false);
                }}
                className="flex items-center bg-white text-[#a51e28] px-4 py-2.5 rounded-xl hover:bg-red-50 transition duration-150 text-sm shadow-sm"
              >
                <span className="mr-1.5">🇦🇱</span> Shqip
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

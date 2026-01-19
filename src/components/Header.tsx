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
    { key: 'header.sponsors', path: '/sponsors' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    <header className="bg-[#a51e28] text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <nav className="flex items-center justify-between py-4 sm:py-5 md:py-8 relative">
          <Link to="/" className="md:mb-0 z-50 md:z-auto">
            <img src={Logo} alt="URA Logo" className="h-14 sm:h-16 md:h-20 w-auto" />
          </Link>

          <div className="hidden lg:flex space-x-6 xl:space-x-10 justify-center w-full relative items-center">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`relative font-medium py-2 px-4 rounded transition duration-300 hover:text-red-200 ${
                    isActive ? 'after:opacity-100' : 'after:opacity-0'
                  } after:content-[""] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-white after:transition-opacity after:duration-300 hover:after:opacity-100`}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            {/* Language Dropdown - Aligned Left */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 py-2 px-4 font-medium hover:text-red-200"
              >
                <Globe size={18} />
                <ChevronDown size={16} />
              </button>
              {isLangOpen && (
                <div className="absolute left-0 mt-2 bg-white text-[#a51e28] shadow-md rounded text-sm z-50 min-w-max text-left">
                  <button
                    onClick={() => changeLanguage('de')}
                    className="block w-full px-4 py-2 hover:bg-red-100 whitespace-nowrap text-left"
                  >
                    🇨🇭 Deutsch
                  </button>
                  <button
                    onClick={() => changeLanguage('sq')}
                    className="block w-full px-4 py-2 hover:bg-red-100 whitespace-nowrap text-left"
                  >
                    🇦🇱 Shqip
                  </button>
                </div>
              )}
            </div>

            {/* Join Us Dropdown (remains right-aligned) */}
            <div className="relative" ref={joinRef}>
              <button
                onClick={() => setIsJoinOpen(!isJoinOpen)}
                className="bg-white text-[#a51e28] font-semibold py-2 px-4 rounded hover:bg-red-100 transition duration-300 flex items-center gap-2"
              >
                {t('header.join')}
                <ChevronDown size={16} />
              </button>
              {isJoinOpen && (
                <div className="absolute right-0 mt-2 bg-white text-[#a51e28] shadow-md rounded z-50 text-sm min-w-max text-right">
                  <Link
                    to="/join-us"
                    className="block px-4 py-2 hover:bg-red-100 text-right whitespace-nowrap"
                    onClick={() => setIsJoinOpen(false)}
                  >
                    {t('header.joinMember')}
                  </Link>
                  <Link
                    to="/sponsor-contact"
                    className="block px-4 py-2 hover:bg-red-100 text-right whitespace-nowrap"
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
            className="lg:hidden p-1 sm:p-2 z-50"
            aria-label="Menu toggle"
          >
            {isMenuOpen ? <X size={24} className="sm:w-7 sm:h-7" /> : <Menu size={24} className="sm:w-7 sm:h-7" />}
          </button>
        </nav>

        <div
          className={`lg:hidden absolute top-0 left-0 w-full bg-[#a51e28] transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-screen py-20 sm:py-24 px-4 sm:px-6' : 'max-h-0 py-0 px-0'
          }`}
        >
          <div className="flex flex-col space-y-4">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`block py-2 sm:py-3 px-3 sm:px-4 rounded text-base sm:text-lg transition duration-200 text-center ${
                    isActive ? 'bg-red-900' : 'hover:bg-red-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.key)}
                </Link>
              );
            })}

            {/* Join Us Mobile Dropdown */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsJoinOpenMobile(!isJoinOpenMobile)}
                className="bg-white text-[#a51e28] font-semibold py-2 px-3 sm:px-4 rounded hover:bg-red-100 transition duration-300 flex items-center justify-center gap-2 w-full text-base sm:text-lg"
              >
                {t('header.join')}
                <ChevronDown size={16} />
              </button>
              {isJoinOpenMobile && (
                <div className="mt-2 space-y-2">
                  <Link
                    to="/join-us"
                    className="block bg-white text-[#a51e28] font-medium py-2 rounded hover:bg-red-100"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsJoinOpenMobile(false);
                    }}
                  >
                    {t('header.joinMember')}
                  </Link>
                  <Link
                    to="/sponsor-contact"
                    className="block bg-white text-[#a51e28] font-medium py-2 rounded hover:bg-red-100"
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

            {/* Language switch mobile */}
            <div className="flex justify-center gap-3 sm:gap-4 pt-4">
              <button
                onClick={() => {
                  changeLanguage('de');
                  setIsMenuOpen(false);
                }}
                className="bg-white text-[#a51e28] px-2 sm:px-3 py-1.5 sm:py-2 rounded hover:bg-red-100 text-xs sm:text-sm"
              >
                🇨🇭 Deutsch
              </button>
              <button
                onClick={() => {
                  changeLanguage('sq');
                  setIsMenuOpen(false);
                }}
                className="bg-white text-[#a51e28] px-2 sm:px-3 py-1.5 sm:py-2 rounded hover:bg-red-100 text-xs sm:text-sm"
              >
                🇦🇱 Shqip
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

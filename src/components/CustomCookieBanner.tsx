import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'; // ✅ Import Link from react-router-dom

const CustomCookieBanner = () => {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between shadow-lg"
      style={{ backgroundColor: '#383838' }}
    >
      <p className="text-white text-sm">
        {t('cookieBanner.message')}{' '}
        <Link to="/privacy-policy" className="underline underline-offset-4" style={{ color: '#9BA2AF' }}>
          {t('cookieBanner.learnMore')}
        </Link>
      </p>
      <button
        onClick={acceptCookies}
        className="ml-4 px-4 py-2 rounded-lg font-medium"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        {t('cookieBanner.accept')}
      </button>
    </div>
  );
};

export default CustomCookieBanner;

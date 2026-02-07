import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from '../images/LogoUra.png';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#333333] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Column 1 - Logo */}
          <div className="mt-9 md:mb-0">
            <img src={Logo} alt={t('footer.logoAlt')} className="h-20 w-auto" />
          </div>

          {/* Column 2 - Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.office.title')}</h4>
            <div className="space-y-3">
              <p className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
                {t('footer.office.location')}
              </p>
              <p className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300">
                {t('footer.office.contactPrompt')}
              </p>
              <a
                href="mailto:Info@ansambli-ura.ch"
                className="text-white transition-colors duration-300"
              >
                Info@ansambli-ura.ch
              </a>
              <a
                href="tel:+41764118600"
                className="text-white block transition-colors duration-300"
              >
                +41 76 411 86 00
              </a>
            </div>
          </div>

          {/* Column 3 - Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.social.title')}</h4>
            <div className="space-y-3">
              <a
                href="https://www.facebook.com/profile.php?id=61576679018019&mibextid=wwXIfr&rdid=RrPMWorh7K4cqGb4&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16UaBNcaAt%2F%3Fmibextid%3DwwXIfr"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span>{t('footer.social.facebook')}</span>
              </a>
              <a
                href="https://www.instagram.com/ansambli.ura"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span>{t('footer.social.instagram')}</span>
              </a>
              <a
                href="https://www.tiktok.com/@ansambli.ura?_t=ZN-8xpX5pyZQhy&_r=1"
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300"
              >
                <span>{t('footer.social.tiktok')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="border-t border-white pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white text-sm">
              {t('footer.copyright', { year: 2025 })}
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy-policy"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <span className="text-white">|</span>
              <Link
                to="/terms-of-service"
                className="text-white hover:text-gray-300 transition-colors duration-300"
              >
                {t('footer.termsConditions')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

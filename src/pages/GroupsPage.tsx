import { useTranslation } from 'react-i18next';
import GroupsSection from '../components/GroupsSection';
import ContactForm from '../components/ContactForm';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

const GroupsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-6 sm:pt-8">
      {/* SEO Meta für Gruppen-Seite */}
      <Helmet>
        <title>Gruppen – Ansambli Ura</title>
        <meta
          name="description"
          content="Vereint durch das Ziel, die albanische Kultur zu bewahren und zu fördern, bringt unser Team Erfahrung, Leidenschaft und Zusammenarbeit in jede Probe und Aufführung ein."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/groups" />
      </Helmet>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
          <Link to="/" className="hover:underline hover:underline-offset-4 text-gray-500 font-medium">
            {t('header.home')}
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-gray-700 font-semibold">{t('groupsSection.title')}</span>
        </nav>
      </div>

      <GroupsSection />
      <ContactForm />
    </div>
  );
};

export default GroupsPage;

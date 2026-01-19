import './i18n'; // ⬅️ Keep this at the top

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import JoinUsPage from './pages/JoinUsPage';
import SponsorJoinUs from './pages/SponsorJoinUs';
import GalleryPage from './pages/GalleryPage';
import BlogPage from './pages/BlogPage';
import AboutUsPage from './pages/AboutUsPage';
import SponsorsPage from './pages/SponsorsPage';
import PartnerPage from './pages/PartnerPage';
import NewsDetailPage from './components/NewsDetailPage';
import ScrollToTop from './components/ScrollToTop';
import CustomCookieBanner from './components/CustomCookieBanner';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsService from './pages/TermsService';

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white flex flex-col justify-between">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/join-us" element={<JoinUsPage />} />
              <Route path="/sponsor-contact" element={<SponsorJoinUs />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/sponsors" element={<SponsorsPage />} />
              <Route path="/partner" element={<PartnerPage />} />
              <Route path="/news/:id" element={<NewsDetailPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsService />} />
            </Routes>
          </main>
          <Footer />
          <CustomCookieBanner />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;

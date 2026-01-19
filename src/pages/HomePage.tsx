import { Helmet } from "react-helmet-async";

import HeroSection from '../components/HeroSection';
import MissionValuesTeam from '../components/MissionValuesTeam';
import NewInvestments from '../components/NewInvestments';
import GroupsSection from '../components/GroupsSection';
import Gallery from '../components/Gallery';
import ContactForm from '../components/ContactForm';
import FinalSection from '../components/FinalSection';
import SponsorsSection from '../components/SponsorsSection';
import PatternStrip from '../components/PatternStrip';

const HomePage = () => {
  return (
    <div className="bg-white">
     <Helmet>
      <title>Ansambli Ura – Tradition und Kultur aus Albanien in der Schweiz</title>
      <meta
        name="description"
        content="Ansambli Ura bringt albanische Tradition, Tanz und Musik in die Schweiz. Entdecken Sie unsere Auftritte, Projekte und kulturellen Aktivitäten."
      />
      <link rel="canonical" href="https://ansambli-ura.ch/" />
    </Helmet>

      <main>
        <HeroSection />
        <NewInvestments />
        <MissionValuesTeam />
        <SponsorsSection />
        <GroupsSection />
        <PatternStrip />
        <Gallery />
        <ContactForm />
        <FinalSection />
      </main>
    </div>
  );
};

export default HomePage;

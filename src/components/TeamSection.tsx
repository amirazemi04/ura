import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';
import { safeGetEntries, safeGetAssetFromReference, safeGetField, normalizeLocale } from '../utils/contentfulHelpers';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

const TeamSection = () => {
  const { i18n } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const currentLocale = normalizeLocale(i18n.language);
        const entries = await safeGetEntries('teamMember', currentLocale);

        const data = await Promise.all(
          entries.map(async (item: any) => {
            const fields = item.fields || {};
            const imageUrl = await safeGetAssetFromReference(fields.image);

            return {
              id: item.sys.id,
              name: safeGetField(fields, 'name', 'Emër pa emër'),
              role: safeGetField(fields, 'role', ''),
              description: safeGetField(fields, 'description', ''),
              image: imageUrl,
            };
          })
        );

        setMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [i18n.language]);

  const handleSelect = (member: TeamMember) => {
    setSelectedMember((prev) => (prev?.id === member.id ? null : member));
  };

  if (loading) {
    return (
      <section className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-500">{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Reveal>
        <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
          <Link to="/" className="hover:underline hover:underline-offset-4 text-gray-500 font-medium">
            {i18n.language === 'sq' ? 'Ballina' : 'Startseite'}
          </Link>
          <span className="mx-1 sm:mx-2">/</span>
          <span className="text-gray-700 font-semibold">
            {i18n.language === 'sq' ? 'Ekipa' : 'Team'}
          </span>
        </nav>
      </Reveal>

      {/* Team grid */}
      <Reveal delay={0.2}>
        {members.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {i18n.language === 'sq' ? 'Asnjë anëtar ekipi i disponueshëm' : 'Keine Teammitglieder verfügbar'}
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {members.map((member) => {
          const isSelected = selectedMember?.id === member.id;

          return (
            <div
              key={member.id}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 rounded-xl overflow-hidden"
              onClick={() => handleSelect(member)}
            >
              <div className="relative bg-white shadow-md rounded-xl overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover aspect-[3/4]"
                  loading="lazy"
                />
                {isSelected && (
                  <span className="absolute inset-0 ring-4 ring-red-500 pointer-events-none rounded-xl" />
                )}
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 text-sm text-gray-700"
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {member.name}
                      <span className="text-gray-500 font-normal"> / {member.role}</span>
                    </h3>
                    <p className="whitespace-pre-line text-xs">{member.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        </div>
        )}
      </Reveal>
    </section>
  );
};

export default TeamSection;

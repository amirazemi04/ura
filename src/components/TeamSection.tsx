import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../contentfulClient';
import Reveal from './Reveal';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  image: string;
}

const DEFAULT_LOCALE = 'de';

const TeamSection = () => {
  const { i18n } = useTranslation();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const currentLocale = i18n.language || DEFAULT_LOCALE;
        const response = await client.getEntries({
          content_type: 'teamMember',
          locale: currentLocale,
        });

        const data = await Promise.all(
          response.items.map(async (item: any) => {
            const imageId = item.fields.image?.sys?.id;
            let imageUrl = '';

            if (imageId) {
              const asset = await client.getAsset(imageId, { locale: DEFAULT_LOCALE });
              imageUrl = asset?.fields?.file?.url ? `https:${asset.fields.file.url}` : '';
            }

            return {
              id: item.sys.id,
              name: item.fields.name || 'Emër pa emër',
              role: item.fields.role || '',
              description: item.fields.description || '',
              image: imageUrl,
            };
          })
        );

        setMembers(data);
      } catch (error) {
        console.error('Gabim në tërheqjen e të dhënave nga Contentful:', error);
      }
    };

    fetchMembers();
  }, [i18n.language]);

  const handleSelect = (member: TeamMember) => {
    setSelectedMember((prev) => (prev?.id === member.id ? null : member));
  };

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Reveal>
        <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
          <Link to="/" className="hover:underline text-gray-500 font-medium">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {members.map((member) => {
          const isSelected = selectedMember?.id === member.id;

          return (
            <div
              key={member.id}
              className="cursor-pointer transition-transform duration-300 hover:scale-105 rounded-md overflow-hidden"
              onClick={() => handleSelect(member)}
            >
              <div className="relative bg-white shadow-md rounded-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover aspect-[3/4]"
                  loading="lazy"
                />
                {isSelected && (
                  <span className="absolute inset-0 ring-4 ring-red-500 pointer-events-none rounded-md" />
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
      </Reveal>
    </section>
  );
};

export default TeamSection;

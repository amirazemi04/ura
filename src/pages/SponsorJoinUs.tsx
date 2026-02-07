import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import emailjs from 'emailjs-com';
import client from '../contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import FinalSection from '../components/FinalSection';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Helmet } from 'react-helmet-async';

const MySwal = withReactContent(Swal);

type FormValues = {
  vorname: string;
  nachname: string;
  email: string;
  adresse: string;
  telefonnummer: string;
  agreed: boolean;
};

const DEFAULT_LOCALE = 'de';

const SponsorJoinUs = () => {
  const { t, i18n } = useTranslation();

  const [textContent, setTextContent] = useState<{
    joinTitle: string;
    joinDescriptio: string;
    sideTextRich: Document | null;
  }>({
    joinTitle: '',
    joinDescriptio: '',
    sideTextRich: null,
  });

  const [sponsorImage, setSponsorImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;

      try {
        const entries = await client.getEntries({
          content_type: 'sponsors',
          limit: 1,
          locale: currentLocale,
        });

        if (entries.items.length > 0) {
          const fields = entries.items[0].fields;
          setTextContent({
            joinTitle: fields.joinTitle || '',
            joinDescriptio: fields.joinDescriptio || '',
            sideTextRich: fields.sideTextRich || null,
          });
        }
      } catch (error) {
        console.error('Error fetching sponsor texts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [i18n.language]);

  useEffect(() => {
    const fetchSponsorImage = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'imazhetEwebit',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        if (response.items.length > 0) {
          const entry = response.items[0];
          const image = entry.fields.contactSponsorImg;
          if (image && image.fields?.file?.url) {
            setSponsorImage(`https:${image.fields.file.url}`);
          }
        }
      } catch (error) {
        console.error('Error fetching sponsor image:', error);
      }
    };

    fetchSponsorImage();
  }, []);

  const initialValues: FormValues = {
    vorname: '',
    nachname: '',
    email: '',
    adresse: '',
    telefonnummer: '',
    agreed: false,
  };

  const inputFields = [
    { label: t('form.firstName'), name: 'vorname' },
    { label: t('form.lastName'), name: 'nachname' },
    { label: t('form.email'), name: 'email', type: 'email' },
    { label: t('form.address'), name: 'adresse' },
    { label: t('form.phone'), name: 'telefonnummer', type: 'tel' },
  ];

  const handleSubmit = (values: FormValues, { resetForm }: any) => {
    if (!values.agreed) {
      MySwal.fire({
        icon: 'warning',
        title: t('form.agreementError'),
        confirmButtonColor: '#f59e0b',
      });
      return;
    }

    emailjs
      .send('service_biptael', 'template_w08yg64', values, 'QMPqO0tWKwYWz0t5H')
      .then(() => {
        MySwal.fire({
          icon: 'success',
          title: t('form.success'),
          confirmButtonColor: '#10B981',
        });
        resetForm();
      })
      .catch(() => {
        MySwal.fire({
          icon: 'error',
          title: t('form.error'),
          confirmButtonColor: '#EF4444',
        });
      });
  };

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: any) => <strong style={{ color: '#a51e28' }}>{text}</strong>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="text-[#333333] leading-relaxed mb-4">{children}</p>
      ),
    },
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 mb-8 pt-6 sm:pt-8">
      {/* SEO Meta für Sponsor Join-Seite */}
      <Helmet>
        <title>Sponsor werden – Ansambli Ura</title>
        <meta
          name="description"
          content="Schliessen Sie sich Ansambli URA an und helfen Sie mit, die albanische Kultur durch Tanz, Musik und Tradition zu feiern. Füllen Sie das Formular aus und werden Sie Teil unserer kulturellen Gemeinschaft in der Schweiz."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/sponsor-contact" />
      </Helmet>

      {/* Breadcrumb Navigation */}
      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.join')}</span>
      </nav>

      {/* Content */}
      {loading ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100">
          <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
        </div>
      ) : (
        <section className="py-16" id="sponsors-contact">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#333333] mb-6 pb-1 text-center relative inline-block">
                {textContent.joinTitle || 'No joinTitle loaded'}
                <svg
                  viewBox="-4 -4 208 28"
                  preserveAspectRatio="none"
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-[-14px] w-full h-6 overflow-visible"
                >
                  <path
                    d="M4,22 Q100,-15 196,22"
                    fill="none"
                    stroke="#a51e28"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mt-6">
                {textContent.joinDescriptio || 'No joinDescription loaded'}
              </p>
            </div>

            {/* Sponsor Image */}
            <section className="py-16">
              <div className="container mx-auto">
                <div className="w-full h-40 sm:h-48 mb-8 sm:mb-12">
                  {sponsorImage ? (
                    <img
                      src={sponsorImage}
                      alt="Sponsor Image"
                      className="object-cover w-full h-full shadow-md"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400">Image not available</span>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Sponsor Form */}
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {() => (
                <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-64">
                  <div className="space-y-4">
                    {inputFields.map(({ label, name, type = 'text' }) => (
                      <div key={name} className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <label
                          htmlFor={name}
                          className="w-full sm:w-36 text-sm font-medium text-[#333333] mb-1 sm:mb-0"
                        >
                          {label}
                        </label>
                        <Field
                          type={type}
                          name={name}
                          id={name}
                          required
                          className="flex-1 border-b border-gray-400 focus:outline-none py-1.5 placeholder:text-gray-400"
                        />
                        <ErrorMessage name={name} component="div" className="text-red-500 text-xs" />
                      </div>
                    ))}

                    <div className="flex items-start gap-2 mt-4">
                      <Field type="checkbox" name="agreed" id="agreed" className="mt-[0.25rem]" />
                      <label htmlFor="agreed" className="text-sm text-gray-700 pt-[2px]">
                        {t('form.agreement_start')}{' '}
                        <Link to="/terms" className="underline text-[#a51e28]">
                          {t('form.terms_conditions')}
                        </Link>{' '}
                        {i18n.language === 'sq' ? 'si dhe' : 'und'}{' '}
                        <Link to="/privacy" className="underline text-[#a51e28]">
                          {t('form.privacy_policy')}
                        </Link>.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="mt-4 bg-[#a51e28] text-white px-4 py-2 rounded hover:bg-[#891b22] transition"
                    >
                      {t('form.send')}
                    </button>
                  </div>

                  <div className="mt-6 lg:mt-9">
                    {textContent.sideTextRich
                      ? documentToReactComponents(textContent.sideTextRich, options)
                      : <p className="text-sm text-gray-400">No sideTextRich loaded</p>}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </section>
      )}

      <FinalSection />
    </div>
  );
};

export default SponsorJoinUs;

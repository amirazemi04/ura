import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import emailjs from 'emailjs-com';
import client from '../contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import FinalSection from '../components/FinalSection';
import { Helmet } from 'react-helmet-async';

type FormValues = {
  vorname: string;
  nachname: string;
  adresse: string;
  plz_ort: string;
  geburtsdatum: string;
  email_adresse: string;
  telefonnummer: string;
  prejardhja: string;
  agreed: boolean;
  role: string;
};

const DEFAULT_LOCALE = 'de';

const JoinUsPage = () => {
  const { t, i18n } = useTranslation();
  const [textContent, setTextContent] = useState<{
    joinTitle: string;
    joinDescription: string;
    sideTextRich: Document | null;
  }>({
    joinTitle: '',
    joinDescription: '',
    sideTextRich: null,
  });

  const [contactImage, setContactImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchText = async () => {
      setLoading(true);
      const currentLocale = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;
      try {
        const entries = await client.getEntries({
          content_type: 'teksti',
          limit: 1,
          locale: currentLocale,
        });
        if (entries.items.length > 0) {
          const fields = entries.items[0].fields;
          setTextContent({
            joinTitle: fields.joinTitle || '',
            joinDescription: fields.joinDescription || '',
            sideTextRich: fields.sideTextRich || null,
          });
        }
      } catch (error) {
        console.error('Error fetching join texts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [i18n.language]);

  useEffect(() => {
    const fetchContactImage = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'imazhetEwebit',
          limit: 1,
          locale: DEFAULT_LOCALE,
        });

        if (response.items.length > 0) {
          const entry = response.items[0];
          const image = entry.fields.contactImg;
          if (image?.fields?.file) {
            setContactImage(`https:${image.fields.file.url}`);
          }
        }
      } catch (error) {
        console.error('Error fetching contact image:', error);
      }
    };

    fetchContactImage();
  }, []);

  const initialValues: FormValues = {
    vorname: '',
    nachname: '',
    adresse: '',
    plz_ort: '',
    geburtsdatum: '',
    email_adresse: '',
    telefonnummer: '',
    prejardhja: '',
    agreed: false,
    role: 'antar',
  };

  const inputFields = [
    { label: t('form.firstName'), name: 'vorname' },
    { label: t('form.lastName'), name: 'nachname' },
    { label: t('form.address'), name: 'adresse' },
    { label: t('form.zipCity'), name: 'plz_ort' },
    { label: t('form.birthdate'), name: 'geburtsdatum', type: 'date' },
    { label: t('form.email'), name: 'email_adresse', type: 'email' },
    { label: t('form.phone'), name: 'telefonnummer', type: 'tel' },
    { label: t('form.origin'), name: 'prejardhja' },
  ];

  const handleSubmit = (values: FormValues, { resetForm }: any) => {
    if (!values.agreed) {
      alert(
        'Ju lutemi pranoni Termat dhe Kushtet dhe Politikën e Privatësisë para se të vazhdoni.'
      );
      return;
    }

    const translatedRole =
      values.role === 'antar'
        ? i18n.language === 'sq'
          ? 'Anëtar'
          : 'Mitglied'
        : i18n.language === 'sq'
        ? 'Valltar'
        : 'Tänzer';

    const emailData = {
      ...values,
      role: translatedRole,
    };

    emailjs
      .send('service_biptael', 'template_m8agxfc', emailData, 'QMPqO0tWKwYWz0t5H')
      .then(() => {
        alert(t('form.success'));
        resetForm();
      })
      .catch((err) => {
        alert(t('form.error'));
        console.error(err);
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
      {/* SEO Meta */}
      <Helmet>
        <title>Werden Sie Teil von Ansambli URA!</title>
        <meta
          name="description"
          content="Werden Sie Teil von Ansambli URA und unterstützen Sie uns dabei, die albanische Kultur durch Tanz, Musik und Tradition lebendig zu halten. Melden Sie sich jetzt an und tanzen Sie mit uns albanische Volkstänze in der Schweiz."
        />
        <link rel="canonical" href="https://ansambli-ura.ch/join-us" />
      </Helmet>

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 my-6 sm:my-12 text-center sm:text-left">
        <Link to="/" className="hover:underline text-gray-500 font-medium">
          {t('header.home')}
        </Link>
        <span className="mx-1 sm:mx-2">/</span>
        <span className="text-gray-700 font-semibold">{t('header.join')}</span>
      </nav>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center bg-gray-100">
          <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
        </div>
      ) : (
        <section className="py-16" id="joinus">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#333333] mb-6 pb-1 text-center relative inline-block">
                {textContent.joinTitle}
                <svg
                  viewBox="0 0 768.9 65.28"
                  preserveAspectRatio="none"
                  className="absolute left-1/2 transform -translate-x-1/2 bottom-[-14px] w-[300px] h-[8px]"
                >
                  <path
                    fill="#a61e29"
                    d="M22.08,48.81c82.09-11.37,164.95-17.33,247.75-20.22,97.88-3.42,195.97-2.19,293.72,4.02,56.9,3.62,113.69,8.98,170.23,16.42,3.24.43,5.97-3.06,6-6,.04-3.59-2.8-5.58-6-6-100.74-13.25-202.31-20-303.88-21.8-93.06-1.65-186.27.79-279.07,7.98-44.1,3.42-88.11,7.96-131.93,14.03-7.62,1.05-4.38,12.62,3.19,11.57"
                  />
                </svg>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mt-6">
                {textContent.joinDescription}
              </p>
            </div>

            {/* Contact Image */}
            <div className="w-full h-40 sm:h-48 mb-8 sm:mb-12">
              {contactImage ? (
                <img
                  src={contactImage}
                  alt="Ansambli URA"
                  className="object-cover w-full h-full shadow-md"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">Image not available</span>
                </div>
              )}
            </div>

            {/* Form */}
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {() => (
                <Form className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-64">
                  <div className="space-y-4">
                    {inputFields.map(({ label, name, type = 'text' }) => (
                      <div
                        key={name}
                        className="flex flex-col sm:flex-row sm:items-center sm:gap-2"
                      >
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
                        <ErrorMessage
                          name={name}
                          component="div"
                          className="text-red-500 text-xs"
                        />
                      </div>
                    ))}

                    {/* Role Radio Buttons */}
                    <div className="mt-4">
                      <span className="block text-sm text-gray-700 mb-2">
                        {i18n.language === 'sq' ? 'Zgjidh një rol' : 'Wähle eine Rolle'}
                      </span>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2">
                          <Field type="radio" name="role" value="antar" required />
                          <span>{i18n.language === 'sq' ? 'Anëtar' : 'Mitglied'}</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <Field type="radio" name="role" value="valltar" required />
                          <span>{i18n.language === 'sq' ? 'Valltar' : 'Tänzer'}</span>
                        </label>
                      </div>
                    </div>

                    {/* Agreement */}
                    <div className="flex items-start gap-2 mt-4">
                      <Field
                        type="checkbox"
                        name="agreed"
                        id="agreed"
                        className="mt-[0.25rem]"
                      />
                      <label htmlFor="agreed" className="text-sm text-gray-700 pt-[2px]">
                        {t('form.agreement_start')}{' '}
                        <Link to="/terms" className="underline text-[#a51e28]">
                          {t('form.terms_conditions')}
                        </Link>{' '}
                        {i18n.language === 'sq' ? 'si dhe' : 'und'}{' '}
                        <Link to="/privacy" className="underline text-[#a51e28]">
                          {t('form.privacy_policy')}
                        </Link>
                        .
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
                    {textContent.sideTextRich &&
                      documentToReactComponents(textContent.sideTextRich, options)}
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

export default JoinUsPage;

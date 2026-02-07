import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import emailjs from 'emailjs-com';
import client from '../contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import Reveal from './Reveal';

type FormValues = {
  vorname: string;
  nachname: string;
  email: string;
  adresse: string;
  telefonnummer: string;
  agreed: boolean;
};

const DEFAULT_LOCALE = 'de';

const ContactSponsors = () => {
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
      alert('Ju lutemi pranoni Termat dhe Kushtet dhe Politikën e Privatësisë para se të vazhdoni.');
      return;
    }

    const serviceID = 'service_biptael';
    const templateID = 'template_w08yg64';
    const userID = 'QMPqO0tWKwYWz0t5H';

    emailjs
      .send(serviceID, templateID, values, userID)
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        alert(t('form.success'));
        resetForm();
      })
      .catch((error) => {
        console.error('EmailJS error:', error);
        alert(t('form.error'));
      });
  };

  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: any) => (
        <strong style={{ color: '#a51e28' }}>{text}</strong>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="text-[#333333] leading-relaxed mb-4">{children}</p>
      ),
    },
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100">
        <p>{i18n.language === 'sq' ? 'Duke u ngarkuar...' : 'Laden...'}</p>
      </div>
    );
  }

  return (
    <section className="py-16" id="sponsors-contact">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#333333] mb-6 pb-1 text-center relative inline-block">
              {textContent.joinTitle || 'No joinTitle loaded'}
              <svg
                viewBox="0 0 300 30"
                preserveAspectRatio="none"
                className="absolute left-1/2 transform -translate-x-1/2 bottom-[-18px] w-[120%] h-[16px]"
              >
                <path
                  d="M5,2 Q150,28 295,2"
                  fill="none"
                  stroke="#a61e29"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mt-6">
              {textContent.joinDescriptio || 'No joinDescription loaded'}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
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
        </Reveal>
      </div>
    </section>
  );
};

export default ContactSponsors;

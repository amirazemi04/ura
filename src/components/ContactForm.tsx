import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import emailjs from 'emailjs-com';
import client from '../contentfulClient';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, Document } from '@contentful/rich-text-types';
import { Link } from 'react-router-dom';
import Reveal from './Reveal';

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

const ContactForm = () => {
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
    role: '',
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

    const serviceID = 'service_biptael';
    const templateID = 'template_m8agxfc';
    const userID = 'QMPqO0tWKwYWz0t5H';

    emailjs
      .send(serviceID, templateID, emailData, userID)
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
    <section className="py-16" id="joinus">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#333333] mb-6 pb-1 text-center relative inline-block">
              {textContent.joinTitle}
              <svg
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                className="absolute left-0 bottom-[-18px] w-full h-[18px]"
              >
                <path
                  d="M2,34 Q100,-16 198,34"
                  fill="none"
                  stroke="#a51e28"
                  strokeWidth="14"
                  strokeLinecap="round"
                />
              </svg>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-2xl mx-auto mt-6">
              {textContent.joinDescription}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({ values }) => (
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

                {/* Inline radio buttons for role */}
                <div className="mt-4">
                  <span className="block text-sm text-gray-700 mb-2">
                    {i18n.language === 'sq'
                      ? 'Zgjidh një rol'
                      : 'Wähle eine Rolle'}
                  </span>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                      <Field type="radio" name="role" value="antar" required />
                      <span>
                        {i18n.language === 'sq' ? 'Antare/rë ' : 'Mitglied'}
                      </span>
                    </label>
                    <label className="flex items-center gap-2">
                      <Field
                        type="radio"
                        name="role"
                        value="valltar"
                        required
                      />
                      <span>
                        {i18n.language === 'sq' ? 'Valltare/rë' : 'Tänzer'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Terms and conditions checkbox */}
                <div className="flex items-start gap-2 mt-4">
                  <Field
                    type="checkbox"
                    name="agreed"
                    id="agreed"
                    className="mt-[0.25rem]"
                  />
                  <label
                    htmlFor="agreed"
                    className="text-sm text-gray-700 pt-[2px]"
                  >
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
                {textContent.sideTextRich &&
                  documentToReactComponents(textContent.sideTextRich, options)}
                </div>
              </Form>
            )}
          </Formik>
        </Reveal>
      </div>
    </section>
  );
};

export default ContactForm;

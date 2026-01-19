import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'de',
    supportedLngs: ['de', 'sq'],
    nonExplicitSupportedLngs: true,
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    debug: true,
    resources: {
      de: {
        translation: {
          welcome: 'Willkommen',
          newsTitle: 'Nachrichten',
          header: {
            home: 'Startseite',
            about: 'Über uns',
            groups: 'Gruppen',
            gallery: 'Galerie',
            sponsors: 'Sponsoren',
            join: 'Mitmachen!',
            joinMember: 'Mitglied | Tänzer',
            joinVolunteer: 'Sponsor',
          },
          aboutUs: {
            header: {
              title: 'Unsere Geschichte',
              slogan: 'Kultur, die Generationen verbindet',
            },
            intro:
              'Das Ensemble URA wurde gegründet, um das albanische kulturelle Erbe durch Tanz, Musik und traditionelle Kleidung zu bewahren und zu fördern. Der Name „URA“ symbolisiert die Verbindung zwischen Generationen, indem er die Vergangenheit mit der Gegenwart in einer künstlerischen und lehrreichen Form vereint. Mit einem engagierten Team und jugendlicher Energie bringt URA den lebendigen Geist der albanischen Kultur auf die Bühne, sowohl im Inland als auch international, und inspiriert Liebe und Stolz für unsere nationale Identität.',
            imageAlt: 'Ensemble URA',
            collapsible: {
              mission: {
                title: 'Mission',
                content:
                  'Das Ensemble URA wurde gegründet, um das albanische kulturelle Erbe durch Tanz, Musik und traditionelle Kleidung zu bewahren und zu fördern. Der Name „URA“ symbolisiert die Verbindung zwischen Generationen, indem er die Vergangenheit mit der Gegenwart in einer künstlerischen und lehrreichen Form vereint. Mit einem engagierten Team und jugendlicher Energie bringt URA den lebendigen Geist der albanischen Kultur auf die Bühne, sowohl im Inland als auch international, und inspiriert Liebe und Stolz für unsere nationale Identität.',
              },
              values: {
                title: 'Werte',
                heritage: 'Erbe',
                heritageContent:
                  'Wir betrachten Kultur als den wertvollsten Schatz einer Nation. Jeder Schritt, Klang und jedes Kleidungsstück ist eine Erinnerung, die sorgfältig bewahrt werden sollte.',
                dedication: 'Hingabe',
                dedicationContent:
                  'Unsere Arbeit basiert auf der Liebe zur Kunst und dem Respekt vor der albanischen Tradition. Jede Aufführung ist das Ergebnis von Engagement und Professionalität.',
                unity: 'Einheit',
                unityContent:
                  'Das Ensemble URA ist eine Brücke, die Generationen, Gemeinschaften und Albaner überall auf der Welt durch eine gemeinsame kulturelle Identität verbindet.',
              },
              authenticity: {
                title: 'Authentizität',
                authenticityContent:
                  'Wir bleiben den Ursprüngen und authentischen Elementen unseres Erbes treu und präsentieren sie in einer künstlerisch angemessenen und präzisen Form.',
              },
              team: {
                title: 'Team',
                content:
                  'Das Ensemble URA wird von einem Team engagierter Künstler und Jugendlicher geleitet, die eine Leidenschaft für das albanische Erbe teilen. Vereint durch das Ziel, unsere Kultur zu bewahren und zu fördern, bringen sie Professionalität, Energie und Zusammenarbeit in jede Aufführung ein.',
              },
            },
          },
          sponsorsSection: {
            title: 'Unsere Sponsoren',
            description:
              'Dank der Unterstützung unserer Sponsoren können wir die albanische Kultur auf nationalen und internationalen Bühnen würdig repräsentieren. Die Zusammenarbeit mit engagierten Sponsoren ermöglicht es uns, die Qualität unserer Auftritte zu sichern, in traditionelle Kostüme, Instrumente und die künstlerische Ausbildung junger Menschen zu investieren.',
            callToAction:
              'Wenn Sie Sponsor des Ensembles URA werden und zur Erhaltung unserer kulturellen Identität beitragen möchten, laden wir Sie ein, uns zu kontaktieren.',
            sponsorAlt: 'Sponsor {{number}}',
          },
          groupsSection: {
            title: 'Gruppen',
            groups: {
              age18_30: 'Alter 5-17',
              age30_45: 'Alter 18+',
              age45_plus: 'Alter ',
            },
            schedule: {
              title: 'Zeitplan',
            },
            locations: {
              title: 'Standorte',
            },
          },
          finalSection: {
            faq: {
              title: 'Häufig gestellte Fragen',
            },
          },
          footer: {
            logoAlt: 'Ensemble URA Logo',
            office: {
              title: 'Büro',
              location: 'Dübendorf, Zürich',
              contactPrompt: 'Haben Sie etwas im Sinn?',
            },
            sponsors: {
              title: 'Unsere Sponsoren',
              amag: 'Amag',
              goldenEagle: 'Golden Eagle',
              swissGovernment: 'Schweizer Regierung',
            },
            social: {
              title: 'Folgen Sie uns',
              facebook: 'Facebook',
              instagram: 'Instagram',
              tiktok: 'TikTok',
            },
            copyright: '© {{year}} HoB Studio. Alle Rechte vorbehalten.',
            privacyPolicy: 'Datenschutzrichtlinie',
            termsConditions: 'Allgemeine Geschäftsbedingungen',
          },
          cookieBanner: {
            message: 'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern.',
            learnMore: 'Mehr erfahren',
            accept: 'Akzeptieren',
          },
          form: {
            firstName: 'Vorname',
            lastName: 'Nachname',
            address: 'Adresse',
            zipCity: 'PLZ/Ort',
            birthdate: 'Geburtsdatum',
            email: 'E-Mail-Adresse',
            phone: 'Telefonnummer',
            businessNumber: 'Unternehmensnummer', // Added German translation
            send: 'Absenden',
            success: 'Ihre Nachricht wurde erfolgreich gesendet!',
            error: 'Es gab ein Problem beim Senden Ihrer Nachricht. Bitte versuchen Sie es erneut.',
            agreement_start: 'Durch das Ausfüllen dieses Formulars stimmen Sie den',
            terms_conditions: 'Allgemeinen Geschäftsbedingungen',
            privacy_policy: 'Datenschutzrichtlinie',
            agreementError: 'Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen und die Datenschutzrichtlinie, bevor Sie fortfahren.',
          },
          gallery: {
            loading: 'Galerie wird geladen…',
            noImages: 'Keine Bilder für "{category}"',
            uncategorized: 'Ohne Kategorie',
            imageAlt: 'Bild {number}',
          },
        },
      },
      sq: {
        translation: {
          welcome: 'Mirë se vini',
          newsTitle: 'Lajmet',
          header: {
            home: 'Ballina',
            about: 'Rreth nesh',
            groups: 'Grupet',
            gallery: 'Galeria',
            sponsors: 'Sponsorat',
            join: 'Bëhu pjesë!',
            joinMember: 'Antare/rë | Valltare/rë',
            joinVolunteer: 'Sponsor',
          },
          aboutUs: {
            header: {
              title: 'Historia jonë',
              slogan: 'Kultura që lidh brezat',
            },
            intro:
              'Ansambli URA është krijuar me qëllimin për të ruajtur dhe promovuar trashëgiminë kulturore shqiptare përmes vallëzimit, muzikës dhe kostumeve tradicionale. Emri “URA” simbolizon lidhjen mes brezave, duke bashkuar të kaluarën me të tashmen në një formë artistike dhe edukative. Me një ekip të përkushtuar dhe energji rinore, URA sjell në skenë shpirtin e gjallë të kulturës shqiptare, brenda dhe jashtë vendit, duke frymëzuar dashuri dhe krenari për identitetin tonë kombëtar.',
            imageAlt: 'Ansambli URA',
            collapsible: {
              mission: {
                title: 'Misioni',
                content:
                  'Ansambli URA është krijuar me qëllimin për të ruajtur dhe promovuar trashëgiminë kulturore shqiptare përmes vallëzimit, muzikës dhe kostumeve tradicionale. Emri “URA” simbolizon lidhjen mes brezave, duke bashkuar të kaluarën me të tashmen në një formë artistike dhe edukative. Me një ekip të përkushtuar dhe energji rinore, URA sjell në skenë shpirtin e gjallë të kulturës shqiptare, brenda dhe jashtë vendit, duke frymëzuar dashuri dhe krenari për identitetin tonë kombëtar.',
              },
              values: {
                title: 'Vlerat',
                heritage: 'Trashëgimia',
                heritageContent:
                  'Ne e shohim kulturën si pasurinë më të çmuar të një kombi. Çdo hap, tingull dhe veshje është një kujtim që meriton të ruhet me kujdes.',
                dedication: 'Përkushtimi',
                dedicationContent:
                  'Puna jonë bazohet në dashurinë për artin dhe respektin ndaj traditës shqiptare. Çdo performancë është rezultat i angazhimit dhe profesionalizmit.',
                unity: 'Bashkimi',
                unityContent:
                  'Ansambli URA është një urë që lidh brezat, komunitetet dhe shqiptarët kudo që ndodhen, përmes një identiteti të përbashkët kulturor.',
              },
              authenticity: {
                title: 'Autenticiteti',
                authenticityContent:
                  'Ne qëndrojmë besnikë ndaj origjinës dhe elementeve autentike të trashëgimisë sonë, duke i sjellë në një formë të denjë dhe të saktë artistikisht.',
              },
              team: {
                title: 'Ekipi',
                content:
                  'Ansambli URA udhëhiqet nga një ekip artistësh dhe të rinjsh të përkushtuar, që ndajnë pasionin për trashëgiminë shqiptare. Të bashkuar nga qëllimi për ta ruajtur dhe promovuar kulturën tonë, ata sjellin profesionalizëm, energji dhe frymë bashkëpunimi në çdo paraqitje.',
              },
            },
          },
          sponsorsSection: {
            title: 'Sponsorat tanë',
            description:
              'Falë mbështetjes së sponsorëve tanë, jemi në gjendje të përfaqësojmë denjësisht kulturën shqiptare në skena kombëtare dhe ndërkombëtare. Bashkëpunimi me sponsorë të përkushtuar na mundëson që të ruajmë cilësinë e paraqitjes, të investojmë në kostume tradicionale, instrumente dhe edukim artistik për të rinjtë.',
            callToAction:
              'Nëse dëshironi të bëheni sponsor i Ansamblit URA dhe të kontribuoni në ruajtjen e identitetit tonë kulturor, ju ftojmë të na kontaktoni.',
            sponsorAlt: 'Sponsori {{number}}',
          },
          groupsSection: {
            title: 'Grupet',
            groups: {
              age18_30: 'Mosha 5-17',
              age30_45: 'Mosha 18+',
              age45_plus: '',
            },
            schedule: {
              title: 'Orari',
            },
            locations: {
              title: 'Lokacionet',
            },
          },
          finalSection: {
            faq: {
              title: 'Pyetje të Shpeshta',
            },
          },
          footer: {
            logoAlt: 'Logoja e Ansamblit URA',
            office: {
              title: 'Zyra',
              location: 'Dübendorf, Zürich',
              contactPrompt: 'Keni diçka në mendje?',
            },
            sponsors: {
              title: 'Sponsorat tanë',
              amag: 'Amag',
              goldenEagle: 'Golden Eagle',
              swissGovernment: 'Qeveria Zvicerane',
            },
            social: {
              title: 'Na ndiqni',
              facebook: 'Facebook',
              instagram: 'Instagram',
              tiktok: 'TikTok',
            },
            copyright: '© {{year}} HoB Studio. Të gjitha të drejtat e rezervuara.',
            privacyPolicy: 'Politika e Privatësisë',
            termsConditions: 'Kushtet dhe Rregullat',
          },
          cookieBanner: {
            message: 'Ne përdorim cookie për të përmirësuar përvojën tuaj.',
            learnMore: 'Mëso më shumë',
            accept: 'Prano',
          },
          form: {
            firstName: 'Emri',
            lastName: 'Mbiemri',
            address: 'Adresa',
            zipCity: 'Kodi Postar/Qyteti',
            birthdate: 'Data e Lindjes',
            email: 'Adresa e E-Mailit',
            phone: 'Numri i Telefonit',
            businessNumber: 'Numri i biznesit', // Existing Albanian translation
            send: 'Dërgo',
            success: 'Mesazhi juaj u dërgua me sukses!',
            error: 'Pati një problem gjatë dërgimit të mesazhit tuaj. Ju lutemi provoni përsëri.',
            agreement_start: 'Duke e plotësuar këtë formular, ju pranoni',
            terms_conditions: 'Termat dhe Kushtet',
            privacy_policy: 'Politikën e Privatësisë',
            agreementError: 'Ju lutemi pranoni Termat dhe Kushtet dhe Politikën e Privatësisë para se të vazhdoni.',
          },
          gallery: {
            loading: 'Galeria po ngarkohet…',
            noImages: 'Nuk ka imazhe për "{category}"',
            uncategorized: 'Pa kategori',
            imageAlt: 'Imazh {number}',
          },
        },
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
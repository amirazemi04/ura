import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';

const sitemap = new SitemapStream({ hostname: 'https://ansambli-ura.ch' });

const pages = [
  '/',
  '/groups',
  '/join-us',
  '/sponsor-contact',
  '/gallery',
  '/about-us',
  '/sponsors',
  '/privacy-policy',
  '/terms-of-service'
];

pages.forEach(page => {
  sitemap.write({ url: page, changefreq: 'weekly', priority: 0.8 });
});

sitemap.end();

streamToPromise(sitemap).then(sm =>
  createWriteStream('./public/sitemap.xml').write(sm.toString())
);

const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');

// Domaini yt
const sitemap = new SitemapStream({ hostname: 'https://ansambli-ura.ch' });

// Rrugët e faqes (nga App.js që më dërgove)
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

// Shto secilën faqe në sitemap
pages.forEach(page => {
  sitemap.write({ url: page, changefreq: 'weekly', priority: 0.8 });
});

// Mbyll stream-in
sitemap.end();

// Shkruaj sitemap.xml te public/
streamToPromise(sitemap).then(sm =>
  createWriteStream('./public/sitemap.xml').write(sm.toString())
);

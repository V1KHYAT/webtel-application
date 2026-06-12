const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('v3-raw.html', 'utf8');
const $ = cheerio.load(html);
const links = [];
$('a').each((i, el) => {
  const href = $(el).attr('href');
  const text = $(el).text().trim();
  if (href && href !== '#' && href !== '') {
    links.push({ text, href });
  }
});
console.log('Valid links found:', links.length);
console.log('Sample links:', links.slice(0, 5));

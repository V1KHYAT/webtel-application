import fs from 'fs';
import * as cheerio from 'cheerio';

const navigation = [];
const seenModules = new Set();

function toTitleCase(str) {
    if (str.toUpperCase() === 'HR') return 'HR';
    return str.toLowerCase().split(' ').map(word => {
        if (word === '&') return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
}

function parseHtml(htmlContent) {
    const $ = cheerio.load(htmlContent);

    $('#menuh > ul > li.nav-item').each((_, moduleEl) => {
        let rawModuleName = $(moduleEl).children('a').first().text().replace(/\s+/g, ' ').trim();
        const moduleName = toTitleCase(rawModuleName);
        
        // Skip if we already parsed this module (e.g. APPROVALS might overlap)
        if (seenModules.has(moduleName)) return;
        seenModules.add(moduleName);
        
        const categories = [];
        
        $(moduleEl).children('ul').children('li').each((_, categoryEl) => {
            let categoryName = $(categoryEl).children('a').first().text().replace(/\s+/g, ' ').trim();
            
            const pages = [];
            const subUl = $(categoryEl).children('ul');
            
            if (subUl.length > 0) {
                $(categoryEl).find('li').each((_, pageEl) => {
                    if ($(pageEl).children('ul').length === 0) {
                        const pageName = $(pageEl).children('a').first().text().replace(/\s+/g, ' ').trim();
                        if (pageName) {
                            pages.push({
                                id: pageName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                                name: pageName,
                                legacyContentSources: [pageName]
                            });
                        }
                    }
                });
            } else {
                if (categoryName) {
                    pages.push({
                        id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                        name: categoryName,
                        legacyContentSources: [categoryName]
                    });
                }
            }
            
            if (pages.length > 0) {
                categories.push({
                    name: categoryName || 'General',
                    pages: pages
                });
            }
        });
        
        if (categories.length > 0) {
            navigation.push({
                module: moduleName,
                categories: categories
            });
        }
    });
}

const html1 = fs.readFileSync('v3-raw.html', 'utf8');
parseHtml(html1);

if (fs.existsSync('v3-raw-2.html')) {
    const html2 = fs.readFileSync('v3-raw-2.html', 'utf8');
    parseHtml(html2);
}

fs.writeFileSync('src/data/v3-ia.json', JSON.stringify({ navigation }, null, 2));
console.log('Parsed to src/data/v3-ia.json');


import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('v3-raw.html', 'utf8');
const $ = cheerio.load(html);

const navigation = [];

$('#menuh > ul > li.nav-item').each((_, moduleEl) => {
    // Top-level module name, e.g., ADMINISTRATION
    const moduleName = $(moduleEl).children('a').first().text().replace(/\s+/g, ' ').trim();
    
    const categories = [];
    
    // First level under module
    $(moduleEl).children('ul').children('li').each((_, categoryEl) => {
        let categoryName = $(categoryEl).children('a').first().text().replace(/\s+/g, ' ').trim();
        
        const pages = [];
        const subUl = $(categoryEl).children('ul');
        
        if (subUl.length > 0) {
            // There are sub-items, so this is a category with pages
            // We want to find ALL terminal <li> under this category (no nested <ul>)
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
            // It's a direct page under the module, so we wrap it in a category of the same name
            if (categoryName) {
                pages.push({
                    id: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                    name: categoryName,
                    legacyContentSources: [categoryName]
                });
            }
        }
        
        // Remove nested img text if any or clean up
        // Some categories have the same name as the page if it was a direct link
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

fs.writeFileSync('src/data/v3-ia.json', JSON.stringify({ navigation }, null, 2));
console.log('Parsed to src/data/v3-ia.json');

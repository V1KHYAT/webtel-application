const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function generateId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const html = fs.readFileSync(path.join(__dirname, '../public/legacy-screens/00_HomePage.html'), 'utf-8');
const $ = cheerio.load(html);

const v1IA = { navigation: [] };

$('#menuh > ul > li').each((_, modLi) => {
    const $modLi = $(modLi);
    // The first <a> is the module name
    const modName = $modLi.children('a').first().text().trim();
    if (!modName) return;

    const modObj = {
        module: modName,
        categories: []
    };

    // The categories are the <li> inside the first <ul>
    const $catUls = $modLi.children('ul');
    if ($catUls.length > 0) {
        $catUls.children('li').each((_, catLi) => {
            const $catLi = $(catLi);
            const catAnchor = $catLi.children('a').first();
            const catName = catAnchor.text().trim() || 'General Actions';
            
            const catObj = {
                name: catName,
                pages: []
            };

            // Check if this category has sub-items (pages)
            const $pageUls = $catLi.children('ul');
            if ($pageUls.length > 0) {
                // It has an inner <ul>, so the items inside are pages
                // Or maybe even another level? Let's find ALL .aspx links inside this category
                $catLi.find('a').each((_, pageA) => {
                    const $pageA = $(pageA);
                    const href = $pageA.attr('href') || '';
                    if (href.toLowerCase().includes('.aspx') && !$pageA.is(catAnchor)) {
                        const pageName = $pageA.text().trim();
                        if (pageName && !pageName.toLowerCase().includes('logout') && !pageName.toLowerCase().includes('login')) {
                            catObj.pages.push({
                                id: generateId(pageName),
                                name: pageName
                            });
                        }
                    }
                });
            } else {
                // This "category" is actually just a single page!
                const href = catAnchor.attr('href') || '';
                if (href.toLowerCase().includes('.aspx')) {
                    if (catName && !catName.toLowerCase().includes('logout') && !catName.toLowerCase().includes('login')) {
                        catObj.pages.push({
                            id: generateId(catName),
                            name: catName
                        });
                    }
                }
            }

            // De-duplicate pages
            const uniquePages = [];
            const seen = new Set();
            for (const p of catObj.pages) {
                if (!seen.has(p.name)) {
                    seen.add(p.name);
                    uniquePages.push(p);
                }
            }
            catObj.pages = uniquePages;

            if (catObj.pages.length > 0) {
                // If the "category" is just a single page, put it in a General category
                if ($pageUls.length === 0) {
                    let generalCat = modObj.categories.find(c => c.name === 'General Actions');
                    if (!generalCat) {
                        generalCat = { name: 'General Actions', pages: [] };
                        modObj.categories.push(generalCat);
                    }
                    generalCat.pages.push(...catObj.pages);
                } else {
                    modObj.categories.push(catObj);
                }
            }
        });
    }

    if (modObj.categories.length > 0) {
        v1IA.navigation.push(modObj);
    }
});

let totalPages = 0;
v1IA.navigation.forEach(m => m.categories.forEach(c => totalPages += c.pages.length));

console.log(`Generated V1 IA with ${totalPages} total pages.`);

fs.writeFileSync(path.join(__dirname, '../src/data/v1-ia.json'), JSON.stringify(v1IA, null, 2));

const fs = require('fs');
const path = require('path');

const dropdownData = require('../dropdown.json');

function generateId(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const v1IA = {
  navigation: []
};

dropdownData.navigation.forEach(mod => {
  if (!mod.categories) return;

  const newModule = {
    module: mod.module,
    categories: []
  };

  mod.categories.forEach(cat => {
    // If it's a string, it's just a page with no sub-items. We'll put it in a "General" category.
    if (typeof cat === 'string') {
      let generalCat = newModule.categories.find(c => c.name === 'General Actions');
      if (!generalCat) {
        generalCat = { name: 'General Actions', pages: [] };
        newModule.categories.push(generalCat);
      }
      generalCat.pages.push({
        id: generateId(cat),
        name: cat
      });
      return;
    }

    const newCategory = {
      name: cat.name,
      pages: []
    };

    if (cat.items) {
      cat.items.forEach(item => {
        if (typeof item === 'string') {
          newCategory.pages.push({
            id: generateId(item),
            name: item
          });
        } else if (typeof item === 'object' && item.name && item.items) {
          // This is the 3rd level! We flatten it into the 2nd level.
          // We'll just add the 3rd level items directly as pages in this category.
          item.items.forEach(subItem => {
            if (typeof subItem === 'string') {
              newCategory.pages.push({
                id: generateId(subItem),
                name: subItem
              });
            }
          });
        }
      });
    }

    if (newCategory.pages.length > 0) {
      newModule.categories.push(newCategory);
    }
  });

  if (newModule.categories.length > 0) {
    v1IA.navigation.push(newModule);
  }
});

const outputPath = path.join(__dirname, '../src/data/v1-ia.json');
fs.writeFileSync(outputPath, JSON.stringify(v1IA, null, 2));

console.log(`Successfully generated V1 IA at ${outputPath}`);

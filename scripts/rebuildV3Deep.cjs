const fs = require('fs');
const path = require('path');

const deepDataRaw = fs.readFileSync(path.join(__dirname, '../dropdown.json'), 'utf8');
const deepData = JSON.parse(deepDataRaw.charCodeAt(0) === 0xFEFF ? deepDataRaw.slice(1) : deepDataRaw);

const flatV3Raw = fs.readFileSync(path.join(__dirname, '../v3_old.json'), 'utf8');
const flatV3 = JSON.parse(flatV3Raw.charCodeAt(0) === 0xFEFF ? flatV3Raw.slice(1) : flatV3Raw);

// Build a map of lowercase name -> original deep items array
const categoryMap = {};

function traverseDeep(items) {
  if (!items) return;
  items.forEach(item => {
    if (typeof item === 'object' && item.name && item.items) {
      categoryMap[item.name.toLowerCase().trim()] = item.items;
      traverseDeep(item.items);
    }
  });
}

deepData.navigation.forEach(mod => {
  categoryMap[mod.module.toLowerCase().trim()] = mod.categories;
  traverseDeep(mod.categories);
});

function parseDeepItems(items) {
  return items.map(item => {
    if (typeof item === 'string') {
      const id = item.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return {
        id,
        name: item,
        type: 'page',
        legacyContentSources: [item]
      };
    } else if (item.name && item.items) {
      return {
        name: item.name,
        type: 'category',
        items: parseDeepItems(item.items)
      };
    }
  });
}

function rebuildV3(categories) {
  if (!categories) return [];
  
  return categories.map(cat => {
    const catName = cat.name.toLowerCase().trim();
    
    // If we have deep items for this category (or it matches a Module name like ASSET)
    if (categoryMap[catName]) {
      return {
        name: cat.name,
        type: 'category',
        items: parseDeepItems(categoryMap[catName])
      };
    }
    
    // Otherwise just use its flattened pages
    return {
      name: cat.name,
      type: 'category',
      items: (cat.pages || []).map(p => ({
        ...p,
        type: 'page'
      }))
    };
  });
}

const v3Deep = flatV3.navigation.map(mod => ({
  module: mod.module,
  items: rebuildV3(mod.categories)
}));

fs.writeFileSync(path.join(__dirname, '../src/data/v1-ia.json'), JSON.stringify({ navigation: v3Deep }, null, 2));
console.log('Successfully merged V3 (10 modules) with original deep nesting into src/data/v1-ia.json');

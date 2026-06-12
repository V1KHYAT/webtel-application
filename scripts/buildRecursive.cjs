const fs = require('fs');

// 1. Build V1 from dropdown.json
const rawV1 = JSON.parse(fs.readFileSync('dropdown.json', 'utf8'));

function parseV1Items(itemsArray) {
  if (!itemsArray) return [];
  return itemsArray.map(item => {
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
        items: parseV1Items(item.items)
      };
    }
  });
}

const v1Navigation = rawV1.navigation.map(mod => ({
  module: mod.module,
  items: parseV1Items(mod.categories || [])
}));

fs.writeFileSync('src/data/v1-ia.json', JSON.stringify({ navigation: v1Navigation }, null, 2));
console.log('Successfully generated recursive src/data/v1-ia.json');

// 2. Build V2 from the existing v2-ia.json to preserve merged logic
const rawV2 = JSON.parse(fs.readFileSync('src/data/v2-ia.json', 'utf8'));

const v2Navigation = rawV2.navigation.map(mod => ({
  module: mod.module,
  items: (mod.categories || []).map(cat => ({
    name: cat.name,
    type: 'category',
    items: (cat.pages || []).map(page => ({
      ...page,
      type: 'page'
    }))
  }))
}));

fs.writeFileSync('src/data/v2-ia.json', JSON.stringify({ navigation: v2Navigation }, null, 2));
console.log('Successfully generated recursive src/data/v2-ia.json');

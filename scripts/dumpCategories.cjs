const fs = require('fs');
const path = require('path');

const iaPath = path.join(__dirname, '../src/data/v4-ia.json');
const data = JSON.parse(fs.readFileSync(iaPath, 'utf-8'));

let output = '';

data.navigation.forEach(mod => {
  output += `\nModule: ${mod.module}\n`;
  mod.categories.forEach(cat => {
    output += `  - ${cat.name}\n`;
  });
});

fs.writeFileSync(path.join(__dirname, 'category_dump.txt'), output);
console.log('Categories dumped to category_dump.txt');

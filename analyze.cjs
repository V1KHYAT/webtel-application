const fs = require('fs');
const v1 = JSON.parse(fs.readFileSync('dropdown.json', 'utf8'));
const v3 = JSON.parse(fs.readFileSync('./src/data/v3-ia.json', 'utf8'));

let v1Pages = [];
v1.navigation.forEach(m => {
  if (m.categories) {
    m.categories.forEach(c => {
      if (c.items) {
        c.items.forEach(p => {
          v1Pages.push({ name: p, module: m.module, category: c.name });
        });
      }
    });
  }
});

let v3Pages = [];
let v3Duplicates = {};
let v3PageNames = new Set();

v3.navigation.forEach(m => {
  if (m.categories) {
    m.categories.forEach(c => {
      if (c.pages) {
        c.pages.forEach(p => {
          const entry = { name: p.name, module: m.module, category: c.name };
          v3Pages.push(entry);
          
          if (v3PageNames.has(p.name)) {
            if (!v3Duplicates[p.name]) v3Duplicates[p.name] = [];
            v3Duplicates[p.name].push(entry);
          } else {
            v3PageNames.add(p.name);
          }
        });
      }
    });
  }
});

console.log('--- Total Pages ---');
console.log('V1:', v1Pages.length);
console.log('V3:', v3Pages.length);

console.log('\n--- V3 Duplicates ---');
for (let name in v3Duplicates) {
  console.log(`"${name}" appears ${v3Duplicates[name].length + 1} times.`);
}

console.log('\n--- Missing in V3 ---');
let missingCount = 0;
let missingNames = [];
v1Pages.forEach(p => {
  if (!v3PageNames.has(p.name)) {
    missingCount++;
    missingNames.push(p.name);
  }
});
console.log(`V1 pages missing from V3: ${missingCount}`);
console.log('Sample missing:', missingNames.slice(0, 5));

console.log('\n--- New in V3 ---');
let newCount = 0;
let v1PageNames = new Set(v1Pages.map(p => p.name));
v3Pages.forEach(p => {
  if (!v1PageNames.has(p.name)) {
    newCount++;
  }
});
console.log(`V3 pages not in V1: ${newCount}`);

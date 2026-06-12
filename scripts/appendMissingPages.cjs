const fs = require('fs');

const missingPages = JSON.parse(fs.readFileSync('missing-v4.json'));
const v4Data = JSON.parse(fs.readFileSync('src/data/v4-ia.json'));

// 1. Collect all merged page names
const mergedNames = new Set();
v4Data.navigation.forEach(mod => {
  mod.categories?.forEach(cat => {
    cat.pages?.forEach(page => {
      if (page.mergedFrom) {
        page.mergedFrom.forEach(name => mergedNames.add(name));
      }
    });
  });
});

// 2. Map old modules to new modules
const moduleMap = {
  'Attendance & Leave': 'Attendance & Leave',
  'Salary Processing': 'Payroll',
  'e-Recruitment': 'Recruitment & Onboarding',
  'Onboarding': 'Recruitment & Onboarding',
  'PMS': 'Performance & Learning',
  'Training': 'Performance & Learning',
  'Travel': 'Travel & Expenses',
  'Asset': 'Assets',
  'Administration': 'Administration',
  'Compliance': 'Compliance',
  'HR': 'People',
  'Employee': 'People',
  'Reports': 'Reports',
  'Others': 'Administration'
};

// 3. Find unmerged pages and group them
missingPages.forEach(p => {
  let name = p.name;
  if (typeof name === 'object') {
    name = name.name; // Use the parent name if it's nested
  }
  
  if (!mergedNames.has(name)) {
    const newModule = moduleMap[p.module] || 'Administration';
    
    // Find or create module in v4Data
    let modObj = v4Data.navigation.find(m => m.module === newModule);
    if (!modObj) {
      modObj = { module: newModule, categories: [] };
      v4Data.navigation.push(modObj);
    }
    
    // Find or create category in modObj
    let catObj = modObj.categories.find(c => c.name === p.category);
    if (!catObj) {
      catObj = { name: p.category, pages: [] };
      modObj.categories.push(catObj);
    }
    
    // Add page if it doesn't exist
    const pageId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    if (!catObj.pages.find(page => page.id === pageId)) {
      catObj.pages.push({ id: pageId, name: name });
    }
  }
});

fs.writeFileSync('src/data/v4-ia.json', JSON.stringify(v4Data, null, 2));
console.log('Restored missing pages to v4-ia.json');

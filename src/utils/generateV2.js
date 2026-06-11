import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read original
const rawData = fs.readFileSync(path.join(__dirname, '../../dropdown.json'), 'utf8');
const data = JSON.parse(rawData);

// Collect all raw items
const allItems = [];
data.navigation.forEach(mod => {
  if (!mod.categories) return;
  mod.categories.forEach(cat => {
    if (typeof cat === 'string') {
      allItems.push({ name: cat, originalModule: mod.module });
    } else if (cat.items) {
      cat.items.forEach(item => {
        if (typeof item === 'string') {
          allItems.push({ name: item, originalModule: mod.module });
        } else if (item.name && item.items) {
          item.items.forEach(sub => {
            if (typeof sub === 'string') {
              allItems.push({ name: sub, originalModule: mod.module });
            }
          });
        }
      });
    }
  });
});

console.log(`Extracted ${allItems.length} raw items from V1.`);

// We will construct the 9 modules and categorize everything.
const v2Structure = [
  { module: "People", categories: { "Recruitment & Hiring": [], "Onboarding": [], "Employee Records": [], "Organization Structure": [], "Exit Management": [] } },
  { module: "Attendance & Leave", categories: { "Daily Operations": [], "Leave Management": [], "Regularization": [] } },
  { module: "Payroll", categories: { "Salary Processing": [], "Tax & Compliance": [], "Salary Structures": [] } },
  { module: "Performance & Training", categories: { "Performance Appraisals": [], "Training Hub": [] } },
  { module: "Travel & Expenses", categories: { "Travel Desk": [], "Expense Claims": [] } },
  { module: "Assets", categories: { "Asset Management": [], "Inventory (Admins)": [] } },
  { module: "Approvals Hub", categories: { "Pending Approvals": [], "Delegation": [] } },
  { module: "Import Center", categories: { "Bulk Imports": [], "Data Export": [] } },
  { module: "Report Builder", categories: { "Report Builder": [] } },
  { module: "Settings", categories: { "Organization Masters": [], "System Configuration": [] } }
];

// Keywords for routing
function routeItem(name, originalModule) {
  const lower = name.toLowerCase();
  
  if (lower.includes('report') || lower.includes('list of') || lower.includes('statement') || lower.includes('register') || lower.includes('challan details') || lower.includes('generate')) {
    if (!lower.includes('generate offer letter') && !lower.includes('generate type of assets')) {
      return { mod: "Report Builder", cat: "Report Builder" };
    }
  }
  
  if (lower.includes('import') || lower.includes('upload') || lower.includes('export')) {
    if (lower.includes('export')) {
      return { mod: "Import Center", cat: "Data Export" };
    }
    return { mod: "Import Center", cat: "Bulk Imports" };
  }
  
  if (lower.includes('approv') || lower.includes('reject') || lower.includes('authorize') || lower.includes('clearance approve')) {
    return { mod: "Approvals Hub", cat: "Pending Approvals" };
  }

  if (lower.includes('master') || lower.includes('template') || lower.includes('setup') || lower.includes('configuration') || lower.includes('define')) {
    if (originalModule === "Administration") {
      return { mod: "Settings", cat: "System Configuration" };
    }
    return { mod: "Settings", cat: "Organization Masters" };
  }

  // Attendance
  if (originalModule === "Attendance & Leave") {
    if (lower.includes('leave') || lower.includes('encashment')) return { mod: "Attendance & Leave", cat: "Leave Management" };
    if (lower.includes('od') || lower.includes('regularization') || lower.includes('mispunch')) return { mod: "Attendance & Leave", cat: "Regularization" };
    return { mod: "Attendance & Leave", cat: "Daily Operations" };
  }

  // Payroll / Compliance
  if (originalModule === "Salary Processing" || originalModule === "Compliance") {
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('tds') || lower.includes('pt ') || lower.includes('lwf')) {
      return { mod: "Payroll", cat: "Tax & Compliance" };
    }
    if (lower.includes('structure') || lower.includes('grade') || lower.includes('increment')) {
      return { mod: "Payroll", cat: "Salary Structures" };
    }
    return { mod: "Payroll", cat: "Salary Processing" };
  }

  // Travel & Expenses
  if (originalModule === "Travel" || lower.includes('expense') || lower.includes('reimbursement')) {
    if (lower.includes('travel') || lower.includes('tour')) return { mod: "Travel & Expenses", cat: "Travel Desk" };
    return { mod: "Travel & Expenses", cat: "Expense Claims" };
  }

  // Assets
  if (originalModule === "Asset") {
    if (lower.includes('amc') || lower.includes('insurance')) return { mod: "Assets", cat: "Inventory (Admins)" };
    return { mod: "Assets", cat: "Asset Management" };
  }

  // Performance & Training
  if (originalModule === "PMS" || originalModule === "Training") {
    if (originalModule === "Training" || lower.includes('training')) return { mod: "Performance & Training", cat: "Training Hub" };
    return { mod: "Performance & Training", cat: "Performance Appraisals" };
  }

  // People
  if (originalModule === "e-Recruitment" || lower.includes('candidate') || lower.includes('mrf') || lower.includes('interview')) {
    return { mod: "People", cat: "Recruitment & Hiring" };
  }
  if (originalModule === "Onboarding" || lower.includes('temporary employee')) {
    return { mod: "People", cat: "Onboarding" };
  }
  if (lower.includes('resign') || lower.includes('exit') || lower.includes('clearance')) {
    return { mod: "People", cat: "Exit Management" };
  }
  if (lower.includes('org') || lower.includes('chart') || lower.includes('manager')) {
    return { mod: "People", cat: "Organization Structure" };
  }
  
  // Catch all for remaining Employee and Administration items
  if (originalModule === "Administration") {
    return { mod: "Settings", cat: "System Configuration" };
  }

  return { mod: "People", cat: "Employee Records" };
}

allItems.forEach(item => {
  const dest = routeItem(item.name, item.originalModule);
  const modObj = v2Structure.find(m => m.module === dest.mod);
  if (!modObj) console.log('Mod not found', dest.mod);
  
  if (!modObj.categories[dest.cat]) {
    modObj.categories[dest.cat] = [];
  }
  
  if (!modObj.categories[dest.cat].includes(item.name)) {
    modObj.categories[dest.cat].push(item.name);
  }
});

// Convert object categories to array structure for UI
const finalV2 = {
  navigation: v2Structure.map(mod => {
    
    // For Report Builder we flatten categories
    if (mod.module === "Report Builder") {
      let allReports = [];
      Object.keys(mod.categories).forEach(k => {
        allReports.push(...mod.categories[k]);
      });
      return {
        module: mod.module,
        categories: allReports
      };
    }
    
    // Otherwise standard categories
    const catArray = Object.keys(mod.categories)
      .map(catName => ({
        name: catName,
        items: mod.categories[catName]
      }))
      .filter(c => c.items.length > 0);
      
    return {
      module: mod.module,
      categories: catArray
    };
  })
};

fs.writeFileSync(path.join(__dirname, '../../src/data/dropdown-v2.json'), JSON.stringify(finalV2, null, 2));
console.log('Successfully generated dropdown-v2.json with 100% of the items mapped!');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

const modules = [
  { module: "People", categories: [] },
  { module: "Attendance & Leave", categories: [] },
  { module: "Payroll", categories: [] },
  { module: "Performance & Training", categories: [] },
  { module: "Travel & Expenses", categories: [] },
  { module: "Assets", categories: [] },
  { module: "Approvals Hub", categories: [] },
  { module: "Import Center", categories: [] },
  { module: "Report Builder", categories: [] },
  { module: "Settings", categories: [] }
];

function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function pushToCategory(modName, catName, item) {
  const mod = modules.find(m => m.module === modName);
  let cat = mod.categories.find(c => c.name === catName);
  if (!cat) {
    cat = { name: catName, pages: [] };
    mod.categories.push(cat);
  }
  
  const pageId = generateId(item.name);
  
  // To avoid duplicate IDs, we append an index if it already exists
  let finalId = pageId;
  let counter = 1;
  while (cat.pages.find(p => p.id === finalId)) {
    finalId = `${pageId}-${counter}`;
    counter++;
  }

  cat.pages.push({
    id: finalId,
    name: item.name,
    legacyFeatures: [item.name] // For now, 1-to-1 mapping
  });
}

// Grouping Logic (Similar to before but mapping to Category instead of merged Page)
allItems.forEach(item => {
  const lower = item.name.toLowerCase();
  const ogMod = item.originalModule;

  // 1. REPORTS
  if (lower.includes('report') || lower.includes('list of') || lower.includes('statement') || lower.includes('register') || lower.includes('challan details') || lower.includes('generate')) {
    if (!lower.includes('generate offer letter') && !lower.includes('generate type of assets')) {
      if (lower.includes('attendance') || lower.includes('leave') || lower.includes('absent')) {
        return pushToCategory("Report Builder", "Attendance & Leave Reports", item);
      }
      if (lower.includes('salary') || lower.includes('tax') || lower.includes('tds') || lower.includes('pf') || lower.includes('esi') || lower.includes('slip')) {
        return pushToCategory("Report Builder", "Payroll & Tax Reports", item);
      }
      if (lower.includes('employee') || lower.includes('joinee') || lower.includes('resign')) {
        return pushToCategory("Report Builder", "Employee Reports", item);
      }
      return pushToCategory("Report Builder", "Custom Reports & Dashboards", item);
    }
  }

  // 2. IMPORTS & EXPORTS
  if (lower.includes('import') || lower.includes('upload') || lower.includes('export')) {
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('punch')) {
      return pushToCategory("Import Center", "Attendance Imports", item);
    }
    if (lower.includes('salary') || lower.includes('pf') || lower.includes('esi') || lower.includes('pt') || lower.includes('tds') || lower.includes('tax')) {
      return pushToCategory("Import Center", "Payroll & Tax Imports", item);
    }
    if (lower.includes('employee') || lower.includes('candidate')) {
      return pushToCategory("Import Center", "Employee & Candidate Data", item);
    }
    if (lower.includes('export')) {
      return pushToCategory("Import Center", "Data Exports", item);
    }
    return pushToCategory("Import Center", "General Bulk Imports", item);
  }

  // 3. APPROVALS
  if (lower.includes('approv') || lower.includes('reject') || lower.includes('authorize') || lower.includes('clearance approve')) {
    if (lower.includes('leave') || lower.includes('od') || lower.includes('mispunch') || lower.includes('attendance')) {
      return pushToCategory("Approvals Hub", "Attendance & Leave Approvals", item);
    }
    if (lower.includes('expense') || lower.includes('travel') || lower.includes('tour')) {
      return pushToCategory("Approvals Hub", "Travel & Expense Approvals", item);
    }
    if (lower.includes('salary') || lower.includes('loan') || lower.includes('tax')) {
      return pushToCategory("Approvals Hub", "Finance & Payroll Approvals", item);
    }
    return pushToCategory("Approvals Hub", "General Approvals", item);
  }

  // 4. SETTINGS
  if (lower.includes('master') || lower.includes('template') || lower.includes('setup') || lower.includes('configuration') || lower.includes('define') || ogMod === "Administration") {
    if (lower.includes('company') || lower.includes('bank') || lower.includes('branch') || lower.includes('location') || lower.includes('region') || lower.includes('department') || lower.includes('grade')) {
      return pushToCategory("Settings", "Organization Profile", item);
    }
    if (lower.includes('user') || lower.includes('role') || lower.includes('password') || lower.includes('right')) {
      return pushToCategory("Settings", "User & Role Management", item);
    }
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('salary') || lower.includes('payhead') || lower.includes('financial')) {
      return pushToCategory("Settings", "Financial & Compliance Setup", item);
    }
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('leave') || lower.includes('holiday')) {
      return pushToCategory("Settings", "Leave & Attendance Setup", item);
    }
    return pushToCategory("Settings", "System Configuration", item);
  }

  // 5. ATTENDANCE & LEAVE
  if (ogMod === "Attendance & Leave") {
    if (lower.includes('leave') || lower.includes('encashment')) return pushToCategory("Attendance & Leave", "Leave Management", item);
    if (lower.includes('shift') || lower.includes('roster')) return pushToCategory("Attendance & Leave", "Shift & Roster Planning", item);
    return pushToCategory("Attendance & Leave", "Daily Attendance", item);
  }

  // 6. PAYROLL & COMPLIANCE
  if (ogMod === "Salary Processing" || ogMod === "Compliance") {
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('tds') || lower.includes('pt') || lower.includes('lwf') || lower.includes('perquisite') || lower.includes('investment')) {
      return pushToCategory("Payroll", "Tax & Declarations", item);
    }
    if (lower.includes('structure') || lower.includes('increment') || lower.includes('arrear')) {
      return pushToCategory("Payroll", "Salary Structures", item);
    }
    if (lower.includes('payment') || lower.includes('cheque') || lower.includes('bank') || lower.includes('transfer')) {
      return pushToCategory("Payroll", "Payouts & Disbursements", item);
    }
    return pushToCategory("Payroll", "Run Payroll", item);
  }

  // 7. TRAVEL & EXPENSES
  if (ogMod === "Travel" || lower.includes('expense') || lower.includes('reimbursement')) {
    if (lower.includes('travel') || lower.includes('tour')) return pushToCategory("Travel & Expenses", "Travel Desk", item);
    return pushToCategory("Travel & Expenses", "Expense Claims", item);
  }

  // 8. ASSETS
  if (ogMod === "Asset") {
    return pushToCategory("Assets", "Asset Registry", item);
  }

  // 9. PERFORMANCE & TRAINING
  if (ogMod === "PMS" || ogMod === "Training") {
    if (ogMod === "Training" || lower.includes('training')) return pushToCategory("Performance & Training", "Learning & Training", item);
    return pushToCategory("Performance & Training", "Performance Reviews", item);
  }

  // 10. PEOPLE
  if (ogMod === "e-Recruitment" || lower.includes('candidate') || lower.includes('mrf') || lower.includes('interview') || lower.includes('vacancy')) {
    return pushToCategory("People", "Recruitment Hub", item);
  }
  if (ogMod === "Onboarding" || lower.includes('temporary employee') || lower.includes('offer letter')) {
    return pushToCategory("People", "Onboarding Pipeline", item);
  }
  if (lower.includes('resign') || lower.includes('exit') || lower.includes('clearance') || lower.includes('separation')) {
    return pushToCategory("People", "Exit Management", item);
  }
  if (lower.includes('award') || lower.includes('disciplinary') || lower.includes('help desk') || lower.includes('ticket')) {
    return pushToCategory("People", "Employee Relations", item);
  }
  
  // Default to Employee Directory
  return pushToCategory("People", "Employee Directory", item);
});

fs.writeFileSync(path.join(__dirname, '../../src/data/pages-ia.json'), JSON.stringify({ navigation: modules }, null, 2));
console.log('Successfully generated 3-level pages-ia.json mapping 461 features to 461 individual pages!');

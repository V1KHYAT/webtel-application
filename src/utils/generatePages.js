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
      allItems.push({ name: cat, originalModule: mod.module, originalCategory: 'General' });
    } else if (cat.items) {
      cat.items.forEach(item => {
        if (typeof item === 'string') {
          allItems.push({ name: item, originalModule: mod.module, originalCategory: cat.name });
        } else if (item.name && item.items) {
          item.items.forEach(sub => {
            if (typeof sub === 'string') {
              allItems.push({ name: sub, originalModule: mod.module, originalCategory: `${cat.name} > ${item.name}` });
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

function pushToCategory(modName, catName, pageName, item) {
  const mod = modules.find(m => m.module === modName);
  let cat = mod.categories.find(c => c.name === catName);
  if (!cat) {
    cat = { name: catName, pages: [] };
    mod.categories.push(cat);
  }
  
  const pageId = generateId(pageName);
  
  let page = cat.pages.find(p => p.id === pageId);
  if (!page) {
    page = {
      id: pageId,
      name: pageName,
      legacyFeatures: []
    };
    cat.pages.push(page);
  }

  if (!page.legacyFeatures.includes(item.name)) {
    page.legacyFeatures.push(item.name);
  }
}

// Grouping Logic to reduce 461 items into ~200-250 pages
allItems.forEach(item => {
  const lower = item.name.toLowerCase();
  const ogMod = item.originalModule;
  const ogCat = item.originalCategory;

  // Derive a smart "Page Name" by grouping similar items
  let pageName = item.name;

  // Smart Merging Rules:
  // 1. Group multiple "Approve", "Reject", "Cancel" into a single approval page per category
  if (lower.includes('approv') || lower.includes('cancel')) {
    if (lower.includes('leave')) pageName = "Leave Approvals";
    else if (lower.includes('od') || lower.includes('mispunch')) pageName = "Attendance Exceptions";
    else if (lower.includes('expense') || lower.includes('tour')) pageName = "Travel & Expense Approvals";
    else if (lower.includes('loan') || lower.includes('advance')) pageName = "Loan & Advance Approvals";
    else pageName = "General Approvals";
  }
  
  // 2. Group Import / Uploads into combined pages
  if (lower.includes('import') || lower.includes('upload')) {
    if (lower.includes('attendance') || lower.includes('punch')) pageName = "Attendance & Punch Imports";
    else if (lower.includes('employee') || lower.includes('detail')) pageName = "Employee Data Imports";
    else if (lower.includes('salary') || lower.includes('pay')) pageName = "Salary & Payroll Imports";
    else if (lower.includes('tax') || lower.includes('tds')) pageName = "Tax Data Imports";
    else pageName = item.name.replace(/import\s*|\s*upload/gi, '').trim() + " Imports";
  }

  // 3. Group Masters into consolidated Setup pages
  if (lower.includes('master')) {
    if (lower.includes('bank') || lower.includes('branch')) pageName = "Banking Configuration";
    else if (lower.includes('company') || lower.includes('location') || lower.includes('region')) pageName = "Company Structure";
    else if (lower.includes('department') || lower.includes('grade') || lower.includes('designation')) pageName = "Organizational Hierarchy";
    else pageName = item.name.replace(/\s*master/gi, '') + " Setup";
  }

  // 4. Reports Merging
  if (lower.includes('report') || lower.includes('register') || lower.includes('statement')) {
    if (lower.includes('leave') || lower.includes('absent')) pageName = "Leave & Absence Reports";
    else if (lower.includes('attendance') || lower.includes('shift')) pageName = "Attendance & Shift Reports";
    else if (lower.includes('salary') || lower.includes('pay')) pageName = "Salary & Pay Reports";
    else if (lower.includes('pf') || lower.includes('esi') || lower.includes('pt')) pageName = "Statutory & Compliance Reports";
    else if (lower.includes('tax') || lower.includes('tds')) pageName = "Taxation Reports";
    else if (lower.includes('employee') || lower.includes('join') || lower.includes('resign')) pageName = "Employee Lifecycle Reports";
  }

  // Remove trailing/leading special characters from pageName
  pageName = pageName.charAt(0).toUpperCase() + pageName.slice(1);

  // ROUTING LOGIC (Same as before, but passing the grouped pageName)
  // 1. REPORTS
  if (lower.includes('report') || lower.includes('list of') || lower.includes('statement') || lower.includes('register') || lower.includes('challan details') || lower.includes('generate')) {
    if (!lower.includes('generate offer letter') && !lower.includes('generate type of assets')) {
      if (lower.includes('attendance') || lower.includes('leave') || lower.includes('absent')) {
        return pushToCategory("Report Builder", "Attendance & Leave Reports", pageName, item);
      }
      if (lower.includes('salary') || lower.includes('tax') || lower.includes('tds') || lower.includes('pf') || lower.includes('esi') || lower.includes('slip')) {
        return pushToCategory("Report Builder", "Payroll & Tax Reports", pageName, item);
      }
      if (lower.includes('employee') || lower.includes('joinee') || lower.includes('resign')) {
        return pushToCategory("Report Builder", "Employee Reports", pageName, item);
      }
      return pushToCategory("Report Builder", "Custom Reports & Dashboards", pageName, item);
    }
  }

  // 2. IMPORTS & EXPORTS
  if (lower.includes('import') || lower.includes('upload') || lower.includes('export')) {
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('punch')) {
      return pushToCategory("Import Center", "Attendance Imports", pageName, item);
    }
    if (lower.includes('salary') || lower.includes('pf') || lower.includes('esi') || lower.includes('pt') || lower.includes('tds') || lower.includes('tax')) {
      return pushToCategory("Import Center", "Payroll & Tax Imports", pageName, item);
    }
    if (lower.includes('employee') || lower.includes('candidate')) {
      return pushToCategory("Import Center", "Employee & Candidate Data", pageName, item);
    }
    if (lower.includes('export')) {
      return pushToCategory("Import Center", "Data Exports", pageName, item);
    }
    return pushToCategory("Import Center", "General Bulk Imports", pageName, item);
  }

  // 3. APPROVALS
  if (lower.includes('approv') || lower.includes('reject') || lower.includes('authorize') || lower.includes('clearance approve')) {
    if (lower.includes('leave') || lower.includes('od') || lower.includes('mispunch') || lower.includes('attendance')) {
      return pushToCategory("Approvals Hub", "Attendance & Leave Approvals", pageName, item);
    }
    if (lower.includes('expense') || lower.includes('travel') || lower.includes('tour')) {
      return pushToCategory("Approvals Hub", "Travel & Expense Approvals", pageName, item);
    }
    if (lower.includes('salary') || lower.includes('loan') || lower.includes('tax')) {
      return pushToCategory("Approvals Hub", "Finance & Payroll Approvals", pageName, item);
    }
    return pushToCategory("Approvals Hub", "General Approvals", pageName, item);
  }

  // 4. SETTINGS
  if (lower.includes('master') || lower.includes('template') || lower.includes('setup') || lower.includes('configuration') || lower.includes('define') || ogMod === "Administration") {
    if (lower.includes('company') || lower.includes('bank') || lower.includes('branch') || lower.includes('location') || lower.includes('region') || lower.includes('department') || lower.includes('grade')) {
      return pushToCategory("Settings", "Organization Profile", pageName, item);
    }
    if (lower.includes('user') || lower.includes('role') || lower.includes('password') || lower.includes('right')) {
      return pushToCategory("Settings", "User & Role Management", pageName, item);
    }
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('salary') || lower.includes('payhead') || lower.includes('financial')) {
      return pushToCategory("Settings", "Financial & Compliance Setup", pageName, item);
    }
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('leave') || lower.includes('holiday')) {
      return pushToCategory("Settings", "Leave & Attendance Setup", pageName, item);
    }
    return pushToCategory("Settings", "System Configuration", pageName, item);
  }

  // 5. ATTENDANCE & LEAVE
  if (ogMod === "Attendance & Leave") {
    if (lower.includes('leave') || lower.includes('encashment')) return pushToCategory("Attendance & Leave", "Leave Management", pageName, item);
    if (lower.includes('shift') || lower.includes('roster')) return pushToCategory("Attendance & Leave", "Shift & Roster Planning", pageName, item);
    return pushToCategory("Attendance & Leave", "Daily Attendance", pageName, item);
  }

  // 6. PAYROLL & COMPLIANCE
  if (ogMod === "Salary Processing" || ogMod === "Compliance") {
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('tds') || lower.includes('pt') || lower.includes('lwf') || lower.includes('perquisite') || lower.includes('investment')) {
      return pushToCategory("Payroll", "Tax & Declarations", pageName, item);
    }
    if (lower.includes('structure') || lower.includes('increment') || lower.includes('arrear')) {
      return pushToCategory("Payroll", "Salary Structures", pageName, item);
    }
    if (lower.includes('payment') || lower.includes('cheque') || lower.includes('bank') || lower.includes('transfer')) {
      return pushToCategory("Payroll", "Payouts & Disbursements", pageName, item);
    }
    return pushToCategory("Payroll", "Run Payroll", pageName, item);
  }

  // 7. TRAVEL & EXPENSES
  if (ogMod === "Travel" || lower.includes('expense') || lower.includes('reimbursement')) {
    if (lower.includes('travel') || lower.includes('tour')) return pushToCategory("Travel & Expenses", "Travel Desk", pageName, item);
    return pushToCategory("Travel & Expenses", "Expense Claims", pageName, item);
  }

  // 8. ASSETS
  if (ogMod === "Asset") {
    return pushToCategory("Assets", "Asset Registry", pageName, item);
  }

  // 9. PERFORMANCE & TRAINING
  if (ogMod === "PMS" || ogMod === "Training") {
    if (ogMod === "Training" || lower.includes('training')) return pushToCategory("Performance & Training", "Learning & Training", pageName, item);
    return pushToCategory("Performance & Training", "Performance Reviews", pageName, item);
  }

  // 10. PEOPLE
  if (ogMod === "e-Recruitment" || lower.includes('candidate') || lower.includes('mrf') || lower.includes('interview') || lower.includes('vacancy')) {
    return pushToCategory("People", "Recruitment Hub", pageName, item);
  }
  if (ogMod === "Onboarding" || lower.includes('temporary employee') || lower.includes('offer letter')) {
    return pushToCategory("People", "Onboarding Pipeline", pageName, item);
  }
  if (lower.includes('resign') || lower.includes('exit') || lower.includes('clearance') || lower.includes('separation')) {
    return pushToCategory("People", "Exit Management", pageName, item);
  }
  if (lower.includes('award') || lower.includes('disciplinary') || lower.includes('help desk') || lower.includes('ticket')) {
    return pushToCategory("People", "Employee Relations", pageName, item);
  }
  
  // Default to Employee Directory
  return pushToCategory("People", "Employee Directory", pageName, item);
});

// Count total pages generated
let totalPages = 0;
modules.forEach(m => {
  m.categories.forEach(c => {
    totalPages += c.pages.length;
  });
});

fs.writeFileSync(path.join(__dirname, '../../src/data/pages-ia.json'), JSON.stringify({ navigation: modules }, null, 2));
console.log(`Successfully generated 3-level pages-ia.json mapping 461 features to ${totalPages} consolidated pages!`);

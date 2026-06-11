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

// We want to reduce 461 items into ~30 consolidated pages.
const modules = [
  { module: "People", pages: [] },
  { module: "Attendance & Leave", pages: [] },
  { module: "Payroll", pages: [] },
  { module: "Performance & Training", pages: [] },
  { module: "Travel & Expenses", pages: [] },
  { module: "Assets", pages: [] },
  { module: "Approvals Hub", pages: [] },
  { module: "Import Center", pages: [] },
  { module: "Report Builder", pages: [] },
  { module: "Settings", pages: [] }
];

// Helper to push to a page
function pushToPage(modName, pageId, pageName, item) {
  const mod = modules.find(m => m.module === modName);
  let page = mod.pages.find(p => p.id === pageId);
  if (!page) {
    page = { id: pageId, name: pageName, legacyFeatures: [] };
    mod.pages.push(page);
  }
  if (!page.legacyFeatures.includes(item.name)) {
    page.legacyFeatures.push(item.name);
  }
}

// Grouping Logic
allItems.forEach(item => {
  const lower = item.name.toLowerCase();
  const ogMod = item.originalModule;

  // 1. REPORTS
  if (lower.includes('report') || lower.includes('list of') || lower.includes('statement') || lower.includes('register') || lower.includes('challan details') || lower.includes('generate')) {
    if (!lower.includes('generate offer letter') && !lower.includes('generate type of assets')) {
      if (lower.includes('attendance') || lower.includes('leave') || lower.includes('absent')) {
        return pushToPage("Report Builder", "attendance-reports", "Attendance & Leave Reports", item);
      }
      if (lower.includes('salary') || lower.includes('tax') || lower.includes('tds') || lower.includes('pf') || lower.includes('esi') || lower.includes('slip')) {
        return pushToPage("Report Builder", "payroll-reports", "Payroll & Tax Reports", item);
      }
      if (lower.includes('employee') || lower.includes('joinee') || lower.includes('resign')) {
        return pushToPage("Report Builder", "employee-reports", "Employee Reports", item);
      }
      return pushToPage("Report Builder", "custom-reports", "Custom Reports & Dashboards", item);
    }
  }

  // 2. IMPORTS & EXPORTS
  if (lower.includes('import') || lower.includes('upload') || lower.includes('export')) {
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('punch')) {
      return pushToPage("Import Center", "attendance-imports", "Attendance Imports", item);
    }
    if (lower.includes('salary') || lower.includes('pf') || lower.includes('esi') || lower.includes('pt') || lower.includes('tds') || lower.includes('tax')) {
      return pushToPage("Import Center", "payroll-imports", "Payroll & Tax Imports", item);
    }
    if (lower.includes('employee') || lower.includes('candidate')) {
      return pushToPage("Import Center", "employee-imports", "Employee & Candidate Data", item);
    }
    if (lower.includes('export')) {
      return pushToPage("Import Center", "data-export", "Data Exports", item);
    }
    return pushToPage("Import Center", "bulk-imports", "General Bulk Imports", item);
  }

  // 3. APPROVALS
  if (lower.includes('approv') || lower.includes('reject') || lower.includes('authorize') || lower.includes('clearance approve')) {
    if (lower.includes('leave') || lower.includes('od') || lower.includes('mispunch') || lower.includes('attendance')) {
      return pushToPage("Approvals Hub", "attendance-approvals", "Attendance & Leave Approvals", item);
    }
    if (lower.includes('expense') || lower.includes('travel') || lower.includes('tour')) {
      return pushToPage("Approvals Hub", "expense-approvals", "Travel & Expense Approvals", item);
    }
    if (lower.includes('salary') || lower.includes('loan') || lower.includes('tax')) {
      return pushToPage("Approvals Hub", "finance-approvals", "Finance & Payroll Approvals", item);
    }
    return pushToPage("Approvals Hub", "general-approvals", "General Approvals", item);
  }

  // 4. SETTINGS
  if (lower.includes('master') || lower.includes('template') || lower.includes('setup') || lower.includes('configuration') || lower.includes('define') || ogMod === "Administration") {
    if (lower.includes('company') || lower.includes('bank') || lower.includes('branch') || lower.includes('location') || lower.includes('region') || lower.includes('department') || lower.includes('grade')) {
      return pushToPage("Settings", "org-profile", "Organization Profile", item);
    }
    if (lower.includes('user') || lower.includes('role') || lower.includes('password') || lower.includes('right')) {
      return pushToPage("Settings", "user-management", "User & Role Management", item);
    }
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('salary') || lower.includes('payhead') || lower.includes('financial')) {
      return pushToPage("Settings", "financial-setup", "Financial & Compliance Setup", item);
    }
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('leave') || lower.includes('holiday')) {
      return pushToPage("Settings", "time-setup", "Leave & Attendance Setup", item);
    }
    return pushToPage("Settings", "system-config", "System Configuration", item);
  }

  // 5. ATTENDANCE & LEAVE
  if (ogMod === "Attendance & Leave") {
    if (lower.includes('leave') || lower.includes('encashment')) return pushToPage("Attendance & Leave", "leave-management", "Leave Management", item);
    if (lower.includes('shift') || lower.includes('roster')) return pushToPage("Attendance & Leave", "shift-roster", "Shift & Roster Planning", item);
    return pushToPage("Attendance & Leave", "daily-attendance", "Daily Attendance", item);
  }

  // 6. PAYROLL & COMPLIANCE
  if (ogMod === "Salary Processing" || ogMod === "Compliance") {
    if (lower.includes('tax') || lower.includes('pf') || lower.includes('esi') || lower.includes('tds') || lower.includes('pt') || lower.includes('lwf') || lower.includes('perquisite') || lower.includes('investment')) {
      return pushToPage("Payroll", "tax-declarations", "Tax & Declarations", item);
    }
    if (lower.includes('structure') || lower.includes('increment') || lower.includes('arrear')) {
      return pushToPage("Payroll", "salary-structures", "Salary Structures", item);
    }
    if (lower.includes('payment') || lower.includes('cheque') || lower.includes('bank') || lower.includes('transfer')) {
      return pushToPage("Payroll", "payouts", "Payouts & Disbursements", item);
    }
    return pushToPage("Payroll", "run-payroll", "Run Payroll", item);
  }

  // 7. TRAVEL & EXPENSES
  if (ogMod === "Travel" || lower.includes('expense') || lower.includes('reimbursement')) {
    if (lower.includes('travel') || lower.includes('tour')) return pushToPage("Travel & Expenses", "travel-desk", "Travel Desk", item);
    return pushToPage("Travel & Expenses", "expense-claims", "Expense Claims", item);
  }

  // 8. ASSETS
  if (ogMod === "Asset") {
    return pushToPage("Assets", "asset-registry", "Asset Registry", item);
  }

  // 9. PERFORMANCE & TRAINING
  if (ogMod === "PMS" || ogMod === "Training") {
    if (ogMod === "Training" || lower.includes('training')) return pushToPage("Performance & Training", "training-hub", "Learning & Training", item);
    return pushToPage("Performance & Training", "performance-reviews", "Performance Reviews", item);
  }

  // 10. PEOPLE
  if (ogMod === "e-Recruitment" || lower.includes('candidate') || lower.includes('mrf') || lower.includes('interview') || lower.includes('vacancy')) {
    return pushToPage("People", "recruitment", "Recruitment Hub", item);
  }
  if (ogMod === "Onboarding" || lower.includes('temporary employee') || lower.includes('offer letter')) {
    return pushToPage("People", "onboarding", "Onboarding Pipeline", item);
  }
  if (lower.includes('resign') || lower.includes('exit') || lower.includes('clearance') || lower.includes('separation')) {
    return pushToPage("People", "exit-management", "Exit Management", item);
  }
  if (lower.includes('award') || lower.includes('disciplinary') || lower.includes('help desk') || lower.includes('ticket')) {
    return pushToPage("People", "employee-relations", "Employee Relations", item);
  }
  
  // Default to Employee Directory
  return pushToPage("People", "employee-directory", "Employee Directory", item);
});

fs.writeFileSync(path.join(__dirname, '../../src/data/pages-ia.json'), JSON.stringify({ navigation: modules }, null, 2));
console.log('Successfully generated pages-ia.json mapping 461 features to 26 consolidated pages!');

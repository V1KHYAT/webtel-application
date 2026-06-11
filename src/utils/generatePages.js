import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, '../../dropdown.json'), 'utf8');
const data = JSON.parse(rawData);

// Collect all 461 raw items
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
              allItems.push({ name: sub, originalModule: mod.module, originalCategory: item.name });
            }
          });
        }
      });
    }
  });
});

// Helper for ID generation
function generateId(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// 1. HARDCODE THE PREMIUM SAAS ARCHITECTURE
const curatedArchitecture = [
  {
    module: "Directory",
    categories: [
      { name: "Employee Hub", pages: ["People Directory", "Employee Documents", "Lifecycle Events", "Separation Details"] },
      { name: "Organization", pages: ["Org Chart", "Company News", "Helpdesk"] }
    ]
  },
  {
    module: "Time",
    categories: [
      { name: "Attendance", pages: ["Daily Punches", "Timesheets", "Attendance Approvals", "Mispunch Rectification"] },
      { name: "Leaves", pages: ["Leave Requests", "Leave Balances", "Leave Approvals", "Encashment"] },
      { name: "Scheduling", pages: ["Shift Roster", "Holiday Calendar"] }
    ]
  },
  {
    module: "Payroll",
    categories: [
      { name: "Compensation", pages: ["Salary Structures", "Run Payroll", "Arrears", "Reimbursements", "Loans & Advances"] },
      { name: "Compliance", pages: ["Tax Declarations", "TDS Details", "PF Details", "ESI Records", "Statutory Setup"] },
      { name: "Disbursements", pages: ["Bank Transfers", "Cheque Payments"] },
      { name: "Payroll Approvals", pages: ["Salary Approvals", "Loan Approvals", "Investment Approvals"] }
    ]
  },
  {
    module: "Recruitment",
    categories: [
      { name: "Hiring", pages: ["Job Requisitions", "Applicant Tracking", "Interview Pipeline"] },
      { name: "Offers", pages: ["Offer Letters", "Candidate Background"] },
      { name: "Onboarding", pages: ["New Hire Checklist", "Probation Tracking"] }
    ]
  },
  {
    module: "Performance",
    categories: [
      { name: "Appraisals", pages: ["Performance Reviews", "Goal Tracking", "360 Feedback"] },
      { name: "Training", pages: ["Course Catalog", "Training Records", "Certifications"] },
      { name: "Engagement", pages: ["Employee Awards", "Disciplinary Actions"] }
    ]
  },
  {
    module: "Expenses",
    categories: [
      { name: "Travel", pages: ["Travel Requests", "Tour Approvals", "Ticketing"] },
      { name: "Claims", pages: ["Expense Claims", "Claim Approvals", "Settlements"] },
      { name: "Assets", pages: ["Asset Registry", "Allocations", "Asset Returns"] }
    ]
  },
  {
    module: "Reports",
    categories: [
      { name: "Analytics", pages: ["Management Dashboard", "Custom Reports"] },
      { name: "Employee Data", pages: ["Directory Reports", "Attrition Analytics", "Lifecycle Reports"] },
      { name: "Time Data", pages: ["Attendance Registers", "Leave Registers", "Shift Reports"] },
      { name: "Payroll Data", pages: ["Salary Registers", "Tax Statements", "Statutory Reports", "Bank Reports"] },
      { name: "Expense Data", pages: ["Expense Statements", "Asset Ledgers"] }
    ]
  },
  {
    module: "Settings",
    categories: [
      { name: "Company Profile", pages: ["Company Details", "Locations & Branches", "Departments & Grades"] },
      { name: "Security", pages: ["User Roles", "Permissions", "Access Logs"] },
      { name: "Data Center", pages: ["Bulk Imports", "Data Exports", "System Setup"] },
      { name: "Configuration", pages: ["Leave Policies", "Payroll Configurations", "Workflow Setup", "Banking Masters"] }
    ]
  }
];

// Initialize the output structure
const modulesOutput = curatedArchitecture.map(mod => ({
  module: mod.module,
  categories: mod.categories.map(cat => ({
    name: cat.name,
    pages: cat.pages.map(pName => ({
      id: generateId(pName),
      name: pName,
      legacyContentSources: []
    }))
  }))
}));

// Helper to push a legacy item into the right mapped page
function mapFeatureToPage(legacyItem, targetModuleName, targetPageName) {
  const mod = modulesOutput.find(m => m.module === targetModuleName);
  if (!mod) throw new Error(`Module ${targetModuleName} not found`);
  
  let targetPage = null;
  for (const cat of mod.categories) {
    const p = cat.pages.find(page => page.name === targetPageName);
    if (p) {
      targetPage = p;
      break;
    }
  }
  
  if (!targetPage) throw new Error(`Page ${targetPageName} not found in ${targetModuleName}`);
  
  if (!targetPage.legacyContentSources.includes(legacyItem.name)) {
    targetPage.legacyContentSources.push(legacyItem.name);
  }
}

// 2. MAPPING THE 461 FEATURES STRICTLY
allItems.forEach(item => {
  const lower = item.name.toLowerCase();
  const ogMod = item.originalModule;
  const ogCat = item.originalCategory.toLowerCase();

  // ----- REPORTS HUB -----
  if (lower.includes('report') || lower.includes('register') || lower.includes('statement') || lower.includes('challan') || lower.includes('list of') || (lower.includes('generate') && !lower.includes('offer letter'))) {
    if (lower.includes('leave') || lower.includes('absent')) return mapFeatureToPage(item, "Reports", "Leave Registers");
    if (lower.includes('attendance') || lower.includes('shift') || lower.includes('punch')) return mapFeatureToPage(item, "Reports", "Attendance Registers");
    if (lower.includes('tax') || lower.includes('tds')) return mapFeatureToPage(item, "Reports", "Tax Statements");
    if (lower.includes('pf') || lower.includes('esi') || lower.includes('pt ') || lower.includes('lwf')) return mapFeatureToPage(item, "Reports", "Statutory Reports");
    if (lower.includes('salary') || lower.includes('pay') || lower.includes('slip') || lower.includes('earning')) return mapFeatureToPage(item, "Reports", "Salary Registers");
    if (lower.includes('bank') || lower.includes('cheque')) return mapFeatureToPage(item, "Reports", "Bank Reports");
    if (lower.includes('expense') || lower.includes('claim')) return mapFeatureToPage(item, "Reports", "Expense Statements");
    if (lower.includes('asset')) return mapFeatureToPage(item, "Reports", "Asset Ledgers");
    if (lower.includes('employee') || lower.includes('join') || lower.includes('resign')) return mapFeatureToPage(item, "Reports", "Directory Reports");
    return mapFeatureToPage(item, "Reports", "Custom Reports");
  }

  // ----- IMPORTS / EXPORTS -----
  if (lower.includes('import') || lower.includes('upload')) return mapFeatureToPage(item, "Settings", "Bulk Imports");
  if (lower.includes('export') || lower.includes('download')) return mapFeatureToPage(item, "Settings", "Data Exports");

  // ----- DIRECTORY / LIFECYCLE -----
  if (ogMod === "Onboarding" || ogCat.includes('onboard')) return mapFeatureToPage(item, "Recruitment", "New Hire Checklist");
  if (lower.includes('resign') || lower.includes('exit') || lower.includes('clearance') || lower.includes('separation')) return mapFeatureToPage(item, "Directory", "Separation Details");
  if (lower.includes('document')) return mapFeatureToPage(item, "Directory", "Employee Documents");
  if (ogMod === "Employee") return mapFeatureToPage(item, "Directory", "People Directory");
  if (lower.includes('award') || lower.includes('disciplinary')) return mapFeatureToPage(item, "Performance", "Employee Awards");
  if (lower.includes('help desk') || lower.includes('ticket')) return mapFeatureToPage(item, "Directory", "Helpdesk");
  
  // ----- TIME & ATTENDANCE -----
  if (lower.includes('leave') || lower.includes('encashment')) {
    if (lower.includes('approv') || lower.includes('cancel')) return mapFeatureToPage(item, "Time", "Leave Approvals");
    if (lower.includes('balance') || lower.includes('credit')) return mapFeatureToPage(item, "Time", "Leave Balances");
    if (lower.includes('encashment')) return mapFeatureToPage(item, "Time", "Encashment");
    return mapFeatureToPage(item, "Time", "Leave Requests");
  }
  if (lower.includes('shift') || lower.includes('roster')) return mapFeatureToPage(item, "Time", "Shift Roster");
  if (ogMod === "Attendance & Leave") {
    if (lower.includes('mispunch')) return mapFeatureToPage(item, "Time", "Mispunch Rectification");
    if (lower.includes('approv')) return mapFeatureToPage(item, "Time", "Attendance Approvals");
    return mapFeatureToPage(item, "Time", "Daily Punches");
  }

  // ----- PAYROLL & COMPENSATION -----
  if (ogMod === "Salary Processing" || ogMod === "Compliance" || ogCat.includes('salary') || lower.includes('salary')) {
    if (lower.includes('pf ')) return mapFeatureToPage(item, "Payroll", "PF Details");
    if (lower.includes('esi ')) return mapFeatureToPage(item, "Payroll", "ESI Records");
    if (lower.includes('tds') || lower.includes('tax')) return mapFeatureToPage(item, "Payroll", "Tax Declarations");
    if (lower.includes('structure') || lower.includes('increment')) return mapFeatureToPage(item, "Payroll", "Salary Structures");
    if (lower.includes('arrear')) return mapFeatureToPage(item, "Payroll", "Arrears");
    if (lower.includes('loan') || lower.includes('advance')) {
      if (lower.includes('approv')) return mapFeatureToPage(item, "Payroll", "Loan Approvals");
      return mapFeatureToPage(item, "Payroll", "Loans & Advances");
    }
    if (lower.includes('bank') || lower.includes('transfer')) return mapFeatureToPage(item, "Payroll", "Bank Transfers");
    if (lower.includes('cheque')) return mapFeatureToPage(item, "Payroll", "Cheque Payments");
    if (lower.includes('approv')) return mapFeatureToPage(item, "Payroll", "Salary Approvals");
    return mapFeatureToPage(item, "Payroll", "Run Payroll");
  }

  // ----- RECRUITMENT -----
  if (ogMod === "e-Recruitment" || lower.includes('mrf') || lower.includes('candidate') || lower.includes('interview') || lower.includes('offer letter')) {
    if (lower.includes('mrf') || lower.includes('vacancy')) return mapFeatureToPage(item, "Recruitment", "Job Requisitions");
    if (lower.includes('offer')) return mapFeatureToPage(item, "Recruitment", "Offer Letters");
    if (lower.includes('interview')) return mapFeatureToPage(item, "Recruitment", "Interview Pipeline");
    return mapFeatureToPage(item, "Recruitment", "Applicant Tracking");
  }

  // ----- PERFORMANCE & TRAINING -----
  if (ogMod === "PMS") {
    if (lower.includes('goal') || lower.includes('kra')) return mapFeatureToPage(item, "Performance", "Goal Tracking");
    return mapFeatureToPage(item, "Performance", "Performance Reviews");
  }
  if (ogMod === "Training" || lower.includes('training') || lower.includes('course')) {
    return mapFeatureToPage(item, "Performance", "Training Records");
  }

  // ----- EXPENSES & ASSETS -----
  if (ogMod === "Travel" || lower.includes('travel') || lower.includes('tour') || lower.includes('expense') || lower.includes('reimbursement')) {
    if (lower.includes('approv')) return mapFeatureToPage(item, "Expenses", "Claim Approvals");
    if (lower.includes('claim') || lower.includes('expense')) return mapFeatureToPage(item, "Expenses", "Expense Claims");
    return mapFeatureToPage(item, "Expenses", "Travel Requests");
  }
  if (ogMod === "Asset" || lower.includes('asset')) {
    if (lower.includes('return')) return mapFeatureToPage(item, "Expenses", "Asset Returns");
    if (lower.includes('allocat')) return mapFeatureToPage(item, "Expenses", "Allocations");
    return mapFeatureToPage(item, "Expenses", "Asset Registry");
  }

  // ----- SETTINGS & ADMINISTRATION (Masters & Approvals Hub overflow) -----
  if (lower.includes('approv')) {
    // If not caught above, it's a workflow approval config or a general approval
    return mapFeatureToPage(item, "Settings", "Workflow Setup");
  }
  if (lower.includes('master') || lower.includes('setup') || lower.includes('config') || ogMod === "Administration") {
    if (lower.includes('company') || lower.includes('location') || lower.includes('branch') || lower.includes('region')) return mapFeatureToPage(item, "Settings", "Company Details");
    if (lower.includes('user') || lower.includes('role') || lower.includes('password') || lower.includes('right')) return mapFeatureToPage(item, "Settings", "User Roles");
    if (lower.includes('bank')) return mapFeatureToPage(item, "Settings", "Banking Masters");
    if (lower.includes('holiday')) return mapFeatureToPage(item, "Time", "Holiday Calendar");
    if (lower.includes('payroll') || lower.includes('payhead') || lower.includes('formula')) return mapFeatureToPage(item, "Settings", "Payroll Configurations");
    if (lower.includes('leave')) return mapFeatureToPage(item, "Settings", "Leave Policies");
    return mapFeatureToPage(item, "Settings", "System Setup");
  }

  // Catch-all fallbacks
  return mapFeatureToPage(item, "Settings", "System Setup");
});

// Calculate metrics
let totalFeaturesMapped = 0;
modulesOutput.forEach(mod => {
  mod.categories.forEach(cat => {
    cat.pages.forEach(p => {
      totalFeaturesMapped += p.legacyContentSources.length;
    });
  });
});

fs.writeFileSync(path.join(__dirname, '../../src/data/premium-ia.json'), JSON.stringify({ navigation: modulesOutput }, null, 2));
console.log(`Successfully generated curated premium-ia.json mapping ${totalFeaturesMapped} total features!`);

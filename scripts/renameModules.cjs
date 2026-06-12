const fs = require('fs');
const path = require('path');

const iaPath = path.join(__dirname, '../src/data/v4-ia.json');
const data = JSON.parse(fs.readFileSync(iaPath, 'utf-8'));

const moduleMap = {
  "Administration": "System & Org Setup",
  "Employee": "Employee Records",
  "HR": "HR Operations",
  "Attendance & Leave": "Time & Attendance",
  "Salary Processing": "Payroll Management",
  "e-Recruitment": "Recruitment (ATS)",
  "Employee Separation": "Offboarding",
  "Expense Claim": "Expenses & Claims",
  "Training": "Learning & Development",
  "PMS": "Performance Appraisals",
  "e-TDS": "Tax & Compliance (TDS)",
  "Loans & Advances": "Loans & Advances",
  "Others": "Additional Tools"
};

const desiredOrder = [
  "System & Org Setup",
  "Employee Records",
  "Recruitment (ATS)",
  "Time & Attendance",
  "Payroll Management",
  "Expenses & Claims",
  "Performance Appraisals",
  "Learning & Development",
  "HR Operations",
  "Loans & Advances",
  "Offboarding",
  "Tax & Compliance (TDS)",
  "Additional Tools"
];

// Rename modules
data.navigation.forEach(nav => {
  if (moduleMap[nav.module]) {
    nav.module = moduleMap[nav.module];
  }
});

// Reorder modules
data.navigation.sort((a, b) => {
  const indexA = desiredOrder.indexOf(a.module);
  const indexB = desiredOrder.indexOf(b.module);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
});

fs.writeFileSync(iaPath, JSON.stringify(data, null, 2));
console.log('Renamed and reordered modules in v4-ia.json');

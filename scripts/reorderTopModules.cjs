const fs = require('fs');
const path = require('path');

const iaPath = path.join(__dirname, '../src/data/v4-ia.json');
const data = JSON.parse(fs.readFileSync(iaPath, 'utf-8'));

// Desired modern order for the modules
const desiredOrder = [
  "Employee Records",
  "HR Operations",
  "Time & Attendance",
  "Payroll Management",
  "Approvals",
  "Compliance",
  "Analytics",
  "Reports",
  "Additional Tools",
  "System & Org Setup"
];

data.navigation.sort((a, b) => {
  const indexA = desiredOrder.indexOf(a.module);
  const indexB = desiredOrder.indexOf(b.module);
  if (indexA === -1) return 1;
  if (indexB === -1) return -1;
  return indexA - indexB;
});

fs.writeFileSync(iaPath, JSON.stringify(data, null, 2));
console.log('Reordered top-level modules successfully');

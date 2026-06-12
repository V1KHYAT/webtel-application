const fs = require('fs');
const path = require('path');

const iaPath = path.join(__dirname, '../src/data/v4-ia.json');
const data = JSON.parse(fs.readFileSync(iaPath, 'utf-8'));

const employeeCategoryRenames = {
  "Employee Setup": "Onboarding & Master Data",
  "Employee Document Bank": "Document Management",
  "Transfer Employee, Employee Shift & Shift in Biometric Database": "Shift & Biometric Transfers",
  "Convert Temporary to Permanent Employee": "Contract Conversions",
  "Intercompany Transfer": "Intercompany Transfers",
  "Trace Employee(s) Through Google Map": "Location Tracking",
  "Reports": "Employee Reports",
  "Intercompany Transfer Report": "Intercompany Transfer Reports"
};

const employeeCategoryOrder = [
  "Onboarding & Master Data",
  "Organization Chart",
  "Document Management",
  "Contract Conversions",
  "Intercompany Transfers",
  "Shift & Biometric Transfers",
  "Employee of the Month",
  "Location Tracking",
  "Employee Reports",
  "Intercompany Transfer Reports"
];

const hrCategoryRenames = {
  "Document Management": "HR Documents & Letters",
  "Accident Incident Details": "Incident Reporting",
  "Disciplinary Action": "Disciplinary Actions",
  "Employee References Management": "Background & References",
  "Employee Awards": "Awards & Recognition",
  "Employee Activity Management": "Task Management",
  "Help Desk": "Helpdesk & Ticketing",
  "Online Separation Process": "Separation Workflows",
  "Employee Movement": "Internal Movements",
  "Employee Search & Send Email": "Communications"
};

const hrCategoryOrder = [
  "Helpdesk & Ticketing",
  "HR Documents & Letters",
  "Communications",
  "Awards & Recognition",
  "Disciplinary Actions",
  "Incident Reporting",
  "Background & References",
  "Internal Movements",
  "Task Management",
  "Separation Workflows"
];

data.navigation.forEach(module => {
  if (module.module === "Employee Records") {
    // Rename
    module.categories.forEach(cat => {
      if (employeeCategoryRenames[cat.name]) {
        cat.name = employeeCategoryRenames[cat.name];
      }
    });
    // Reorder
    module.categories.sort((a, b) => {
      const indexA = employeeCategoryOrder.indexOf(a.name);
      const indexB = employeeCategoryOrder.indexOf(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }

  if (module.module === "HR Operations") {
    // Rename
    module.categories.forEach(cat => {
      if (hrCategoryRenames[cat.name]) {
        cat.name = hrCategoryRenames[cat.name];
      }
    });
    // Reorder
    module.categories.sort((a, b) => {
      const indexA = hrCategoryOrder.indexOf(a.name);
      const indexB = hrCategoryOrder.indexOf(b.name);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }
});

fs.writeFileSync(iaPath, JSON.stringify(data, null, 2));
console.log('Renamed and reordered inner categories for Employee Records and HR Operations');

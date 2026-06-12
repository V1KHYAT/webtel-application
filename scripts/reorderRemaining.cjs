const fs = require('fs');
const path = require('path');

const iaPath = path.join(__dirname, '../src/data/v4-ia.json');
const data = JSON.parse(fs.readFileSync(iaPath, 'utf-8'));

const mappings = {
  "System & Org Setup": {
    renames: {
      "Organization Setup": "Company Profile",
      "Organization Master Setup": "Organizational Hierarchy",
      "Employee Portal Setup": "Portal & UI Settings",
      "Employee Compliance Setup": "Compliance Settings",
      "Loan / TDS Setup": "Tax & Loan Settings",
      "Pay Component Setup": "Payroll Components",
      "User Administration": "Users & Roles",
      "Configuration Reports": "Setup Reports",
      "Dynamic Parameters": "System Variables",
      "Organization Database Backup": "Database Management",
      "End User License Agreement": "EULA",
      "Disclaimer": "Disclaimers"
    },
    order: [
      "Company Profile",
      "Organizational Hierarchy",
      "Portal & UI Settings",
      "Users & Roles",
      "Payroll Components",
      "Tax & Loan Settings",
      "Compliance Settings",
      "System Variables",
      "Database Management",
      "Setup Reports",
      "EULA",
      "Disclaimers"
    ]
  },
  "Time & Attendance": {
    renames: {
      "Leave & Attendance Setup": "Settings & Policies",
      "Assignments": "Shift Assignments",
      "Work Schedule Assignments": "Work Schedules",
      "Holiday and OT Settings": "Holidays & Overtime",
      "Time Management ( Manual )": "Manual Timesheets",
      "Time Management ( Automated )": "Biometric / Auto-Timesheets",
      "Attendance Processing": "Attendance Processing",
      "Attendance Process ( Manual )": "Manual Attendance Processing",
      "Attendance ,OT & Night Allowance Calculation": "Overtime & Allowance Calculation",
      "Attendance Correction ( After Process )": "Post-Process Corrections",
      "Online Attendance": "Web Attendance",
      "Timesheet Process (Online)": "Timesheet Approvals",
      "Leave Reports": "Leave Reports",
      "Attendance Reports": "Attendance Reports",
      "Leave & Attendance Settings Report": "Configuration Reports",
      "Employee Track (Attendance)": "Live Tracking",
      "Attendance Approval/Rejection (Mobile App)": "Mobile Approvals"
    },
    order: [
      "Settings & Policies",
      "Shift Assignments",
      "Work Schedules",
      "Holidays & Overtime",
      "Web Attendance",
      "Biometric / Auto-Timesheets",
      "Manual Timesheets",
      "Timesheet Approvals",
      "Attendance Processing",
      "Manual Attendance Processing",
      "Overtime & Allowance Calculation",
      "Post-Process Corrections",
      "Mobile Approvals",
      "Live Tracking",
      "Leave Reports",
      "Attendance Reports",
      "Configuration Reports"
    ]
  },
  "Payroll Management": {
    renames: {
      "Salary Assignment": "Salary Structures",
      "Salary Structure Assigned to Employee": "Employee Compensations",
      "List of Payheads": "Payheads Directory",
      "Map Payhead with SAP CODE": "SAP Integration",
      "Salary Process, Unlock & Hold / Release": "Monthly Processing",
      "Salary Lock / Unlock Month": "Period Closing",
      "Tax Process & Edit": "Tax Processing",
      "Manage Payments Made to Employees": "Payout Management",
      "Journal Voucher": "Accounting (JV)",
      "Salary Slip & Register (Various Formats & E-Mailing)": "Payslips & Registers",
      "Salary Slip & Register (With Attendance Details) (Custom Made)": "Detailed Payslips",
      "Employees Monthly Arrear Details": "Arrears Management",
      "Salary Variance": "Variance Analysis",
      "Monthly Budget Variance Report (Custom Made)": "Budget vs Actuals",
      "Payment Made to Employee Reports": "Payout Reports",
      "Salary(MISC.) Payment Report": "Misc Payments",
      "LIC Premium Paid Report": "LIC Deductions",
      "Reports": "General Payroll Reports"
    },
    order: [
      "Salary Structures",
      "Employee Compensations",
      "Payheads Directory",
      "SAP Integration",
      "Monthly Processing",
      "Tax Processing",
      "Period Closing",
      "Payout Management",
      "Arrears Management",
      "Payslips & Registers",
      "Detailed Payslips",
      "Accounting (JV)",
      "Variance Analysis",
      "Budget vs Actuals",
      "Payout Reports",
      "Misc Payments",
      "LIC Deductions",
      "General Payroll Reports"
    ]
  },
  "Additional Tools": {
    renames: {
      "Employee Expense Management": "Expense Claims",
      "Daily / Monthly Attendance with Expense Details Process": "Expense Processing",
      "Reimbursement Management": "Reimbursements",
      "Employee Exit Management": "Exit Management",
      "Loan & Advance": "Loans & Advances",
      "ASSET": "Asset Management",
      "FBP": "Flexible Benefits Plan"
    },
    order: [] // Use existing order if order array is empty
  },
  "Approvals": {
    renames: {
      "Authorize Employees To View Salary Slip and TDS Slip": "Payslip Access Authorization",
      "Approve Loan Requested by Employee": "Loan Requests",
      "Approve Changes made by Employee to his/her Master Record": "Profile Edit Requests",
      "Approve OD & Tour Request Requested by Employee": "Tour & On-Duty Requests",
      "Approve Employee Travel Request Requested by Employee": "Travel Requests",
      "Approve Employee Expense Request": "Expense Claims",
      "Employee Overtime Approval": "Overtime Requests",
      "Employee Overtime Approval/Rejection (Daily)": "Daily OT Requests",
      "LTA / Sodexho Request Export": "LTA & Sodexo Processing"
    },
    order: []
  },
  "Compliance": {
    renames: {
      "Employee Provident Fund": "Provident Fund (PF)",
      "Employee State Insurance ( ESI )": "State Insurance (ESIC)",
      "Professional Tax ( PT )": "Professional Tax (PT)",
      "TDS": "Tax Deducted at Source (TDS)",
      "PF Reports": "PF Reports",
      "ESI Reports": "ESIC Reports",
      "LWF - Professional Tax Reports": "LWF & PT Reports",
      "TDS Reports": "TDS Reports"
    },
    order: []
  }
};

data.navigation.forEach(module => {
  const mapData = mappings[module.module];
  if (mapData) {
    // Rename categories
    module.categories.forEach(cat => {
      if (mapData.renames[cat.name]) {
        cat.name = mapData.renames[cat.name];
      }
    });
    
    // Reorder categories if order array is provided
    if (mapData.order && mapData.order.length > 0) {
      module.categories.sort((a, b) => {
        const indexA = mapData.order.indexOf(a.name);
        const indexB = mapData.order.indexOf(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }
  }
});

fs.writeFileSync(iaPath, JSON.stringify(data, null, 2));
console.log('Renamed and reordered inner categories for all remaining modules');

const fs = require('fs');

const v3 = JSON.parse(fs.readFileSync('src/data/v3-ia.json', 'utf8'));

// Deep copy V3
const v4 = JSON.parse(JSON.stringify(v3));

function generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// 1. Remove Reports from outside the Reports module
v4.navigation.forEach(mod => {
    if (mod.module === 'Reports') return; // Keep inside Reports
    
    // Filter out categories that are explicitly reports
    if (mod.categories) {
        mod.categories = mod.categories.filter(cat => {
            const name = cat.name.toLowerCase();
            if (name.includes('reports') || name === 'reports') {
                return false;
            }
            return true;
        });
    }
});

// 2. Club granular pages and rename them
const mergerRules = [
    {
        targetCategory: 'Organization Setup',
        pagesToMerge: ['Company Details', 'Global Settings', 'Mail & SMS Configuration'],
        newName: 'Company & Global Settings'
    },
    {
        targetCategory: 'Manage Perquisite',
        pagesToMerge: ['Import Car Perquisite', 'Import Employee Monthly Car Perquisite Details', 'Import Asset Perquisite Detail'],
        newName: 'Import Perquisites'
    },
    {
        targetCategory: 'Manage Perquisite',
        pagesToMerge: ['Create - Update Perquisite', 'Assign Perquisite', 'Calculate Perq Value'],
        newName: 'Manage Perquisites'
    },
    {
        targetCategory: 'Chap. VI A and Income from other Sources',
        pagesToMerge: ['Enter Chapter-VI A Investments (Individually)', 'Import Chapter VI A Investment Details'],
        newName: 'Chapter VI-A Investments'
    },
    {
        targetCategory: 'Enter TDS before Salary Process',
        pagesToMerge: ['Enter TDS before Salary Process (Individually)', 'Import TDS (Before Salary Process)'],
        newName: 'TDS Before Salary Process'
    },
    {
        targetCategory: 'Salary Structure',
        pagesToMerge: ['Assign Salary Structure to Employees (Individually)', 'Assign Salary Structure to Employees (Group)', 'Import Salary Structure'],
        newName: 'Assign & Import Salary Structure'
    },
    {
        targetCategory: 'Leave Encashment',
        pagesToMerge: ['Manage Leave Encashment (Individually)', 'Import Leave Encashment'],
        newName: 'Leave Encashment'
    },
    {
        targetCategory: 'Employee Rent Details',
        pagesToMerge: ['Employee Rent Details (Individually)', 'Import Monthly Rent Paid By Employee', 'Import Annual Rent Paid By Employee'],
        newName: 'Employee Rent Details'
    },
    {
        targetCategory: 'Manage Employee Mediclaim Details',
        pagesToMerge: ['The data entered using this import method is not used in TDS Calculation, it is used only for storage.'],
        newName: 'Import Mediclaim Data'
    },
    {
        targetCategory: 'Loan & Advance',
        pagesToMerge: ['Manage Loan - Advance (Individually)', 'Import Loan - Advance Transaction Detail'],
        newName: 'Manage Loan & Advance'
    },
    {
        targetCategory: 'Employee Exit Management',
        pagesToMerge: ['Full and Finalization', 'Import Employee Finalization Details'],
        newName: 'Full and Finalization'
    },
    {
        targetCategory: 'Reimbursement Management',
        pagesToMerge: ['Enter Reimbursements & Approve Reimbursements', 'Import Reimbursements Claim and Bills', 'Import Reimbursements Bills', 'Import Reimbursements Opening Balance'],
        newName: 'Manage & Import Reimbursements'
    },
    {
        targetCategory: 'Salary Process, Unlock & Hold / Release',
        pagesToMerge: ['Salary Process', 'UnLock Salary', 'Hold / Unhold Salary', 'Import Method to Hold-Release Salary'],
        newName: 'Salary Processing & Locks'
    },
    {
        targetCategory: 'Manage Salary Matrix',
        pagesToMerge: ['Create - Assign Salary Matrix Template', 'Import Salary Matrix'],
        newName: 'Salary Matrix'
    }
];

v4.navigation.forEach(mod => {
    if (!mod.categories) return;
    mod.categories.forEach(cat => {
        mergerRules.forEach(rule => {
            if (cat.name === rule.targetCategory || rule.targetCategory === 'ALL') {
                // Find all pages that match the merge rule
                const matchedPages = cat.pages.filter(p => rule.pagesToMerge.includes(p.name));
                
                if (matchedPages.length > 0) {
                    // Remove matched pages
                    cat.pages = cat.pages.filter(p => !rule.pagesToMerge.includes(p.name));
                    
                    // Collect all legacy sources from matched pages
                    let legacySources = [];
                    matchedPages.forEach(mp => {
                        legacySources = legacySources.concat(mp.legacyContentSources || []);
                    });
                    
                    // Add the unified page
                    cat.pages.push({
                        id: generateSlug(rule.newName),
                        name: rule.newName,
                        legacyContentSources: legacySources
                    });
                }
            }
        });

        // Global renaming logic for overly verbose names
        cat.pages.forEach(p => {
            if (p.name === 'Approve Changes made by Employee to his/her Master Record. Like Telephone, Address etc') {
                p.name = 'Approve Master Record Changes';
                p.id = generateSlug(p.name);
            }
            if (p.name === 'Transfer Assets to Assets Manager who are assgined the role of managing assets like Assets Manager in Mumbai is assgined with the role to manage Mumbai Branch assets.') {
                p.name = 'Asset Transfer Process - Assign';
                p.id = generateSlug(p.name);
            }
            if (p.name === 'Step 1: You can choose payheads so as to enable employee to make choice using this form. Step 2: Employee selects as per his/her choice in ESS and his/her chosen amount is exported in Import-Export Option Export Payhead Chosen by Employee like LTA, Sodexo etc.) (for eg. LTA, Sodexho, Conveyance, Fuel etc.') {
                p.name = 'Enter/Update Payhead Choice for Employee';
                p.id = generateSlug(p.name);
            }
            if (p.name === 'You can use this tool to advise employee on where to invest so as to save tax. The near same tool is also available to employee on ESS.') {
                p.name = 'Tax Calculator';
                p.id = generateSlug(p.name);
            }
            if (p.name === 'iPay would provide you with vital information in excel that would help you to understand on how calculations have been made. Eg. HRA-CLA calculations, PF, ESI etc.') {
                p.name = 'Ask Me / FAQ';
                p.id = generateSlug(p.name);
            }
        });
    });
});

fs.writeFileSync('src/data/v4-ia.json', JSON.stringify(v4, null, 2));
console.log('V4 generated successfully!');

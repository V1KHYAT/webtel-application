const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '../public/legacy-screens/Company_Details.html'), 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const extractedTables = [];

doc.querySelectorAll('table').forEach(table => {
    const rules = table.getAttribute('rules');
    const className = table.className || '';
    
    // Check if any row has a known header class
    let hasHeaderRowClass = false;
    for (let i = 0; i < table.rows.length; i++) {
        const rowClass = table.rows[i].className || '';
        if (rowClass.toLowerCase().includes('header')) {
            hasHeaderRowClass = true;
            break;
        }
    }

    const isLikelyDataGrid = 
        rules === 'all' || 
        className.toLowerCase().includes('grid') || 
        hasHeaderRowClass ||
        table.id.toLowerCase().includes('grid') ||
        table.id.toLowerCase().startsWith('dg');

    if (!isLikelyDataGrid) return;

    const hasHeaders = table.querySelector('th') || hasHeaderRowClass || (table.rows.length > 0 && table.rows[0].cells[0].tagName.toLowerCase() === 'th');
    const hasDataRows = table.rows.length > 1;
    
    if (hasHeaders && hasDataRows) {
        const headerRow = table.rows[0];
        const headers = Array.from(headerRow.cells).map(cell => cell.textContent.trim()).filter(h => h);
        const rows = [];
        
        for (let i = 1; i < table.rows.length; i++) {
            const cells = Array.from(table.rows[i].cells).map(cell => cell.textContent.trim());
            if (cells.some(c => c)) { // Only add non-empty rows
                rows.push(cells);
            }
        }
        
        if (headers.length > 0 && rows.length > 0) {
            extractedTables.push({ id: table.id, headers, rows });
        }
    }
});

console.log(JSON.stringify(extractedTables, null, 2));

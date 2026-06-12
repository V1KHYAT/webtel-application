const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, '../src/pages/GenericPage.jsx');
let content = fs.readFileSync(pagePath, 'utf8');

// Fix imports
content = content.replace(
  /import \{ Construction, ArrowLeft, ArrowRight, FileQuestion \} from 'lucide-react';/,
  `import { LayoutGrid, FileText } from 'lucide-react';\nimport LegacyParser from '../components/layout/LegacyParser';`
);

// Replace iaVersion === 4 checks with iaVersion === 2
content = content.replace(/iaVersion === 4/g, 'iaVersion === 2');

// Update text referencing V4/V3 to V2/V1
content = content.replace(/V4 REDESIGN/g, 'V2 REDESIGN');
content = content.replace(/legacy V3 pages/g, 'legacy V1 pages');
content = content.replace(/V4 NON-MERGED PAGES/g, 'V2 NON-MERGED PAGES');

fs.writeFileSync(pagePath, content);
console.log('GenericPage.jsx cleaned successfully');

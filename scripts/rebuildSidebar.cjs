const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/components/layout/Sidebar.jsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

// 1. Fix imports
content = content.replace(
  /import premiumIA from '\.\.\/\.\.\/data\/premium-ia\.json';\s*import v3IA from '\.\.\/\.\.\/data\/v3-ia\.json';\s*import v4IA from '\.\.\/\.\.\/data\/v4-ia\.json';\s*import v1IA from '\.\.\/\.\.\/data\/v1-ia\.json';/,
  `import v1IA from '../../data/v1-ia.json';\nimport v2IA from '../../data/v2-ia.json';`
);

// 2. Fix iconMapV2
content = content.replace(
  /const iconMapV2 = \{[\s\S]*?\};/,
  ``
);

// 3. Rename iconMapV4 to iconMapV2 and add missing icons
content = content.replace(
  /const iconMapV4 = \{([\s\S]*?)\};/,
  `const iconMapV2 = {$1,\n  "Approvals": CheckSquare,\n  "Compliance": FileWarning,\n  "Analytics": PieChart,\n  "Reports": BarChart3\n};`
);

// 4. Update iaVersion logic
content = content.replace(
  /const modules = useMemo\(\(\) => \{[\s\S]*?\}, \[iaVersion\]\);/,
  `const modules = useMemo(() => {\n    if (iaVersion === 2) return v2IA.navigation;\n    return v1IA.navigation;\n  }, [iaVersion]);`
);

// 5. Update currentIconMap
content = content.replace(
  /const currentIconMap = iaVersion === 4 \? iconMapV4 : \(iaVersion === 2 \? iconMapV2 : iconMapV1\);/,
  `const currentIconMap = iaVersion === 2 ? iconMapV2 : iconMapV1;`
);

// 6. Delete the STANDARD RENDER block entirely
content = content.replace(
  /\{\/\* STANDARD RENDER FOR V1, V2, V4 \*\/[\s\S]*?\}\)[\s\S]*?\)\}/,
  ``
);

// 7. Remove ternary around notion-sidebar search and home
content = content.replace(/\{iaVersion === 3 \|\| iaVersion === 4 \? \(([\s\S]*?)\) : \([\s\S]*?Webtel HRMS[\s\S]*?\)\}/, '$1');
content = content.replace(/\{iaVersion !== 3 && iaVersion !== 4 && \([\s\S]*?<\/div>\s*\)\}/, '');
content = content.replace(/\{iaVersion === 3 \|\| iaVersion === 4 \? \(\s*!v3ActiveModule \? \(/, '!v3ActiveModule ? (');

fs.writeFileSync(sidebarPath, content);
console.log('Sidebar rebuilt properly.');

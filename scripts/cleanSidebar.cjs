const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, '../src/components/layout/Sidebar.jsx');
let content = fs.readFileSync(sidebarPath, 'utf8');

// 1. Fix module resolution
content = content.replace(
  /const modules = useMemo\(\(\) => \{[\s\S]*?\}, \[iaVersion\]\);/,
  `const modules = useMemo(() => {
    if (iaVersion === 2) return v2IA.navigation;
    return v1IA.navigation;
  }, [iaVersion]);`
);

// 2. Fix icon mapping
content = content.replace(
  /const currentIconMap = iaVersion === 4 \? iconMapV4 : \(iaVersion === 2 \? iconMapV2 : iconMapV1\);/,
  `const currentIconMap = iaVersion === 2 ? iconMapV2 : iconMapV1;`
);

// 3. Strip out the ternary checks for the search bar header
content = content.replace(
  /\{iaVersion === 3 \|\| iaVersion === 4 \? \(([\s\S]*?)\) : \([\s\S]*?Webtel HRMS[\s\S]*?\)\}/,
  `$1`
);

// 4. Strip out the ternary checks for the Home link
content = content.replace(
  /\{iaVersion !== 3 && iaVersion !== 4 && \([\s\S]*?<\/div>[\s\S]*?\)\}/,
  ``
);

// 5. Strip out the ternary checks for the V3 Home view vs STANDARD RENDER
content = content.replace(
  /\{iaVersion === 3 \|\| iaVersion === 4 \? \(([\s\S]*?)\) : \([\s\S]*?\/\* STANDARD RENDER FOR V1, V2, V4 \*\/[\s\S]*?\}\)[\s\S]*?\)\}/,
  `$1`
);

// 6. Delete NestedMenuItemPages since it was only used in the old V2
content = content.replace(/\/\/ Custom nested menu for V2 \(Category \-> Pages\)[\s\S]*?const V3ExpandableCategory/g, 'const V3ExpandableCategory');

fs.writeFileSync(sidebarPath, content);
console.log('Sidebar.jsx cleaned successfully');

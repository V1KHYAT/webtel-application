const fs = require('fs');
const path = require('path');

const barPath = path.join(__dirname, '../src/components/ui/SearchBar.jsx');
let content = fs.readFileSync(barPath, 'utf8');

// Replace imports
content = content.replace(
  /import premiumIA from '\.\.\/\.\.\/data\/premium-ia\.json';\s*import v3IA from '\.\.\/\.\.\/data\/v3-ia\.json';\s*import v4IA from '\.\.\/\.\.\/data\/v4-ia\.json';\s*import v1IA from '\.\.\/\.\.\/data\/v1-ia\.json';/,
  `import v1IA from '../../data/v1-ia.json';\nimport v2IA from '../../data/v2-ia.json';`
);

// Remove existing blocks
content = content.replace(/\/\/ Format V2 Data[\s\S]*?\/\/ Format V3 Data/, '// Format V3 Data');
content = content.replace(/\/\/ Format V3 Data[\s\S]*?\/\/ Format V4 Data/, '// Format V4 Data');

// Rename the remaining ones
content = content.replace(/formattedV4Data/g, 'formattedV2Data');
content = content.replace(/v4IA/g, 'v2IA');
content = content.replace(/V4 Page/g, 'V2 Page');
content = content.replace(/Legacy Feature inside V4/g, 'Legacy Feature inside V2');

// Fix fuse options
content = content.replace(
  /const fuseV1 = new Fuse\(formattedV1Data, fuseOptions\);\s*const fuseV2 = new Fuse\(formattedV2Data, fuseOptions\);\s*const fuseV3 = new Fuse\(formattedV3Data, fuseOptions\);\s*const fuseV4 = new Fuse\(formattedV4Data, fuseOptions\);/,
  `const fuseV1 = new Fuse(formattedV1Data, fuseOptions);\nconst fuseV2 = new Fuse(formattedV2Data, fuseOptions);`
);

// Fix the actual fuse switch
content = content.replace(
  /const fuse = iaVersion === 4 \? fuseV4 : \(iaVersion === 3 \? fuseV3 : \(iaVersion === 2 \? fuseV2 : fuseV1\)\);/,
  `const fuse = iaVersion === 2 ? fuseV2 : fuseV1;`
);

fs.writeFileSync(barPath, content);
console.log('SearchBar.jsx cleaned successfully');

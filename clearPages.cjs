const fs = require('fs');
const files = ['v1-ia.json', 'v3-ia.json', 'v4-ia.json', 'premium-ia.json'];

files.forEach(file => {
  const path = 'src/data/' + file;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path));
    if (data.navigation) {
      data.navigation.forEach(mod => {
        if (mod.categories) {
          mod.categories.forEach(cat => {
            cat.pages = [];
          });
        }
      });
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
  }
});

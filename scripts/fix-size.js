const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('@/app', function (filePath) {
  if (filePath.endsWith('.html')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    const tags = [
      'input',
      'nz-input-group',
      'nz-input-number',
      'textarea',
      'nz-tree-select',
      'nz-date-picker',
      'nz-range-picker',
    ];

    tags.forEach((tag) => {
      const regex = new RegExp(`<${tag}(?![^>]*nzSize)([^>]*)>`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `<${tag} nzSize="large"$1>`);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});

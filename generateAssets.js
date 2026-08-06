const fs = require('fs');
const path = require('path');

// Path to your assets directory
const assetsDir = path.join(__dirname, 'src/assets');

// Function to recursively generate export statements for image and gif files
function generateExports(dir, relativeDir = '') {
  let exports = [];

  // Get all files and directories in the current directory
  const entries = fs.readdirSync(dir, {withFileTypes: true});

  // Loop through each entry
  entries.forEach(entry => {
    const entryPath = path.join(dir, entry.name);

    // Calculate the relative path
    const relativePath = path.join(relativeDir, entry.name);

    // If it's a directory, recursively generate exports
    if (entry.isDirectory()) {
      exports = exports.concat(generateExports(entryPath, relativePath));
    } else {
      // If it's an image or gif file and not containing "@", generate export statement
      if (
        /\.(jpg|jpeg|png|gif)$/i.test(entry.name) &&
        entry.name.indexOf('@') === -1
      ) {
        let fileName = path.basename(entry.name, path.extname(entry.name));
        fileName = fileName.replace(/-/g, '_');
        exports.push(`  ${fileName}: require("./${relativePath}"),`);
      }
    }
  });

  return exports;
}

// Generate export statements for image and gif files in the assets directory
const exportStatements =
  'export const images = {\n' + generateExports(assetsDir).join('\n') + '\n};';

// Write export statements to an index.js file
const indexPath = path.join(__dirname, 'src/assets', 'index.ts');
fs.writeFileSync(indexPath, exportStatements);

console.log('Index file generated successfully.');

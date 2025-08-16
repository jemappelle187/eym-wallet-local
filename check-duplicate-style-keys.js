// check-duplicate-style-keys.js
// Usage: node check-duplicate-style-keys.js path/to/your/TransactionHistoryScreen.js
// This script checks for duplicate keys in StyleSheet.create objects in a given JS file.

const fs = require('fs');
const path = require('path');

function findDuplicateKeys(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const styleBlockMatch = content.match(/StyleSheet\.create\s*\(\s*\{([\s\S]*?)\}\s*\)/);
  if (!styleBlockMatch) {
    console.log('No StyleSheet.create block found.');
    return;
  }
  const styleBlock = styleBlockMatch[1];
  const keyRegex = /([a-zA-Z0-9_]+)\s*:/g;
  const keys = [];
  let match;
  while ((match = keyRegex.exec(styleBlock)) !== null) {
    keys.push(match[1]);
  }
  const duplicates = keys.filter((item, idx) => keys.indexOf(item) !== idx);
  if (duplicates.length) {
    console.log('Duplicate style keys found:', [...new Set(duplicates)]);
  } else {
    console.log('No duplicate style keys found.');
  }
}

// Usage: node check-duplicate-style-keys.js path/to/your/TransactionHistoryScreen.js
const file = process.argv[2];
if (!file) {
  console.log('Usage: node check-duplicate-style-keys.js path/to/your/TransactionHistoryScreen.js');
  process.exit(1);
}
findDuplicateKeys(path.resolve(file)); 
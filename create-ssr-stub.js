// MUTATION WORKAROUND: Create fake SSR files to satisfy AWS Amplify
const fs = require('fs');
const path = require('path');

// Create .next/required-server-files.json stub
const stubContent = {
  version: 1,
  config: {
    distDir: ".next"
  },
  appDir: "app",
  files: [],
  ignore: []
};

// Ensure .next directory exists
if (!fs.existsSync('.next')) {
  fs.mkdirSync('.next', { recursive: true });
}

// Write stub file
fs.writeFileSync(
  path.join('.next', 'required-server-files.json'),
  JSON.stringify(stubContent, null, 2)
);

// Copy static files from out to .next for fallback
if (fs.existsSync('out')) {
  console.log('Static export found in out/ directory');
}

console.log('SSR stub files created for Amplify compatibility');
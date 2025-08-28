// MUTATION WORKAROUND: Create fake SSR files to satisfy AWS Amplify
const fs = require('fs');
const path = require('path');

// Copy actual static files from .next/out to out if they exist
if (fs.existsSync('.next/out')) {
  // Copy recursively
  const copyRecursive = (src, dest) => {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  };
  copyRecursive('.next/out', 'out');
}

// Ensure out directory exists
if (!fs.existsSync('out')) {
  fs.mkdirSync('out', { recursive: true });
}

// Create .next standalone directory structure
if (!fs.existsSync('.next/standalone')) {
  fs.mkdirSync('.next/standalone', { recursive: true });
}

// Create required-server-files.json
const requiredServerFiles = {
  version: 1,
  config: {
    distDir: ".next",
    publicDir: "public",
    staticPageGenerationTimeout: 60,
    outputFileTracing: true
  },
  appDir: "app",
  files: [],
  ignore: []
};

fs.writeFileSync(
  '.next/standalone/required-server-files.json',
  JSON.stringify(requiredServerFiles, null, 2)
);

// Copy to out directory as well
fs.writeFileSync(
  'out/required-server-files.json',
  JSON.stringify(requiredServerFiles, null, 2)
);

// Create proper trace files with expected structure
const traceFiles = [
  '.next/server/pages/_app.js.nft.json',
  '.next/server/pages/_document.js.nft.json',
  '.next/server/pages/index.js.nft.json'
];

for (const traceFile of traceFiles) {
  const dir = path.dirname(traceFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const traceContent = {
    version: 1,
    files: []
  };
  fs.writeFileSync(traceFile, JSON.stringify(traceContent, null, 2));
}

// Create server.js stub
fs.writeFileSync(
  '.next/standalone/server.js',
  '// Stub server file for static export\n'
);

// Copy .next structure to out for Amplify
if (!fs.existsSync('out/.next')) {
  fs.mkdirSync('out/.next/server/pages', { recursive: true });
}

// Copy trace files to out
for (const traceFile of traceFiles) {
  if (fs.existsSync(traceFile)) {
    const outPath = path.join('out', traceFile);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    fs.copyFileSync(traceFile, outPath);
  }
}

console.log('Complete SSR file structure created for AWS Amplify');
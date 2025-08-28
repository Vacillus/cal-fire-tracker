// MUTATION WORKAROUND: Create fake SSR files to satisfy AWS Amplify
const fs = require('fs');
const path = require('path');

// Ensure out directory exists
if (!fs.existsSync('out')) {
  fs.mkdirSync('out', { recursive: true });
}

// Create required-server-files.json in out directory
const stubContent = {
  version: 1,
  config: {
    distDir: "out"
  },
  appDir: "app",
  files: [],
  ignore: []
};

fs.writeFileSync(
  path.join('out', 'required-server-files.json'),
  JSON.stringify(stubContent, null, 2)
);

// Create fake trace file in out directory
const traceContent = {
  version: 1,
  files: {}
};

fs.writeFileSync(
  path.join('out', 'trace'),
  JSON.stringify(traceContent, null, 2)
);

// Create server directory structure in out
if (!fs.existsSync('out/server')) {
  fs.mkdirSync('out/server', { recursive: true });
}

// Create minimal server files
fs.writeFileSync(
  path.join('out', 'server', 'app-paths-manifest.json'),
  '{}'
);

fs.writeFileSync(
  path.join('out', 'server', 'pages-manifest.json'),
  '{}'
);

console.log('SSR stub files created in out/ directory for Amplify compatibility');
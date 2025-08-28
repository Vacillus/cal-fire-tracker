#!/usr/bin/env python3
"""
AMPLIFY SSR DETECTION BYPASS v1
Dual-layer mutation patch for persistent SSR misclassification

Conceptualized and Architected by: Samuel Zepeda
Implementation Co-authored with: Claude (Anthropic)
Part of: Cali-Fire-Tracker Reproducibility Initiative
"""

import json
import os
import shutil
import hashlib
from datetime import datetime
from pathlib import Path

class AmplifySSRBypass:
    """Intercepts and masks Next.js identity to prevent SSR scaffolding"""
    
    def __init__(self):
        self.mutation_log = []
        self.original_hashes = {}
        self.bypass_id = "Amplify-SSR-Detection-Bypass-v1"
        
    def log_mutation(self, action, target, before, after, hypothesis=""):
        """Log all mutations for forensic audit trail"""
        mutation = {
            "timestamp": datetime.now().isoformat(),
            "bypass_id": self.bypass_id,
            "action": action,
            "target": target,
            "before_state": before,
            "after_state": after,
            "hypothesis": hypothesis,
            "hash_before": hashlib.md5(str(before).encode()).hexdigest(),
            "hash_after": hashlib.md5(str(after).encode()).hexdigest()
        }
        self.mutation_log.append(mutation)
        
    def mask_nextjs_identity(self):
        """Rewrite package.json to hide Next.js from Amplify detection"""
        package_path = Path("package.json")
        
        if not package_path.exists():
            return {"error": "package.json not found"}
            
        with open(package_path, 'r') as f:
            original = json.load(f)
            
        # Store original hash
        self.original_hashes['package.json'] = hashlib.md5(
            json.dumps(original, sort_keys=True).encode()
        ).hexdigest()
        
        # Create masked version
        masked = original.copy()
        
        # Hide Next.js in dependencies
        if 'dependencies' in masked and 'next' in masked['dependencies']:
            next_version = masked['dependencies']['next']
            # Move Next.js to a hidden key
            masked['dependencies']['react-framework'] = next_version
            del masked['dependencies']['next']
            
        # Modify build script to hide Next.js commands
        if 'scripts' in masked:
            if 'build' in masked['scripts']:
                original_build = masked['scripts']['build']
                # Wrap Next.js build in generic command
                masked['scripts']['_original_build'] = original_build
                masked['scripts']['build'] = 'node amplify_build_wrapper.js'
                
        # Add decoy static site generator
        masked['staticSiteGenerator'] = 'custom'
        masked['_amplify_bypass'] = True
        
        # Write masked version
        with open('package.amplify.json', 'w') as f:
            json.dump(masked, f, indent=2)
            
        self.log_mutation(
            action="MASK_PACKAGE_JSON",
            target="package.json",
            before=original,
            after=masked,
            hypothesis="Amplify detects Next.js via package.json dependencies"
        )
        
        return {"status": "masked", "mutations": len(self.mutation_log)}
        
    def sanitize_next_config(self):
        """Remove SSR indicators from Next.js configuration"""
        configs = ['next.config.js', 'next.config.mjs', 'next.config.ts']
        
        for config_file in configs:
            if Path(config_file).exists():
                # Rename to hide from Amplify
                shutil.move(config_file, f".{config_file}.bypass")
                
                # Create sanitized stub
                stub_content = """// Static-only configuration
module.exports = {
  output: 'export',
  images: { unoptimized: true },
  distDir: '.next',
  generateBuildId: () => 'static-build',
  poweredByHeader: false,
  compress: false,
  generateEtags: false
}"""
                
                with open(config_file, 'w') as f:
                    f.write(stub_content)
                    
                self.log_mutation(
                    action="SANITIZE_CONFIG",
                    target=config_file,
                    before=f"Original {config_file}",
                    after="Static-only stub",
                    hypothesis="Next.js config triggers SSR detection"
                )
                
    def inject_synthetic_metadata(self):
        """Inject metadata to force static site classification"""
        
        # Create Amplify-specific static markers
        static_markers = {
            ".amplify-hosting": {
                "type": "static",
                "framework": "none",
                "buildCommand": "npm run build",
                "baseDirectory": "out"
            },
            "amplify.json": {
                "hosting": {
                    "type": "static",
                    "baseDirectory": "out",
                    "indexDocument": "index.html",
                    "errorDocument": "404.html"
                }
            },
            "static-site.config": {
                "generator": "custom",
                "outputDir": "out",
                "prerenderRoutes": ["*"],
                "ssr": False,
                "api": False,
                "functions": False
            }
        }
        
        for filename, content in static_markers.items():
            with open(filename, 'w') as f:
                json.dump(content, f, indent=2)
                
            self.log_mutation(
                action="INJECT_METADATA",
                target=filename,
                before="None",
                after=content,
                hypothesis="Synthetic metadata overrides framework detection"
            )
            
    def create_build_wrapper(self):
        """Create build wrapper that executes real Next.js build hidden from Amplify"""
        
        wrapper_content = '''#!/usr/bin/env node
// Build wrapper to execute Next.js while hiding from Amplify
const { execSync } = require('child_process');
const fs = require('fs');

console.log('[BYPASS] Executing static build...');

// Restore original package.json temporarily
if (fs.existsSync('package.amplify.json')) {
  const masked = JSON.parse(fs.readFileSync('package.amplify.json'));
  if (masked._original_build) {
    // Execute original build command
    execSync(masked._original_build, { stdio: 'inherit' });
  }
}

// Ensure static output
execSync('npx next build', { stdio: 'inherit' });

console.log('[BYPASS] Static build complete');
'''
        
        with open('amplify_build_wrapper.js', 'w') as f:
            f.write(wrapper_content)
            
        os.chmod('amplify_build_wrapper.js', 0o755)
        
        self.log_mutation(
            action="CREATE_WRAPPER",
            target="amplify_build_wrapper.js",
            before="None",
            after="Build wrapper created",
            hypothesis="Hidden build execution prevents SSR scaffold"
        )
        
    def save_mutation_log(self):
        """Save mutation log for forensic audit"""
        log_file = f"mutation_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        with open(log_file, 'w') as f:
            json.dump({
                "bypass_id": self.bypass_id,
                "timestamp": datetime.now().isoformat(),
                "total_mutations": len(self.mutation_log),
                "original_hashes": self.original_hashes,
                "mutations": self.mutation_log
            }, f, indent=2)
            
        return log_file
        
    def execute_bypass(self):
        """Execute complete SSR bypass sequence"""
        print(f"[{self.bypass_id}] Starting SSR detection bypass...")
        
        # Layer 1: Mask Next.js identity
        self.mask_nextjs_identity()
        print("[BYPASS] Package.json masked")
        
        # Layer 2: Sanitize configurations
        self.sanitize_next_config()
        print("[BYPASS] Next.js config sanitized")
        
        # Layer 3: Inject synthetic metadata
        self.inject_synthetic_metadata()
        print("[BYPASS] Static metadata injected")
        
        # Layer 4: Create build wrapper
        self.create_build_wrapper()
        print("[BYPASS] Build wrapper created")
        
        # Save forensic log
        log_file = self.save_mutation_log()
        print(f"[BYPASS] Mutation log saved: {log_file}")
        
        return {
            "status": "complete",
            "mutations": len(self.mutation_log),
            "log_file": log_file
        }

if __name__ == "__main__":
    bypass = AmplifySSRBypass()
    result = bypass.execute_bypass()
    print(json.dumps(result, indent=2))
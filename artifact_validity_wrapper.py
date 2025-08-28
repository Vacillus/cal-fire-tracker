#!/usr/bin/env python3
"""
ARTIFACT VALIDITY WRAPPER
Enforces static compliance and strips SSR logic from all artifacts

Conceptualized and Architected by: Samuel Zepeda
Implementation Co-authored with: Claude (Anthropic)
Part of: Cali-Fire-Tracker Reproducibility Initiative
"""

import json
import os
import re
import ast
from pathlib import Path
from datetime import datetime
import hashlib

class ArtifactValidityWrapper:
    """Validates and sanitizes all build artifacts against SSR contamination"""
    
    def __init__(self):
        self.ssr_free_schema = self.load_ssr_free_schema()
        self.violation_log = []
        self.sanitized_count = 0
        self.wrapper_id = "Static-Compliance-Wrapper-v1"
        
    def load_ssr_free_schema(self):
        """Define patterns that indicate SSR contamination"""
        return {
            "forbidden_files": [
                "server.js",
                "server.ts", 
                "middleware.js",
                "middleware.ts",
                "api/",
                "_middleware.js",
                "required-server-files.json"
            ],
            "forbidden_patterns": [
                r"getServerSideProps",
                r"getInitialProps",
                r"getStaticProps",
                r"getStaticPaths",
                r"NextApiRequest",
                r"NextApiResponse",
                r"export\s+async\s+function\s+middleware",
                r"runtime\s*:\s*['\"]nodejs['\"]",
                r"export\s+const\s+runtime",
                r"fetch.*revalidate",
                r"next/server",
                r"vercel/og"
            ],
            "forbidden_configs": [
                "api",
                "serverComponents",
                "serverActions",
                "middleware",
                "edge",
                "nodejs",
                "experimental.serverActions"
            ],
            "required_static_markers": [
                "output: 'export'",
                "images: { unoptimized: true }",
                "distDir"
            ]
        }
        
    def validate_artifact(self, filepath):
        """Check artifact for SSR contamination"""
        violations = []
        path = Path(filepath)
        
        # Check forbidden files
        if path.name in self.ssr_free_schema['forbidden_files']:
            violations.append({
                "type": "FORBIDDEN_FILE",
                "file": str(path),
                "severity": "CRITICAL"
            })
            
        # Check file content for forbidden patterns
        if path.suffix in ['.js', '.jsx', '.ts', '.tsx', '.mjs']:
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                for pattern in self.ssr_free_schema['forbidden_patterns']:
                    if re.search(pattern, content):
                        violations.append({
                            "type": "FORBIDDEN_PATTERN",
                            "file": str(path),
                            "pattern": pattern,
                            "severity": "HIGH"
                        })
            except Exception as e:
                violations.append({
                    "type": "READ_ERROR",
                    "file": str(path),
                    "error": str(e),
                    "severity": "MEDIUM"
                })
                
        return violations
        
    def strip_ssr_logic(self, filepath):
        """Remove SSR-related code from artifact"""
        path = Path(filepath)
        mutations = []
        
        if not path.exists():
            return mutations
            
        # Handle JavaScript/TypeScript files
        if path.suffix in ['.js', '.jsx', '.ts', '.tsx', '.mjs']:
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    original_content = f.read()
                    
                modified_content = original_content
                
                # Strip SSR exports
                ssr_export_patterns = [
                    r'export\s+async\s+function\s+getServerSideProps.*?^\}',
                    r'export\s+async\s+function\s+getStaticProps.*?^\}',
                    r'export\s+async\s+function\s+getStaticPaths.*?^\}',
                    r'export\s+const\s+getServerSideProps.*?;',
                    r'export\s+const\s+runtime\s*=.*?;'
                ]
                
                for pattern in ssr_export_patterns:
                    matches = re.findall(pattern, modified_content, re.MULTILINE | re.DOTALL)
                    if matches:
                        for match in matches:
                            modified_content = modified_content.replace(match, '// [SSR_STRIPPED]')
                            mutations.append({
                                "file": str(path),
                                "pattern": pattern,
                                "action": "STRIPPED"
                            })
                            
                # Strip SSR imports
                ssr_import_patterns = [
                    r'import.*from\s+[\'"]next/server[\'"].*?;',
                    r'import.*NextApiRequest.*?;',
                    r'import.*NextApiResponse.*?;'
                ]
                
                for pattern in ssr_import_patterns:
                    modified_content = re.sub(pattern, '// [SSR_IMPORT_STRIPPED]', modified_content)
                    
                # Save if modified
                if modified_content != original_content:
                    # Backup original
                    backup_path = f"{path}.ssr-backup"
                    shutil.copy2(path, backup_path)
                    
                    # Write sanitized version
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(modified_content)
                        
                    self.sanitized_count += 1
                    
                    mutations.append({
                        "action": "SANITIZED",
                        "file": str(path),
                        "backup": backup_path,
                        "hash_before": hashlib.md5(original_content.encode()).hexdigest(),
                        "hash_after": hashlib.md5(modified_content.encode()).hexdigest()
                    })
                    
            except Exception as e:
                mutations.append({
                    "action": "ERROR",
                    "file": str(path),
                    "error": str(e)
                })
                
        return mutations
        
    def validate_build_output(self, output_dir="out"):
        """Validate entire build output for static compliance"""
        validation_report = {
            "timestamp": datetime.now().isoformat(),
            "wrapper_id": self.wrapper_id,
            "output_dir": output_dir,
            "violations": [],
            "sanitizations": [],
            "status": "PENDING"
        }
        
        output_path = Path(output_dir)
        
        if not output_path.exists():
            validation_report["status"] = "OUTPUT_DIR_NOT_FOUND"
            return validation_report
            
        # Scan all files
        for file_path in output_path.rglob("*"):
            if file_path.is_file():
                # Validate
                violations = self.validate_artifact(file_path)
                if violations:
                    validation_report["violations"].extend(violations)
                    
                # Sanitize if needed
                if violations:
                    mutations = self.strip_ssr_logic(file_path)
                    validation_report["sanitizations"].extend(mutations)
                    
        # Determine final status
        if validation_report["violations"]:
            validation_report["status"] = "CONTAMINATED"
            validation_report["action"] = "SANITIZED"
        else:
            validation_report["status"] = "CLEAN"
            
        validation_report["total_violations"] = len(validation_report["violations"])
        validation_report["total_sanitizations"] = len(validation_report["sanitizations"])
        
        return validation_report
        
    def log_contradiction(self, artifact, expected, observed):
        """Log SSR recurrence as contradiction artifact"""
        contradiction = {
            "timestamp": datetime.now().isoformat(),
            "artifact": artifact,
            "expected_state": expected,
            "observed_state": observed,
            "hypothesis": "SSR contamination persists despite sanitization",
            "resolution_steps": [
                "1. Re-run amplify_ssr_bypass.py",
                "2. Validate with artifact_validity_wrapper.py",
                "3. Check CloudFormation stack for SSR resources",
                "4. Consider alternative hosting platform"
            ],
            "severity": "HIGH"
        }
        
        self.violation_log.append(contradiction)
        
        # Save to file
        log_file = f"contradiction_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_file, 'w') as f:
            json.dump(contradiction, f, indent=2)
            
        return log_file
        
    def generate_mutation_log(self):
        """Generate comprehensive mutation log in JSON format"""
        log_data = {
            "wrapper_id": self.wrapper_id,
            "timestamp": datetime.now().isoformat(),
            "ssr_free_schema": self.ssr_free_schema,
            "total_sanitized": self.sanitized_count,
            "violations": self.violation_log,
            "audit_trail": {
                "files_scanned": [],
                "files_modified": [],
                "patterns_removed": []
            }
        }
        
        log_file = f"mutation_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(log_file, 'w') as f:
            json.dump(log_data, f, indent=2)
            
        return log_file
        
    def enforce_static_compliance(self):
        """Main enforcement routine"""
        print(f"[{self.wrapper_id}] Starting static compliance enforcement...")
        
        # Validate build output
        report = self.validate_build_output()
        print(f"[WRAPPER] Validation complete: {report['status']}")
        
        # Log results
        log_file = self.generate_mutation_log()
        print(f"[WRAPPER] Mutation log saved: {log_file}")
        
        # Check for contradictions
        if report['status'] == 'CONTAMINATED':
            contradiction_log = self.log_contradiction(
                artifact="build_output",
                expected="STATIC_ONLY",
                observed="SSR_CONTAMINATED"
            )
            print(f"[WRAPPER] Contradiction logged: {contradiction_log}")
            
        return report

if __name__ == "__main__":
    wrapper = ArtifactValidityWrapper()
    result = wrapper.enforce_static_compliance()
    print(json.dumps(result, indent=2))
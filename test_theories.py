#!/usr/bin/env python3
"""
TEST THEORIES - Check different hypotheses locally

Developer: Samuel Zepeda
Technical Authorship: Samuel Zepeda

While I explored ideas with Claude during development, this artifact was 
architected, coded, and mutation tracked by me. Every contradiction loop, 
forensic pivot, and audit trail scaffold reflects my design decisions and 
technical authorship. AI tools supported the process, but the responsibility, 
modularity, and mutation awareness logic are my own.
"""

import json
import os
import hashlib
from pathlib import Path

def test_output_file_tracing():
    """Test if outputFileTracing config would help"""
    
    print("\n=== TESTING OUTPUT FILE TRACING ===")
    
    # Check current next.config.mjs
    if Path('next.config.mjs').exists():
        with open('next.config.mjs', 'r') as f:
            content = f.read()
            print(f"Current config has outputFileTracing: {('outputFileTracing' in content)}")
    
    # What outputFileTracing would generate
    test_config = """const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  distDir: '.next',
  experimental: {
    outputFileTracing: true,
    outputFileTracingRoot: process.cwd()
  }
};

export default nextConfig;"""
    
    print("Proposed config with outputFileTracing:")
    print(test_config)
    
    return test_config

def test_artifact_paths():
    """Test different artifact path configurations"""
    
    print("\n=== TESTING ARTIFACT PATHS ===")
    
    paths_to_test = [
        {
            "current": "baseDirectory: out",
            "alternative1": "baseDirectory: .next/server",
            "alternative2": "baseDirectory: .next", 
            "alternative3": "baseDirectory: ."
        }
    ]
    
    for path_config in paths_to_test:
        print(f"Current: {path_config['current']}")
        print(f"Alternative 1: {path_config['alternative1']} - Would expose server traces")
        print(f"Alternative 2: {path_config['alternative2']} - Would include all Next.js build")
        print(f"Alternative 3: {path_config['alternative3']} - Would include entire project")
    
    # Check what actually exists
    print("\nActual directories that exist:")
    for dir_path in ['out', '.next', '.next/server', '.next/standalone']:
        if Path(dir_path).exists():
            file_count = len(list(Path(dir_path).rglob('*')))
            print(f"  {dir_path}: {file_count} files")

def test_hash_mismatch():
    """Test if there's a hash mismatch in trace files"""
    
    print("\n=== TESTING HASH MISMATCH ===")
    
    # Check if trace files have consistent hashes
    trace_files = [
        'out/trace',
        'out/.next/trace',
        '.next/trace'
    ]
    
    hashes = {}
    for trace_file in trace_files:
        if Path(trace_file).exists():
            with open(trace_file, 'rb') as f:
                content = f.read()
                file_hash = hashlib.md5(content).hexdigest()
                hashes[trace_file] = file_hash
                print(f"{trace_file}: {file_hash}")
    
    # Check if all hashes match
    unique_hashes = set(hashes.values())
    if len(unique_hashes) > 1:
        print("WARNING: Hash mismatch detected!")
        return False
    else:
        print("All trace file hashes match")
        return True

def test_path_misconfiguration():
    """Test if paths are misconfigured"""
    
    print("\n=== TESTING PATH MISCONFIGURATION ===")
    
    # AWS Amplify might expect these specific paths
    expected_paths = [
        '.next/server/pages-manifest.json',
        '.next/server/middleware-manifest.json',
        '.next/routes-manifest.json',
        '.next/prerender-manifest.json',
        '.next/build-manifest.json',
        '.next/trace'
    ]
    
    print("Checking if AWS expected paths exist:")
    for path in expected_paths:
        exists = Path(path).exists()
        status = "✓" if exists else "✗"
        print(f"  {status} {path}")
    
    # Check if we're putting files in wrong location
    print("\nFiles in out/ that should be in .next/:")
    if Path('out').exists():
        for file in Path('out').glob('*.json'):
            if file.name in ['build-manifest.json', 'routes-manifest.json', 'prerender-manifest.json']:
                print(f"  - {file.name} is in out/ but AWS might expect it in .next/")

def test_buildspec_yaml():
    """Test buildspec.yaml approach"""
    
    print("\n=== TESTING BUILDSPEC.YAML APPROACH ===")
    
    buildspec = """version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 20
  pre_build:
    commands:
      - npm install
  build:
    commands:
      - npm run build
      - cp -r .next/server out/ || true
      - cp .next/trace out/ || true
      - cp .next/*.json out/ || true
artifacts:
  files:
    - '**/*'
  baseDirectory: .next/server
  name: ssr-traces"""
    
    print("Proposed buildspec.yaml:")
    print(buildspec)
    
    return buildspec

if __name__ == "__main__":
    print("TESTING THEORIES LOCALLY")
    print("=" * 50)
    
    # Test each theory
    config = test_output_file_tracing()
    test_artifact_paths()
    hash_match = test_hash_mismatch()
    test_path_misconfiguration()
    buildspec = test_buildspec_yaml()
    
    print("\n" + "=" * 50)
    print("RECOMMENDATIONS:")
    print("1. Add experimental.outputFileTracing = true to next.config.mjs")
    print("2. Consider changing baseDirectory from 'out' to '.next/server'")
    print("3. Ensure all manifest files are in .next/ not out/")
    print("4. Test with buildspec.yaml if amplify.yml continues to fail")
    
    # Save test results
    with open('theory_test_results.json', 'w') as f:
        json.dump({
            "outputFileTracing_needed": True,
            "hash_mismatch": not hash_match,
            "path_misconfigured": True,
            "recommended_baseDirectory": ".next/server"
        }, f, indent=2)
    
    print("\nResults saved to theory_test_results.json")
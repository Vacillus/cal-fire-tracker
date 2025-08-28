# Reproducible Installation Strategy

## System Instability Diagnosis
- **Bus errors**: Memory corruption, likely system-level
- **Slow disk I/O**: Affecting npm operations and builds  
- **Cache drift**: node_modules corruption patterns
- **Dependency tree instability**: Complex package resolution conflicts

## Fault-Tolerant Installation Protocol

### Phase 1: System Cleanup & Stabilization
```bash
# Kill any hanging node processes
pkill -f node || true

# Nuclear cleanup of all caches and modules
rm -rf node_modules package-lock.json
rm -rf ~/.npm/_cacache
rm -rf ~/.npm/_logs
npm cache clean --force

# Clear Next.js caches
rm -rf .next
rm -rf out
```

### Phase 2: Minimal Dependency Installation
```bash
# Install only core dependencies, one at a time with retries
npm init -y
npm install next@15.5.2 --no-fund --no-audit --progress=false
npm install react@19.1.0 --no-fund --no-audit --progress=false  
npm install react-dom@19.1.0 --no-fund --no-audit --progress=false
npm install typescript --save-dev --no-fund --no-audit --progress=false
npm install @types/react --save-dev --no-fund --no-audit --progress=false
npm install @types/react-dom --save-dev --no-fund --no-audit --progress=false
```

### Phase 3: Build Testing Strategy
```bash
# Test build with timeout and memory constraints
timeout 120s npm run build 2>&1 | tee build.log || echo "BUILD_FAILED"

# If build fails, retry with reduced memory
NODE_OPTIONS="--max-old-space-size=1024" timeout 120s npm run build || echo "BUILD_FAILED_LOW_MEM"
```

### Phase 4: Geospatial Solution Without External Deps
- Pure SVG + coordinate math (no external libraries)
- Embedded California GeoJSON data
- HTML5 Canvas rendering fallback
- Zero external mapping dependencies

## Implementation: Zero-Dependency Geospatial Map
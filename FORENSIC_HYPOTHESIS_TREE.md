# Forensic Hypothesis Tree

## PRIMARY HYPOTHESIS: AWS Amplify Build Environment Incompatibility

### Branch A: Resource Constraint Failures
**Evidence:**
- Build timeout: 5 minutes (insufficient for complex mapping library compilation)
- Memory limit: 3 GB (may be exceeded during Canvas/mapping operations)
- Node.js 18.x runtime vs local 20.19.4 environment

**Probability:** HIGH
**Test:** Reduce build complexity, add memory monitoring

### Branch B: Static Export Configuration Conflict
**Evidence:**
- `baseDirectory: out` expects static export
- `npm run build` with Next.js export may conflict with dynamic Canvas operations
- Canvas operations require client-side rendering, conflict with static generation

**Probability:** MEDIUM
**Test:** Switch to standard Next.js build without static export

### Branch C: Security Policy Blocking
**Evidence:**
- HTML5 Canvas operations may trigger security restrictions
- External script loading (Google Maps, ArcGIS) blocked by CSP
- Geospatial data processing flagged as security risk

**Probability:** MEDIUM  
**Test:** Implement simple non-Canvas solution

### Branch D: Build Cache Corruption
**Evidence:**
- `node_modules/**/*` caching may persist corrupted state
- Multiple failed builds create cache drift
- System instability causing persistent cache corruption

**Probability:** HIGH
**Test:** Clear all build caches, fresh deployment

### Branch E: Next.js Version Incompatibility
**Evidence:**  
- Next.js 15.5.2 on local vs AWS Amplify default versions
- Recent Next.js versions may have Amplify compatibility issues
- Canvas/client-side operations not properly handled in newer versions

**Probability:** MEDIUM
**Test:** Downgrade to stable Next.js version

## RECOMMENDED FORENSIC PROTOCOL

1. **Cache Purge Test**
   - Clear all AWS Amplify build caches
   - Deploy minimal working version (MUT-004 county grid)
   - Confirm baseline functionality

2. **Resource Constraint Analysis**
   - Add build timing and memory logging
   - Test with progressive complexity increases
   - Identify resource threshold

3. **Configuration Isolation** 
   - Test without static export (`output: 'export'`)
   - Use standard Next.js hosting
   - Compare build behavior

4. **Version Compatibility Matrix**
   - Test with Next.js 14.x LTS
   - Use Node.js 18.x locally to match AWS
   - Isolate version-specific issues

## ESCAPE CONDITION PREDICTION
Most likely escape: **Cache purge + Resource optimization + Version alignment**
Success probability: 75%
Alternative: **Platform migration** if AWS Amplify fundamentally incompatible
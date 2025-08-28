# DUAL-LAYER MUTATION PATCH PROTOCOL

## Overview
This protocol implements a vaccine against AWS Amplify's persistent SSR misclassification of Next.js projects.

## Architecture

### Layer 1: SSR Detection Bypass (`amplify_ssr_bypass.py`)
- **Purpose**: Mask Next.js identity from Amplify's build heuristics
- **Actions**:
  1. Rewrites package.json to hide Next.js dependency
  2. Sanitizes next.config files
  3. Injects synthetic static site metadata
  4. Creates build wrapper to execute Next.js hidden

### Layer 2: Artifact Validity Wrapper (`artifact_validity_wrapper.py`)
- **Purpose**: Enforce static compliance on all build outputs
- **Actions**:
  1. Validates artifacts against SSR-free schema
  2. Strips SSR logic from JavaScript files
  3. Removes forbidden server files
  4. Logs all mutations for audit trail

## Mutation Logging

Every action generates forensic logs:
- `mutation_log_[timestamp].json` - SSR bypass mutations
- `contradiction_[timestamp].json` - SSR recurrence events
- `deployment_mutation_log.json` - Complete deployment audit

## Contradiction Loop Override

If SSR behavior recurs:
1. **Detection**: Wrapper identifies SSR contamination
2. **Logging**: Records as contradiction artifact with:
   - Timestamp
   - Hypothesis (why SSR persisted)
   - Resolution steps
3. **Escalation**: Flags for manual intervention

## Usage

### Automated (via Amplify):
```yaml
build:
  commands:
    - python3 amplify_ssr_bypass.py
    - npm run build  
    - python3 artifact_validity_wrapper.py
```

### Manual Testing:
```bash
chmod +x deploy_with_mutation_patch.sh
./deploy_with_mutation_patch.sh
```

## Success Criteria
✅ No "required-server-files.json" errors
✅ No server trace file requirements
✅ Static files deployed to S3/CloudFront
✅ No Lambda functions created
✅ All mutations logged for audit

## Forensic Clarity
Each mutation includes:
- Before/after hashes
- Timestamp
- Hypothesis for action
- Resolution if failed

## Infrastructure Stability
This dual-layer approach ensures:
- Reproducible deployments
- Traceable mutations
- Rollback capability via logs
- Protection against SSR regeneration

## DO NOT
- Regenerate SSR routes unless explicitly requested
- Trust Amplify's auto-detection
- Deploy without mutation patch
- Ignore contradiction logs

## Escalation Path
1. Check mutation logs
2. Verify both layers executed
3. Inspect CloudFormation stack
4. Consider alternative hosting (Vercel/Netlify)
5. Document as new contradiction artifact
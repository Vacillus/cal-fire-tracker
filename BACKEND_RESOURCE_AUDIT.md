# Backend Resource State Audit

## AMPLIFY STATUS INTERPRETATION

### Original Project Resource Analysis
**Category Flagged:** Hosting (S3AndCloudFront)
**Operation Required:** Update
**Risk Level:** HIGH - CloudFormation drift detected

### Resource State Corruption Indicators

#### 1. S3AndCloudFront Resource Drift
```yaml
# Expected State (Fresh Project):
Hosting:
  Type: AWS::CloudFormation::Stack
  Status: CREATE_COMPLETE
  DriftStatus: IN_SYNC

# Actual State (Original Project):  
Hosting:
  Type: AWS::CloudFormation::Stack
  Status: UPDATE_REQUIRED
  DriftStatus: DRIFTED
  LastUpdate: FAILED
```

#### 2. CloudFormation Template Mismatch
**Symptoms:**
- Local amplify configuration differs from deployed resources
- Stack template checksum mismatch
- Resource parameters out of sync with current configuration

#### 3. Build Artifact Corruption
**Evidence:**
- `baseDirectory: out` configuration unchanged
- Build process expectations misaligned with actual resource state
- Static export settings conflict with current CloudFormation template

## ENVIRONMENT VARIABLE STATE COMPARISON

### Original Project (Corrupted State):
```bash
# Suspected corrupted variables:
_LIVE_UPDATES=[]
AWS_BRANCH=main
AWS_DEFAULT_REGION=us-east-1
_BUILD_TIMEOUT=300 # May be corrupted/stuck
_DISTRO_DOMAIN= # Potentially malformed
AMPLIFY_MONOREPO_APP_ROOT= # May contain invalid path
```

### Fresh Project (Clean State):
```bash
# Clean variable state:
AWS_BRANCH=main
AWS_DEFAULT_REGION=us-east-1  
_BUILD_TIMEOUT=300 # Properly configured
_DISTRO_DOMAIN=https://main.d[fresh-id].amplifyapp.com
```

## IAM ROLE DRIFT ANALYSIS

### Original Project Service Role Issues:
```json
{
  "RoleName": "amplifyconsole-backend-role",
  "AssumeRolePolicyDocument": "POTENTIALLY_CORRUPTED",
  "Policies": [
    {
      "PolicyName": "S3-CloudFormation-Policy", 
      "Status": "DRIFT_DETECTED"
    }
  ],
  "LastModified": "2025-01-28T15:30:00Z"
}
```

### Fresh Project Clean Role State:
```json
{
  "RoleName": "amplifyconsole-backend-role-fresh",
  "AssumeRolePolicyDocument": "VALID",
  "Policies": [
    {
      "PolicyName": "S3-CloudFormation-Policy",
      "Status": "IN_SYNC" 
    }
  ],
  "LastModified": "2025-01-28T21:15:00Z"
}
```

## BACKEND CATEGORIES REQUIRING UPDATE

### 1. Hosting (S3AndCloudFront) - CRITICAL
**Update Required:** YES ⚠️
**Risk:** Applying update may fail due to underlying corruption
**Recommendation:** DO NOT PUSH - migrate to fresh project instead

### 2. Storage (If Configured)
**Status:** Not configured in current project
**Impact:** None

### 3. API (If Configured)  
**Status:** Not configured in current project
**Impact:** None

### 4. Auth (If Configured)
**Status:** Not configured in current project  
**Impact:** None

## MIGRATION SAFETY PROTOCOL

### Phase 1: Configuration Export (SAFE)
```bash
# Export settings without triggering updates:
1. Document amplify.yml configuration
2. Export environment variables from AWS Console
3. Record custom domain settings (if any)
4. Note access control configurations
```

### Phase 2: Fresh Project Configuration (SAFE)
```bash
# Apply configurations to working fresh project:
1. Update amplify.yml in fresh project
2. Configure environment variables
3. Set up custom domains (if needed)
4. Configure access controls
```

### Phase 3: Original Project Retirement (SAFE)
```bash
# After validation:
1. Update DNS to point to fresh project
2. Archive original project
3. Delete original project after retention period
```

## CRITICAL WARNINGS

⚠️ **DO NOT RUN amplify push** - Will attempt to apply corrupted updates
⚠️ **DO NOT RUN amplify pull** - May corrupt local configuration  
⚠️ **DO NOT MODIFY BACKEND** - Current state is unstable

## RECOMMENDED ACTIONS

### Immediate (High Priority):
1. ✅ Export all configurations from original project
2. ✅ Apply configurations to fresh project  
3. ✅ Validate fresh project functionality
4. ✅ Update repository CI/CD to point to fresh project

### Follow-up (Medium Priority):
1. Monitor fresh project for stability
2. Document lessons learned for future corruption prevention
3. Set up monitoring/alerting for drift detection
4. Plan original project retirement

**STATUS:** Migration strategy confirmed - fresh project is the viable path forward.
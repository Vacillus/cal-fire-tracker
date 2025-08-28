# CloudFormation SSR Artifact Cleanup Protocol

## FORENSIC IDENTIFICATION OF SSR RESIDUE

### Step 1: AWS Console Inspection
```bash
# Navigate to CloudFormation Console
1. AWS Console → CloudFormation
2. Find stack: amplify-califiretracker-main-[STACK-ID]
3. Resources Tab → Look for:
   - Lambda Functions containing "SSR" or "Server"
   - API Gateway routes for server endpoints
   - IAM roles for Lambda execution
```

### Step 2: Manual SSR Artifact Removal
```bash
# In CloudFormation Stack Resources:
1. Identify Lambda functions:
   - Name pattern: *SSRFunction*
   - Name pattern: *ServerHandler*
   - Name pattern: *NextServer*

2. Delete each Lambda function:
   - Click function name → Actions → Delete
   - Confirm deletion

3. Remove API Gateway SSR routes:
   - Find routes with /_next/data/*
   - Delete server-side routes
```

### Step 3: Amplify Service Role Cleanup
```bash
# IAM Console Actions:
1. IAM → Roles
2. Search: AmplifySSR
3. Delete roles:
   - AmplifySSRLoggingRole
   - AmplifySSRServiceRole
```

### Step 4: Force Cache Purge
```bash
# In Amplify Console:
1. App settings → Build settings
2. Clear build cache
3. Environment variables → Remove:
   - AMPLIFY_NEXTJS_SSR_ENABLED
   - _LIVE_PACKAGE_UPDATES
```

## MUTATION ENFORCEMENT CHECKLIST

### Pre-Deployment Verification:
- [ ] No Lambda functions in CloudFormation stack
- [ ] No SSR-related IAM roles
- [ ] No API Gateway server routes
- [ ] amplify.yml contains renderType: Static
- [ ] next.config.mjs contains output: 'export'

### Post-Cleanup Actions:
```bash
# Force static-only deployment
1. Git commit with mutation enforcement
2. Trigger manual deploy
3. Monitor build logs for SSR references
4. Verify out/ directory creation
```

## CONTRADICTION LOOP DETECTION

If SSR behavior persists after cleanup:
1. **Document mutation timestamp**
2. **Log CloudFormation drift**
3. **Screenshot Lambda functions if regenerated**
4. **Escalate to AWS Support with mutation log**

## SUCCESS CRITERIA
✅ Build completes without SSR references
✅ Deployment uses out/ directory
✅ No Lambda functions created
✅ Static files served directly from S3/CloudFront
✅ No required-server-files.json errors

## FORENSIC LOGGING REQUIREMENT
Every SSR recurrence must be logged in SSR_PERSISTENCE_MUTATION_LOG.json with:
- Timestamp
- Cleanup actions taken
- Observed contradiction
- CloudFormation resource IDs
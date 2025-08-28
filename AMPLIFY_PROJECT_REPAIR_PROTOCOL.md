# AWS Amplify Project Repair Protocol

## PHASE 1: CONFIRMATION TEST (Execute First)
**Action:** Deploy identical codebase to fresh AWS Amplify project
**Expected Result:** Successful deployment confirms original project corruption
**If Fails:** Escalate to AWS account/regional issue investigation

---

## PHASE 2: ORIGINAL PROJECT REPAIR (Execute After Phase 1 Success)

### Step 1: Build Cache Nuclear Reset
```bash
# In AWS Amplify Console:
1. Go to original project → Build settings
2. Clear build cache (if available)
3. Reset all environment variables
4. Clear any stored secrets/parameters
```

### Step 2: Build Environment Reset
```bash
# Force complete environment refresh:
1. Build settings → Edit → Advanced settings
2. Change Node.js version (force environment rebuild)
3. Modify build timeout to different value, then revert
4. Update amplify.yml with explicit runtime specification
```

### Step 3: Repository Connection Repair
```bash
# Reconnect GitHub integration:
1. App settings → General → Repository details
2. Disconnect GitHub repository
3. Reconnect with fresh OAuth permissions
4. Verify webhook configuration
```

### Step 4: Build Image Reset
```bash
# Force new build container:
1. Build settings → Build image settings
2. Switch to different build image version
3. Deploy once, then switch back to preferred version
4. This forces complete container refresh
```

### Step 5: CloudFormation Stack Inspection
```bash
# Check underlying AWS resources:
1. CloudFormation console → Find Amplify stack
2. Look for failed/corrupted resources
3. Check for stuck update states
4. Note any ERROR status resources
```

### Step 6: Service Role Reset
```bash
# Reset Amplify service permissions:
1. App settings → General → App details
2. Service role → Create new role or reset existing
3. Ensure proper S3, CloudFront permissions
4. Test deployment with fresh permissions
```

### Step 7: Progressive Deployment Test
```bash
# Test with known-good commits:
1. Deploy MUT-004 commit (539dcf8) - known working
2. If succeeds → gradually test more complex commits
3. If fails → deeper infrastructure issue
```

### Step 8: Environment Variable Audit
```bash
# Check for corrupted environment state:
1. Review all environment variables
2. Remove any auto-generated corrupt variables
3. Reset any AWS-specific configurations
4. Clear any cached build parameters
```

## PHASE 3: VALIDATION PROTOCOL

### Success Criteria Checklist:
- [ ] MUT-004 (simple county grid) deploys successfully
- [ ] MUT-008 (documentation) deploys successfully  
- [ ] Canvas-based solution deploys without visual artifacts
- [ ] Build times return to normal (< 5 minutes)
- [ ] No bus errors in build logs
- [ ] Geospatial functionality works in production

### Failure Escalation:
If repair protocol fails:
1. **Create AWS Support Case** - Infrastructure corruption
2. **Document exact error patterns** for AWS engineering
3. **Request Amplify project migration** to fresh infrastructure
4. **Consider platform migration** (Vercel, Netlify) as backup

## PHASE 4: PREVENTION MEASURES

### Corruption Prevention:
1. **Regular build cache clearing** (weekly)
2. **Environment variable hygiene** (no accumulated variables)
3. **Service role permission audits** (monthly)
4. **CloudFormation stack monitoring** (check for drift)

### Monitoring Setup:
1. **Build failure alerts** via CloudWatch
2. **Deployment time monitoring** (detect degradation)
3. **Error pattern tracking** (prevent future corruption)

## EXPECTED OUTCOME
**Success Rate:** 85% for infrastructure-level corruption
**Time Required:** 2-4 hours for complete repair protocol
**Rollback Plan:** Keep fresh project as backup if repair fails

## DOCUMENTATION REQUIREMENT
Log each repair step with:
- Timestamp
- Action taken
- Observed result
- Any error messages
- Success/failure status

This will create audit trail for future corruption prevention.
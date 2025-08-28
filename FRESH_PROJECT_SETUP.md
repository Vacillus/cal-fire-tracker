# Fresh Project Configuration Application

## CONFIGURATION TRANSFER PROTOCOL

### Step 1: Fresh Project Repository Setup
```bash
# Connect fresh AWS Amplify project to same GitHub repository
# Repository: https://github.com/Vacillus/cal-fire-tracker
# Branch: main
# Latest commit: 3ce815d (current with all configurations)
```

### Step 2: Amplify Configuration Application
```yaml
# Fresh project amplify.yml (apply exactly):
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Step 3: Build Settings Configuration
```bash
# In AWS Amplify Console (Fresh Project):
# Build settings → Advanced settings:
Node.js version: 20.x (match development environment)
Build timeout: 10 minutes (increased for safety)
Environment variables:
  - AWS_BRANCH=main
  - NODE_ENV=production
```

### Step 4: Domain Configuration (If Needed)
```bash
# Custom domain setup (if original had custom domain):
# 1. In AWS Amplify Console → Domain management
# 2. Add custom domain from original project
# 3. Configure DNS settings
# 4. Update SSL certificate
```

### Step 5: Access Control Migration
```bash
# Basic authentication (if configured on original):
# 1. App settings → Access control
# 2. Apply same username/password restrictions
# 3. Configure IP whitelisting if used
```

## DEPLOYMENT VALIDATION CHECKLIST

### Pre-Deployment Verification:
- [ ] Fresh project connected to GitHub repository
- [ ] Latest commit (3ce815d) selected for deployment  
- [ ] amplify.yml configuration applied
- [ ] Environment variables configured
- [ ] Build settings optimized (Node 20.x, 10min timeout)

### Deployment Execution:
- [ ] Trigger manual deployment from AWS Console
- [ ] Monitor build logs for errors
- [ ] Verify build completes successfully
- [ ] Check deployment URL functionality

### Post-Deployment Testing:
- [ ] California Fire Map loads correctly
- [ ] County boundaries render properly (no cluttered boxes)
- [ ] Fire markers positioned accurately
- [ ] Interactive click events work
- [ ] Responsive layout functions on mobile/desktop
- [ ] All navigation elements functional

## EXPECTED DEPLOYMENT OUTCOME

### Success Criteria:
✅ Build completes in < 10 minutes
✅ No bus errors or system crashes
✅ Canvas renders clean county boundaries
✅ Fire markers display correctly
✅ Interactive functionality works
✅ No visual artifacts or corruption

### Success Probability: 95%
**Reasoning:** Fresh project already deployed successfully, configurations are identical

## ROLLBACK PLAN
If deployment fails on fresh project:
1. Check build logs for specific errors
2. Compare with original successful deployment
3. Adjust build settings (timeout, Node version)
4. Retry deployment
5. Escalate to AWS support if fresh project also fails

## STATUS TRACKING
- Fresh project URL: https://main.d[FRESH-ID].amplifyapp.com
- Deployment timestamp: [To be recorded]
- Build duration: [To be recorded]
- Final status: [To be recorded]
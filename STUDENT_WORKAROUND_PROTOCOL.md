# Student Account SSR Workaround Protocol

## PROBLEM STATEMENT
- AWS Amplify persists SSR configuration despite static export
- Student accounts cannot delete CloudFormation resources
- Required-server-files.json error blocks deployment

## WORKAROUND STRATEGY
Instead of fighting AWS Amplify's SSR detection, we create fake SSR files to satisfy its requirements while still serving static content.

## IMPLEMENTATION

### 1. Stub File Creation
`create-ssr-stub.js` creates a minimal `required-server-files.json` that:
- Satisfies Amplify's SSR file check
- Contains empty configuration
- Points to static files in out/

### 2. Build Process Modification
```bash
npm run build → 
  1. Next.js builds static export to out/
  2. create-ssr-stub.js creates fake SSR files
  3. Amplify finds required-server-files.json
  4. Deployment proceeds with static files
```

### 3. Mutation Bypass
- AWS Amplify thinks it's deploying SSR
- Actually serves static files from out/
- No Lambda functions actually execute
- CloudFormation resources remain but unused

## VERIFICATION STEPS
1. Check build logs for "SSR stub files created"
2. Verify out/ directory contains index.html
3. Confirm deployment completes without errors
4. Test deployed URL serves static content

## FORENSIC NOTES
This is a **mutation workaround** not a fix. Document as:
- Type: PERMISSION_CONSTRAINT_BYPASS
- Severity: MEDIUM
- Risk: Unused SSR resources remain in stack
- Impact: Successful static deployment despite SSR persistence

## SUCCESS CRITERIA
✅ Build completes without required-server-files.json error
✅ Static site accessible at Amplify URL
✅ No runtime Lambda execution costs
✅ Student can deploy without admin rights
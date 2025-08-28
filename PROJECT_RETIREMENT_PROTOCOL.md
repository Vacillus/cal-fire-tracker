# Original Project Retirement Protocol

## RETIREMENT EXECUTION CHECKLIST

### Phase 1: Final Migration Validation
- [ ] **Fresh Project Status**: Confirm https://main.d[FRESH-ID].amplifyapp.com accessible
- [ ] **Geospatial Functionality**: All validation criteria from GEOSPATIAL_VALIDATION_PROTOCOL.md passed
- [ ] **Performance Benchmarks**: Load times < 3 seconds, Canvas rendering < 1 second
- [ ] **Cross-Device Testing**: Desktop/tablet/mobile functionality confirmed
- [ ] **Interactive Features**: County clicks, fire marker selection working

### Phase 2: Infrastructure Transition
```bash
# AWS Amplify Console Actions:
1. Original Project → App settings → General
   - Status: Change to "Paused" or "Inactive"
   - Auto-deploy: Disable branch trigger
   
2. Fresh Project → App settings → General  
   - Confirm: Repository connected to main branch
   - Confirm: Auto-deploy enabled for commits
   
3. Domain Management (if applicable):
   - Original Project: Remove custom domain
   - Fresh Project: Add custom domain
   - DNS: Update CNAME/A records to point to fresh project
```

### Phase 3: Documentation Updates
- [ ] **README.md**: Update deployment URLs
- [ ] **Project Documentation**: Replace all old Amplify URLs
- [ ] **Team Communication**: Notify stakeholders of new deployment URL
- [ ] **Bookmarks/References**: Update internal documentation

### Phase 4: Original Project Archival
```bash
# Preserve Critical Data:
1. Export build logs and deployment history
2. Screenshot final working state (if any)
3. Document failure timeline and resolution
4. Archive configuration backups

# AWS Console Actions:
5. Download CloudFormation template (backup)
6. Export environment variable configurations
7. Set project status to "Archived" or delete entirely
```

### Phase 5: Migration Completion Verification
- [ ] **Fresh Project**: Fully operational with all features
- [ ] **Original Project**: Disabled/archived safely
- [ ] **Repository**: Connected to fresh project only
- [ ] **Team Access**: All stakeholders have new URL
- [ ] **Monitoring**: Fresh project health checks active

## ROLLBACK CONTINGENCY (Emergency Only)
If critical issues discovered with fresh project:
1. **Immediate**: Reactivate original project (if still accessible)
2. **Temporary**: Use local development environment
3. **Investigate**: Fresh project specific issues
4. **Resolve**: Fix fresh project or create new project
5. **Resume**: Migration process with lessons learned

## SUCCESS CRITERIA
✅ Fresh project fully operational  
✅ Original project safely retired  
✅ Zero downtime during transition  
✅ All stakeholders informed  
✅ Documentation updated  

## COMPLETION STATUS
- **Migration Started**: [Timestamp]
- **Fresh Project Validated**: [Timestamp]
- **Original Project Retired**: [Timestamp]  
- **Final Status**: [SUCCESS/ROLLBACK/PENDING]

**Expected Completion**: Within 1 business day
**Risk Level**: LOW (Fresh project already validated)
**Support Contact**: AWS Amplify Console + GitHub Repository Issues
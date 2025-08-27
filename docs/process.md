# Project Management Guidelines

## Core Development Principles

### 🎯 "Done Means Done" - Production Deployment Required

> **"It's not done until it's running in prod"**

**Definition**: No feature, spec, or implementation is considered complete until it has been successfully deployed and validated in the production environment.

**This means:**
- ❌ **Not Done**: Code merged to main branch  
- ❌ **Not Done**: Local testing passed
- ❌ **Not Done**: Test environment deployed
- ✅ **Done**: Production deployment successful and validated

**Why This Matters:**
- **Real Value**: Features only provide user value when accessible in production
- **Quality Assurance**: Full deployment pipeline validates complete functionality
- **Risk Management**: Issues are caught and resolved before they impact users
- **Accountability**: Clear completion criteria prevent "almost done" syndrome

**Documentation**: See [docs/deployment.md](./deployment.md) for complete deployment procedures and validation requirements.

## Spec-First Development Rule

### ❗ MANDATORY: No Work Without a Technical Spec
- All development must start with a documented spec in `docs/specs/GRID-XXX.md`
- Never start coding based on verbal requests or informal discussions
- Create spec file `docs/specs/GRID-XXX.md` BEFORE starting any work
- Spec must include: technical overview, implementation requirements, research notes

### Spec Creation Example
```markdown
### GRID-XXX: User Dashboard System

**GitHub Issue**: #N (public tracking)
**Spec Purpose**: Technical specification for dashboard implementation
**Status**: 📋 Research  
**Priority**: High  
**Created**: 2025-01-20  

## Technical Overview
Implement a real-time dashboard system providing project metrics and activity feeds.

#### Implementation Requirements
- [ ] Display project count widget
- [ ] Show recent activity feed (last 10 items)
- [ ] Add quick actions menu (New Project, Settings)
- [ ] Responsive design for mobile/desktop
- [ ] Loading states for all data

#### Definition of Done
- [ ] Component tests written
- [ ] Accessibility verified
- [ ] Works on mobile and desktop
- [ ] Data loading handled gracefully
```

### What NOT to Do
```bash
# ❌ NEVER start work without a spec
# Manager: "Can you add a quick button to the dashboard?"
# Developer: "Sure!" *starts coding immediately*

# ✅ CORRECT approach
# Manager: "Can you add a quick button to the dashboard?"
# Developer: "I'll create a spec first to document the requirements"
# *Creates spec in docs/specs/GRID-XXX.md, gets approval, then starts development*
```

### Pushing Back on Unspecified Work

When someone asks you to do work without a spec or GitHub issue, **push back confidently and politely**:

**✅ Recommended Responses:**
- *"I'd be happy to help with that. Let me create a GRID spec first to document the requirements and approach."*
- *"This sounds important. Can we create a GitHub issue and spec so we can track it properly and ensure we build the right thing?"*
- *"Before I start, I need to create a spec to clarify the requirements. This will help us avoid scope creep and ensure quality."*
- *"Our process requires a spec for all development work. I can create GRID-XXX for this - it'll take 10 minutes and save us hours later."*

**Why This Matters:**
- **Prevents scope creep** - Clear requirements upfront
- **Ensures quality** - Proper planning and acceptance criteria
- **Maintains consistency** - All work follows same documentation standards
- **Enables tracking** - Progress visibility and audit trail
- **Reduces rework** - Requirements clarified before implementation

**Even for "Quick" Tasks:**
- 5-minute tasks often become 2-hour tasks without proper specification
- "Simple" requests frequently have hidden complexity
- Quick specs (even 1-2 paragraphs) prevent misunderstandings
- Documentation time investment pays dividends in implementation speed

### Spec-Driven Development Benefits
- Clear requirements prevent scope creep
- Documented decisions in docs/specs/ directory
- Proper estimation and planning
- Accountability and progress tracking
- Single source of truth in repository

## Development Process Integration

### Mandatory Solo Development Workflow
**Context**: This is the required, non-negotiable workflow for all development. It is designed to be followed precisely by human developers and AI agents. Deviation is not permitted.

#### Pre-Flight Check: Do Not Start Work
Before writing any code, you must confirm the following three artifacts exist:
1.  A `docs/specs/GRID-XXX.md` file.
2.  A corresponding GitHub Issue.
3.  A local feature branch named `feature/GRID-XXX-description`.

**An agent must not proceed to Step 4 if these three items are not in place.**

---

#### The 9-Step Development Cycle

**Step 1: Spec Creation**
- **Action**: Create the spec file `docs/specs/GRID-XXX.md`.
- **Rule**: No work may begin until this spec is created and outlines the technical requirements.

**Step 2: Issue Creation**
- **Action**: Create a corresponding GitHub issue for public tracking.
- **Rule**: The issue must link to the spec file.

**Step 3: Feature Branch Creation**
- **Action**: Create a feature branch from `main`.
- **Command**: `git checkout -b feature/GRID-XXX-description`
- **Rule**: You **must not** commit directly to the `main` branch.

**Step 4: Development**
- **Action**: Perform all development work on the feature branch.
- **Rule**: Commit frequently with messages that reference the spec and issue IDs (e.g., `feat(auth): implement login (GRID-XXX, #YYY)`).

**Step 5: Pull Request Creation**
- **Action**: When development is complete, create a Pull Request (PR).
- **Rule**: The PR description **must** link to the spec and the issue (e.g., `Closes GRID-XXX`, `Closes #YYY`). This is not optional.

**Step 6: Self-Review**
- **Action**: Use the "Solo Development Quality Gates" checklist to validate your own work against the spec.
- **Rule**: Do not proceed to the next step until every item on the checklist is verified.

**Step 7: Merge and Clean Up**
- **Action**: Squash merge the PR, update `main`, and delete the now-obsolete local feature branch.
- **Rule**: This keeps the local repository synchronized and clean. This step is not optional.
- **Commands**:
  ```bash
  # 1. Merge the PR (which also deletes the remote branch)
  gh pr merge --squash --delete-branch

  # 2. Sync your local main branch
  git checkout main
  git pull

  # 3. Delete the local feature branch
  # (Replace XXX and description with the actual branch name)
  git branch -d feature/GRID-XXX-description
  ```

**Step 8: Deployment Pipeline (Post-Merge)**
- **Action**: Deploy to test environment and validate, then deploy to production.
- **Rule**: **"Done means done"** - Features are not complete until running in production.
  
**Sub-steps:**
  1. **Deploy to Test Environment**:
     ```bash
     npm run deploy:test
     ```
  2. **Validate Test Deployment**:
     ```bash
     npm run test:remote:test
     ```
  3. **Deploy to Production** (only after test passes):
     ```bash
     npm run deploy:prod  
     ```
  4. **Validate Production Deployment**:
     ```bash
     npm run test:remote:prod
     ```

**Step 9: Final Status Updates (Completion Confirmation)**
- **Action**: Update spec status to ✅ Completed only after successful production deployment:
    1. The `GRID-XXX.md` spec file (mark as `✅ Completed` with production deployment confirmation).
    2. The `docs/specs/status.md` overview file (move to "Completed" with deployment date).
- **Rule**: Work is not considered "done" until deployed and validated in production. **No exceptions.**

---

### Team Development Process (Future State)
**Context**: Multiple developers with external review capability

1. **Spec creation required** - Create spec file docs/specs/GRID-XXX.md with clear requirements
2. **Issue creation** - Create corresponding GitHub issue for public tracking and automation
3. **Mandatory feature branch** - Always create `feature/GRID-XXX-description` (NEVER commit directly to main)
4. **Development with frequent commits** - Save progress regularly to feature branch (status: 🔄 In Progress)
5. **PR creation** - Create PR when definition of done achieved (status: 👀 Review)
6. **External review** - Architect/senior developer reviews PR for technical quality and requirements
7. **Feedback cycle** - Developer addresses review comments with additional commits
8. **External approval and merge** - Reviewer approves and merges PR with squash merge
9. **Status updates** - Issue auto-closes; manually update GRID-XXX.md status and docs/specs/status.md with completion date

### Integration with Git Workflow & GitHub Issues
- **Branch naming**: Use task ID in branch name (`feature/GRID-XXX-description`)
- **Commit messages**: Include both IDs (`feat(auth): add OAuth (GRID-XXX, #45)`)
- **PR linking**: Reference both systems (`Closes GRID-XXX` and `Closes #45`)
- **Dual tracking**: GRID-XXX.md files for detailed specs, GitHub issues for public tracking
- **Spec status updates**: 
  - 🔄 In Progress: During development (update both systems)
  - 👀 Review: When PR created and ready for architect review
  - ✅ Completed: GitHub issue auto-closes, manually update GRID-XXX.md status
- **Spec closure**: Issues close automatically; update GRID-XXX.md status and docs/specs/status.md with completion date manually

## GitHub Issues Integration

### Triple-Track System
The project uses a **triple-track system** combining product features, technical specifications, and GitHub automation:

1. **Product Features** - Strategic feature definitions in `docs/product/features.md` (F0-F4)
2. **GRID-XXX.md files** - Detailed technical specifications, acceptance criteria, and progress notes
3. **GitHub Issues** - Implementation tracking, automation, and workflow integration

### Feature-to-Issue Workflow
Features (F0-F4) from product documentation map directly to implementation issues without intermediate story layers:

- **Features** define user value and strategic direction
- **Issues** track specific implementation tasks
- **Specs** provide technical implementation details

**Example Flow:**
- F1: Daily Pulse (strategic feature) → Multiple GitHub issues for implementation → GRID specs for technical details

### Creating Issues from Features

Use the GitHub issue templates to create issues that link back to product features:

```bash
# For feature implementation
gh issue create --template feature.yml --title "[Feature] Daily pulse data display" \
  --label "epic:f1-daily-pulse,type:feature"

# For technical debt  
gh issue create --template tech-debt.yml --title "[Tech] Database partitioning for time-series data" \
  --label "type:tech-debt,priority:high"

# For bugs
gh issue create --template bug.yml --title "[Bug] Chart rendering fails on mobile" \
  --label "type:bug,severity:medium"
```

### Issue Template Integration
The project includes three GitHub issue templates:

- **feature.yml** - Links to product epics (F0-F4) with structured fields
- **tech-debt.yml** - Categorizes technical work (infrastructure, performance, etc.)
- **bug.yml** - Captures bug reports with severity levels

### Creating Issues from Specs
```bash
# After creating GRID-XXX.md file, create corresponding issue
gh issue create --title "GRID-123: Add user authentication system" \
  --body "Detailed specifications: [GRID-123](docs/specs/GRID-123.md)

Summary of key requirements:
- OAuth integration with Google/Microsoft
- Session management with sliding expiration  
- User profile creation and management

See full acceptance criteria in the spec file."

# Issue gets assigned #45, now reference both: GRID-123 and #45
```

### Linking to Specs in Issues
To ensure that links to specs within GitHub Issues are permanent and not subject to future changes, always use absolute URLs that point to the specific commit hash of the pull request that closed the issue.

**Why is this important?**
Relative links like `[GRID-123](docs/specs/GRID-123.md)` will always point to the latest version of the spec in the `main` branch. This can cause confusion when reviewing closed issues, as the spec may have been updated since the issue was resolved. Using a permanent link to a specific commit hash ensures that the link always shows the spec as it was when the issue was closed.

**How to get the permanent link:**
1. Find the pull request that closed the issue.
2. Get the merge commit hash of that pull request.
3. Construct the URL with the following format: `https://github.com/awynne/grid/blob/COMMIT_HASH/docs/specs/GRID-XXX.md`

**Example:**
`[GRID-005](https://github.com/awynne/grid/blob/ceaaf4a342687437b211433bac0babf67cf1e851/docs/specs/GRID-005.md)`


### Enhanced Commit Messages
```bash
# ✅ Include GRID-XXX, GitHub issue number, and epic context when applicable
git commit -m "feat(daily-pulse): add real-time data display (GRID-123, #45)"
git commit -m "fix(dashboard): resolve loading race condition (GRID-456, #78)"
git commit -m "docs(api): update integration guide (GRID-202, #91)"

# For epic-related work, include epic reference
git commit -m "feat(f1-daily-pulse): implement chart components (GRID-124, #46)"
```

### Enhanced PR Creation
```bash
# ✅ Reference both systems for automatic linking
gh pr create --title "feat(auth): Add OAuth authentication system" \
  --body "Implements GRID-123: User authentication system

## Summary
- Add Google and Microsoft OAuth providers
- Implement session management with sliding expiration
- Create user profile management workflow

## Testing
- [x] OAuth flow tested with both providers
- [x] Session management verified
- [x] User profile creation works
- [x] Error handling for failed OAuth

Closes GRID-123
Closes #45"
```

### GitHub Labels and Milestones

The project uses structured labels for organization and filtering:

**Epic Labels** (link to product features):
- `epic:f0-shared-shell` - F0: Shared Shell & Freshness
- `epic:f1-daily-pulse` - F1: Daily Pulse  
- `epic:f2-powering-me` - F2: What's Powering Me
- `epic:f3-duck-days` - F3: Duck Days
- `epic:f4-what-changed` - F4: What Changed

**Type Labels**:
- `type:feature` - New feature or capability
- `type:bug` - Bug or issue fix
- `type:tech-debt` - Technical debt, refactoring, infrastructure
- `type:docs` - Documentation updates
- `type:spec` - GRID-XXX technical specification

**Priority & Size Labels**:
- Priority: `priority:critical/high/medium/low`
- Size: `size:xs/s/m/l/xl` (for estimation)
- Status: `status:blocked/in-review/ready`

**Milestones**:
- "MVP - Core Features" - F1 Daily Pulse and F2 What's Powering Me
- "Phase 2 - Analytics" - F3 Duck Days and F4 What Changed

### Benefits of Triple System
- **Strategic alignment** - Features linked to business value and user needs
- **Rich documentation** - Detailed specs remain in GRID-XXX.md files
- **Public visibility** - Stakeholders can track progress in GitHub issues
- **Automation** - Issues auto-close when PRs merge, labels enable filtering
- **Integration** - Works with GitHub project boards, mentions, notifications
- **Traceability** - Full links between features, specs, issues, PRs, and code changes
- **LLM-friendly** - All systems optimized for AI assistant workflows

## Solo Development Quality Gates

### Self-Review Validation Checklist
Since no external reviewer is available in solo development, use this checklist before self-merge:

**Spec Compliance:**
- [ ] All spec requirements satisfied
- [ ] Definition of done criteria met
- [ ] Implementation matches technical overview

**Code Quality:**
- [ ] No breaking changes introduced
- [ ] Code follows established patterns and conventions
- [ ] Error handling appropriate for scope
- [ ] Performance considerations addressed

**Documentation & Integration:**
- [ ] Documentation updated as needed
- [ ] Cross-references and links functional
- [ ] Commit messages follow conventional format
- [ ] PR description comprehensive and clear

**Testing & Validation:**
- [ ] Tests pass (when applicable)
- [ ] Manual validation completed
- [ ] No obvious regressions introduced
- [ ] Feature works as specified

**Repository Standards:**
- [ ] Branch naming follows convention
- [ ] No direct commits to main
- [ ] GitHub issue properly linked
- [ ] Status updates prepared for post-merge

**Deployment & Production Readiness:**
- [ ] Test environment deployment successful
- [ ] Test environment validation passed
- [ ] Production deployment successful  
- [ ] Production environment validation passed
- [ ] Health checks responding correctly
- [ ] Performance meets production requirements

**"Done Means Done" Confirmation:**
- [ ] Feature accessible and functional in production
- [ ] No rollback required after deployment
- [ ] Monitoring confirms stable operation
- [ ] Spec marked ✅ Completed only after production validation

## Spec Management Process

### Spec Status Legend
- 🆕 **New** - Spec created, not yet assigned
- 🔄 **In Progress** - Currently being worked on
- 👀 **Review** - Definition of done achieved, PR created, awaiting review
- 🚀 **Ready for Test** - PR merged, ready for test environment deployment
- 🧪 **Testing** - Deployed to test environment, undergoing validation
- 🎯 **Ready for Prod** - Test validation passed, ready for production deployment
- ✅ **Completed** - Successfully deployed and validated in production
- ❌ **Cancelled** - Spec cancelled or no longer needed
- 🔴 **Blocked** - Cannot proceed due to dependencies

**Important**: Only ✅ **Completed** means "done" - all other statuses indicate work in progress.

### Solo Development Completion Workflow
**Updated Process**: Specs are marked ✅ Completed only after successful production deployment:

1. **Developer completes work** - All acceptance criteria and definition of done satisfied
2. **Move to 👀 Review** - Create PR and update spec status  
3. **Self-validation** - Complete quality checklist and verify all requirements met
4. **Self-merge** - Squash merge after validation
5. **Move to 🚀 Ready for Test** - Update spec status, prepare for deployment
6. **Deploy to Test** - Run `npm run deploy:test` and validate with `npm run test:remote:test`
7. **Move to 🧪 Testing** - Update spec status during test validation
8. **Move to 🎯 Ready for Prod** - After successful test validation
9. **Deploy to Production** - Run `npm run deploy:prod` and validate with `npm run test:remote:prod`
10. **Spec marked ✅ Completed** - Only after successful production deployment and validation

**Rule**: No spec is considered "done" until step 10 is complete and production is stable.

### Team Development Completion Workflow
**Future State**: Specs are marked ✅ Completed after external review cycle:

1. **Developer completes work** - All acceptance criteria and definition of done satisfied
2. **Move to 👀 Review** - Create PR and update spec status
3. **External review** - Architect/senior developer reviews PR for technical quality
4. **External approval and merge** - Reviewer merges after approval
5. **Spec marked ✅ Completed** - Update status and link merged PR

**Never mark a spec complete until the PR is merged.**

### Solo Development Example Workflow
Here's the complete solo development process with feature integration:

```bash
# 0. Create GRID-XXX.md spec file with all requirements
# 1. Create corresponding issue using template
gh issue create --template feature.yml \
  --title "[Feature] Real-time grid frequency display" \
  --body "Epic: F1 - Daily Pulse

Product Documentation: https://github.com/awynne/grid/blob/main/docs/product/features.md#f1-daily-pulse

Description: Implement real-time frequency chart showing current grid stability

Acceptance Criteria:
- [ ] Display current frequency (Hz) with 1-second updates
- [ ] Show color coding (green=stable, yellow=caution, red=alert)  
- [ ] Include 24-hour historical trend line
- [ ] Responsive design for mobile/desktop

Technical Notes: Uses EIA-930 real-time data stream" \
  --label "epic:f1-daily-pulse,type:feature,size:l"

# Issue created as #12

# 2. MANDATORY: Create feature branch (NEVER commit directly to main)
git checkout -b feature/GRID-004-frequency-display

# 3. Development work with frequent commits
git add .
git commit -m "feat(f1-daily-pulse): add frequency chart component (GRID-004, #12)"
git push -u origin feature/GRID-004-frequency-display

git add .
git commit -m "feat(f1-daily-pulse): implement real-time data updates (GRID-004, #12)"
git push

# 4. Create PR for audit trail and GitHub automation
gh pr create --title "feat(f1-daily-pulse): Add real-time grid frequency display" \
  --body "Implements GRID-004: Real-time frequency chart for F1 Daily Pulse

## Changes
- Add frequency chart component with 1-second updates
- Implement color coding for stability indicators
- Add 24-hour historical trend line
- Responsive design for mobile and desktop

## Epic Integration
- Part of F1: Daily Pulse feature epic
- Uses EIA-930 real-time data stream
- Contributes to grid stability awareness goal

## Solo Development Validation
- [x] All spec requirements satisfied
- [x] No breaking changes introduced
- [x] Documentation updated
- [x] Manual testing completed

Closes GRID-004
Closes #12"

# 5. Self-merge after validation (GitHub prevents self-approval)
gh pr merge --squash --delete-branch

# 6. Update spec status manually
# - Update GRID-004.md status to ✅ Completed
# - Update docs/specs/status.md with completion date in Completed column
```

**Spec file updates when moving to Review:**
- Change status from 🔄 In Progress to 👀 Review
- Update Definition of Done: PR created (✅) but not yet merged (⏳)
- Add progress note with PR link
- Move spec to Active/Review section in status.md
- Update spec statistics

### Creating New Specs
1. **Use sequential GRID-XXX numbering** (GRID-001, GRID-002, etc.)
2. **Create GRID-XXX.md file first** with all required sections
3. **Create issue** linking to the spec file for public tracking
4. **Update spec file** with issue number for cross-reference
5. **Set clear priorities**: High, Medium, Low
6. **Estimate complexity** if helpful (Small, Medium, Large)
7. **Identify dependencies** with other specs

### Spec Status Updates
- Update status emoji and date when changing status
- Move completed specs to "Completed Specifications" section in docs/specs/status.md
- Add completion date in the Completed column and any relevant notes
- Keep active specs at top for visibility

### Technical Specification Template
```markdown
### GRID-XXX: Technical Feature Name

**GitHub Issue**: #XXX (public tracking)
**Spec Purpose**: Technical implementation details and research
**Status**: 📋 Research | 🔄 In Progress | 👀 Review | ✅ Implemented
**Priority**: High | Medium | Low
**Created**: YYYY-MM-DD

## Technical Overview
High-level architecture and approach decisions. What are we building and why?

## Implementation Requirements
- [ ] Specific technical acceptance criteria
- [ ] API contracts and schemas needed
- [ ] Database migrations required
- [ ] Security considerations addressed
- [ ] Performance requirements met
- [ ] Error handling implemented
- [ ] Tests written and passing

## Research Notes
- Investigation findings and technical decisions
- Architecture alternatives considered
- Framework-specific constraints discovered
- Integration challenges and solutions

## Implementation Details
- Code patterns and conventions to follow
- Specific algorithms or libraries to use
- Configuration requirements
- Deployment considerations

## Dependencies & Integration
- Technical dependencies on other specs: GRID-XXX
- External service requirements
- Breaking changes or migration needs
- Cross-cutting concerns (auth, logging, etc.)

## Testing Strategy
- Unit testing approach
- Integration testing requirements
- End-to-end testing scenarios
- Performance testing criteria
```

### Specification Review Process
1. **Spec Creation**: Developer or architect creates specs following the template
2. **Technical Review**: Lead developer or architect reviews technical approach
3. **Implementation Planning**: Break down into development phases if needed
4. **Progress Updates**: Developer updates status as research and implementation progresses
5. **Implementation Complete**: Mark complete when all technical requirements met and tested

## Project Planning

### Sprint/Milestone Planning
- Group related specs into logical milestones
- Prioritize specs based on user value and dependencies
- Consider team capacity and skill requirements
- Plan for testing and documentation work

### Estimation Guidelines
- **Small**: 1-2 hours, simple changes, clear requirements
- **Medium**: 0.5-1 day, moderate complexity, may need research
- **Large**: 1-3 days, complex features, multiple components affected
- **Extra Large**: Break down into smaller specs

### Dependency Management
- Identify blocking specs early
- Plan dependent specs in logical order
- Communicate blockers immediately
- Consider parallel work opportunities

## Communication Guidelines

### Spec Updates
- Update spec status regularly (at least daily)
- Add notes for significant progress or blockers
- Tag relevant team members for input needed
- Link related PRs and commits

### Meetings and Reviews
- Use docs/specs/status.md as agenda for standups
- Review completed specs in retrospectives
- Plan upcoming specs in planning sessions
- Reference spec IDs in all project discussions

### Documentation Requirements
- Keep individual spec files and docs/specs/status.md updated with current status
- Link all code changes back to specs
- Document decisions and context in spec notes
- Maintain clean spec history for future reference
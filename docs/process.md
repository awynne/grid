# Project Management Guidelines

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

### Spec-Driven Development Benefits
- Clear requirements prevent scope creep
- Documented decisions in docs/specs/ directory
- Proper estimation and planning
- Accountability and progress tracking
- Single source of truth in repository

## Development Process Integration

### Solo Development Process (Current Reality)
**Context**: Single developer (awynne) with GitHub self-approval restriction

1. **Spec creation required** - Create spec file docs/specs/GRID-XXX.md with clear requirements
2. **Issue creation** - Create corresponding GitHub issue for public tracking and automation
3. **Mandatory feature branch** - Always create `feature/GRID-XXX-description` (NEVER commit directly to main)
4. **Development with frequent commits** - Save progress regularly to feature branch (status: 🔄 In Progress)
5. **PR creation** - Create PR for audit trail and GitHub automation (status: 👀 Review)
6. **Self-review validation** - Use quality checklist to validate work meets standards
7. **Self-merge** - Squash merge after validation (GitHub prevents self-approval)
8. **Status updates** - Issue auto-closes; manually update GRID-XXX.md status and docs/specs/status.md

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
9. **Status updates** - Issue auto-closes; manually update GRID-XXX.md status and docs/specs/status.md

### Integration with Git Workflow & GitHub Issues
- **Branch naming**: Use task ID in branch name (`feature/GRID-XXX-description`)
- **Commit messages**: Include both IDs (`feat(auth): add OAuth (GRID-XXX, #45)`)
- **PR linking**: Reference both systems (`Closes GRID-XXX` and `Closes #45`)
- **Dual tracking**: GRID-XXX.md files for detailed specs, GitHub issues for public tracking
- **Spec status updates**: 
  - 🔄 In Progress: During development (update both systems)
  - 👀 Review: When PR created and ready for architect review
  - ✅ Completed: GitHub issue auto-closes, manually update GRID-XXX.md status
- **Spec closure**: Issues close automatically; update GRID-XXX.md status and docs/specs/status.md manually

## GitHub Issues Integration

### Dual-Track System
The project uses a **dual-track system** combining detailed spec documentation with GitHub's automation benefits:

1. **GRID-XXX.md files** - Detailed technical specifications, acceptance criteria, and progress notes
2. **Issues** - Public tracking, automation, and integration with GitHub workflows

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

### Enhanced Commit Messages
```bash
# ✅ Include both GRID-XXX and GitHub issue number
git commit -m "feat(auth): add OAuth providers (GRID-123, #45)"
git commit -m "fix(dashboard): resolve loading race condition (GRID-456, #78)"
git commit -m "docs(api): update integration guide (GRID-202, #91)"
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

### Benefits of Dual System
- **Rich documentation** - Detailed specs remain in GRID-XXX.md files
- **Public visibility** - Stakeholders can track progress in GitHub issues
- **Automation** - Issues auto-close when PRs merge
- **Integration** - Works with GitHub project boards, mentions, notifications
- **Traceability** - Full links between specs, issues, PRs, and code changes
- **LLM-friendly** - Both systems optimized for AI assistant workflows

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

## Spec Management Process

### Spec Status Legend
- 🆕 **New** - Spec created, not yet assigned
- 🔄 **In Progress** - Currently being worked on
- 👀 **Review** - Definition of done achieved, PR created, awaiting review
- ✅ **Completed** - PR merged to main branch
- ❌ **Cancelled** - Spec cancelled or no longer needed
- 🔴 **Blocked** - Cannot proceed due to dependencies

### Solo Development Completion Workflow
**Current Reality**: Specs are marked ✅ Completed after self-validation and merge:

1. **Developer completes work** - All acceptance criteria and definition of done satisfied
2. **Move to 👀 Review** - Create PR and update spec status
3. **Self-validation** - Complete quality checklist and verify all requirements met
4. **Self-merge** - Squash merge after validation (GitHub prevents self-approval)
5. **Spec marked ✅ Completed** - Update status and link merged PR

### Team Development Completion Workflow
**Future State**: Specs are marked ✅ Completed after external review cycle:

1. **Developer completes work** - All acceptance criteria and definition of done satisfied
2. **Move to 👀 Review** - Create PR and update spec status
3. **External review** - Architect/senior developer reviews PR for technical quality
4. **External approval and merge** - Reviewer merges after approval
5. **Spec marked ✅ Completed** - Update status and link merged PR

**Never mark a spec complete until the PR is merged.**

### Solo Development Example Workflow
Here's the complete solo development process with mandatory feature branches:

```bash
# 0. Create GRID-XXX.md spec file with all requirements
# 1. Create corresponding issue for tracking
gh issue create --title "GRID-004: Add user dashboard metrics" \
  --body "Full specifications: [GRID-004](docs/specs/GRID-004.md)

Key requirements:
- Project count widget
- Recent activity feed  
- Quick actions menu
- Responsive design

See spec file for complete acceptance criteria."

# Issue created as #12

# 2. MANDATORY: Create feature branch (NEVER commit directly to main)
git checkout -b feature/GRID-004-user-dashboard

# 3. Development work with frequent commits
git add .
git commit -m "feat(dashboard): add project count widget (GRID-004, #12)"
git push -u origin feature/GRID-004-user-dashboard

git add .
git commit -m "feat(dashboard): add activity feed component (GRID-004, #12)"
git push

# 4. Create PR for audit trail and GitHub automation
gh pr create --title "feat(dashboard): Add user dashboard metrics" \
  --body "Implements GRID-004: User dashboard with project metrics

## Changes
- Add project count widget with real-time updates
- Add recent activity feed (last 10 items)
- Add quick actions menu (New Project, Settings)
- Responsive design for mobile and desktop

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
# - Update docs/specs/status.md with completion
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
- Add completion date and any relevant notes
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
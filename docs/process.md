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
# ❌ NEVER start work without a task
# Manager: "Can you add a quick button to the dashboard?"
# Developer: "Sure!" *starts coding immediately*

# ✅ CORRECT approach
# Manager: "Can you add a quick button to the dashboard?"
# Developer: "I'll create a task first to document the requirements"
# *Creates task in docs/specs/GRID-XXX.md, gets approval, then starts development*
```

### Task-Driven Development Benefits
- Clear requirements prevent scope creep
- Documented decisions in docs/specs/ directory
- Proper estimation and planning
- Accountability and progress tracking
- Single source of truth in repository

## Development Process Integration

### Development Process Steps
1. **Task creation required** - Create task file docs/specs/GRID-XXX.md with clear requirements
2. **GitHub issue creation** - Create corresponding GitHub issue for public tracking and automation
3. **Developer reviews task** - Understand acceptance criteria before starting
4. **Developer works on feature** with frequent commits to feature branch (status: 🔄 In Progress)
5. **Developer creates PR** when definition of done is achieved (status: 👀 Review)
6. **Architect reviews PR** - Technical review, code quality, requirements verification
7. **Developer addresses feedback** with additional commits if needed
8. **Architect approves and merges** PR with squash merge
9. **Automatic closure** - GitHub issue automatically closes; update GRID-XXX.md status manually

### Integration with Git Workflow & GitHub Issues
- **Branch naming**: Use task ID in branch name (`feature/GRID-XXX-description`)
- **Commit messages**: Include both IDs (`feat(auth): add OAuth (GRID-XXX, #45)`)
- **PR linking**: Reference both systems (`Closes GRID-XXX` and `Closes #45`)
- **Dual tracking**: GRID-XXX.md files for detailed specs, GitHub issues for public tracking
- **Task status updates**: 
  - 🔄 In Progress: During development (update both systems)
  - 👀 Review: When PR created and ready for architect review
  - ✅ Completed: GitHub issue auto-closes, manually update GRID-XXX.md status
- **Task closure**: GitHub issues close automatically; update GRID-XXX.md status and docs/specs/status.md manually

## GitHub Issues Integration

### Dual-Track System
The project uses a **dual-track system** combining detailed task documentation with GitHub's automation benefits:

1. **GRID-XXX.md files** - Detailed task specifications, acceptance criteria, and progress notes
2. **GitHub issues** - Public tracking, automation, and integration with GitHub workflows

### Creating Issues from Tasks
```bash
# After creating GRID-XXX.md file, create corresponding GitHub issue
gh issue create --title "GRID-123: Add user authentication system" \
  --body "Detailed specifications: [GRID-123](docs/specs/GRID-123.md)

Summary of key requirements:
- OAuth integration with Google/Microsoft
- Session management with sliding expiration  
- User profile creation and management

See full acceptance criteria in the task file."

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
- **Traceability** - Full links between tasks, issues, PRs, and code changes
- **LLM-friendly** - Both systems optimized for AI assistant workflows

## Task Management Process

### Task Status Legend
- 🆕 **New** - Task created, not yet assigned
- 🔄 **In Progress** - Currently being worked on
- 👀 **Review** - Definition of done achieved, PR created, awaiting architect review
- ✅ **Completed** - PR reviewed, approved, and merged by architect
- ❌ **Cancelled** - Task cancelled or no longer needed
- 🔴 **Blocked** - Cannot proceed due to dependencies

### Task Completion Workflow
**Important**: Tasks are only marked ✅ Completed after the full review cycle:

1. **Developer completes work** - All acceptance criteria and definition of done satisfied
2. **Move to 👀 Review** - Create PR and update task status 
3. **Architect reviews PR** - Technical review, code quality, requirements verification
4. **PR approved and merged** - Architect merges after approval
5. **Task marked ✅ Completed** - Update status and link merged PR

**Never mark a task complete until the PR is merged.**

### Example Workflow with GitHub Issues
Here's the enhanced process with GitHub issues integration:

```bash
# 0. Create GRID-XXX.md task file (as before)
# 1. Create corresponding GitHub issue
gh issue create --title "GRID-004: Add user dashboard metrics" \
  --body "Full specifications: [GRID-004](docs/specs/GRID-004.md)

Key requirements:
- Project count widget
- Recent activity feed  
- Quick actions menu
- Responsive design

See task file for complete acceptance criteria."

# Issue created as #12

# 2. Development work with enhanced commit messages
git add .
git commit -m "feat(dashboard): add project count widget (GRID-004, #12)"
git push origin feature/GRID-004-user-dashboard

git add .
git commit -m "feat(dashboard): add activity feed component (GRID-004, #12)"
git push

# 3. Create PR linking both systems
gh pr create --title "feat(dashboard): Add user dashboard metrics" \
  --body "Implements GRID-004: User dashboard with project metrics

## Changes
- Add project count widget with real-time updates
- Add recent activity feed (last 10 items)
- Add quick actions menu (New Project, Settings)
- Responsive design for mobile and desktop

Closes GRID-004
Closes #12"

# 5. Update task status files
```

**Task file updates when moving to Review:**
- Change status from 🔄 In Progress to 👀 Review
- Update Definition of Done: PR created (✅) but not yet merged (⏳)
- Add progress note with PR link
- Move task to Active/Review section in status.md
- Update task statistics

### Creating New Tasks
1. **Use sequential GRID-XXX numbering** (GRID-001, GRID-002, etc.)
2. **Create GRID-XXX.md file first** with all required sections
3. **Create GitHub issue** linking to the task file for public tracking
4. **Update task file** with GitHub issue number for cross-reference
5. **Set clear priorities**: High, Medium, Low
6. **Estimate complexity** if helpful (Small, Medium, Large)
7. **Identify dependencies** with other tasks

### Task Status Updates
- Update status emoji and date when changing status
- Move completed tasks to "Completed Tasks" section in docs/specs/status.md
- Add completion date and any relevant notes
- Keep active tasks at top for visibility

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
- Group related tasks into logical milestones
- Prioritize tasks based on user value and dependencies
- Consider team capacity and skill requirements
- Plan for testing and documentation tasks

### Estimation Guidelines
- **Small**: 1-2 hours, simple changes, clear requirements
- **Medium**: 0.5-1 day, moderate complexity, may need research
- **Large**: 1-3 days, complex features, multiple components affected
- **Extra Large**: Break down into smaller tasks

### Dependency Management
- Identify blocking tasks early
- Plan dependent tasks in logical order
- Communicate blockers immediately
- Consider parallel work opportunities

## Communication Guidelines

### Task Updates
- Update task status regularly (at least daily)
- Add notes for significant progress or blockers
- Tag relevant team members for input needed
- Link related PRs and commits

### Meetings and Reviews
- Use docs/specs/status.md as agenda for standups
- Review completed tasks in retrospectives
- Plan upcoming tasks in planning sessions
- Reference task IDs in all project discussions

### Documentation Requirements
- Keep individual task files and docs/specs/status.md updated with current status
- Link all code changes back to tasks
- Document decisions and context in task notes
- Maintain clean task history for future reference
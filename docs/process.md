# Project Management Guidelines

## Task-First Development Rule

### ❗ MANDATORY: No Work Without a Task
- All development must start with a documented task in `docs/tasks.md`
- Never start coding based on verbal requests or informal discussions
- Create task entry in `docs/tasks.md` BEFORE starting any work
- Task must include: description, acceptance criteria, definition of done

### Task Creation Example
```markdown
### GRID-XXX: Add user project dashboard
**Status**: 🆕 New  
**Priority**: High  
**Assignee**: TBD  
**Created**: 2025-01-20  

#### Description
Users need a dashboard to view their project metrics and recent activity.

#### Acceptance Criteria
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
# *Creates task in docs/tasks/GRID-XXX.md, gets approval, then starts development*
```

### Task-Driven Development Benefits
- Clear requirements prevent scope creep
- Documented decisions in docs/tasks/ directory
- Proper estimation and planning
- Accountability and progress tracking
- Single source of truth in repository

## Development Process Integration

### Development Process Steps
1. **Task creation required** - Create task file docs/tasks/GRID-XXX.md with clear requirements
2. **Developer reviews task** - Understand acceptance criteria before starting
3. **Developer works on feature** with frequent commits to feature branch (status: 🔄 In Progress)
4. **Developer creates PR** when definition of done is achieved (status: 👀 Review)
5. **Architect reviews PR** - Technical review, code quality, requirements verification
6. **Developer addresses feedback** with additional commits if needed
7. **Architect approves and merges** PR with squash merge
8. **Task closed** - Update status to ✅ Completed and link merged PR

### Integration with Git Workflow
- **Branch naming**: Use task ID in branch name (`feature/GRID-XXX-description`)
- **Commit messages**: Include task ID (`feat(auth): add OAuth (GRID-XXX)`)
- **PR linking**: Reference task in PR description (`Closes GRID-XXX`)
- **Task status updates**: 
  - 🔄 In Progress: During development
  - 👀 Review: When PR created and ready for architect review
  - ✅ Completed: Only after PR is approved and merged
- **Task closure**: Mark complete when PR is merged and update status in task file and docs/tasks/status.md

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

### Example Workflow: GRID-002
Here's the exact process followed for GRID-002 as a reference:

```bash
# 1. Complete development work (all acceptance criteria met)
# 2. Commit final changes
git add .
git commit -m "Refine GRID-002: Streamline activity logs and add workflow guidance"

# 3. Push feature branch to remote
git push origin GRID-002-activity-log

# 4. Create pull request
gh pr create --title "GRID-002: Create Development Activity Log" --body "..."

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
2. **Include all required sections**: Description, Acceptance Criteria, Definition of Done
3. **Set clear priorities**: High, Medium, Low
4. **Estimate complexity** if helpful (Small, Medium, Large)
5. **Identify dependencies** with other tasks

### Task Status Updates
- Update status emoji and date when changing status
- Move completed tasks to "Completed Tasks" section in docs/tasks/status.md
- Add completion date and any relevant notes
- Keep active tasks at top for visibility

### Task Template
```markdown
### GRID-XXX: Task Title
**Status**: 🆕 New  
**Priority**: Medium  
**Assignee**: TBD  
**Created**: YYYY-MM-DD  
**Estimated Size**: Medium  

#### Description
Clear description of what needs to be done and why.

#### Acceptance Criteria
- [ ] Specific, testable criteria
- [ ] Each criterion should be verifiable
- [ ] Include technical and functional requirements

#### Definition of Done
- [ ] **Task requirements met** - All acceptance criteria satisfied
- [ ] Code complete and tested (if applicable)
- [ ] Documentation updated (if applicable)
- [ ] Reviewed and approved
- [ ] No TypeScript errors (if applicable)
- [ ] Task marked complete in individual task file and docs/tasks/status.md

#### Dependencies
- GRID-XXX (if any)

#### Notes
Any additional context, references, or considerations.
```

### Task Review Process
1. **Task Creation**: Anyone can create tasks following the template
2. **Task Review**: Lead developer or product owner reviews new tasks
3. **Task Assignment**: Tasks assigned during planning or as needed
4. **Progress Updates**: Developer updates status as work progresses
5. **Task Completion**: Mark complete when all acceptance criteria met

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
- Use docs/tasks/status.md as agenda for standups
- Review completed tasks in retrospectives
- Plan upcoming tasks in planning sessions
- Reference task IDs in all project discussions

### Documentation Requirements
- Keep individual task files and docs/tasks/status.md updated with current status
- Link all code changes back to tasks
- Document decisions and context in task notes
- Maintain clean task history for future reference
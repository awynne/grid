# General Coding Standards & Guidelines

> **📋 Purpose**: Language-agnostic coding principles, workflow standards, and universal development practices that apply across all technology stacks.

> **🔗 See Also**: [React Router Technical Standards](./coding-react-router.md) for TypeScript, React, Prisma, and deployment-specific guidelines.

## Table of Contents
- [General Principles](#general-principles)
- [Security Guidelines](#security-guidelines)
- [Accessibility Standards](#accessibility-standards)
- [Testing Philosophy](#testing-philosophy)
- [Git Workflow](#git-workflow)
- [Code Review Process](#code-review-process)
- [Tools & Setup](#tools--setup)
- [Performance Guidelines](#performance-guidelines)

## General Principles

### Code Philosophy
- **Prefer explicit over implicit** - Code should be self-documenting
- **Fail fast and loud** - Use type systems and validation to catch errors early
- **Progressive enhancement** - Build with web standards first, enhance with framework features
- **Performance by default** - Optimize for user experience and core metrics

### Comment Guidelines
Comments should explain **WHY**, not **WHAT**. The code itself should be clear about what it does.

```javascript
// ❌ Bad - explaining what
// Increment the counter by 1
count = count + 1;

// ✅ Good - explaining why
// We increment after successful validation to prevent double-counting failed attempts
count = count + 1;

// ✅ Good - explaining business context
// Customer retention drops significantly after 3 failed login attempts
MAX_LOGIN_ATTEMPTS = 3;
```

## Security Guidelines

### General Security Principles
- **Input validation** - Validate all user input at application boundaries
- **Least privilege** - Grant minimal permissions necessary for functionality
- **Defense in depth** - Layer multiple security controls
- **Fail securely** - Ensure failures don't compromise security
- **Security by design** - Build security into architecture from the start


## Accessibility Standards

### WCAG 2.1 AA Guidelines
- **Perceivable** - Information must be presentable in ways users can perceive
- **Operable** - Interface components must be operable by all users
- **Understandable** - Information and UI operation must be understandable
- **Robust** - Content must be robust enough for various assistive technologies

### Core Accessibility Principles
- **Semantic HTML** - Use appropriate HTML elements for their intended purpose
- **Keyboard navigation** - All functionality must be accessible via keyboard
- **Screen reader support** - Provide proper labels, descriptions, and structure
- **Color contrast** - Maintain WCAG AA compliant color ratios (4.5:1 for text)
- **Focus management** - Provide clear focus indicators and logical focus flow
- **Alternative text** - Provide meaningful descriptions for non-text content
- **Error handling** - Clear, descriptive error messages and validation feedback

### Universal Design Patterns
- **Progressive enhancement** - Build for basic functionality first, enhance with advanced features
- **Multi-sensory feedback** - Don't rely solely on color, sound, or visual cues
- **Flexible layouts** - Support different screen sizes and zoom levels
- **User control** - Allow users to control timing, animations, and auto-updating content
- **Consistent navigation** - Maintain predictable navigation patterns throughout the application

### Testing Guidelines
- **Automated testing** - Use accessibility testing tools in CI/CD pipeline
- **Manual testing** - Test with keyboard-only navigation and screen readers
- **User testing** - Include users with disabilities in usability testing
- **Regular audits** - Perform periodic accessibility audits and remediation

## Testing Philosophy

### Test Behavior, Not Implementation
- **Focus on user outcomes** - Test what the user experiences, not internal code structure
- **Test business logic** - Verify the application solves the intended problems
- **Stable tests** - Tests should remain valid even when implementation details change
- **Clear test names** - Test names should describe the expected behavior in plain language

### Testing Pyramid
- **Unit tests (70%)** - Fast, isolated tests for individual functions and components
- **Integration tests (20%)** - Test interactions between multiple components/systems
- **End-to-end tests (10%)** - Full user workflow tests through the UI

### General Testing Principles
- **Arrange, Act, Assert** - Structure tests with clear setup, execution, and verification phases
- **Test edge cases** - Include boundary conditions, null values, and error scenarios
- **Isolated tests** - Each test should be independent and not rely on other tests
- **Meaningful assertions** - Assert on meaningful outcomes, not implementation details
- **Fast feedback** - Tests should run quickly to enable rapid development cycles

### Test Data Strategy
- **Use realistic data** - Test data should represent real-world scenarios
- **Avoid hardcoded values** - Use test data factories or fixtures for consistency
- **Clean state** - Ensure tests start with a known, clean state
- **Deterministic tests** - Tests should produce the same results every time they run

### Testing in This Repository
- A unit test runner is not yet configured. Validate changes with:
  - `npm run typecheck` and `npm run lint`
  - Manual validation via dev server (`npm run dev`)
  - DB checks: `npm run db:studio`, `node scripts/test-local-setup.js`
- For environment validation: `npm run test:remote:test` or `npm run test:remote:prod`.

> Roadmap: Add Vitest + React Testing Library for unit/integration tests.

## Git Workflow

> **📋 Project Management**: See [process.md](./process.md) for spec creation, workflow processes, and project management guidelines.

### Branch Naming
```bash
# ✅ Use ticket ID with descriptive names
feature/GRID-123-user-authentication
bugfix/GRID-456-dashboard-loading-error
hotfix/GRID-789-payment-processing-timeout
chore/GRID-101-update-dependencies
docs/GRID-202-api-documentation

# Format: {type}/{TICKET-ID}-{short-description}
# - type: feature, bugfix, hotfix, chore, docs
# - TICKET-ID: Jira/GitHub issue number
# - short-description: kebab-case description
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/) with scope:

```bash
# ✅ Scoped commit messages
feat(auth): add user project creation workflow
fix(dashboard): resolve data loading race condition
docs(api): update integration guidelines
test(auth): add user authentication test coverage
refactor(forms): extract reusable validation logic

# ✅ Include context for why changes were made
feat(projects): add status filtering (GRID-123)

Users frequently need to filter projects by status to focus on
urgent items. This adds a dropdown filter that persists in URL
parameters for bookmarkable filtered views.

Closes GRID-123
```

### Spec-First Development Rule
```bash
# ❗ MANDATORY: No work without a spec
# - All development must start with a documented spec in docs/specs/GRID-XXX.md
# - Never start coding based on verbal requests or informal discussions
# - Create spec file in docs/specs/GRID-XXX.md BEFORE starting any work
# - Spec must include: description, acceptance criteria, definition of done

# ✅ Create spec first in docs/specs/GRID-XXX.md
# Add new spec following the template:
### GRID-XXX: Add user project dashboard
**Status**: 🆕 New  
**Priority**: High  
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

# Spec gets assigned GRID-XXX, NOW you can start development
```

### Development Workflow with GitHub CLI
```bash
# ✅ Install GitHub CLI (better for LLM agents)
npm install -g gh
gh auth login

# 0. VERIFY SPEC EXISTS - Check spec in docs/specs/GRID-XXX.md
# Review GRID-XXX spec requirements before starting
# Ensure issue was created and note the issue number (e.g., #45)

# 1. Create feature branch from main (using spec ID)
gh repo sync  # Sync with upstream
git checkout main
git pull origin main
git checkout -b feature/GRID-123-user-dashboard

# 2. Commit frequently while developing (save progress)
git add .
git commit -m "feat(dashboard): add basic dashboard layout (GRID-123, #45)"
git push origin feature/GRID-123-user-dashboard

# Continue working and committing frequently
git add .
git commit -m "feat(dashboard): add project count widget (GRID-123, #45)"
git push

git add .
git commit -m "feat(dashboard): add recent activity feed (GRID-123, #45)"
git push

git add .
git commit -m "feat(dashboard): add quick actions menu (GRID-123, #45)"
git push

# 3. When feature is ready for review, create PR
gh pr create --title "feat(dashboard): Add user project metrics" --body "Implements GRID-123\n\n- Add project count widget\n- Add recent activity feed\n- Add quick actions menu\n\nCloses GRID-123\nCloses #45"

# 4. After review, merge via CLI (squash combines all commits)
gh pr merge --squash --delete-branch

# 5. Clean up local branch
git checkout main
git pull origin main
```

### Pull Request Guidelines
```bash
# ✅ Create PR with proper format
gh pr create \
  --title "feat(auth): Add Google OAuth integration" \
  --body "$(cat <<'EOF'
Implements GRID-456: Google OAuth authentication

## Changes
- Add Google OAuth provider configuration
- Implement OAuth callback handling
- Add user creation from OAuth profile
- Update login UI with Google button

## Testing
- [ ] OAuth flow works in development
- [ ] User profile correctly populated
- [ ] Session management works
- [ ] Error handling for OAuth failures

Closes GRID-456
EOF
)"

# ✅ PR checklist in description
- **Title**: Use conventional commit format with scope
- **Description**: Include ticket reference, changes, testing checklist
- **Size**: Keep PRs focused and reviewable (< 500 lines when possible)
- **Tests**: Include tests for new functionality
- **Documentation**: Update relevant docs
```

### GitHub CLI Commands for LLM Agents
```bash
# ✅ Useful gh commands for automation
gh pr list                              # List open PRs
gh pr view 123                          # View PR details
gh pr checkout 123                      # Checkout PR locally
gh pr review 123 --approve              # Approve PR
gh pr review 123 --comment "LGTM"       # Add review comment
gh pr merge 123 --squash --delete-branch # Squash merge and cleanup

# ✅ Repository management
gh repo view                            # View repo details
gh issue list                           # List issues
gh issue create --title "Bug: ..."       # Create issue
gh workflow list                        # List GitHub Actions
gh workflow run "Deploy"                # Trigger workflow

# ✅ Branch management
gh repo sync                            # Sync fork with upstream
gh pr create --draft                    # Create draft PR
gh pr ready                             # Mark draft as ready
```

## Code Review Process

### Reviewer Checklist
- [ ] Code follows established patterns and conventions
- [ ] Changes include appropriate tests
- [ ] No obvious security vulnerabilities
- [ ] Performance implications considered
- [ ] Error handling is appropriate
- [ ] Documentation updated if needed

### Review Workflow
```bash
# ✅ Step 1: Reviewer comments on PR
gh pr list                              # See open PRs
gh pr checkout 123                      # Checkout PR to test locally
npm test                                # Run tests
npm run typecheck                       # Check types
npm run test:local                      # Validate DB/dev env (this repo)

# ✅ Add review comments (don't approve yet)
gh pr review 123 --comment --body "Consider extracting this logic into a reusable hook for better testing"
gh pr review 123 --request-changes --body "Please address the TypeScript errors in UserService.ts"

# ✅ Step 2: Developer makes adjustments
# Developer addresses feedback, pushes new commits
git add .
git commit -m "fix(auth): address review feedback (GRID-123)"
git push

# ✅ Step 3: Final reviewer approves and merges
gh pr review 123 --approve --body "LGTM! All feedback addressed."
gh pr merge 123 --squash --delete-branch
```

### Review Comments (Keep Informal)
```typescript
// ✅ Simple, helpful feedback
// Could extract this to a hook?
// What if API returns null here?
// Nice solution! ✅
// Consider using React.memo here for performance
```

### Commit Frequency Guidelines
```bash
# ✅ Commit frequently during development
# - Save progress regularly (multiple times per day)
# - Each commit should be a logical unit of work
# - Push commits to backup work and show progress
# - Don't worry about commit message perfection - squash merge will clean up

# ✅ Examples of frequent commits
git commit -m "feat(auth): add login form structure"
git commit -m "feat(auth): add form validation"
git commit -m "feat(auth): connect to OAuth provider"
git commit -m "feat(auth): add error handling"
git commit -m "feat(auth): add loading states"

# ✅ Push frequently to backup work
git push  # Push after each commit or group of commits
```

### Development Process Steps
1. **Spec creation required** - Create issue with clear requirements
2. **Developer reviews spec** - Understand acceptance criteria before starting
3. **Developer works on feature** with frequent commits to feature branch
4. **Developer creates PR** when feature is ready for review via `gh pr create`
5. **Reviewer adds feedback** via `gh pr review --comment` or `--request-changes`
6. **Developer addresses feedback** with additional commits and pushes updates
7. **Final reviewer approves** via `gh pr review --approve`
8. **Final reviewer merges** via `gh pr merge --squash --delete-branch` (combines all commits)
9. **Spec closed** - Link PR to spec and close issue

### Technical Definition of Done
Code is ready when:
- [ ] All tests pass (unit, integration, e2e)
- [ ] No TypeScript errors or linting issues
- [ ] Code follows established patterns and conventions
- [ ] PR is reviewed, approved, and merged
- [ ] Branch is deleted after merge
- [ ] Spec status updated in individual spec file and docs/specs/status.md

## Tools & Setup

### Development Environment
- **Editor setup** - Configure your editor with appropriate extensions for the project's technology stack
- **Dependency management** - Use the project's preferred package manager consistently
- **Environment variables** - Follow the project's conventions for environment configuration
- **Database setup** - Initialize and seed databases according to project documentation
- **Development server** - Use the project's standard development server configuration

## Performance Guidelines

### Core Performance Principles
- **Measure first** - Use performance monitoring tools to identify bottlenecks
- **Optimize critical path** - Prioritize optimizations that affect user-perceived performance
- **Progressive loading** - Load essential content first, enhance progressively
- **Efficient data access** - Minimize database queries and payload sizes
- **Caching strategy** - Implement appropriate caching at multiple levels
- **Code splitting** - Load only necessary code for each user interaction
- **Asset optimization** - Optimize images, fonts, and other static resources

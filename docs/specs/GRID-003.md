# GRID-003: Coding Standards Architecture Separation

**GitHub Issue**: #6 (public tracking)  
**Spec Purpose**: Documentation architecture for universal vs. technology-specific standards  
**Status**: ✅ Implemented  
**Priority**: Medium  
**Created**: 2025-08-21  

## Technical Overview
Refactor the monolithic coding standards documentation into a layered architecture that separates universal development principles from technology-specific implementation patterns. This separation enables better maintainability, clearer scope definition, and easier navigation for developers working across different technology stacks.

## Implementation Requirements
- [x] Create new `coding-react-router.md` with React Router/TypeScript/React specific content
- [x] Update `coding.md` to contain only language-agnostic standards
- [x] Maintain all existing content (no information loss)
- [x] Update cross-references in other documentation files
- [x] Ensure clear navigation between the two files
- [x] Language-agnostic file covers: Git workflow, general principles, security, accessibility
- [x] React Router-specific file covers: TypeScript, React, React Router, shadcn/ui, database patterns

## Definition of Done
- [x] **Spec requirements met** - All acceptance criteria satisfied
- [x] Files properly separated with clear scope definitions
- [x] All cross-references updated to point to correct files
- [x] Documentation navigation updated in README.md
- [x] **Code reviewed and approved** - PR #3 created and approved
- [x] **Merged to main** - Changes integrated into main branch

## Dependencies
- None

## Implementation Notes

### Language-Agnostic Content (stays in `coding.md`)
- General principles and philosophy
- Comment guidelines
- Git workflow and branch naming
- Code review process
- Security guidelines (general concepts)
- Accessibility standards (WCAG principles)
- File naming conventions (general patterns)
- Environment variable patterns
- Testing philosophy

### Technology-Specific Content (moves to `coding-react-router.md`)
- TypeScript guidelines and patterns
- React Router conventions (routes, loaders, actions)
- React component guidelines
- Database guidelines (Prisma-specific)
- CSS/Styling conventions (shadcn/ui, Tailwind)
- Authentication patterns (React Router v7 session management)
- Progressive Web App implementation
- Specific tool configurations
- Package.json scripts and dependencies

## Progress Notes
- **2025-08-21**: Spec created for coding standards separation
- **2025-08-21**: Feature branch created, spec moved to In Progress
- **2025-08-21**: Coding standards separation completed - [PR #3](https://github.com/awynne/grid/pull/3) created and merged

## Related Specs
- [GRID-001](./GRID-001.md) - Documentation structure foundation
- [GRID-002](./GRID-002.md) - Development activity log system

## Links
- Back to [Spec Status](./status.md)
- [Process Guidelines](../process.md)
- [Documentation Standards](../documentation.md)
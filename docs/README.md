# GridPulse Project Documentation

This directory contains all project documentation for the GridPulse electric grid data visualization platform. Each document serves a specific purpose in guiding development and maintaining project standards.

## Documentation Overview

### 📋 [process.md](./process.md)
**Project Management & Workflow**
- Spec-first development rule and guidelines
- Development process steps and workflow
- Spec management processes and templates
- Integration between specs and Git workflow
- Project planning and communication guidelines

**Use this when:** Creating specs, understanding workflow, or managing project processes.

### 💻 [coding.md](./coding.md)
**Universal Coding Standards**
- Language-agnostic coding principles and philosophy
- Security guidelines (general concepts)
- Accessibility standards (WCAG AA principles)
- Git workflow and code review process
- Testing philosophy and strategies
- Performance guidelines

**Use this when:** Understanding universal development principles and establishing project workflow.

### ⚡ [coding-react-router.md](./coding-react-router.md)
**Technology-Specific Implementation**
- TypeScript, React, and React Router coding conventions
- Database patterns with Prisma
- CSS/Styling conventions with shadcn/ui and Tailwind
- Authentication with React Router sessions
- Environment configuration and Railway deployment
- Progressive Web App implementation
- Tool configurations and setup

**Use this when:** Writing code, setting up development environment, or implementing features.

### 📝 [specs/](./specs/)
**Technical Specifications & Research**
- [status.md](./specs/status.md) - Implementation status overview and tracking
- Individual spec files (GRID-XXX.md) with technical specifications
- Research notes and implementation details
- Cross-references to issues for public tracking

**Use this when:** Researching implementation details, checking development status, or understanding technical requirements.

### 🎨 [design.md](./design.md) *(To be created)*
**Design System & UI Guidelines**
- Visual design standards and brand guidelines
- Component design patterns and usage
- Color palettes, typography, and spacing
- Responsive design principles
- User experience guidelines

**Use this when:** Designing UI components, creating consistent visual experiences, or maintaining brand standards.

### 📖 [product/](./product/)
**Product Requirements & Research**
- [prd.md](./product/prd.md) - Product requirements and specifications
- [research.md](./product/research.md) - EIA-930 dataset research and analysis
- [features.md](./product/features.md) - Feature definitions and user stories
- [stack-fit.md](./product/stack-fit.md) - Architecture and technology analysis
- [design.md](./product/design.md) - UI/UX design specifications

**Use this when:** Understanding product goals, planning features, or making product decisions.

### 📚 [documentation.md](./documentation.md)
**Documentation Guidelines & Standards**
- Documentation principles and formatting standards
- Content guidelines and writing style
- Maintenance processes and review procedures
- Templates and quality checklists

**Use this when:** Creating or updating documentation, ensuring consistency across docs.

### 📅 [activity/](./activity/)
**Development Context & Research Log**
- [daily.md](./activity/daily.md) - Daily context, research findings, and GitHub Issues summary
- [weekly.md](./activity/weekly.md) - Strategic decisions and completed GitHub Issues aggregation
- Focus on WHY decisions were made, not WHAT was completed
- GitHub Issues provide completion tracking, activity logs provide context

**Use this when:** Understanding decision context, reviewing research findings, or tracking strategic direction changes.

### 🎭 [roles.md](./roles.md)
**LLM Roles and Personas**
- Architect role: technical direction and architectural decisions
- Developer role: implementation focus and honest technical feedback
- Interaction patterns and collaboration guidelines
- Conflict resolution and success metrics

**Use this when:** Setting up LLM sessions with specific roles, defining responsibilities and behaviors.

## Quick Navigation

**Getting Started:**
1. Read [product/prd.md](./product/prd.md) for product understanding
2. Review [process.md](./process.md) for workflow guidelines
3. Study [coding.md](./coding.md) for universal principles
4. Review [coding-react-router.md](./coding-react-router.md) for implementation details
5. Check [specs/status.md](./specs/status.md) for current work

**During Development:**
- Create specs following [process.md](./process.md) guidelines
- Follow universal standards in [coding.md](./coding.md)
- Apply technology-specific patterns from [coding-react-router.md](./coding-react-router.md)
- Reference [design.md](./design.md) for UI consistency *(to be created)*
- Update progress in [specs/status.md](./specs/status.md) and individual spec files
- Log daily activities in [activity/daily.md](./activity/daily.md)

**For Reviews:**
- Verify spec completion in [specs/status.md](./specs/status.md)
- Check code against universal standards in [coding.md](./coding.md)
- Verify technology-specific patterns in [coding-react-router.md](./coding-react-router.md)
- Ensure design consistency with [design.md](./design.md) *(to be created)*

## Contributing to Documentation

See [documentation.md](./documentation.md) for comprehensive guidelines on:
- Documentation standards and formatting
- Content guidelines and writing style
- Maintenance processes and review procedures
- Templates and quality checklists

**Quick reference:**
- Create specs for major documentation changes
- Follow Git workflow for all updates
- Review for accuracy and test all links
- Maintain consistency across documents
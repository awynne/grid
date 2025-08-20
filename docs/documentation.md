# Documentation Guidelines

## Documentation Principles

### ✅ Single Source of Truth
Each document has a clear, distinct purpose with minimal overlap. Cross-references link related information without duplication.

### 🤖 LLM-Friendly Format
All documentation is structured for easy parsing by both humans and AI assistants, with consistent formatting and clear section headers.

### 🔄 Living Documents
Documentation is updated alongside code changes and project evolution. Keep information current and actionable.

### 📚 Comprehensive Coverage
From high-level product strategy to detailed coding standards, documentation covers all aspects of project development.

## Documentation Structure

### File Naming Conventions
- Use lowercase with hyphens for multi-word files: `file-name.md`
- Use descriptive, clear names that indicate purpose
- Keep names concise but unambiguous

### Formatting Standards

#### Headers
```markdown
# Main Title (H1) - Only one per document
## Major Section (H2)
### Subsection (H3)
#### Detail Section (H4)
```

#### Code Blocks
```markdown
# ✅ Use descriptive comments
```typescript
// ✅ Good example with context
export function UserService() {
  // Implementation details
}
```

# ❌ Avoid uncommented code blocks
```

#### Lists and Checkboxes
```markdown
# ✅ Use checkboxes for actionable items
- [ ] Task to be completed
- [x] Completed task

# ✅ Use bullets for reference lists
- Reference item
- Another reference item
```

#### Emphasis and Callouts
```markdown
**Bold** for important terms and concepts
*Italic* for emphasis or foreign terms
`code` for inline code and filenames

> **📋 Note**: Use blockquotes with emoji for callouts
> **⚠️ Warning**: For important warnings
> **💡 Tip**: For helpful suggestions
```

### Cross-References
- Always use relative links: `[process.md](./process.md)`
- Include anchor links for specific sections: `[task template](./process.md#task-template)`
- Update all references when moving or renaming content
- Test links when making changes

### Code Examples
- Include practical, working examples
- Show both correct (✅) and incorrect (❌) patterns
- Provide context for why examples are good or bad
- Use consistent variable names and patterns across documents

## Content Guidelines

### Writing Style
- **Clear and concise** - Avoid unnecessary words, don't be a sycophant, don't use corporate-speak
- **Actionable** - Focus on what readers should do
- **Consistent terminology** - Use the same terms throughout
- **Present tense** - "Use this pattern" not "You should use this pattern"

### Section Organization
1. **Purpose statement** - What this section covers
2. **Key concepts** - Important terms and ideas
3. **Practical examples** - How to apply the concepts
4. **Common mistakes** - What to avoid
5. **Cross-references** - Related information

### Examples and Templates
- Provide copy-paste templates when possible
- Include filled-out examples alongside templates
- Show progression from simple to complex examples
- Explain each part of complex examples

## Maintenance Process

### When to Update Documentation

#### process.md
- Workflow processes change
- Task management procedures evolve
- New project management tools adopted
- Team roles or responsibilities change

#### coding.md
- New technical standards adopted
- Development tools or frameworks updated
- Security requirements change
- Coding patterns evolve

#### tasks/ directory
- Continuously as tasks are created, updated, completed
- Project milestones change
- Dependencies are resolved or added

#### design.md
- Design system components added or modified
- Visual standards change
- New design tools or processes adopted
- Brand guidelines updated

#### prd.md
- Product requirements change
- New features planned or removed
- User research provides new insights
- Business objectives shift

### Documentation Review Process

#### For Minor Updates
1. Make changes directly to documentation
2. Include documentation updates in relevant code PRs
3. Ensure cross-references remain accurate

#### For Major Updates
1. **Create task** in [tasks/status.md](./tasks/status.md) for significant documentation changes
2. **Follow Git workflow** from [coding.md](./coding.md)
3. **Review for accuracy** - Ensure technical accuracy and completeness
4. **Review for clarity** - Test with someone unfamiliar with the content
5. **Test all links** - Verify cross-references and external links work
6. **Update related documents** - Ensure consistency across all docs

### Quality Checklist
- [ ] **Clear purpose** - Reader understands what document covers
- [ ] **Consistent formatting** - Follows established patterns
- [ ] **Working examples** - All code examples are tested and functional
- [ ] **Accurate links** - All cross-references work correctly
- [ ] **Up-to-date content** - Information reflects current practices
- [ ] **Appropriate detail level** - Neither too basic nor too advanced
- [ ] **Actionable guidance** - Reader knows what to do next

## Documentation Tools and Automation

### VS Code Extensions
```json
{
  "recommendations": [
    "yzhang.markdown-all-in-one",
    "DavidAnson.vscode-markdownlint",
    "bierner.markdown-preview-github-styles"
  ]
}
```

### Markdown Linting Rules
- Use consistent heading styles
- Avoid trailing whitespace
- Include alt text for images
- Use consistent list markers
- Limit line length to 120 characters for readability

### Link Checking
```bash
# Manually check links periodically
# Use markdown-link-check or similar tools in CI/CD if needed
```

## Templates

### New Document Template
```markdown
# Document Title

> **📋 Purpose**: Brief description of what this document covers and when to use it.

## Table of Contents
- [Section 1](#section-1)
- [Section 2](#section-2)

## Section 1

### Subsection
Content with examples and practical guidance.

## Cross-References
- Related information in [other-doc.md](./other-doc.md)
- Specific procedures in [process.md#section](./process.md#section)
```

### Section Template
```markdown
### Section Title

#### Purpose
What this section covers and why it's important.

#### Guidelines
- Clear, actionable guidelines
- With specific examples

#### Examples
```language
// ✅ Good example
code example
```

```language
// ❌ Avoid this
problematic code
```

#### Common Mistakes
- What people often get wrong
- How to avoid these mistakes

#### See Also
- [Related section](./file.md#section)
```

## Documentation Metrics

### Success Indicators
- **Reduced questions** - Fewer clarification requests on covered topics
- **Faster onboarding** - New team members productive more quickly
- **Consistent implementation** - Code follows documented standards
- **Self-service** - Team members find answers without asking
- **Up-to-date content** - Documentation reflects current practices

### Review Schedule
- **Monthly**: Quick review of all documents for accuracy
- **Quarterly**: Comprehensive review and update cycle
- **Major releases**: Full documentation audit and updates
- **Tool changes**: Immediate updates when processes change
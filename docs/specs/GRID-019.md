### GRID-019: Open Source License Selection and Implementation

**GitHub Issue**: #TBD (public tracking)
**Spec Purpose**: Evaluate and select an open source license, add LICENSE and notices, and update repository metadata to reflect the chosen license.
**Status**: 📋 Research
**Priority**: Medium
**Created**: 2025-08-30

## Technical Overview
This spec defines how GridPulse will adopt an open source license. It evaluates candidate licenses, documents decision criteria, and outlines the implementation steps to add a LICENSE file, update repository metadata, and communicate the choice. The selection should align with project goals: open collaboration, community contributions, compatibility with common JS/TS ecosystems, and clarity on permissions, conditions, and patent grants.

## Implementation Requirements
- [ ] Select an OSI-approved license based on criteria below
- [ ] Add root-level `LICENSE` file with the exact approved text
- [ ] Update `package.json` `license` field to SPDX identifier
- [ ] Update `README.md` with license badge/section and link to `LICENSE`
- [ ] Add copyright notice and year in `LICENSE` name section
- [ ] Add `NOTICE` file if required by selected license (e.g., Apache-2.0)
- [ ] Create `docs/legal/` with brief rationale and obligations summary
- [ ] Add PR/issue templates guidance to reference license obligations if needed
- [ ] Verify third-party dependencies’ license compatibility
- [ ] Confirm CI and distribution artifacts include license where appropriate

## Decision Criteria
- Permissiveness vs. copyleft strength (contribution and adoption goals)
- Patent grant scope and termination conditions
- Notice and attribution requirements for redistributions
- Compatibility with npm ecosystem and common contributors’ preferences
- Corporate/commercial adoption friendliness
- Enforceability clarity and OSI approval
- Simplicity of compliance for contributors and users

## Candidates Considered
Note: Final choice should incorporate the owner’s “open source license options” document referenced outside this repo. Pending that input, the likely short list is:
- MIT: Simple, permissive; no explicit patent grant
- Apache-2.0: Permissive with explicit patent license and NOTICE requirements
- GPL-3.0-only/-or-later: Strong copyleft; impacts downstream proprietary use
- LGPL-3.0: Weak copyleft for libraries; less friction than GPL
- MPL-2.0: File-level copyleft; good balance for some ecosystems

Recommendation if no additional constraints from the owner document: Apache-2.0 (permits wide adoption, includes patent grant, has clear NOTICE obligations). MIT remains acceptable if minimal obligations are preferred and patent risks are deemed low.

## Implementation Details
- LICENSE: Use exact upstream text from OSI; do not modify wording
- package.json: `"license": "Apache-2.0"` (or selected SPDX)
- README: Add “License” section: short description + link to LICENSE + badge
- NOTICE (if applicable): List project copyright and any required attributions
- Source headers: Optional; only if policy requires. Prefer repo-level LICENSE/NOTICE
- Docs: Add `docs/legal/license-rationale.md` with: chosen license, alternatives considered, obligations summary, and FAQs

## Dependencies & Integration
- Documentation workflow (docs/): ensure references and badges are consistent
- CI/release: verify packaged artifacts include LICENSE (and NOTICE if required)
- GitHub settings: add repository license via UI when convenient (optional)

## Research Notes
- MIT and Apache-2.0 are the most common for TypeScript OSS; Apache’s patent grant is often preferred for org adoption
- Copyleft options (GPL/MPL/LGPL) may deter some adopters but can be appropriate if ensuring open derivatives is a goal
- Some ecosystems (e.g., clients embedding code) prefer permissive licensing to reduce obligations

## Testing Strategy
- Validate `npm pack` includes `LICENSE` (and `NOTICE` if applicable)
- Confirm `package.json` license passes `npm`/GitHub detection
- Verify README links and badges render correctly
- Manual compliance review against OSI text and project files


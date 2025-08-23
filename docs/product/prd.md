# Product Requirements Document (PRD)

> **📖 Purpose**: Product vision, requirements, and specifications for the GridPulse electric grid data visualization platform.

## Table of Contents
- [Product Overview](#product-overview)
- [Target Audience](#target-audience)
- [Product Goals & Objectives](#product-goals--objectives)
- [User Personas](#user-personas)
- [User Stories & Use Cases](#user-stories--use-cases)
- [Feature Requirements](#feature-requirements)
- [Technical Requirements](#technical-requirements)
- [User Experience Requirements](#user-experience-requirements)
- [Performance Requirements](#performance-requirements)
- [Security Requirements](#security-requirements)
- [Accessibility Requirements](#accessibility-requirements)
- [Success Metrics](#success-metrics)
- [Release Plan](#release-plan)
- [Future Roadmap](#future-roadmap)

## Product Overview

### Vision Statement
A lightweight, near-real-time web app that turns hourly grid data into: a daily story, personal "what to do now/next," an exploration of duck-curve dynamics, and a one-glance change summary.

### Product Mission
Transform scattered grid charts into actionable insights for reporters, consumers, analysts, and executives using EIA-930 data.

### Value Proposition
**Problem:** People see scattered grid charts but don't get quick, actionable or narrative insights.
**Solution:** GridPulse provides four focused experiences that turn raw EIA-930 data into immediately useful information.

### Problem Statement
Electric grid data is published hourly by EIA-930 but remains fragmented across different charts and dashboards. Users struggle to:
- Extract narrative insights for reporting
- Know when electricity is cleanest for load shifting
- Understand duck curve patterns and grid dynamics
- Quickly identify material changes from baseline

### Solution Overview
GridPulse delivers four core experiences:
1. **Daily Pulse** - Auto-generated daily narrative + annotated chart
2. **What's Powering Me** - Current CO₂ intensity + next clean window
3. **Duck Days** - Discoverable gallery of duck curve patterns
4. **What Changed** - Daily diff cards vs baseline metrics

## Target Audience

### Primary Users
- **Reporters / energy bloggers** - Need fast, accurate daily updates with embeddable charts
- **Consumers / prosumers** - Want to time electricity usage for lower emissions
- **Analysts / educators** - Require tools to surface and explain grid patterns
- **Executives / product managers** - Need quick summaries of material changes

### Secondary Users
- **Policy makers** - Understanding grid dynamics for regulation
- **Utility operators** - Benchmarking against other balancing authorities
- **Researchers** - Accessing clean, structured grid data

### User Characteristics
- **Technical comfort**: Varies from general public to technical experts
- **Time constraints**: Need information quickly (30 seconds to 5 minutes)
- **Context**: Often looking for specific insights rather than general exploration
- **Sharing needs**: Frequently embed or share findings with others

### User Environment
- **Access patterns**: Both desktop and mobile usage
- **Network**: Varies from high-speed to mobile connections
- **Context**: Often multitasking, need focused information
- **Urgency**: Mix of real-time needs and historical analysis

## Product Goals & Objectives

### Business Goals
- **Activation**: ≥40% of first-time visitors interact with BA/date controls
- **Engagement**: Median session ≥2:00; ≥1 chart expand per visit
- **Shareability**: ≥10% sessions use "Copy link/Embed" (Daily Pulse)
- **Utility**: ≥30% click "Next clean window" info on What's Powering Me

### User Goals
- **Reporters**: Get headline and chart for daily energy story in <60 seconds
- **Consumers**: Know when to run electricity-hungry tasks for lower emissions
- **Analysts**: Surface and explain duck-curve patterns with minimal setup
- **Executives**: See what moved yesterday vs typical at a glance

### Technical Goals
- **Performance**: First paint <2.5s on 3G Fast; API TTFB <300ms from cache
- **Reliability**: Serve cached data if upstream stale; uptime target 99.5% (MVP)
- **Scalability**: Handle 60+ balancing authorities and 2+ years of hourly data
- **Freshness**: Show per-series "Last updated" badges with graceful degradation

### Success Criteria
- **MVP Launch**: 5 BAs, 4 core features, <$50/month infrastructure cost
- **User Adoption**: 100+ monthly users within 3 months
- **Content Quality**: 100% headline/annotation accuracy vs computed series in QA
- **Technical Performance**: Meet all Core Web Vitals targets

## User Personas

### Primary Persona: Energy Reporter (Sarah)
- **Role**: Energy journalist at regional publication
- **Goals**: Daily story with credible data and shareable visuals
- **Pain Points**: Manual chart creation, data verification time
- **Behavior**: Checks multiple sources, needs quick turnaround
- **Success**: "Give me a headline and chart I can embed today, fast"

### Secondary Persona: Conscious Consumer (Mike)
- **Role**: Homeowner with solar panels and EV
- **Goals**: Time energy usage for lower costs and emissions
- **Pain Points**: Don't know when grid is cleanest
- **Behavior**: Willing to shift flexible loads if guidance is clear
- **Success**: "Tell me when to run electricity-hungry tasks for lower emissions"

### Analyst Persona: Grid Educator (Dr. Kim)
- **Role**: University researcher studying grid flexibility
- **Goals**: Find and explain duck curve examples for teaching
- **Pain Points**: Hard to surface good examples quickly
- **Behavior**: Needs reproducible analysis and clear visualizations
- **Success**: "Let me surface and explain duck-curve patterns with minimal setup"

## User Stories & Use Cases

### Epic 1: Daily Pulse (F1)
- Auto-generated daily narrative with annotated chart
- Embeddable content for reporters and bloggers
- Peak/trough identification and forecast comparison
- **User Story**: "As a reporter, I want a concise daily brief with chart so I can publish quickly"

### Epic 2: What's Powering Me (F2)
- Current CO₂ intensity indicator and next clean window
- 24-hour band visualization for load shifting guidance
- **User Story**: "As a consumer, I want to see when electricity is cleanest so I can time flexible loads"

### Epic 3: Duck Days Explorer (F3)
- Gallery of "duckiest" days with scoring algorithm
- Detailed net-load analysis and comparison to typical patterns
- **User Story**: "As an analyst, I want to surface duck-curve patterns so I can teach grid dynamics"

### Epic 4: What Changed Dashboard (F4)
- Daily difference cards comparing yesterday vs baseline
- KPI tracking for demand, clean hours, ramps, and interchange
- **User Story**: "As an executive, I want a one-glance summary so I can spot material changes"

### Epic 5: Shared Infrastructure (F0)
- BA selector, date controls, and deep linking
- Data freshness indicators and graceful error handling
- **User Story**: "As any user, I want consistent controls and data freshness so I can trust and share views"

## Feature Requirements

### MVP Features (Version 1.0)
- **Scope**: Lower-48 BAs with data present in EIA-930
- **Data Types**: Hourly demand, fuel mix, interchange, CO₂ estimate, day-ahead forecast
- **Time Ranges**: Today, Yesterday, Last 7/30 days, custom single-day
- **Core Features**: Daily Pulse + What's Powering Me cards
- **Access**: No login; public read-only site with accountless sharing

### Phase 2 Features
- Duck Days gallery and detailed analysis
- What Changed daily diff dashboard
- Enhanced embed capabilities with oEmbed support
- Mobile-optimized responsive design

### Future Features
- Email/Slack daily digest notifications
- Saved views and alert preferences (requires auth)
- Additional balancing authorities and data sources
- Advanced analytical tools and comparisons

### Feature Prioritization
**Prioritization Framework**: Ease (1-5) × Demo Wow (1-5)
- **F1 Daily Pulse**: 10 (high impact, moderate complexity)
- **F2 What's Powering Me**: 9 (high utility, simple implementation)
- **F3 Duck Days**: 9 (high educational value, moderate complexity)
- **F4 What Changed**: 8 (useful but requires baseline computation)
- **F0 Infrastructure**: 8 (essential foundation, moderate complexity)

## Technical Requirements

### Platform Requirements
- **Architecture**: Dual-service (Remix web + worker) on Railway
- **Database**: PostgreSQL with monthly partitioning (TimescaleDB upgrade path)
- **Caching**: Redis (Upstash) for computed results and API responses
- **Background Jobs**: node-cron for hourly ingestion (BullMQ upgrade path)
- **Reference**: [stack-fit.md](./stack-fit.md) and [GRID-008](../specs/GRID-008.md)

### Browser Support
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Progressive Enhancement**: Works without JavaScript for basic content

### Device Support
- **Responsive Design**: Mobile-first approach with breakpoints
- **Touch Optimization**: Charts and controls work on touch devices
- **Screen Readers**: Full ARIA support and keyboard navigation
- **Offline Capability**: PWA with cached data fallbacks

### Integration Requirements
- **EIA v2 API**: Hourly data ingestion with rate limiting and resilience
- **Embed Support**: iFrame and script-based embeds for external sites
- **Export Formats**: PNG, CSV, and shareable links
- **Deep Linking**: All views shareable via URL parameters

### Data Requirements
- **Data Sources**: EIA-930 hourly electric grid monitor exclusively
- **Coverage**: 60+ balancing authorities across Lower-48 states
- **Freshness**: Per-series timestamps with staleness indicators
- **Storage**: Minimum 2 years retention, partitioned by month
- **Backup**: Automated daily backups with point-in-time recovery

## User Experience Requirements

### Design Requirements
- **Information Architecture**: Hybrid dashboard with stackable cards + deep-link pages
- **Visual Hierarchy**: Clear primary actions, secondary details on hover/click
- **Brand Identity**: GridPulse branding with professional, data-focused aesthetic
- **Component Library**: shadcn/ui with custom grid-specific extensions
- **Reference**: [design.md](./design.md) when created

### Interaction Requirements
- **BA Selection**: Typeahead search with geo-location default suggestion
- **Date Controls**: Presets (Today/Yesterday/Last 7d) + custom date picker
- **Chart Interactions**: Hover tooltips, click annotations, zoom/pan support
- **Sharing**: One-click copy link, embed code generation

### Navigation Requirements
- **Header Controls**: BA dropdown, date picker, freshness indicators
- **Card Navigation**: Expand to full view, deep-link to focused pages
- **Breadcrumbs**: Clear path back to dashboard from detail views
- **Mobile Menu**: Collapsible navigation for smaller screens

### Responsive Design Requirements
- **Breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Chart Scaling**: Responsive charts with touch-friendly interactions
- **Card Layout**: 1 column mobile, 2 column tablet, 3-4 column desktop
- **Typography**: Readable at all sizes with proper contrast ratios

## Performance Requirements

### Page Load Times
- *Reference performance guidelines from [coding.md](./coding.md#performance-guidelines)*

### Core Web Vitals
- *Reference targets from [coding-remix-stack.md](./coding-remix-stack.md)*

### Offline Functionality
- *Reference PWA guidelines from [coding-remix-stack.md](./coding-remix-stack.md)*

### Scalability Requirements
- *To be defined*

## Security Requirements

### Authentication Requirements
- *Reference security guidelines from [coding.md](./coding.md#security-guidelines) and [coding-remix-stack.md](./coding-remix-stack.md)*

### Authorization Requirements
- *To be defined*

### Data Protection Requirements
- *To be defined*

### Compliance Requirements
- *To be defined*

## Accessibility Requirements

### WCAG Compliance
- *Reference accessibility standards from [coding.md](./coding.md#accessibility-standards)*

### Assistive Technology Support
- *To be defined*

### Keyboard Navigation
- *To be defined*

### Screen Reader Support
- *To be defined*

## Success Metrics

### User Engagement Metrics
- **Activation**: ≥40% of first-time visitors interact with BA/date controls
- **Session Quality**: Median session ≥2:00; ≥1 chart expand per visit
- **Feature Adoption**: ≥30% click "Next clean window" on What's Powering Me
- **Content Interaction**: ≥40% of Duck Days gallery viewers click a day detail

### Performance Metrics
- **Page Load**: First paint <2.5s on 3G Fast connections
- **API Response**: TTFB <300ms from cache, <1s from database
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Uptime**: 99.5% availability target for MVP

### Business Metrics
- **Shareability**: ≥10% sessions use "Copy link/Embed" features
- **Content Quality**: 100% headline/annotation accuracy vs computed data
- **User Growth**: 100+ monthly active users within 3 months of launch
- **Cost Efficiency**: <$50/month infrastructure cost for MVP scale

### Technical Metrics
- **Data Freshness**: <10% sessions encounter stale-data warnings
- **Ingestion Success**: ≥99% successful hourly data ingestion jobs
- **Cache Performance**: ≥70% cache hit rate for computed results
- **Error Rate**: <1% application error rate across all endpoints

## Release Plan

### MVP Release (Version 1.0)
- **Milestone M0**: Backend ingest (BA list, demand + fuel mix, baselines job)
- **Milestone M1**: Dashboard with Daily Pulse + What's Powering Me cards
- **Milestone M2**: Duck Days gallery + What Changed KPIs
- **Milestone M3**: Embeds for Daily Pulse + shareable deep links
- **Target**: 4-6 weeks from architecture completion

### Subsequent Releases
- **Version 1.1**: Mobile optimization and PWA capabilities
- **Version 1.2**: Enhanced embed features and oEmbed support
- **Version 1.3**: Optional authentication for saved preferences
- **Version 2.0**: Email/Slack digest and alert capabilities

### Release Criteria
- All 4 core features (F1-F4) functional with 5+ balancing authorities
- Performance targets met (Core Web Vitals, response times)
- Data accuracy validated (100% headline/annotation accuracy)
- Accessibility compliance (WCAG AA)
- Error rate <1% and uptime >99.5%

### Go-to-Market Strategy
- **Phase 1**: Soft launch with energy reporter contacts for feedback
- **Phase 2**: Social media promotion in energy/data visualization communities
- **Phase 3**: Outreach to educational institutions and policy organizations
- **Content Marketing**: Blog posts about duck curve patterns, grid insights

## Future Roadmap

### Short-term Goals (3-6 months)
- **Scale to Production**: All 60+ balancing authorities with TimescaleDB
- **Mobile Excellence**: Fully optimized mobile experience with touch interactions
- **Advanced Analytics**: Baseline comparisons, trend analysis, forecasting accuracy
- **Community Building**: 1000+ monthly users, active feedback loop

### Medium-term Goals (6-12 months)
- **API Platform**: Public API for third-party integrations
- **Advanced Alerts**: Email/SMS notifications for grid events
- **Regional Analysis**: Multi-BA comparisons and regional insights
- **Educational Content**: Guided tutorials and explanations

### Long-term Vision (1+ years)
- **Global Expansion**: International grid data sources beyond US
- **Real-time Features**: Sub-hourly data where available
- **Predictive Analytics**: Machine learning for demand and generation forecasting
- **Policy Tools**: Regulatory analysis and scenario modeling

### Potential Integrations
- **Weather APIs**: Correlation with weather patterns
- **Carbon Tracking**: Integration with corporate sustainability platforms
- **Educational LMS**: Content for energy courses and training
- **Utility APIs**: Direct data feeds from progressive utilities

## Constraints & Assumptions

### Technical Constraints
- **Data Dependency**: Limited to EIA-930 availability and accuracy
- **API Rate Limits**: EIA v2 API throttling affects ingestion frequency
- **Time Zone Complexity**: Balancing authority boundaries vs time zones
- **Behind-the-Meter Solar**: Net-load calculations are approximations

### Business Constraints
- **Public Data Only**: Cannot access proprietary utility data
- **No Revenue Model**: Free public service limits monetization options
- **Regulatory Sensitivity**: Energy data requires careful interpretation
- **Attribution Requirements**: Must credit EIA as data source

### Resource Constraints
- **Solo Development**: Limited by single developer bandwidth
- **Infrastructure Budget**: Target <$50/month for MVP scale
- **Data Storage**: Costs scale with retention period and BA coverage
- **API Costs**: Potential future charges for high-volume EIA access

### Assumptions
- **EIA Stability**: API structure and data quality remain consistent
- **User Interest**: Demand exists for accessible grid data insights
- **Technical Stack**: Remix/Railway ecosystem meets scaling needs
- **Data Freshness**: Users accept 1-2 hour lag for non-demand data

## Risk Assessment

### Technical Risks
- **Data lag creates confusion**: Users expect real-time but get 1-2 hour delays
- **Coverage gaps across BAs**: Not all regions report all data series
- **EIA API changes**: Endpoint modifications could break ingestion
- **Query performance degradation**: Time-series data growth impacts response times

### Business Risks
- **Low user adoption**: Market may be smaller than anticipated
- **Misinterpretation of data**: Users draw incorrect conclusions from visualizations
- **Competition from utilities**: Utilities may create superior internal tools
- **Regulatory sensitivity**: Incorrect analysis could influence policy decisions

### Mitigation Strategies
- **Freshness transparency**: Per-series badges, tooltips explain lags, avoid "real-time" claims
- **Graceful degradation**: Default to well-covered BAs, show skeletons for missing data
- **API monitoring**: Smoke tests, versioning, fallback to cached data
- **Performance planning**: GRID-007 data volume analysis, TimescaleDB migration path
- **User education**: Clear disclaimers, formula explanations, methodology transparency
- **Quality assurance**: 100% accuracy requirement, automated validation checks

## Cross-References

### Product Documentation
- [Product Research](./research.md) - EIA-930 dataset analysis and feature derivation
- [Features & Epics](./features.md) - Detailed feature specifications and user stories
- [Stack-Fit Analysis](./stack-fit.md) - Technical architecture analysis and recommendations
- [Design System](./design.md) - Visual and UX specifications *(to be created)*

### Technical Documentation
- [Universal Coding Standards](../coding.md) - Language-agnostic development principles
- [Remix Stack Technical Standards](../coding-remix-stack.md) - Technology-specific implementation guidelines
- [Process Guidelines](../process.md) - Development workflow and spec management
- [GRID-007](../specs/GRID-007.md) - Data volume analysis task
- [GRID-008](../specs/GRID-008.md) - MVP architecture design specification
- [Spec Status](../specs/status.md) - Current development progress
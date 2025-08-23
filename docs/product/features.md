# GridPulse Features & Epics

> **🎯 Purpose**: Feature specifications and acceptance criteria for GridPulse electric grid data visualization platform.

## Table of Contents
- [Feature Index](#feature-index)
- [Feature Specifications](#feature-specifications)
  - [F0: Shared Shell & Freshness](#f0-shared-shell--freshness)
  - [F1: Daily Pulse](#f1-daily-pulse)
  - [F2: What's Powering Me](#f2-whats-powering-me)
  - [F3: Duck Days](#f3-duck-days)
  - [F4: What Changed](#f4-what-changed)

## Feature Index

| ID     | Feature                      | **Goal**                                                         | Primary Route         |
| ------ | ---------------------------- | ---------------------------------------------------------------- | --------------------- |
| **F0** | **Shared Shell & Freshness** | Common nav, deep links, freshness & empty states                 | shared (`/dashboard`) |
| **F1** | **Daily Pulse**              | Auto-generate a daily, embeddable narrative with annotated chart | `/daily`              |
| **F2** | **What's Powering Me**       | Surface current CO₂ intensity and the next clean window          | `/wpm`                |
| **F3** | **Duck Days**                | Find and explain "duckiest" days; visualize net-load dynamics    | `/ducks`              |
| **F4** | **What Changed**             | Summarize yesterday vs baseline with actionable deltas           | `/diff`               |

> **Implementation note:** Each feature links to GitHub issues for implementation tracking and progress visibility.

## Feature Specifications

### F0: Shared Shell & Freshness

**User Story:** As any user, I want consistent BA/date controls, deep links, and clear data freshness so I trust what I'm seeing and can share exact views.

**Problem:** Users can't tell what's fresh, and shared URLs don't reliably reproduce the same view.

**Outcome:** Trust and shareability via consistent BA/date controls, deep links, and visible freshness.

**Success Metrics:**
- ≥20% of sessions copy or share a deep link
- <10% of sessions encounter a stale-data warning (and tooltip explains cause)
- ≥95% of deep-link loads reproduce identical state (BA/date/visible series)

**Acceptance Criteria:**
- BA selector with typeahead search and geo-location defaults
- Date controls with presets (Today/Yesterday/Last 7d) and custom picker
- URL parameters reflect all selections for deep linking
- Per-series freshness badges with last-updated timestamps
- Graceful error states with informative messages
- Keyboard accessible navigation and controls

**Implementation Status**: [Track on GitHub](https://github.com/awynne/grid/issues?q=label%3Aepic%3Af0-shared-shell)

---

### F1: Daily Pulse

**User Story:** As a reporter or energy blogger, I want a concise daily brief with an annotated chart for my BA so I can publish or embed a trustworthy update quickly.

**Problem:** Reporters need a fast, accurate daily update they can reuse without hand-curating charts.

**Outcome:** One-click brief with headline, bullets, and annotated chart; embeddable and shareable.

**Success Metrics:**
- ≥10% of sessions use "Copy link/Embed"
- 100% headline/annotation accuracy vs computed series in QA
- Median time-to-first-embed ≤60s for first-time visitors

**Functional Requirements:**

**Inputs:** Hourly demand, generation by fuel, day-ahead forecast, interchange (optional), CO₂ (optional).

**Computation:**
- Identify **peak hour** & **trough**
- Compute **largest deviation vs day-ahead forecast** (if forecast available)
- Detect **notable ramp** (max Δ over 1h within 15:00–21:00)
- Generate copy via templates with thresholds (e.g., "X% above typical", "cleanest hour at HH:00")

**Outputs:** Headline, 3–5 bullets, annotated chart, shareable permalink, embed snippet.

**Acceptance Criteria:**
- Headlines avoid jargon, fit ≤120 chars, and never contradict chart values
- Annotated fuel-mix + demand chart with peak/trough/ramp markers
- Hover tooltips show exact values, legend toggles visibility
- Copy permalink and embed snippet (oEmbed/iFrame support)
- PNG download capability
- Renders identically when embedded

**Implementation Status**: [Track on GitHub](https://github.com/awynne/grid/issues?q=label%3Aepic%3Af1-daily-pulse)

---

### F2: What's Powering Me

**User Story:** As a consumer/prosumer or facilities operator, I want to see current CO₂ intensity and the next clean window for my BA so I can time flexible loads and lower emissions without effort.

**Problem:** People don't know when electricity is cleanest to shift flexible loads.

**Outcome:** Clear CO₂ status and the next clean window with simple guidance.

**Success Metrics:**
- ≥30% open the clean-window tooltip or band details
- ≥60% of eligible sessions display a clean window within the next 24h
- CO₂ fallback estimation error <2% vs native CO₂ where available

**Functional Requirements:**

**Inputs:** Hourly fuel mix &/or CO₂ estimate for selected BA; next 24–48h horizon.

**Computation:**
- If CO₂ available, use it; else estimate from fuel mix via fixed intensity factors
- Compute **"clean windows"**: contiguous blocks where intensity is in the top (cleanest) quartile for the next 24h
- Output next window bounds & a compact hour-band visualization

**Outputs:** Current intensity status; next clean window; micro-copy suggestions.

**Acceptance Criteria:**
- Current CO₂ intensity pill with timestamped freshness badge
- Next clean window computation with start–end times
- 24-hour band visualization colored by CO₂ quartiles
- Fuel-mix fallback with disclaimer tooltip when CO₂ data unavailable
- Window aligns with underlying series within one refresh cycle
- Simple guidance text for load shifting

**Implementation Status**: [Track on GitHub](https://github.com/awynne/grid/issues?q=label%3Aepic%3Af2-powering-me)

---

### F3: Duck Days

**User Story:** As an analyst or educator, I want to surface the "duckiest" days and explain net-load dynamics so I can teach and communicate grid flexibility needs.

**Problem:** It's hard to find and explain "duck curve" days quickly.

**Outcome:** Ranked gallery and annotated detail that make the dynamics obvious.

**Success Metrics:**
- ≥40% of gallery viewers click a day detail
- Median time on a detail ≥20s
- Score reproducibility: 100% stability on re-run with unchanged data

**Functional Requirements:**

**Inputs:** Hourly demand & solar generation (or proxy from fuel mix).

**Computation:**
- **Net load** = demand − solar
- **Duckiness score (0–100):** 50% evening ramp rate (3–9pm), 35% valley depth (max−midday min), 15% trough time (earlier = higher)
- Rank last 60 days; store top N

**Outputs:** Gallery cards; detail chart with annotations; compare vs typical weekday curve.

**Acceptance Criteria:**
- Score = 0–100 using ramp/valley/trough formula; reproducible and stored daily
- Gallery shows 8 cards with date+score+sparkline; stable ranking unless new data
- Day detail with net-load line + fuel-mix area chart
- Annotations for trough time, evening ramp rate
- Overlay comparison with typical weekday curve
- Score explanation tooltip ("why this score?")

**Implementation Status**: [Track on GitHub](https://github.com/awynne/grid/issues?q=label%3Aepic%3Af3-duck-days)

---

### F4: What Changed

**User Story:** As an executive, PM, or analyst, I want a one-glance summary of yesterday vs baseline so I can spot material changes and drill into the relevant hour.

**Problem:** Busy stakeholders lack a quick sense of what materially changed yesterday.

**Outcome:** Delta cards that spotlight peaks, cleanest hour, ramps, and interchange.

**Success Metrics:**
- ≥35% of users click at least one KPI card
- Tooltip open rate ≥25%
- Baseline calculation job success rate ≥99%

**Functional Requirements:**

**Inputs:** Yesterday's hourly series; 30-day same-weekday baseline.

**Computation:** KPIs: max demand; cleanest hour (min CO₂); largest ramp (max 1h Δ); biggest interchange swing (max |Δ| across ties).

**Outputs:** KPI cards with Δ vs baseline; tooltips show absolute & % change.

**Acceptance Criteria:**
- Four KPI cards: max demand, cleanest hour, largest ramp, interchange swing
- Absolute + percentage deltas vs baseline clearly displayed
- Baseline window documented in tooltip (30-day same-weekday median)
- Clicking KPI deep-links to selected day with annotations
- Baseline calculation job runs reliably with ≥99% success rate
- KPI values match source series exactly

**Implementation Status**: [Track on GitHub](https://github.com/awynne/grid/issues?q=label%3Aepic%3Af4-what-changed)

---

## Formulas Reference

### Net Load & Duckiness Calculations
- **Net Load** = `demand − solar_generation` (proxy from fuel mix where needed)
- **Evening Ramp (MW/h)** = `max( net(t+1) − net(t) )` over 15:00–21:00
- **Valley Depth (MW)** = `max_day(net) − min_midday(net; 10:00–15:00)`
- **Duckiness (0–100)** = `w1*z(ramp) + w2*z(valley) + w3*z(-trough_time)` with `w1=0.5, w2=0.35, w3=0.15`

### Clean Windows
- **Clean Windows:** contiguous hours where `CO₂_intensity ≤ Q1` (cleanest quartile) in next 24h

## Feature-to-Spec Mapping

This section maps strategic features to their implementing technical specifications, showing the relationship between user value (features) and technical implementation (specs).

### Current Mapping

| Feature | Specs | Status | Notes |
|---------|-------|--------|-------|
| **F0: Shared Shell** | *TBD* | 🔄 Planning | Requires UI component architecture, routing, URL state management specs |
| **F1: Daily Pulse** | *TBD* | 🔄 Planning | Requires narrative generation, chart annotation, embed functionality specs |
| **F2: What's Powering Me** | *TBD* | 🔄 Planning | Requires CO₂ estimation, clean window calculation, real-time updates specs |
| **F3: Duck Days** | *TBD* | 🔄 Planning | Requires net-load calculation, duckiness scoring, ranking algorithm specs |
| **F4: What Changed** | *TBD* | 🔄 Planning | Requires baseline calculation, KPI computation, delta visualization specs |
| **All Features** | [GRID-007](../specs/GRID-007.md) | 🆕 New | EIA-930 data volume analysis (infrastructure) |
| **All Features** | [GRID-008](../specs/GRID-008.md) | 🆕 New | MVP architecture design (infrastructure) |

### Planned Spec Breakdown

**Infrastructure Specs (Cross-Feature):**
- ✅ GRID-007: EIA-930 Data Volume Analysis - Storage and performance requirements
- ✅ GRID-008: MVP Architecture Design - Dual-service pattern, database design
- 🔄 GRID-009: Real-time Data Pipeline - WebSocket updates, data freshness
- 🔄 GRID-010: Chart Component Library - Reusable visualization components

**F0: Shared Shell & Freshness:**
- 🔄 GRID-011: URL State Management - Deep linking, route parameters
- 🔄 GRID-012: BA/Date Controls - Selector components, geolocation defaults  
- 🔄 GRID-013: Freshness Indicators - Last-updated badges, stale data warnings

**F1: Daily Pulse:**
- 🔄 GRID-014: Narrative Generation Engine - Template system, threshold rules
- 🔄 GRID-015: Chart Annotation System - Peak/trough/ramp markers
- 🔄 GRID-016: Embed & Share Functionality - oEmbed/iFrame, permalink generation

**F2: What's Powering Me:**
- 🔄 GRID-017: CO₂ Estimation Algorithm - Fuel mix to CO₂ conversion
- 🔄 GRID-018: Clean Window Calculator - Quartile analysis, contiguous blocks
- 🔄 GRID-019: Real-time Status Display - Current intensity, next window UI

**F3: Duck Days:**
- 🔄 GRID-020: Net-Load Calculation - Demand minus solar computation
- 🔄 GRID-021: Duckiness Scoring Algorithm - Ramp/valley/trough formula
- 🔄 GRID-022: Duck Day Gallery - Ranking, sparklines, detail views

**F4: What Changed:**
- 🔄 GRID-023: Baseline Calculation Job - 30-day same-weekday median
- 🔄 GRID-024: KPI Delta Computation - Max demand, cleanest hour, ramps
- 🔄 GRID-025: Delta Visualization Cards - Absolute/percentage change display

### Mapping Guidelines

**1:Many Relationship**: Most features require multiple specs for complete implementation
- Features define user value and acceptance criteria
- Specs define technical implementation details and architecture

**Shared Infrastructure**: Some specs support multiple features
- GRID-007, GRID-008: Foundation for all features
- GRID-009, GRID-010: Common components used across features

**Implementation Order**: Infrastructure specs enable feature specs
1. **Phase 1**: GRID-007, GRID-008 (data and architecture foundation)
2. **Phase 2**: GRID-009, GRID-010 (common components)  
3. **Phase 3**: Feature-specific specs (GRID-011+)

**Status Legend**: 
- ✅ **Created** - Spec file exists with technical details
- 🔄 **Planning** - Feature requirements defined, spec creation needed
- 🆕 **New** - Spec created but implementation not started

## Cross-References

- [Product Research](./research.md) - Dataset analysis and feature derivation methodology
- [Product Requirements](./prd.md) - Core product specifications and business requirements
- [Stack-Fit Analysis](./stack-fit.md) - Technical implementation considerations
- [GRID-008](../specs/GRID-008.md) - MVP architecture design supporting these features
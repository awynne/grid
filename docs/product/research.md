# GridPulse Product Research

> **=� Purpose**: Research findings, dataset analysis, and prioritization framework for GridPulse electric grid data visualization platform.

## Table of Contents
- [Dataset Overview](#dataset-overview)
- [API Access Patterns](#api-access-patterns)
- [Feature Derivation](#feature-derivation)
- [Prioritization Framework](#prioritization-framework)
- [Research Risks](#research-risks)

## Dataset Overview

### EIA Hourly Electric Grid Monitor (EIA-930)

- **What it is:** Hourly operational data compiled by the U.S. Energy Information Administration from balancing authorities (BAs) across the Lower-48.
- **Core series used in GridPulse:**
  - **Demand (load):** Hourly BA demand.
  - **Day-ahead demand forecast:** Typically posted late morning ET for many BAs.
  - **Generation by fuel/technology:** Hourly mix (e.g., coal, gas, nuclear, hydro, wind, solar) with some reporting lag.
  - **Interchange:** Net imports/exports between neighboring BAs.
  - **CO� emissions / intensity (where available):** EIA estimates aligned to fuel mix.
- **Update cadence (practical):** Demand is near real-time (hourly); fuel mix and interchange can lag ~12 days in certain regions; forecasts publish once daily. Behind-the-meter solar is not fully represented, so **net-load is an approximation**.

## API Access Patterns

### EIA v2 API Quick Start

> Goal: a clear, repeatable way for engineering to fetch and cache the exact series we need.

#### Authentication & Base Setup
1. **Get an API key** (free). Store as `EIA_API_KEY` (server-side).
2. **Base path (v2 style):** `https://api.eia.gov/v2/electricity/rto/&`

#### Common Dataset Paths
- Hourly **demand**: `/electricity/rto/region-sub-ba-data/` or `/electricity/rto/region-data/` (varies by BA coverage)
- **Fuel-type generation**: `/electricity/rto/fuel-type-data/`
- **Interchange**: `/electricity/rto/interchange-data/`
- **Day-ahead demand forecast**: `/electricity/rto/demand-forecast/`
- **Emissions / intensity** (if exposed): `/electricity/rto/emissions/` or EIA-published estimate endpoints

#### Query Pattern (v2)
- **Filters:** `facets[region][]=PJM`, `facets[ba][]=PJM` (dataset dependent)
- **Window:** `start=2025-07-01&end=2025-07-07`
- **Frequency:** `frequency=hourly`
- **Select fields:** `data[0]=value`, `data[1]=fuel-type` (dataset dependent)
- **Sort/limit:** `sort[0][column]=period&sort[0][direction]=asc&offset=0&length=5000`

#### Example Request
```http
GET https://api.eia.gov/v2/electricity/rto/fuel-type-data/data/?
  api_key=YOUR_KEY&frequency=hourly&start=2025-07-01&end=2025-07-02&
  facets[region][]=PJM&sort[0][column]=period&sort[0][direction]=asc
```

**Typical response fields:**
```json
{
  "response": {
    "data": [
      {
        "period": "2025-07-01T13:00-04:00",
        "region": "PJM",
        "fuel-type": "solar",
        "value": 3245.0,
        "units": "MW"
      }
    ]
  }
}
```

#### API Best Practices
6. **CSV access:** Append `&format=csv` to receive CSV; same parameters.
7. **Rate limits & resilience:** Respect server hints; back off on 429/5xx; cache last-good; schedule hourly pulls with jitter.
8. **Time zones:** API returns ISO timestamps with offsets; normalize to BA timezone for UI; store UTC in the DB.

## Feature Derivation

### Inventory � Jobs Mapping

We listed EIA-930's reliable, hourly series and mapped them to distinct user jobs:

- **Daily Pulse (F1):** Demand + fuel mix (+ forecast) � generate *narrative + annotated chart* for reporters.
- **What's Powering Me (F2):** Fuel mix/CO� � compute *current intensity* and *next clean window* for behavior change.
- **Duck Days (F3):** Demand + solar � compute *net-load* and *duckiness* for analysis/education.
- **What Changed (F4):** Yesterday vs baseline across all series � *delta cards* for quick status.

### Feasibility Assessment

- **Feasibility check:** Chosen features only require EIA-930 (no third-party device APIs). We explicitly avoided tariffs and price modeling for MVP.
- **Freshness awareness:** We aligned UX to series lags (e.g., demand drives "today," while fuel mix may be yesterday in some BAs). Freshness badges and copy reduce confusion.

## Prioritization Framework

### Scoring Methodology

We scored each idea on two axes and summed them:
- **Ease (15):** engineering effort to produce a polished MVP.
- **Demo Wow (15):** immediate visual/value impact in a 5-minute demo.

### Results & Rationale

**Top results:** F1 **Daily Pulse** (10), then F1/F3/F4 cluster (9s), with F2 strong for actionability. This informed the milestone plan (M1 ships F1+F2; M2 adds F3; M3 strengthens sharing via embeds; M4 adds digest).

**Why this works:** The scoring rewards features that (a) pull from stable EIA-930 slices, (b) minimize integrations, and (c) produce instantly legible visuals or copy.

## Research Risks

### Technical Risks

- **Endpoint drift:** EIA occasionally revises dataset paths/fields. We'll keep dataset paths in a constants module and add smoke tests.
- **Coverage gaps:** Not all BAs report all series (e.g., CO�). We provide graceful fallbacks (fuel-mix factors) and disclose gaps in tooltips.
- **Interpretation risk:** "Net-load" is approximate where behind-the-meter PV is large; we label charts accordingly and avoid over-precise claims.

### Open Questions

1. **IA:** Do we prefer the Hybrid (cards + deep links) or a Tab-only approach?
2. **Default BA:** Use geo-IP to suggest (PJM for Pittsburgh), or force explicit selection?
3. **CO� estimation:** If absent, OK to use fixed intensity factors per fuel type for MVP?
4. **Brand/Cohesion:** Name = "GridPulse" (confirmed)
5. **Embeds:** Inline script vs iFrame; which hosts will we target for a quick demo?

## Grid Phenomena Reference

### Understanding the Duck Curve & "Duckiest Days"

The **duck curve** is a famous graph showing daily electricity demand that looks like the profile of a duck:

**Duck Anatomy:**
- **Morning ramp-up** (duck's tail) - demand rises as people wake up, turn on lights, start industrial processes
- **Midday belly dip** (duck's belly) - demand drops as solar panels produce peak power, often exceeding local consumption
- **Evening ramp** (duck's neck) - steep demand spike as sun sets but people come home, turn on appliances, charge electric vehicles

**"Duckiest Days" Defined:**
The **duckiest days** are when this pattern is most extreme, typically featuring:

**Deep Belly (Valley)**: Midday demand drops way below normal because:
- Lots of solar generation (clear, sunny day)
- Mild weather requiring less air conditioning or heating
- Low industrial activity (weekends, holidays)
- High behind-the-meter solar adoption in the region

**Steep Neck (Evening Ramp)**: Demand spikes rapidly between 3-9pm because:
- Solar generation drops off quickly as sun sets
- People return home from work and school
- Residential loads surge: lights, cooking, TV, appliances
- Industrial activity resumes for evening shifts
- Electric vehicle charging begins en masse

**Why "Duckiest Days" Matter:**
These extreme days create significant grid management challenges:

- **Grid operators** must rapidly scale up dispatchable (non-solar) generation as the sun sets, sometimes requiring expensive peaker plants
- **Energy storage** becomes crucial to smooth the transitions by storing excess midday solar and releasing it during evening ramps  
- **Grid flexibility** is tested to its limits, requiring sophisticated forecasting and resource coordination
- **Energy costs** often spike during evening ramps due to supply/demand imbalances
- **Grid stability** can be threatened if ramp rates exceed generation dispatch capabilities

**GridPulse F3 Connection:**
F3: Duck Days finds and ranks these extreme days using a "duckiness score" (0-100) based on:
- **50% evening ramp rate** - measures how steep the 3-9pm demand spike (MW/hour change)
- **35% valley depth** - measures how deep the midday dip compared to daily peak (MW difference)  
- **15% trough timing** - rewards earlier midday minimums which indicate stronger solar impact

This scoring helps analysts and educators **visualize grid flexibility challenges** and understand exactly when the grid experiences the most stress from renewable intermittency. By surfacing the most extreme examples, F3 makes abstract grid concepts tangible and teachable.

**Real-World Impact:**
Understanding duck curve dynamics is essential for:
- **Policy makers** designing renewable energy incentives and grid modernization
- **Utilities** planning storage investments and demand response programs
- **Educators** teaching about renewable integration challenges
- **Energy consumers** understanding when electricity is cleanest and cheapest
- **Grid researchers** studying intermittency patterns and solutions

## Cross-References

- [Features & Epics](./features.md) - Detailed feature specifications derived from this research
- [Stack-Fit Analysis](./stack-fit.md) - Technical architecture analysis
- [Product Requirements](./prd.md) - Core product specifications
- [GRID-007](../specs/GRID-007.md) - Data volume analysis task
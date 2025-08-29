# GRID-013: EIA Data Ingestion Service

**Status**: 🔄 In Progress  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-29  

**Issue Link**: *To be created*

## Overview

Implement a standalone Python data ingestion service running from home network infrastructure, with scheduled EIA-930 data fetching that communicates with the GridPulse application via REST API rather than direct database access. This maintains true microservice architecture with proper API boundaries.

## ⚠️ ARCHITECTURE DECISION REQUIRED

**Critical architectural change**: Worker service will run as **external standalone service** (not Railway-hosted) and communicate via **REST API** rather than direct database access. This requires:

1. **Service Design Pattern**: True microservice with API-first data ingestion
2. **Network Architecture**: Home network → Railway API communication
3. **Scheduling Strategy**: External cron/Dagster vs. Railway-hosted timer service
4. **Data Flow**: Worker → GridPulse API → TimescaleDB (not Worker → TimescaleDB direct)

## Problem Statement

GridPulse requires reliable, automated ingestion of EIA-930 data with:
- Hourly data fetching from EIA v2 API (18.8 records/hour/BA)
- Data normalization and validation
- Idempotent operations (safe to re-run)
- Error handling and retry logic
- Performance target: <5 minutes for 24 hours of 5 BAs data

## Scope

### In Scope
- **External Python Service**: Standalone worker running on home network
- **EIA v2 API Integration**: Authentication and data fetching
- **GridPulse API Integration**: REST API calls for data submission (not direct DB)
- **Data Processing**: pandas normalization and validation  
- **Scheduling Strategy**: External scheduling mechanism (Dagster vs. cron TBD)
- **Error Handling**: Network failures, API errors, retry logic
- **Authentication**: API key management for both EIA and GridPulse APIs
- **Data Quality**: Validation before API submission

### Out of Scope
- **Railway Hosting**: Worker runs externally, not on Railway infrastructure
- **Direct Database Access**: All data goes through GridPulse REST API
- **Complex Queue Systems**: Simple request/response pattern for MVP
- **Real-time Streaming**: Hourly batch processing sufficient
- **GridPulse API Implementation**: API endpoints assumed to exist (separate spec)
- **Advanced Monitoring**: Basic logging only, no complex observability

## 🔬 RESEARCH REQUIRED: Orchestration Strategy

### Decision Point: Dagster vs. Simple Cron

**Current assumption**: Dagster provides orchestration, monitoring, and data lineage benefits.

**New constraint**: External service running on home network changes requirements:

#### Option 1: Dagster on Home Network
**Pros**: Asset lineage, web UI, sophisticated scheduling, data validation
**Cons**: Additional infrastructure, resource usage, complexity for simple hourly jobs

#### Option 2: Simple Cron + Python Scripts  
**Pros**: Minimal overhead, simple deployment, standard Unix scheduling
**Cons**: No pipeline visibility, basic error handling, manual monitoring

### 🚨 RESEARCH QUESTIONS:

1. **Dagster Resource Requirements**: What are minimum system requirements for Dagster daemon?
2. **Dagster Web UI**: Can it be accessed securely from external network? Required?
3. **Dagster Storage**: What persistent storage does Dagster need for metadata?
4. **Network Connectivity**: Can Dagster assets make HTTPS calls to Railway API reliably?
5. **Cost/Benefit**: Does Dagster complexity justify benefits for simple hourly API calls?

### 🎯 DECISION CRITERIA:
- **Reliability**: Can we achieve 99%+ uptime for hourly jobs?
- **Operational Overhead**: How much maintenance does each approach require?
- **Debugging**: How easy is it to troubleshoot failed runs?
- **Cost**: Power/resource usage on home network infrastructure

## Technical Requirements

### New Architecture: External Worker → GridPulse API

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Home Network   │    │   Railway Cloud  │    │  TimescaleDB    │
│                 │    │                  │    │                 │
│  Python Worker  │───▶│  GridPulse API   │───▶│  observations   │
│  - EIA API      │    │  - REST endpoints│    │  - series data  │
│  - Scheduling   │    │  - Authentication│    │  - time-series  │
│  - Data Proc    │    │  - Validation    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 🚨 MISSING DEPENDENCY: GridPulse REST API

**Critical Gap**: This spec assumes GridPulse application has REST API endpoints for data ingestion.

**Required API Endpoints** (to be implemented):
```
POST /api/v1/data/observations
  - Accept batch observation data
  - Validate data quality and format
  - Handle duplicate detection/upserts
  - Return success/error status

GET /api/v1/data/series/{series_id}/latest
  - Return latest timestamp for incremental fetches
  - Support for multiple series query

POST /api/v1/auth/worker
  - Worker authentication endpoint
  - API key validation
```

**⚠️ REQUIRES SEPARATE SPEC**: GridPulse API implementation (GRID-015 or new spec)

### EIA API Integration

Based on GridPulse product research, target these EIA-930 endpoints:

#### Primary Data Series
```python
# EIA v2 API endpoints for time-series data
EIA_DATA_SERIES = {
    # Demand data (most reliable, near real-time)
    'demand': '/electricity/rto/region-data/',
    
    # Generation by fuel type (12+ hour lag in some regions)
    'fuel_mix': '/electricity/rto/fuel-type-data/',
    
    # Interchange between BAs  
    'interchange': '/electricity/rto/interchange-data/',
    
    # Day-ahead demand forecasts
    'forecast': '/electricity/rto/demand-forecast/',
}
```

#### MVP Balancing Authorities
```python
MVP_BALANCING_AUTHORITIES = [
    'PJM',     # PJM Interconnection (Eastern)
    'CAISO',   # California ISO (Western)
    'MISO',    # Midcontinent ISO (Central)
    'ERCOT',   # Texas (separate grid)
    'SPP'      # Southwest Power Pool (Central)
]
```

### 🔬 RESEARCH REQUIRED: Service Implementation Strategy

**Decision Point**: Dagster assets vs. simple Python scripts

#### Option A: Dagster Asset-Based Architecture
```python
# If using Dagster - asset pipeline approach
@asset(group_name="eia_raw_data")
def eia_demand_data(config: EIAConfig) -> Dict[str, pd.DataFrame]:
    """Fetch from EIA API"""
    # EIA API calls
    pass

@asset(group_name="gridpulse_api")  
def submitted_observations(normalized_observations: pd.DataFrame) -> int:
    """Submit to GridPulse API instead of direct DB"""
    response = requests.post(
        f"{GRIDPULSE_BASE_URL}/api/v1/data/observations",
        json=normalized_observations.to_dict('records'),
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return response.json()['records_processed']
```

#### Option B: Simple Script Architecture  
```python
# If using cron - simple function approach
def main():
    # 1. Fetch from EIA API
    raw_data = fetch_eia_data()
    
    # 2. Process and normalize  
    normalized = process_data(raw_data)
    
    # 3. Submit to GridPulse API
    submit_to_api(normalized)
```

### 🚨 ARCHITECTURE QUESTIONS:

1. **API Authentication**: How should worker authenticate with GridPulse API?
   - API key in headers?
   - JWT tokens with refresh?
   - Service-to-service authentication?

2. **Batch Size**: What's optimal batch size for API submissions?
   - Single large POST with all data?
   - Multiple smaller batches?
   - Streaming approach?

3. **Error Handling**: How should API failures be handled?
   - Retry logic for transient failures?
   - Dead letter queue for permanent failures?
   - Partial batch success handling?

4. **Rate Limiting**: Does GridPulse API need rate limiting?
   - Worker is controlled environment, but API might have limits
   - Coordinate with EIA API rate limiting

### ⚠️ VARIABLE PATTERN PROBLEMS

**Home Network Configuration Challenges**:
```python
# These patterns need research:
EIA_API_KEY = os.getenv('EIA_API_KEY')              # ✅ Standard
GRIDPULSE_API_KEY = os.getenv('GRIDPULSE_API_KEY')  # ⚠️  How generated?
GRIDPULSE_BASE_URL = os.getenv('GRIDPULSE_BASE_URL') # ⚠️  Railway dynamic URLs?
```

**Questions**:
1. How are Railway URLs discovered? (https://xyz-production.up.railway.app)
2. How is GridPulse API key generated and rotated?
3. Should config be file-based vs. environment variables?
4. How to handle Railway service restarts/URL changes?

### Dagster Scheduling Configuration

```python
# Dagster schedules and sensors
from dagster import schedule, sensor, RunRequest, SkipReason
from datetime import datetime

@schedule(
    cron_schedule="15 * * * *",  # Every hour at 15 minutes past
    job_name="eia_ingestion_job"
)
def hourly_eia_ingestion_schedule(context):
    """Schedule hourly EIA data ingestion with 15-minute offset for EIA publication delay"""
    return RunRequest(
        run_key=f"eia_ingestion_{context.scheduled_execution_time.strftime('%Y%m%d_%H%M')}",
        tags={"schedule": "hourly_ingestion"}
    )

@schedule(
    cron_schedule="0 1 * * *",  # Daily at 1 AM
    job_name="eia_health_check_job"
)
def daily_health_check_schedule(context):
    """Daily health check and data quality metrics"""
    return RunRequest(
        run_key=f"health_check_{context.scheduled_execution_time.strftime('%Y%m%d')}",
        tags={"schedule": "daily_health_check"}
    )

@sensor(job_name="eia_backfill_job")
def data_gap_sensor(context):
    """Sensor to detect and trigger backfill for data gaps"""
    # Check for missing data periods and trigger backfill jobs
    gaps = detect_data_gaps()
    
    if gaps:
        return [RunRequest(
            run_key=f"backfill_{gap['start']}_{gap['end']}",
            tags={"backfill": "gap_detected"}
        ) for gap in gaps]
    
    return SkipReason("No data gaps detected")
```

## Implementation Tasks

### Phase 1: Dagster Asset Framework Setup
- [ ] Install and configure Dagster with TimescaleDB integration
- [ ] Create Dagster asset groups for EIA data pipeline
- [ ] Implement asset dependency graph (raw → processed → stored)
- [ ] Set up Dagster schedules and sensors
- [ ] Configure Dagster web UI for monitoring

### Phase 2: EIA API Client & Data Assets
- [ ] Implement EIA v2 API authentication with rate limiting
- [ ] Create Dagster assets for raw data fetching (demand, fuel_mix, interchange)
- [ ] Add request/response logging with Dagster logger
- [ ] Implement retry logic with exponential backoff
- [ ] Create asset checks for data quality validation

### Phase 3: Data Processing & Normalization Assets
- [ ] Implement pandas-based data normalization assets
- [ ] Create series mapping logic (EIA series → internal series)
- [ ] Add data validation and quality check assets
- [ ] Implement duplicate detection in upsert logic
- [ ] Create batch insertion optimization with TimescaleDB

### Phase 4: Orchestration & Monitoring
- [ ] Configure Dagster schedules for hourly/daily runs
- [ ] Set up Dagster sensors for gap detection and backfilling
- [ ] Implement asset materialization policies and partitioning
- [ ] Add comprehensive logging and alerting through Dagster
- [ ] Create data lineage tracking and asset health monitoring

### Phase 5: Testing & Validation
- [ ] Create unit tests for all Dagster assets and functions
- [ ] Implement integration tests with EIA API using Dagster test framework
- [ ] Add performance benchmarking for asset execution times
- [ ] Test error scenarios and Dagster retry/failure handling
- [ ] Validate data quality and asset dependency resolution

## Implementation Details

### EIA API Client Implementation

```python
# Python EIA API client with pandas integration
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import time
from dagster import get_dagster_logger

class EIAAPIClient:
    def __init__(self, api_key: str, base_url: str = "https://api.eia.gov/v2"):
        self.api_key = api_key
        self.base_url = base_url
        self.rate_limiter = SimpleRateLimiter(requests_per_hour=4800)  # Under 5000 limit
        
    def fetch_demand_data(self, ba_code: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """Fetch demand data from EIA API and return as pandas DataFrame"""
        logger = get_dagster_logger()
        
        params = {
            'api_key': self.api_key,
            'frequency': 'hourly',
            'start': start_date.strftime('%Y-%m-%d'),
            'end': end_date.strftime('%Y-%m-%d'),
            'facets[respondent][]': ba_code,
            'sort[0][column]': 'period',
            'sort[0][direction]': 'asc'
        }
        
        url = f"{self.base_url}/electricity/rto/region-data/data/"
        
        # Apply rate limiting
        self.rate_limiter.wait_if_needed()
        
        response = requests.get(url, params=params, timeout=30)
        
        if response.status_code != 200:
            logger.error(f"EIA API error: {response.status_code} - {response.text}")
            raise EIAAPIError(f"API request failed: {response.status_code}")
            
        data = response.json()
        
        if 'response' not in data or 'data' not in data['response']:
            logger.warning(f"No data returned for {ba_code} demand")
            return pd.DataFrame()
            
        # Convert to DataFrame with proper column types
        df = pd.DataFrame(data['response']['data'])
        if not df.empty:
            df['period'] = pd.to_datetime(df['period'])
            df['value'] = pd.to_numeric(df['value'], errors='coerce')
            df['ba_code'] = ba_code
            df['data_type'] = 'demand'
            
        logger.info(f"Fetched {len(df)} demand records for {ba_code}")
        return df
    
    def fetch_fuel_mix_data(self, ba_code: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """Fetch fuel mix data from EIA API and return as pandas DataFrame"""
        # Similar implementation for fuel mix endpoint
        # /electricity/rto/fuel-type-data/
        pass
    
    def fetch_interchange_data(self, ba_code: str, start_date: datetime, end_date: datetime) -> pd.DataFrame:
        """Fetch interchange data from EIA API and return as pandas DataFrame"""
        # Similar implementation for interchange endpoint
        # /electricity/rto/interchange-data/
        pass

class SimpleRateLimiter:
    def __init__(self, requests_per_hour: int):
        self.requests_per_hour = requests_per_hour
        self.request_times: List[float] = []
    
    def wait_if_needed(self):
        """Wait if necessary to respect rate limits"""
        now = time.time()
        hour_ago = now - 3600
        
        # Remove old requests
        self.request_times = [t for t in self.request_times if t > hour_ago]
        
        if len(self.request_times) >= self.requests_per_hour:
            sleep_time = self.request_times[0] + 3600 - now
            if sleep_time > 0:
                time.sleep(sleep_time)
        
        self.request_times.append(now)
```

### Data Normalization with Pandas

```python
# Pandas-based data normalization for Dagster assets
import pandas as pd
from typing import Literal
from dagster import get_dagster_logger

QualityFlag = Literal['good', 'estimated', 'missing']

def normalize_demand_data(raw_df: pd.DataFrame, ba_code: str) -> pd.DataFrame:
    """Transform raw EIA demand data into normalized observation format"""
    logger = get_dagster_logger()
    
    if raw_df.empty:
        return pd.DataFrame(columns=['series_id', 'timestamp', 'value', 'quality_flag', 'source_data'])
    
    normalized = raw_df.copy()
    
    # Create series_id mapping
    normalized['series_id'] = normalized['respondent'] + '_demand'
    
    # Standardize timestamp
    normalized['timestamp'] = pd.to_datetime(normalized['period'])
    
    # Determine quality flags
    normalized['quality_flag'] = normalized.apply(determine_quality_flag, axis=1)
    
    # Preserve source data for audit trail
    normalized['source_data'] = raw_df.to_dict('records')
    
    # Select final columns
    final_df = normalized[['series_id', 'timestamp', 'value', 'quality_flag', 'source_data']].copy()
    
    logger.info(f"Normalized {len(final_df)} demand observations for {ba_code}")
    return final_df

def normalize_fuel_mix_data(raw_df: pd.DataFrame, ba_code: str) -> pd.DataFrame:
    """Transform raw EIA fuel mix data into normalized observation format"""
    # Similar normalization logic for fuel mix data
    # Handle fuel-type specific series IDs like 'PJM_coal', 'PJM_natural_gas', etc.
    pass

def determine_quality_flag(row: pd.Series) -> QualityFlag:
    """Determine data quality flag based on EIA data characteristics"""
    if pd.isna(row['value']) or row['value'] is None:
        return 'missing'
    
    # Check for EIA quality indicators
    if 'data-quality-flag' in row and row['data-quality-flag']:
        return 'estimated'
    
    return 'good'

def validate_observations(df: pd.DataFrame) -> pd.DataFrame:
    """Apply data quality validation rules and filter invalid observations"""
    logger = get_dagster_logger()
    
    initial_count = len(df)
    
    # Remove duplicate timestamps per series
    df = df.drop_duplicates(subset=['series_id', 'timestamp'], keep='last')
    
    # Remove observations with invalid values (but keep 'missing' quality flags)
    valid_mask = (
        df['quality_flag'].isin(['good', 'estimated', 'missing']) &
        df['series_id'].notna() &
        df['timestamp'].notna()
    )
    
    df_valid = df[valid_mask].copy()
    
    filtered_count = initial_count - len(df_valid)
    if filtered_count > 0:
        logger.warning(f"Filtered out {filtered_count} invalid observations")
    
    return df_valid
```

### TimescaleDB Integration with Pandas

```python
# Database integration optimized for pandas DataFrames
import psycopg2
import pandas as pd
from sqlalchemy import create_engine
from dagster import get_dagster_logger

def batch_upsert_observations(df: pd.DataFrame, connection_string: str) -> int:
    """Efficiently upsert observations DataFrame to TimescaleDB"""
    logger = get_dagster_logger()
    
    if df.empty:
        logger.info("No observations to upsert")
        return 0
    
    engine = create_engine(connection_string)
    
    try:
        # Use pandas to_sql with PostgreSQL COPY for performance
        # This requires a temporary table approach for upsert
        with engine.begin() as conn:
            # Create temporary table
            temp_table = f"temp_observations_{int(pd.Timestamp.now().timestamp())}"
            
            # Insert data to temporary table
            df.to_sql(temp_table, conn, if_exists='replace', index=False, method='multi')
            
            # Perform upsert from temporary table
            upsert_query = f"""
            INSERT INTO observations (series_id, ts, value, quality_flag, source_data)
            SELECT 
                s.id as series_id,
                t.timestamp::timestamptz as ts,
                t.value::numeric,
                t.quality_flag::varchar,
                t.source_data::jsonb
            FROM {temp_table} t
            JOIN series s ON s.eia_series_id = t.series_id
            ON CONFLICT (series_id, ts) DO UPDATE SET
                value = EXCLUDED.value,
                quality_flag = EXCLUDED.quality_flag,
                source_data = EXCLUDED.source_data,
                updated_at = NOW()
            """
            
            result = conn.execute(upsert_query)
            records_affected = result.rowcount
            
            # Clean up temporary table
            conn.execute(f"DROP TABLE {temp_table}")
            
            logger.info(f"Successfully upserted {records_affected} observations")
            return records_affected
            
    except Exception as e:
        logger.error(f"Database upsert failed: {e}")
        raise

def get_latest_timestamp_for_series(series_id: str, connection_string: str) -> Optional[datetime]:
    """Get the latest timestamp for a given series to determine incremental fetch range"""
    engine = create_engine(connection_string)
    
    query = """
    SELECT MAX(o.ts) as latest_ts
    FROM observations o
    JOIN series s ON s.id = o.series_id  
    WHERE s.eia_series_id = %s
    """
    
    result = pd.read_sql(query, engine, params=[series_id])
    
    if not result.empty and result['latest_ts'].iloc[0] is not None:
        return pd.to_datetime(result['latest_ts'].iloc[0])
    
    return None
```

## Success Criteria

### Functional Requirements
- [ ] Dagster assets successfully fetch data from EIA API for all 5 MVP BAs
- [ ] Asset pipeline normalizes and stores data in TimescaleDB with proper lineage
- [ ] Dagster schedules run hourly without manual intervention
- [ ] Asset failure handling and retry logic works gracefully
- [ ] Asset materialization prevents duplicate data insertion (idempotent)

### Performance Requirements  
- [ ] Asset execution completes 24 hours of data for 5 BAs in <5 minutes
- [ ] Processes 2,256 records/day average (18.8 records/hour/BA × 5 BAs × 24 hours)
- [ ] API rate limiting stays under EIA limits (4800 requests/hour with buffer)
- [ ] Pandas-based batch insertion achieves >1000 records/second

### Reliability Requirements
- [ ] Dagster handles network failures with asset retry policies
- [ ] Asset dependency resolution works correctly with database issues
- [ ] Dagster logging captures all operations for debugging and monitoring
- [ ] Dagster daemon handles graceful shutdown and restart
- [ ] Asset health checks and sensors respond correctly

### Data Quality Requirements
- [ ] Asset checks catch malformed records and data quality issues
- [ ] Quality flags properly assigned (good/estimated/missing) in pandas processing
- [ ] Source data preserved for audit trail in asset materialization
- [ ] Asset dependency graph ensures no data loss during pipeline execution

### Dagster-Specific Requirements
- [ ] Asset lineage graph clearly shows data flow from EIA → processed → stored
- [ ] Asset partitioning enables efficient historical data processing
- [ ] Dagster Web UI provides visibility into pipeline status and performance
- [ ] Asset sensors detect data gaps and trigger backfill automatically
- [ ] Asset checks validate data quality at each pipeline stage

## Dependencies

### ✅ Completed Dependencies
- **GRID-011**: Railway infrastructure setup 
- **GRID-012**: TimescaleDB schema implemented
- **GRID-012A**: Docker deployment pipeline established

### 🚨 MISSING DEPENDENCIES

#### Critical Blockers:
1. **GridPulse API Implementation** (GRID-015 or new spec required)
   - POST /api/v1/data/observations endpoint
   - Authentication system for worker services  
   - Batch data ingestion with validation
   - Error handling and response formatting

2. **Service Discovery & Configuration**
   - Railway URL discovery mechanism
   - API key generation and management system
   - Home network → Railway connectivity validation

#### Technical Dependencies:
- **EIA API Key**: Obtained and configured for external service
- **Home Network Infrastructure**: Python 3.9+, scheduling system
- **Network Access**: Outbound HTTPS to EIA and Railway APIs
- **Configuration Management**: Secure storage of API keys and URLs

#### Decision Dependencies:
- **Orchestration Choice**: Dagster vs. cron scheduling decision
- **Authentication Strategy**: API key vs. JWT token approach
- **Batch Size Strategy**: Optimal API payload size determination

## Monitoring and Alerting

### Key Metrics (via Dagster Web UI)
- **Asset materialization success rate**: % of successful hourly asset runs
- **Data volume**: Records processed per asset execution 
- **API performance**: EIA API response times and error rates tracked by assets
- **Processing time**: End-to-end asset execution duration
- **Data freshness**: Asset freshness policies and SLA monitoring

### Dagster Health Monitoring
```python
# Built-in Dagster monitoring capabilities
from dagster import sensor, asset_sensor, DefaultSensorStatus
from dagster import AssetMaterialization, AssetObservation

@asset_sensor(
    asset_key="stored_observations",
    minimum_interval_seconds=300  # Check every 5 minutes
)
def data_freshness_sensor(context, asset_event):
    """Monitor data freshness and alert on stale data"""
    if asset_event and asset_event.dagster_event.is_successful_output:
        # Check if data is fresh enough
        latest_timestamp = get_latest_data_timestamp()
        staleness_hours = (datetime.now() - latest_timestamp).total_seconds() / 3600
        
        if staleness_hours > 2:  # Alert if data is >2 hours stale
            context.log.error(f"Data is {staleness_hours:.1f} hours stale")
            # Trigger alert via external system
            
        return AssetObservation(
            asset_key="stored_observations",
            metadata={"staleness_hours": staleness_hours}
        )

@sensor(job_name="eia_ingestion_job", default_status=DefaultSensorStatus.RUNNING)
def pipeline_failure_sensor(context):
    """Monitor for pipeline failures and trigger alerts"""
    # Query recent runs for failures
    failed_runs = context.instance.get_runs_by_filter(
        filters=RunsFilter(
            job_name="eia_ingestion_job",
            statuses=[DagsterRunStatus.FAILURE]
        ),
        limit=1
    )
    
    if failed_runs:
        latest_failure = failed_runs[0]
        context.log.error(f"Pipeline failed: {latest_failure.run_id}")
        # Trigger external alerting system
```

### Dagster Web UI Features
- **Asset Lineage Graph**: Visual representation of data flow
- **Asset Health Dashboard**: Real-time status of all pipeline components  
- **Run Timeline**: Historical view of schedule executions and failures
- **Asset Checks**: Data quality validation results and trends
- **Performance Metrics**: Execution times, resource usage, and throughput

## 🎯 KEY DECISIONS NEEDED

### 1. Orchestration Framework
**Question**: Dagster vs. simple cron + Python scripts?
**Impact**: Resource usage, complexity, monitoring capabilities
**Research Required**: 
- Dagster minimum system requirements
- Home network resource constraints  
- Monitoring and alerting needs

### 2. API Design Patterns
**Question**: How should GridPulse API handle batch data ingestion?
**Impact**: Performance, error handling, data consistency
**Research Required**:
- Optimal batch sizes for TimescaleDB
- API authentication patterns
- Error response formats and retry strategies

### 3. Service Discovery
**Question**: How does home worker discover Railway service URLs?
**Impact**: Reliability, configuration management
**Research Required**:
- Railway URL patterns and stability
- Configuration distribution mechanisms
- Network connectivity requirements

### 4. Dagster Web UI Requirements
**Question**: Is Dagster Web UI necessary and how to access securely?

**If Web UI Required**:
- **Security**: VPN, reverse proxy, or public access?
- **Authentication**: Built-in auth vs. external auth provider?
- **Network Access**: Port forwarding, dynamic DNS requirements?
- **Resource Usage**: Additional memory/CPU requirements on home network

**If Web UI Not Required**:
- **Alternative Monitoring**: Log files, external monitoring services?
- **Debugging**: How to troubleshoot failed runs without UI?
- **Operational Visibility**: Pipeline status and health monitoring?

**Research Needed**:
1. Can Dagster run without Web UI (daemon-only mode)?
2. What are minimum viable monitoring requirements?
3. How critical is visual pipeline monitoring for simple hourly jobs?
4. What are security implications of exposing Dagster UI?

## Future Enhancements

### If Dagster Selected
- **Asset Partitioning**: Historical data processing optimization
- **Advanced Monitoring**: Integration with external monitoring systems
- **Multi-Service Integration**: Additional data sources beyond EIA

### If Simple Scripts Selected  
- **Enhanced Logging**: Structured logging with external aggregation
- **Health Monitoring**: External service monitoring integration
- **Configuration Management**: Centralized configuration service

## Research Tasks

### Phase 1: Architecture Research
- [ ] **Dagster Requirements Analysis**: Resource usage, storage needs, network requirements
- [ ] **API Design Research**: Best practices for batch data ingestion APIs
- [ ] **Railway Service Discovery**: URL patterns, stability, configuration methods
- [ ] **Authentication Strategy**: API key vs. JWT comparison for service-to-service auth

### Phase 2: Implementation Strategy  
- [ ] **Orchestration Decision**: Based on Phase 1 research, choose Dagster vs. cron
- [ ] **API Specification**: Design GridPulse data ingestion API (separate spec)
- [ ] **Configuration Management**: Secure, reliable config distribution design
- [ ] **Monitoring Strategy**: Determine monitoring approach based on orchestration choice

## Notes

**Critical Architectural Shift**: Moving from direct database access to API-first microservice pattern requires fundamental changes to data ingestion strategy. This affects:

- **Performance**: API calls vs. direct DB inserts
- **Error Handling**: Network failures become more common failure mode
- **Authentication**: New security boundary requiring API authentication
- **Monitoring**: Additional layer requiring monitoring (API availability, response times)

**Benefits of API-First Approach**:
- True microservice isolation
- API can serve multiple consumers (worker, UI, future services)
- Better security boundaries
- Independent scaling of ingestion and API services

**Tradeoffs**:
- Additional network calls and latency
- More complex error handling
- API becomes critical path for data ingestion
- Additional authentication and authorization complexity

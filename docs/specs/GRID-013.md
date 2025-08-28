# GRID-013: EIA Data Ingestion Service

**Status**: 🆕 New  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  

**Issue Link**: *To be created*

## Overview

Implement the Python worker service for automated EIA-930 data ingestion, including hourly scheduled jobs, API integration, data processing with pandas, and error handling.

## Problem Statement

GridPulse requires reliable, automated ingestion of EIA-930 data with:
- Hourly data fetching from EIA v2 API (18.8 records/hour/BA)
- Data normalization and validation
- Idempotent operations (safe to re-run)
- Error handling and retry logic
- Performance target: <5 minutes for 24 hours of 5 BAs data

## Scope

### In Scope
- EIA v2 API integration and authentication
- Hourly job scheduling with APScheduler  
- Data fetching for 5 MVP Balancing Authorities
- Data processing with pandas and TimescaleDB insertion
- Error handling, logging, and monitoring
- Idempotency and duplicate prevention
- Basic retry logic and rate limiting

### Out of Scope
- Complex queue systems (BullMQ upgrade path in future specs)
- Real-time data streaming (hourly batch is sufficient for MVP)
- Data analytics and calculations (separate specs)
- UI integration (future specs)
- Advanced monitoring (basic logging only)

## Architecture Decision: Dagster for Pipeline Orchestration

### Research and Analysis

In evaluating frameworks for data pipeline orchestration, we considered Prefect, Apache Airflow, and Dagster. The key requirements were:
- Clear data architecture visibility
- Support for parallel execution  
- Low overhead in setup and maintenance
- Data lineage and validation capabilities

### Decision: Dagster Selected

**Rationale:**
- **Architecture-First Approach**: Dagster aligns with our desire for intuitive, visual understanding of data flow
- **Strong Data Lineage**: Native tracking of data dependencies and asset versioning
- **Efficient Parallelism**: Supports concurrent task execution natively
- **Data-Centric Design**: Asset-based model fits EIA data series perfectly
- **Developer Experience**: Clear, Pythonic APIs and good documentation

**Why Not Alternatives:**
- **Prefect**: Less architectural transparency, fewer data-centric features
- **Airflow**: Higher operational complexity even in lightweight variants, task-focused rather than asset-focused

### Consequences
- **Positive**: Better maintainability, improved debugging/observability, native scaling for asset-driven workflows
- **Tradeoffs**: Learning curve for team, may require custom integrations for legacy systems

## Technical Requirements

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

### Dagster Pipeline Architecture

```python
# Dagster assets for EIA data ingestion
from dagster import asset, AssetIn, Config, get_dagster_logger
from typing import List, Dict, Any
import pandas as pd
import requests
from datetime import datetime, timedelta

class EIAConfig(Config):
    api_key: str
    base_url: str = "https://api.eia.gov/v2"
    rate_limit_per_hour: int = 5000

MVP_BALANCING_AUTHORITIES = ['PJM', 'CAISO', 'MISO', 'ERCOT', 'SPP']

@asset(group_name="eia_raw_data")
def eia_demand_data(config: EIAConfig) -> Dict[str, pd.DataFrame]:
    """Fetch hourly demand data for all MVP balancing authorities"""
    logger = get_dagster_logger()
    
    demand_data = {}
    for ba_code in MVP_BALANCING_AUTHORITIES:
        df = fetch_eia_data(config, ba_code, 'demand')
        demand_data[ba_code] = df
        logger.info(f"Fetched {len(df)} demand records for {ba_code}")
    
    return demand_data

@asset(group_name="eia_raw_data") 
def eia_fuel_mix_data(config: EIAConfig) -> Dict[str, pd.DataFrame]:
    """Fetch hourly fuel mix data for all MVP balancing authorities"""
    logger = get_dagster_logger()
    
    fuel_mix_data = {}
    for ba_code in MVP_BALANCING_AUTHORITIES:
        df = fetch_eia_data(config, ba_code, 'fuel_mix')
        fuel_mix_data[ba_code] = df
        logger.info(f"Fetched {len(df)} fuel mix records for {ba_code}")
    
    return fuel_mix_data

@asset(group_name="eia_processed")
def normalized_observations(
    eia_demand_data: Dict[str, pd.DataFrame],
    eia_fuel_mix_data: Dict[str, pd.DataFrame]
) -> pd.DataFrame:
    """Normalize and combine all EIA data into standardized observations"""
    logger = get_dagster_logger()
    
    all_observations = []
    
    # Process demand data
    for ba_code, df in eia_demand_data.items():
        normalized = normalize_demand_data(df, ba_code)
        all_observations.append(normalized)
        
    # Process fuel mix data  
    for ba_code, df in eia_fuel_mix_data.items():
        normalized = normalize_fuel_mix_data(df, ba_code)
        all_observations.append(normalized)
    
    combined_df = pd.concat(all_observations, ignore_index=True)
    logger.info(f"Normalized {len(combined_df)} total observations")
    
    return combined_df

@asset(group_name="timescaledb")
def stored_observations(normalized_observations: pd.DataFrame) -> int:
    """Store normalized observations in TimescaleDB"""
    logger = get_dagster_logger()
    
    # Validate data quality
    valid_observations = validate_observations(normalized_observations)
    
    # Batch insert to database with upsert logic
    records_inserted = batch_upsert_observations(valid_observations)
    
    logger.info(f"Successfully stored {records_inserted} observations")
    return records_inserted

def fetch_eia_data(config: EIAConfig, ba_code: str, data_type: str) -> pd.DataFrame:
    """Fetch data from EIA API with rate limiting and error handling"""
    # Implementation details for API calls with pandas DataFrame return
    pass

def normalize_demand_data(raw_df: pd.DataFrame, ba_code: str) -> pd.DataFrame:
    """Transform raw EIA demand data into normalized observation format"""
    # Implementation details for pandas transformation
    pass
```

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

- **GRID-011**: ✅ Railway worker service deployed (update to Python environment)
- **GRID-012**: ✅ TimescaleDB schema implemented
- EIA API key obtained and configured in Dagster environment
- Python 3.9+ environment with Dagster, pandas, psycopg2, sqlalchemy packages
- Dagster daemon running for schedule and sensor execution

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

## Future Enhancements

### Advanced Dagster Features
- **Asset Partitioning**: Time-based partitioning for efficient historical processing
- **Asset Selection**: Selective re-processing of specific data ranges or BAs
- **Multi-Asset Jobs**: Optimized parallel processing across multiple BAs
- **Asset Checks**: Comprehensive data quality scoring and anomaly detection

### Dagster+ Cloud Features (Optional)
- **Branch Deployments**: Isolated testing of pipeline changes
- **Monitoring & Alerting**: Advanced notification integrations
- **Insights**: Performance analytics and optimization recommendations
- **Role-Based Access Control**: Team collaboration with appropriate permissions

## Notes

This implementation leverages Dagster's asset-centric architecture for reliability and observability. The pipeline is designed to be stateless and idempotent through Dagster's materialization system, making it safe to restart and re-run without data corruption.

The 15-minute offset in Dagster schedules accounts for EIA's typical publication delay, ensuring data is available when assets are materialized.

Key advantages of the Dagster approach:
- **Asset lineage** provides clear visibility into data dependencies and transformations
- **Native retry policies** handle transient failures gracefully  
- **Pandas integration** enables efficient data processing and validation
- **Built-in monitoring** through Dagster Web UI reduces operational overhead
- **Sensor-based backfilling** automatically handles data gaps without manual intervention

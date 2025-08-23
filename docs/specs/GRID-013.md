# GRID-013: EIA Data Ingestion Service

**Status**: 🆕 New  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  

**Issue Link**: *To be created*

## Overview

Implement the Node.js worker service for automated EIA-930 data ingestion, including hourly cron jobs, API integration, data normalization, and error handling.

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
- Hourly cron job scheduling with node-cron
- Data fetching for 5 MVP Balancing Authorities
- Data normalization and TimescaleDB insertion
- Error handling, logging, and monitoring
- Idempotency and duplicate prevention
- Basic retry logic and rate limiting

### Out of Scope
- Complex queue systems (BullMQ upgrade path in future specs)
- Real-time data streaming (hourly batch is sufficient for MVP)
- Data analytics and calculations (separate specs)
- UI integration (future specs)
- Advanced monitoring (basic logging only)

## Technical Requirements

### EIA API Integration

Based on GridPulse product research, target these EIA-930 endpoints:

#### Primary Data Series
```typescript
interface EIADataSeries {
  // Demand data (most reliable, near real-time)
  demand: '/electricity/rto/region-data/';
  
  // Generation by fuel type (12+ hour lag in some regions)
  fuelMix: '/electricity/rto/fuel-type-data/';
  
  // Interchange between BAs
  interchange: '/electricity/rto/interchange-data/';
  
  // Day-ahead demand forecasts
  forecast: '/electricity/rto/demand-forecast/';
}
```

#### MVP Balancing Authorities
```typescript
const MVP_BALANCING_AUTHORITIES = [
  'PJM',    // PJM Interconnection (Eastern)
  'CAISO',  // California ISO (Western)  
  'MISO',   // Midcontinent ISO (Central)
  'ERCOT',  // Texas (separate grid)
  'SPP'     // Southwest Power Pool (Central)
];
```

### Worker Service Architecture

```typescript
// Main worker service structure
class EIAIngestionService {
  private apiClient: EIAAPIClient;
  private database: TimescaleDBClient;
  private logger: Logger;
  
  async startScheduledJobs(): Promise<void>;
  async ingestLatestData(): Promise<void>;
  async processBalancingAuthority(baCode: string): Promise<void>;
  async normalizeAndStore(rawData: EIAResponse): Promise<void>;
}
```

### Cron Job Configuration

```typescript
import cron from 'node-cron';

// Every hour at 15 minutes past (gives EIA time to publish)
cron.schedule('15 * * * *', async () => {
  try {
    await ingestionService.ingestLatestData();
  } catch (error) {
    logger.error('Scheduled ingestion failed', { error });
  }
});

// Daily health check and metrics at 1 AM
cron.schedule('0 1 * * *', async () => {
  await ingestionService.generateHealthMetrics();
});
```

## Implementation Tasks

### Phase 1: EIA API Client
- [ ] Implement EIA v2 API authentication
- [ ] Create typed interfaces for EIA responses
- [ ] Implement rate limiting (respect EIA API limits)
- [ ] Add request/response logging
- [ ] Implement basic retry logic with exponential backoff

### Phase 2: Data Processing Pipeline
- [ ] Implement data normalization functions
- [ ] Create series mapping logic (EIA series → internal series)
- [ ] Implement data validation and quality checks
- [ ] Add duplicate detection and handling
- [ ] Create batch insertion optimizations

### Phase 3: Scheduling & Orchestration
- [ ] Set up node-cron for hourly ingestion
- [ ] Implement job execution monitoring
- [ ] Add error handling and alerting
- [ ] Create health check endpoints
- [ ] Implement graceful shutdown handling

### Phase 4: Testing & Validation
- [ ] Create unit tests for all components
- [ ] Implement integration tests with EIA API
- [ ] Add performance benchmarking
- [ ] Test error scenarios and recovery
- [ ] Validate data quality and completeness

## Implementation Details

### EIA API Client Implementation

```typescript
interface EIAAPIClient {
  async fetchDemandData(
    baCode: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<EIADemandResponse>;
  
  async fetchFuelMixData(
    baCode: string,
    startDate: Date,
    endDate: Date  
  ): Promise<EIAFuelMixResponse>;
  
  async fetchInterchangeData(
    baCode: string,
    startDate: Date,
    endDate: Date
  ): Promise<EIAInterchangeResponse>;
}

class EIAAPIClientImpl implements EIAAPIClient {
  private readonly baseURL = 'https://api.eia.gov/v2';
  private readonly apiKey: string;
  private readonly rateLimiter: RateLimiter;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter({
      tokensPerInterval: 5000, // EIA limit: 5000 requests/hour
      interval: 'hour'
    });
  }
  
  async fetchDemandData(baCode: string, startDate: Date, endDate: Date) {
    await this.rateLimiter.removeTokens(1);
    
    const params = new URLSearchParams({
      api_key: this.apiKey,
      frequency: 'hourly',
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      'facets[respondent][]': baCode,
      'sort[0][column]': 'period',
      'sort[0][direction]': 'asc'
    });
    
    const response = await fetch(
      `${this.baseURL}/electricity/rto/region-data/data/?${params}`
    );
    
    if (!response.ok) {
      throw new EIAAPIError(`API request failed: ${response.status}`);
    }
    
    return response.json() as EIADemandResponse;
  }
}
```

### Data Normalization Pipeline

```typescript
interface DataNormalizer {
  normalizeDemandData(rawData: EIADemandResponse): NormalizedObservation[];
  normalizeFuelMixData(rawData: EIAFuelMixResponse): NormalizedObservation[];
  validateObservation(obs: NormalizedObservation): ValidationResult;
}

interface NormalizedObservation {
  seriesId: string;
  timestamp: Date;
  value: number;
  qualityFlag: 'good' | 'estimated' | 'missing';
  sourceData: any; // Original EIA data for audit trail
}

class DataNormalizerImpl implements DataNormalizer {
  normalizeDemandData(rawData: EIADemandResponse): NormalizedObservation[] {
    return rawData.response.data.map(record => ({
      seriesId: this.mapToInternalSeriesId(record.respondent, 'demand'),
      timestamp: new Date(record.period),
      value: parseFloat(record.value),
      qualityFlag: this.determineQualityFlag(record),
      sourceData: record
    }));
  }
  
  private mapToInternalSeriesId(baCode: string, type: string): string {
    // Look up internal series ID from database
    // This requires series to be pre-created in GRID-012
    return `${baCode}_${type}`;
  }
  
  private determineQualityFlag(record: any): 'good' | 'estimated' | 'missing' {
    // EIA quality flag mapping logic
    if (record.value === null) return 'missing';
    if (record['data-quality-flag']) return 'estimated';
    return 'good';
  }
}
```

### Database Integration

```typescript
interface TimescaleDBClient {
  async batchInsertObservations(observations: NormalizedObservation[]): Promise<void>;
  async getLatestTimestamp(seriesId: string): Promise<Date | null>;
  async checkSeriesExists(seriesId: string): Promise<boolean>;
}

class TimescaleDBClientImpl implements TimescaleDBClient {
  constructor(private pool: Pool) {}
  
  async batchInsertObservations(observations: NormalizedObservation[]) {
    const query = `
      INSERT INTO observations (series_id, ts, value, quality_flag, source_data)
      SELECT 
        s.id,
        $1::timestamptz,
        $2::numeric,
        $3::varchar,
        $4::jsonb
      FROM series s
      WHERE s.eia_series_id = $5
      ON CONFLICT (series_id, ts) DO UPDATE SET
        value = EXCLUDED.value,
        quality_flag = EXCLUDED.quality_flag,
        source_data = EXCLUDED.source_data
    `;
    
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const obs of observations) {
        await client.query(query, [
          obs.timestamp,
          obs.value,
          obs.qualityFlag,
          JSON.stringify(obs.sourceData),
          obs.seriesId
        ]);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}
```

### Main Ingestion Service

```typescript
class EIAIngestionService {
  constructor(
    private apiClient: EIAAPIClient,
    private database: TimescaleDBClient,
    private normalizer: DataNormalizer,
    private logger: Logger
  ) {}
  
  async ingestLatestData(): Promise<void> {
    const startTime = Date.now();
    this.logger.info('Starting scheduled data ingestion');
    
    try {
      // Process each BA in parallel for efficiency
      const promises = MVP_BALANCING_AUTHORITIES.map(baCode => 
        this.processBalancingAuthority(baCode)
      );
      
      const results = await Promise.allSettled(promises);
      
      // Log results and any failures
      results.forEach((result, index) => {
        const baCode = MVP_BALANCING_AUTHORITIES[index];
        if (result.status === 'rejected') {
          this.logger.error(`Failed to process ${baCode}`, { 
            error: result.reason 
          });
        } else {
          this.logger.info(`Successfully processed ${baCode}`, {
            recordsIngested: result.value
          });
        }
      });
      
      const duration = Date.now() - startTime;
      this.logger.info('Ingestion completed', { 
        duration: `${duration}ms`,
        totalBAs: MVP_BALANCING_AUTHORITIES.length
      });
      
    } catch (error) {
      this.logger.error('Ingestion failed', { error });
      throw error;
    }
  }
  
  async processBalancingAuthority(baCode: string): Promise<number> {
    // Get the latest data we have for this BA
    const latestTimestamp = await this.getLatestDataTimestamp(baCode);
    
    // Fetch data from latest timestamp to now
    const endDate = new Date();
    const startDate = latestTimestamp || new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Fetch all data types for this BA
    const [demandData, fuelMixData, interchangeData] = await Promise.all([
      this.apiClient.fetchDemandData(baCode, startDate, endDate),
      this.apiClient.fetchFuelMixData(baCode, startDate, endDate),
      this.apiClient.fetchInterchangeData(baCode, startDate, endDate)
    ]);
    
    // Normalize and combine all observations
    const allObservations = [
      ...this.normalizer.normalizeDemandData(demandData),
      ...this.normalizer.normalizeFuelMixData(fuelMixData),
      ...this.normalizer.normalizeInterchangeData(interchangeData)
    ];
    
    // Validate and filter observations
    const validObservations = allObservations.filter(obs => {
      const validation = this.normalizer.validateObservation(obs);
      if (!validation.isValid) {
        this.logger.warn('Invalid observation filtered', {
          baCode,
          observation: obs,
          errors: validation.errors
        });
      }
      return validation.isValid;
    });
    
    // Batch insert to database
    if (validObservations.length > 0) {
      await this.database.batchInsertObservations(validObservations);
    }
    
    return validObservations.length;
  }
}
```

## Success Criteria

### Functional Requirements
- [ ] Successfully fetches data from EIA API for all 5 MVP BAs
- [ ] Normalizes and stores data in TimescaleDB
- [ ] Runs hourly cron job without manual intervention
- [ ] Handles API errors gracefully with retry logic
- [ ] Prevents duplicate data insertion (idempotent)

### Performance Requirements
- [ ] Ingests 24 hours of data for 5 BAs in <5 minutes
- [ ] Processes 2,256 records/day average (18.8 records/hour/BA × 5 BAs × 24 hours)
- [ ] API rate limiting stays under EIA limits (5000 requests/hour)
- [ ] Database insertion performance >1000 records/second

### Reliability Requirements
- [ ] Handles network failures with exponential backoff retry
- [ ] Recovers from database connection issues
- [ ] Logs all operations for debugging and monitoring
- [ ] Graceful shutdown on service restart
- [ ] Health check endpoint responds correctly

### Data Quality Requirements
- [ ] Data validation catches malformed records
- [ ] Quality flags properly assigned (good/estimated/missing)
- [ ] Source data preserved for audit trail
- [ ] No data loss during ingestion process

## Dependencies

- **GRID-011**: ✅ Railway worker service deployed
- **GRID-012**: ✅ TimescaleDB schema implemented
- EIA API key obtained and configured
- Node.js environment with required packages

## Monitoring and Alerting

### Key Metrics
- **Ingestion success rate**: % of successful hourly runs
- **Data volume**: Records ingested per hour/day
- **API performance**: Response times and error rates
- **Processing time**: End-to-end ingestion duration
- **Data freshness**: Time lag from EIA publication to storage

### Health Check Endpoint
```typescript
app.get('/worker/health', async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    lastIngestion: await getLastIngestionTimestamp(),
    activeJobs: cron.getTasks().size,
    database: await checkDatabaseConnection(),
    eia_api: await checkEIAAPIConnection()
  };
  
  const isHealthy = health.database && health.eia_api;
  res.status(isHealthy ? 200 : 503).json(health);
});
```

## Future Enhancements

### BullMQ Migration Path
When moving from node-cron to BullMQ (future spec):
- Job queue for individual BA processing
- Better error handling and retry policies
- Job prioritization and rate limiting
- Monitoring dashboard integration

### Advanced Features
- Backfill jobs for historical data gaps
- Data quality scoring and anomaly detection
- Adaptive scheduling based on EIA publication patterns
- Multi-region failover and redundancy

## Notes

This implementation focuses on reliability and simplicity for the MVP. The service is designed to be stateless and idempotent, making it safe to restart and re-run without data corruption.

The 15-minute offset in the cron schedule accounts for EIA's typical publication delay, ensuring data is available when we fetch it.

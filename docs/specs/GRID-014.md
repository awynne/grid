# GRID-014: Redis Caching Layer

**Status**: 🆕 New  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  

**Issue Link**: *To be created*

## Overview

Implement Redis caching layer for GridPulse MVP to optimize performance, reduce database load, and enable fast API responses with <300ms target response times.

## Problem Statement

GridPulse requires a caching strategy that:
- Achieves <300ms API response times for cached data
- Reduces TimescaleDB query load for frequently accessed data
- Provides stale data fallback when EIA API is unavailable
- Supports cache invalidation for fresh data updates
- Stays within Railway/Upstash free tier limits initially

## Scope

### In Scope
- Redis cache client setup and configuration
- Cache key design and naming conventions
- Caching strategies for different data types
- Cache invalidation and TTL management
- Performance optimization for dashboard queries
- Error handling and fallback strategies

### Out of Scope
- Advanced cache warming strategies (future optimization)
- Distributed caching (single Redis instance sufficient for MVP)
- Complex cache analytics (basic metrics only)
- Cache persistence configuration (Redis default)

## Technical Requirements

### Cache Architecture

Based on GRID-008 design, implement these cache patterns:

```typescript
interface CacheKeys {
  // Balancing Authority metadata (long TTL)
  baList: 'ba:list:v1';
  baInfo: (baCode: string) => `ba:${baCode}:info:v1`;
  
  // Time-series data (medium TTL)
  dailyPulse: (ba: string, date: string) => `daily:${ba}:${date}`;
  hourlyData: (ba: string, hour: string) => `hourly:${ba}:${hour}`;
  
  // Real-time indicators (short TTL)
  freshness: (ba: string) => `freshness:${ba}:v1`;
  cleanWindow: (ba: string) => `clean:${ba}:${Date.now().toString().slice(0, -5)}`; // 10min buckets
  
  // Analytics results (long TTL, invalidated on new data)
  duckScores: (ba: string, days: number) => `ducks:${ba}:${days}d`;
  baselineComparison: (ba: string, date: string) => `baseline:${ba}:${date}`;
}
```

### Cache Client Implementation

```typescript
interface CacheClient {
  // Basic operations
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  
  // Advanced operations
  mget<T>(keys: string[]): Promise<(T | null)[]>;
  mset(keyValues: Record<string, any>, ttlSeconds?: number): Promise<void>;
  exists(key: string): Promise<boolean>;
  
  // Cache management
  invalidatePattern(pattern: string): Promise<void>;
  flushAll(): Promise<void>;
}

class RedisCacheClient implements CacheClient {
  constructor(
    private redis: Redis,
    private logger: Logger,
    private metrics: MetricsCollector
  ) {}
  
  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    try {
      const value = await this.redis.get(key);
      this.metrics.recordCacheHit(key, Date.now() - startTime);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.metrics.recordCacheError(key, error);
      this.logger.error('Cache get failed', { key, error });
      return null; // Graceful degradation
    }
  }
  
  async set<T>(key: string, value: T, ttlSeconds = 3600): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttlSeconds, serialized);
      this.metrics.recordCacheSet(key);
    } catch (error) {
      this.metrics.recordCacheError(key, error);
      this.logger.error('Cache set failed', { key, error });
      // Don't throw - caching is not critical for functionality
    }
  }
}
```

## Implementation Tasks

### Phase 1: Cache Client Setup
- [ ] Install and configure Redis client (ioredis)
- [ ] Implement CacheClient interface with error handling
- [ ] Add connection pooling and retry logic
- [ ] Create cache key utilities and constants
- [ ] Add basic metrics collection

### Phase 2: Caching Strategies
- [ ] Implement read-through caching for BA metadata
- [ ] Add write-through caching for time-series data
- [ ] Implement cache-aside pattern for analytics results
- [ ] Add TTL management for different data types
- [ ] Create cache warming utilities

### Phase 3: Integration Points
- [ ] Integrate caching into database query layer
- [ ] Add cache invalidation to data ingestion service
- [ ] Implement fallback strategies for cache misses
- [ ] Add cache health monitoring
- [ ] Create cache management utilities

### Phase 4: Performance Optimization
- [ ] Implement batch operations for bulk queries
- [ ] Add compression for large cached objects
- [ ] Optimize serialization/deserialization
- [ ] Add cache hit ratio monitoring
- [ ] Performance test and tune TTL values

## Implementation Details

### Cache Strategy by Data Type

#### 1. Balancing Authority Metadata (Long TTL - 24 hours)
```typescript
class BAMetadataCache {
  private cache: CacheClient;
  private readonly TTL = 24 * 60 * 60; // 24 hours
  
  async getBAList(): Promise<BalancingAuthority[]> {
    const cacheKey = 'ba:list:v1';
    
    // Try cache first
    let baList = await this.cache.get<BalancingAuthority[]>(cacheKey);
    if (baList) {
      return baList;
    }
    
    // Cache miss - fetch from database
    baList = await this.database.getBalancingAuthorities();
    await this.cache.set(cacheKey, baList, this.TTL);
    
    return baList;
  }
  
  async getBAInfo(baCode: string): Promise<BalancingAuthority | null> {
    const cacheKey = `ba:${baCode}:info:v1`;
    
    let baInfo = await this.cache.get<BalancingAuthority>(cacheKey);
    if (baInfo) {
      return baInfo;
    }
    
    baInfo = await this.database.getBalancingAuthority(baCode);
    if (baInfo) {
      await this.cache.set(cacheKey, baInfo, this.TTL);
    }
    
    return baInfo;
  }
}
```

#### 2. Time-Series Data (Medium TTL - 1 hour)
```typescript
class TimeSeriesCache {
  private cache: CacheClient;
  private readonly TTL = 60 * 60; // 1 hour
  
  async getHourlyData(
    baCode: string, 
    startHour: Date, 
    endHour: Date
  ): Promise<TimeSeriesPoint[]> {
    // Generate cache keys for each hour
    const hours = this.generateHourRange(startHour, endHour);
    const cacheKeys = hours.map(hour => 
      `hourly:${baCode}:${hour.toISOString().slice(0, 13)}`
    );
    
    // Batch get from cache
    const cachedData = await this.cache.mget<TimeSeriesPoint[]>(cacheKeys);
    
    // Identify cache misses
    const missingHours: Date[] = [];
    cachedData.forEach((data, index) => {
      if (!data) {
        missingHours.push(hours[index]);
      }
    });
    
    // Fetch missing data from database
    let missingData: TimeSeriesPoint[] = [];
    if (missingHours.length > 0) {
      missingData = await this.database.getHourlyData(
        baCode, 
        missingHours[0], 
        missingHours[missingHours.length - 1]
      );
      
      // Cache the fetched data
      const cacheOperations: Record<string, TimeSeriesPoint[]> = {};
      missingData.forEach(point => {
        const hourKey = `hourly:${baCode}:${point.timestamp.toISOString().slice(0, 13)}`;
        cacheOperations[hourKey] = [point]; // Single point per hour key
      });
      
      await this.cache.mset(cacheOperations, this.TTL);
    }
    
    // Combine cached and fetched data
    const allData = [...cachedData.filter(Boolean).flat(), ...missingData];
    return allData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }
}
```

#### 3. Analytics Results (Long TTL with Invalidation)
```typescript
class AnalyticsCache {
  private cache: CacheClient;
  private readonly TTL = 6 * 60 * 60; // 6 hours
  
  async getDuckCurveScores(
    baCode: string, 
    days: number
  ): Promise<DuckCurveMetrics | null> {
    const cacheKey = `ducks:${baCode}:${days}d`;
    
    // Check cache first
    let metrics = await this.cache.get<DuckCurveMetrics>(cacheKey);
    if (metrics) {
      return metrics;
    }
    
    // Cache miss - compute metrics
    metrics = await this.analytics.calculateDuckCurveMetrics(baCode, days);
    if (metrics) {
      await this.cache.set(cacheKey, metrics, this.TTL);
    }
    
    return metrics;
  }
  
  // Invalidate analytics cache when new data arrives
  async invalidateAnalyticsCache(baCode: string): Promise<void> {
    const patterns = [
      `ducks:${baCode}:*`,
      `baseline:${baCode}:*`,
      `daily:${baCode}:*`
    ];
    
    await Promise.all(
      patterns.map(pattern => this.cache.invalidatePattern(pattern))
    );
  }
}
```

#### 4. Real-Time Indicators (Short TTL - 10 minutes)
```typescript
class FreshnessCache {
  private cache: CacheClient;
  private readonly TTL = 10 * 60; // 10 minutes
  
  async getFreshnessIndicator(baCode: string): Promise<FreshnessIndicator> {
    const cacheKey = `freshness:${baCode}:v1`;
    
    let indicator = await this.cache.get<FreshnessIndicator>(cacheKey);
    if (indicator) {
      return indicator;
    }
    
    // Calculate freshness from latest data timestamps
    indicator = await this.calculateFreshness(baCode);
    await this.cache.set(cacheKey, indicator, this.TTL);
    
    return indicator;
  }
  
  async getCleanEnergyWindow(baCode: string): Promise<CleanEnergyWindow> {
    // Use time-bucketed cache key for 10-minute windows
    const timeBucket = Math.floor(Date.now() / (10 * 60 * 1000));
    const cacheKey = `clean:${baCode}:${timeBucket}`;
    
    let window = await this.cache.get<CleanEnergyWindow>(cacheKey);
    if (window) {
      return window;
    }
    
    window = await this.analytics.calculateCleanEnergyWindow(baCode);
    await this.cache.set(cacheKey, window, this.TTL);
    
    return window;
  }
}
```

### Cache Integration Layer

```typescript
class CacheIntegratedDataService {
  constructor(
    private database: TimescaleDBClient,
    private cache: CacheClient,
    private baCache: BAMetadataCache,
    private tsCache: TimeSeriesCache,
    private analyticsCache: AnalyticsCache,
    private freshnessCache: FreshnessCache
  ) {}
  
  // High-level API that automatically uses caching
  async getDashboardData(baCode: string): Promise<DashboardData> {
    const [baInfo, latestData, freshness, duckScores] = await Promise.all([
      this.baCache.getBAInfo(baCode),
      this.tsCache.getHourlyData(
        baCode, 
        new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        new Date()
      ),
      this.freshnessCache.getFreshnessIndicator(baCode),
      this.analyticsCache.getDuckCurveScores(baCode, 30)
    ]);
    
    return {
      balancingAuthority: baInfo,
      timeSeriesData: latestData,
      freshness,
      analytics: { duckCurve: duckScores }
    };
  }
  
  // Called by ingestion service to invalidate cache
  async onNewDataIngested(baCode: string): Promise<void> {
    await Promise.all([
      this.freshnessCache.invalidateFreshness(baCode),
      this.analyticsCache.invalidateAnalyticsCache(baCode),
      // Don't invalidate time-series cache - it will naturally expire
    ]);
  }
}
```

## Success Criteria

### Performance Requirements
- [ ] API responses <300ms for cached data (90th percentile)
- [ ] Cache hit ratio >80% for frequently accessed data
- [ ] Cache operations complete in <10ms average
- [ ] Graceful degradation when cache is unavailable

### Reliability Requirements
- [ ] Cache failures don't break application functionality
- [ ] Automatic reconnection on Redis connection loss
- [ ] Proper error handling and logging for all cache operations
- [ ] Cache invalidation works correctly after data updates

### Resource Requirements
- [ ] Stay within Upstash free tier limits (10K requests/day initially)
- [ ] Memory usage <100MB for cached data
- [ ] Cache key naming follows consistent patterns
- [ ] TTL values optimized for data freshness vs performance

## Cache Configuration

### TTL Strategy
```typescript
const CACHE_TTL = {
  // Static/slow-changing data
  BA_METADATA: 24 * 60 * 60,      // 24 hours
  SERIES_DEFINITIONS: 12 * 60 * 60, // 12 hours
  
  // Time-series data  
  HOURLY_DATA: 60 * 60,           // 1 hour
  DAILY_AGGREGATES: 6 * 60 * 60,  // 6 hours
  
  // Analytics results
  DUCK_SCORES: 6 * 60 * 60,       // 6 hours
  BASELINE_COMPARISON: 2 * 60 * 60, // 2 hours
  
  // Real-time indicators
  FRESHNESS: 10 * 60,             // 10 minutes
  CLEAN_WINDOWS: 10 * 60,         // 10 minutes
} as const;
```

### Redis Configuration
```typescript
const redisConfig = {
  host: process.env.UPSTASH_REDIS_REST_URL,
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  
  // Connection pool settings
  family: 4,
  connectTimeout: 10000,
  commandTimeout: 5000,
};
```

## Dependencies

- **GRID-011**: ✅ Railway infrastructure with Redis add-on
- **GRID-012**: ✅ TimescaleDB schema for data queries
- **GRID-013**: Data ingestion service for cache invalidation
- Redis client library (ioredis)

## Monitoring and Metrics

### Key Metrics to Track
- **Cache hit ratio**: % of requests served from cache
- **Cache response times**: Average/p95 cache operation latency
- **Cache memory usage**: Current memory consumption
- **Error rates**: Failed cache operations per minute
- **TTL effectiveness**: How often data expires vs gets invalidated

### Health Check Integration
```typescript
async function checkCacheHealth(): Promise<HealthStatus> {
  try {
    const testKey = 'health:check';
    await cache.set(testKey, { timestamp: Date.now() }, 60);
    const result = await cache.get(testKey);
    await cache.del(testKey);
    
    return {
      status: 'healthy',
      latency: Date.now() - result.timestamp,
      connected: true
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      connected: false
    };
  }
}
```

## Future Optimizations

### Cache Warming
- Pre-populate cache with dashboard data during low-traffic periods
- Intelligent prefetching based on user access patterns
- Background refresh of expiring high-value cache entries

### Advanced Features
- Cache compression for large objects
- Cache tiering (L1: memory, L2: Redis)
- Distributed cache invalidation for multi-instance deployments
- Cache analytics and optimization recommendations

## Notes

This caching layer is designed to be transparent to the application logic - if cache fails, the system falls back to database queries. The cache serves as a performance optimization, not a critical dependency.

The TTL values are initially conservative and should be tuned based on actual usage patterns and data freshness requirements observed in production.

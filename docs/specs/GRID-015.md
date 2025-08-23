# GRID-015: REST API Design

**Status**: 🆕 New  
**Priority**: High  
**Created**: 2025-08-22  
**Updated**: 2025-08-22  

**Issue Link**: *To be created*

## Overview

Design and implement the REST API layer for GridPulse MVP, providing language-agnostic endpoints for time-series data, analytics, and dashboard functionality with <300ms response times.

## Problem Statement

GridPulse requires a well-designed REST API that:
- Serves dashboard data with <300ms response times
- Provides language-agnostic endpoints for future Python integration
- Supports efficient time-series data queries
- Enables real-time freshness indicators
- Follows RESTful conventions and best practices
- Integrates seamlessly with caching layer

## Scope

### In Scope
- REST API endpoint design and implementation
- Request/response schemas and validation
- Error handling and status codes
- API documentation and OpenAPI spec
- Integration with caching and database layers
- Authentication and rate limiting (basic)
- Performance optimization for dashboard queries

### Out of Scope
- GraphQL implementation (REST-first approach)
- Advanced authentication (OAuth, complex permissions)
- API versioning strategy (v1 only for MVP)
- Webhook/real-time subscriptions (future enhancement)
- Complex API analytics (basic metrics only)

## Technical Requirements

### API Architecture

```typescript
// Core API structure following GridPulse features
interface APIEndpoints {
  // Balancing Authority metadata
  '/api/v1/balancing-authorities': BalancingAuthority[];
  '/api/v1/balancing-authorities/{baCode}': BalancingAuthority;
  
  // Time-series data
  '/api/v1/balancing-authorities/{baCode}/demand': TimeSeriesData[];
  '/api/v1/balancing-authorities/{baCode}/generation': GenerationData[];
  '/api/v1/balancing-authorities/{baCode}/interchange': InterchangeData[];
  
  // Dashboard endpoints (optimized for UI)
  '/api/v1/dashboard/{baCode}': DashboardData;
  '/api/v1/dashboard/{baCode}/daily-pulse': DailyPulseData;
  '/api/v1/dashboard/{baCode}/freshness': FreshnessIndicator;
  
  // Analytics endpoints
  '/api/v1/analytics/{baCode}/duck-curve': DuckCurveMetrics;
  '/api/v1/analytics/{baCode}/clean-energy': CleanEnergyAnalysis;
  '/api/v1/analytics/{baCode}/baseline-comparison': BaselineComparison;
  
  // Health and status
  '/api/v1/health': HealthStatus;
  '/api/v1/status': SystemStatus;
}
```

### Response Format Standards

```typescript
// Standard API response wrapper
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    cached: boolean;
    cacheTTL?: number;
  };
}

// Time-series data format
interface TimeSeriesPoint {
  timestamp: string; // ISO 8601
  value: number;
  unit: string;
  quality: 'good' | 'estimated' | 'missing';
}

// Pagination for large datasets
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
}
```

## Implementation Tasks

### Phase 1: Core API Infrastructure
- [ ] Set up Express.js with TypeScript
- [ ] Implement request/response middleware stack
- [ ] Add input validation with Joi/Zod
- [ ] Create error handling middleware
- [ ] Add request logging and metrics

### Phase 2: Data Endpoints
- [ ] Implement balancing authority endpoints
- [ ] Create time-series data endpoints
- [ ] Add query parameter handling (date ranges, filtering)
- [ ] Integrate with caching layer
- [ ] Add response compression

### Phase 3: Dashboard Endpoints
- [ ] Create optimized dashboard data endpoints
- [ ] Implement daily pulse calculations
- [ ] Add freshness indicator endpoints
- [ ] Optimize for frontend performance
- [ ] Add real-time data indicators

### Phase 4: Analytics Endpoints
- [ ] Implement duck curve analysis endpoints
- [ ] Add clean energy window calculations
- [ ] Create baseline comparison endpoints
- [ ] Add performance monitoring
- [ ] Optimize complex query performance

## Implementation Details

### Core API Service Structure

```typescript
// Main API service class
class GridPulseAPIService {
  constructor(
    private database: TimescaleDBClient,
    private cache: CacheClient,
    private analytics: AnalyticsService,
    private logger: Logger
  ) {}
  
  // Route handlers organized by feature
  balancingAuthorities = new BalancingAuthorityController(this.database, this.cache);
  timeSeries = new TimeSeriesController(this.database, this.cache);
  dashboard = new DashboardController(this.database, this.cache, this.analytics);
  analytics = new AnalyticsController(this.analytics, this.cache);
  health = new HealthController(this.database, this.cache);
}

// Express app setup
const app = express();

// Middleware stack
app.use(helmet()); // Security headers
app.use(cors()); // CORS configuration
app.use(compression()); // Response compression
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger); // Request logging
app.use(rateLimiter); // Basic rate limiting

// API routes
app.use('/api/v1/balancing-authorities', apiService.balancingAuthorities.routes);
app.use('/api/v1/dashboard', apiService.dashboard.routes);
app.use('/api/v1/analytics', apiService.analytics.routes);
app.use('/api/v1/health', apiService.health.routes);
```

### Balancing Authority Endpoints

```typescript
class BalancingAuthorityController {
  constructor(
    private database: TimescaleDBClient,
    private cache: CacheClient
  ) {}
  
  // GET /api/v1/balancing-authorities
  async getBalancingAuthorities(req: Request, res: Response) {
    try {
      const cacheKey = 'api:ba:list:v1';
      
      // Try cache first
      let baList = await this.cache.get<BalancingAuthority[]>(cacheKey);
      
      if (!baList) {
        // Cache miss - query database
        baList = await this.database.getBalancingAuthorities();
        await this.cache.set(cacheKey, baList, 24 * 60 * 60); // 24 hour TTL
      }
      
      res.json({
        success: true,
        data: baList,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!baList
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch balancing authorities');
    }
  }
  
  // GET /api/v1/balancing-authorities/{baCode}
  async getBalancingAuthority(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      
      // Validate BA code format
      if (!/^[A-Z]{2,10}$/.test(baCode)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_BA_CODE',
            message: 'Balancing authority code must be 2-10 uppercase letters'
          }
        });
      }
      
      const cacheKey = `api:ba:${baCode}:info:v1`;
      let baInfo = await this.cache.get<BalancingAuthority>(cacheKey);
      
      if (!baInfo) {
        baInfo = await this.database.getBalancingAuthority(baCode);
        if (!baInfo) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'BA_NOT_FOUND',
              message: `Balancing authority '${baCode}' not found`
            }
          });
        }
        
        await this.cache.set(cacheKey, baInfo, 24 * 60 * 60);
      }
      
      res.json({
        success: true,
        data: baInfo,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!baInfo
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch balancing authority');
    }
  }
}
```

### Time-Series Data Endpoints

```typescript
class TimeSeriesController {
  // GET /api/v1/balancing-authorities/{baCode}/demand
  async getDemandData(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      const query = this.parseTimeSeriesQuery(req.query);
      
      // Validate query parameters
      const validation = this.validateTimeSeriesQuery(query);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_QUERY_PARAMS',
            message: 'Invalid query parameters',
            details: validation.errors
          }
        });
      }
      
      // Generate cache key based on query parameters
      const cacheKey = `api:ts:${baCode}:demand:${this.hashQuery(query)}`;
      
      let demandData = await this.cache.get<TimeSeriesPoint[]>(cacheKey);
      
      if (!demandData) {
        // Fetch from database
        demandData = await this.database.getDemandData(
          baCode,
          query.startDate,
          query.endDate,
          query.resolution
        );
        
        // Cache with appropriate TTL based on data age
        const ttl = this.calculateTTL(query.endDate);
        await this.cache.set(cacheKey, demandData, ttl);
      }
      
      res.json({
        success: true,
        data: demandData,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!demandData,
          query: {
            baCode,
            startDate: query.startDate.toISOString(),
            endDate: query.endDate.toISOString(),
            resolution: query.resolution,
            dataPoints: demandData?.length || 0
          }
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch demand data');
    }
  }
  
  private parseTimeSeriesQuery(query: any): TimeSeriesQuery {
    return {
      startDate: query.start ? new Date(query.start) : new Date(Date.now() - 24 * 60 * 60 * 1000),
      endDate: query.end ? new Date(query.end) : new Date(),
      resolution: query.resolution || 'hourly',
      limit: Math.min(parseInt(query.limit) || 1000, 10000), // Max 10k points
      offset: parseInt(query.offset) || 0
    };
  }
  
  private validateTimeSeriesQuery(query: TimeSeriesQuery): ValidationResult {
    const errors: string[] = [];
    
    if (query.startDate >= query.endDate) {
      errors.push('Start date must be before end date');
    }
    
    const maxRange = 365 * 24 * 60 * 60 * 1000; // 1 year
    if (query.endDate.getTime() - query.startDate.getTime() > maxRange) {
      errors.push('Date range cannot exceed 1 year');
    }
    
    if (!['hourly', 'daily', 'monthly'].includes(query.resolution)) {
      errors.push('Resolution must be hourly, daily, or monthly');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
```

### Dashboard Endpoints (Optimized for UI)

```typescript
class DashboardController {
  // GET /api/v1/dashboard/{baCode}
  async getDashboardData(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      const cacheKey = `api:dashboard:${baCode}:v1`;
      
      let dashboardData = await this.cache.get<DashboardData>(cacheKey);
      
      if (!dashboardData) {
        // Fetch all dashboard components in parallel
        const [baInfo, latestData, freshness, dailyPulse, analytics] = await Promise.all([
          this.database.getBalancingAuthority(baCode),
          this.database.getLatestHourlyData(baCode, 24), // Last 24 hours
          this.calculateFreshness(baCode),
          this.analytics.calculateDailyPulse(baCode),
          this.analytics.getRecentAnalytics(baCode)
        ]);
        
        if (!baInfo) {
          return res.status(404).json({
            success: false,
            error: {
              code: 'BA_NOT_FOUND',
              message: `Balancing authority '${baCode}' not found`
            }
          });
        }
        
        dashboardData = {
          balancingAuthority: baInfo,
          timeSeriesData: latestData,
          freshness,
          dailyPulse,
          analytics,
          lastUpdated: new Date().toISOString()
        };
        
        // Cache for 10 minutes (frequent updates expected)
        await this.cache.set(cacheKey, dashboardData, 10 * 60);
      }
      
      res.json({
        success: true,
        data: dashboardData,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!dashboardData,
          cacheTTL: 600 // 10 minutes
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch dashboard data');
    }
  }
  
  // GET /api/v1/dashboard/{baCode}/daily-pulse
  async getDailyPulse(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      const cacheKey = `api:pulse:${baCode}:${date.toISOString().split('T')[0]}`;
      
      let pulseData = await this.cache.get<DailyPulseData>(cacheKey);
      
      if (!pulseData) {
        pulseData = await this.analytics.calculateDailyPulse(baCode, date);
        
        // Cache for 6 hours (daily data doesn't change frequently)
        await this.cache.set(cacheKey, pulseData, 6 * 60 * 60);
      }
      
      res.json({
        success: true,
        data: pulseData,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!pulseData,
          date: date.toISOString().split('T')[0]
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to fetch daily pulse data');
    }
  }
}
```

### Analytics Endpoints

```typescript
class AnalyticsController {
  // GET /api/v1/analytics/{baCode}/duck-curve
  async getDuckCurveAnalysis(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      
      // Validate days parameter
      if (days < 1 || days > 365) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_DAYS_PARAM',
            message: 'Days parameter must be between 1 and 365'
          }
        });
      }
      
      const cacheKey = `api:analytics:duck:${baCode}:${days}d`;
      
      let duckAnalysis = await this.cache.get<DuckCurveAnalysis>(cacheKey);
      
      if (!duckAnalysis) {
        duckAnalysis = await this.analytics.calculateDuckCurveAnalysis(baCode, days);
        
        // Cache for 6 hours (analytics are computationally expensive)
        await this.cache.set(cacheKey, duckAnalysis, 6 * 60 * 60);
      }
      
      res.json({
        success: true,
        data: duckAnalysis,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!duckAnalysis,
          parameters: { baCode, days }
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to calculate duck curve analysis');
    }
  }
  
  // GET /api/v1/analytics/{baCode}/clean-energy
  async getCleanEnergyAnalysis(req: Request, res: Response) {
    try {
      const { baCode } = req.params;
      const cacheKey = `api:analytics:clean:${baCode}:current`;
      
      let cleanAnalysis = await this.cache.get<CleanEnergyAnalysis>(cacheKey);
      
      if (!cleanAnalysis) {
        cleanAnalysis = await this.analytics.calculateCleanEnergyAnalysis(baCode);
        
        // Cache for 1 hour (clean energy windows change frequently)
        await this.cache.set(cacheKey, cleanAnalysis, 60 * 60);
      }
      
      res.json({
        success: true,
        data: cleanAnalysis,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: req.headers['x-request-id'],
          cached: !!cleanAnalysis
        }
      });
      
    } catch (error) {
      this.handleError(res, error, 'Failed to calculate clean energy analysis');
    }
  }
}
```

### Error Handling and Middleware

```typescript
// Global error handling middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  const requestId = req.headers['x-request-id'] as string;
  
  logger.error('API Error', {
    requestId,
    method: req.method,
    url: req.url,
    error: err.message,
    stack: err.stack
  });
  
  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: err.message,
        details: isProduction ? undefined : err.details
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
  }
  
  if (err instanceof DatabaseError) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: 'Database temporarily unavailable'
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId
      }
    });
  }
  
  // Generic server error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId
    }
  });
}

// Request logging middleware
function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const requestId = uuidv4();
  
  req.headers['x-request-id'] = requestId;
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('API Request', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'],
      ip: req.ip
    });
  });
  
  next();
}

// Rate limiting middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  }
});
```

## Success Criteria

### Performance Requirements
- [ ] API responses <300ms for cached data (95th percentile)
- [ ] API responses <1000ms for uncached data (95th percentile)
- [ ] Support 100+ concurrent requests without degradation
- [ ] Cache hit ratio >80% for dashboard endpoints

### Reliability Requirements
- [ ] 99.9% uptime for API endpoints
- [ ] Graceful error handling for all failure scenarios
- [ ] Proper HTTP status codes for all responses
- [ ] Request timeout handling (30 second max)

### API Quality Requirements
- [ ] Consistent response format across all endpoints
- [ ] Comprehensive input validation
- [ ] Clear error messages with actionable information
- [ ] OpenAPI/Swagger documentation complete

### Security Requirements
- [ ] Input sanitization for all parameters
- [ ] Rate limiting to prevent abuse
- [ ] Security headers (helmet.js)
- [ ] CORS configuration for frontend domains

## API Documentation

### OpenAPI Specification
```yaml
openapi: 3.0.0
info:
  title: GridPulse API
  version: 1.0.0
  description: REST API for electric grid data visualization

servers:
  - url: https://gridpulse-web.up.railway.app/api/v1
    description: Production server

paths:
  /balancing-authorities:
    get:
      summary: Get all balancing authorities
      responses:
        '200':
          description: List of balancing authorities
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BalancingAuthorityListResponse'
  
  /balancing-authorities/{baCode}:
    get:
      summary: Get balancing authority by code
      parameters:
        - name: baCode
          in: path
          required: true
          schema:
            type: string
            pattern: '^[A-Z]{2,10}$'
      responses:
        '200':
          description: Balancing authority details
        '404':
          description: Balancing authority not found

components:
  schemas:
    APIResponse:
      type: object
      properties:
        success:
          type: boolean
        data:
          type: object
        error:
          $ref: '#/components/schemas/APIError'
        meta:
          $ref: '#/components/schemas/ResponseMeta'
```

## Dependencies

- **GRID-011**: ✅ Railway web service infrastructure
- **GRID-012**: ✅ TimescaleDB schema for data queries
- **GRID-013**: Data ingestion service for fresh data
- **GRID-014**: ✅ Redis caching layer integration
- Express.js, TypeScript, validation libraries

## Performance Monitoring

### Key Metrics
- **Response times**: Average, p95, p99 by endpoint
- **Error rates**: 4xx and 5xx responses per minute
- **Cache performance**: Hit ratios and cache response times
- **Database query performance**: Query times and connection pool usage
- **Throughput**: Requests per second by endpoint

### Health Check Endpoint
```typescript
// GET /api/v1/health
async function healthCheck(req: Request, res: Response) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: await checkDatabaseHealth(),
      cache: await checkCacheHealth(),
      analytics: await checkAnalyticsHealth()
    },
    version: process.env.APP_VERSION,
    uptime: process.uptime()
  };
  
  const isHealthy = Object.values(health.services).every(service => 
    service.status === 'healthy'
  );
  
  res.status(isHealthy ? 200 : 503).json(health);
}
```

## Future Enhancements

### API Evolution
- GraphQL endpoint for complex queries
- WebSocket support for real-time updates
- API versioning strategy (v2, v3)
- Advanced authentication and authorization
- API analytics and usage monitoring

### Performance Optimizations
- Response streaming for large datasets
- Advanced caching strategies (edge caching)
- Database query optimization
- Connection pooling and load balancing

## Notes

This API design prioritizes simplicity and performance for the MVP while providing a foundation for future enhancements. The language-agnostic REST design enables easy integration with the planned Python analytics services.

All endpoints are designed to work efficiently with the caching layer, ensuring fast response times for dashboard and analytics queries.

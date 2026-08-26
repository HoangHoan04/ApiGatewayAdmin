import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GatewayMetricsDto {
  totalRequests: number;
  successRate: number;
  avgLatencyMs: number;
  statusDistribution: Record<string, number>;
  uptimeSeconds: number;
  memoryUsageMb: number;
  serverTime: string;
}

export interface GatewayRouteDto {
  routeId: string;
  clusterId: string;
  pathMatch: string;
  methods: string[];
  authorizationPolicy: string;
  rateLimiterPolicy: string;
  timeout?: number;
}

export interface GatewayClusterDto {
  clusterId: string;
  destinations: Array<{
    name: string;
    address: string;
    health?: string;
  }>;
}

export interface GatewayRoutesResponse {
  totalRoutes: number;
  totalClusters: number;
  routes: GatewayRouteDto[];
  clusters: GatewayClusterDto[];
}

export interface ServiceHealthDto {
  serviceKey: string;
  name: string;
  baseUrl: string;
  description: string;
  icon: string;
  status: 'HEALTHY' | 'UNHEALTHY' | 'STANDBY' | 'UNKNOWN';
  latencyMs: number;
  lastCheckedAt: string;
  errorMessage?: string;
}

export interface HealthCheckAllResponse {
  totalServices: number;
  healthyServices: number;
  overallStatus: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  checkedAt: string;
  services: ServiceHealthDto[];
}

export interface RequestTraceItemDto {
  id: string;
  correlationId: string;
  timestamp: string;
  method: string;
  path: string;
  queryString?: string;
  clientIp: string;
  statusCode: number;
  durationMs: number;
  targetCluster?: string;
  userIdentity?: string;
}

export interface RequestLogSearchResponse {
  items: RequestTraceItemDto[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
}

export interface SwaggerDocItemDto {
  serviceKey: string;
  name: string;
  baseUrl: string;
  swaggerUrl: string;
  proxyDocUrl: string;
  description: string;
  icon: string;
  status: 'HEALTHY' | 'UNHEALTHY' | 'UNKNOWN';
  latencyMs: number;
}

@Injectable({
  providedIn: 'root',
})
export class GatewayManagementService {
  private readonly baseUrl = environment.apiUrl || 'http://localhost:8000';

  constructor(private readonly http: HttpClient) {}

  getSwaggerDocs(): Observable<SwaggerDocItemDto[]> {
    return this.http.post<SwaggerDocItemDto[]>(`${this.baseUrl}/api/gateway/swagger-docs/list`, {});
  }

  getMetrics(): Observable<GatewayMetricsDto> {
    return this.http.post<GatewayMetricsDto>(`${this.baseUrl}/api/gateway/metrics/stats`, {});
  }

  getRoutes(): Observable<GatewayRoutesResponse> {
    return this.http.post<GatewayRoutesResponse>(`${this.baseUrl}/api/gateway/routes/list`, {});
  }

  getServicesHealth(): Observable<HealthCheckAllResponse> {
    return this.http.post<HealthCheckAllResponse>(`${this.baseUrl}/api/gateway/health/check-all`, {});
  }

  searchLogs(dto: {
    keyword?: string;
    method?: string;
    statusCode?: number;
    targetCluster?: string;
    pageIndex: number;
    pageSize: number;
  }): Observable<RequestLogSearchResponse> {
    return this.http.post<RequestLogSearchResponse>(`${this.baseUrl}/api/gateway/logs/search`, dto);
  }

  clearLogs(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.baseUrl}/api/gateway/logs/clear`, {});
  }
}

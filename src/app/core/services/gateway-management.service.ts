import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface GatewayMetricsDto {
  totalRequests: number;
  successRate: number;
  avgLatencyMs: number;
  p95LatencyMs?: number;
  errorRate?: number;
  statusDistribution: Record<string, number>;
  topSlowRoutes?: Array<{ path: string; count: number; avgMs: number; p95Ms: number }>;
  timeline?: Array<{ time: string; requests: number; avgLatencyMs: number }>;
  uptimeSeconds: number;
  memoryUsageMb: number;
  serverTime: string;
  windowMinutes?: number;
  source?: string;
}

export interface GatewayRouteDto {
  id?: string;
  routeId: string;
  clusterId: string;
  clusterPk?: string;
  pathMatch: string;
  methods: string[];
  authorizationPolicy: string;
  rateLimiterPolicy: string;
  rateLimitPolicyId?: string;
  timeout?: number;
  isPublic?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  transformsJson?: string;
}

export interface GatewayClusterDto {
  id?: string;
  clusterId: string;
  serviceId?: string;
  timeoutSeconds?: number;
  circuitBreakerEnabled?: boolean;
  isActive?: boolean;
  destinations: Array<{
    id?: string;
    name: string;
    address: string;
    health?: string;
    weight?: number;
    isActive?: boolean;
  }>;
}

export interface GatewayServiceItemDto {
  id?: string;
  code: string;
  name: string;
  baseUrl: string;
  healthPath?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
}

export interface GatewayRoutesResponse {
  totalRoutes: number;
  totalClusters: number;
  routes: GatewayRouteDto[];
  clusters: GatewayClusterDto[];
  services?: GatewayServiceItemDto[];
  ratePolicies?: any[];
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

  getSecurityStatus(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/api/gateway/security/status`, {});
  }

  upsertRoute(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/routes/upsert`, body);
  }

  deleteRoute(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/routes/delete`, { id });
  }

  setRouteActive(id: string, isActive: boolean): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/routes/set-active`, { id, isActive });
  }

  testRoute(body: { method: string; path: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/routes/test`, body);
  }

  upsertRatePolicy(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/rate-policies/upsert`, body);
  }

  deleteRatePolicy(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/rate-policies/delete`, { id });
  }

  upsertIpRule(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/ip-rules/upsert`, body);
  }

  deleteIpRule(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/ip-rules/delete`, { id });
  }

  upsertMaintenance(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/maintenance/upsert`, body);
  }

  upsertCluster(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/clusters/upsert`, body);
  }

  upsertDestination(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/destinations/upsert`, body);
  }

  deleteDestination(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/destinations/delete`, { id });
  }

  upsertService(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/services/upsert`, body);
  }

  deleteService(id: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/gateway/services/delete`, { id });
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

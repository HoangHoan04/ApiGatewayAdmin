import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EndpointService } from './endpoint.service';

export interface PagedResult<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface DashboardStats {
  totalEventsToday: number;
  totalEventsThisMonth: number;
  successRateToday: number;
  pendingRetryCount: number;
  activeAdaptersCount: number;
  activeMappingsCount: number;
  eventsByStatus: { name: string; value: number; code?: string }[];
  eventsByProvider: { name: string; value: number; code?: string }[];
  eventsBySourceSystem: { name: string; value: number; code?: string }[];
  dailyTrend: { date: string; successCount: number; failedCount: number; totalCount: number }[];
}

export interface IntegrationMapping {
  id: string;
  name: string;
  sourceSystem: string;
  eventType: string;
  providerCode: string;
  isActive: boolean;
  description?: string;
  configJson?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface IntegrationCredential {
  id: string;
  name: string;
  providerCode: string;
  companyId?: string;
  companyName?: string;
  environment?: string;
  isActive: boolean;
  publicConfigJson?: string;
  createdAt: string;
  updatedAt?: string;
  maskedFields: Record<string, string>;
}

export interface SyncLog {
  id: string;
  sourceSystem: string;
  providerCode: string;
  eventType: string;
  mappingId?: string;
  mappingName?: string;
  companyId?: string;
  idempotencyKey?: string;
  payloadJson?: string;
  responseJson?: string;
  sourceRefId?: string;
  status: string;   // 'Pending' | 'InProgress' | 'Success' | 'Failed' | 'Retrying' | 'Dead'
  retryCount: number;
  maxRetries: number;
  nextRetryAt?: string;
  errorMessage?: string;
  executionDurationMs?: number;
  createdAt: string;
  completedAt?: string;
}

export interface WebhookLog {
  id: string;
  providerCode: string;
  httpMethod: string;
  path?: string;
  headersJson?: string;
  queryParamsJson?: string;
  bodyPayload?: string;
  responseStatusCode?: number;
  isSignatureValid: boolean;
  isProcessed: boolean;
  clientIp?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface AdapterInfo {
  providerCode: string;
  displayName: string;
  description: string;
  category: string;
  icon?: string;
  supportedEventTypes: string[];
  supportsInboundWebhook: boolean;
  requiredCredentialFields: {
    key: string;
    label: string;
    type: string;
    placeholder?: string;
    isRequired: boolean;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class IntegrationHubService {
  constructor(
    private http: HttpClient,
    private endpoints: EndpointService
  ) {}

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.post<DashboardStats>(this.endpoints.DASHBOARD.STATS, {});
  }

  // ─── Mappings ────────────────────────────────────────────────────────────────
  getMappings(query: any = {}): Observable<PagedResult<IntegrationMapping>> {
    return this.http.post<PagedResult<IntegrationMapping>>(this.endpoints.MAPPINGS.PAGINATION, query);
  }

  getMappingById(id: string): Observable<IntegrationMapping> {
    return this.http.post<IntegrationMapping>(this.endpoints.MAPPINGS.DETAIL, { id });
  }

  createMapping(data: any): Observable<IntegrationMapping> {
    return this.http.post<IntegrationMapping>(this.endpoints.MAPPINGS.CREATE, data);
  }

  updateMapping(data: any): Observable<IntegrationMapping> {
    return this.http.post<IntegrationMapping>(this.endpoints.MAPPINGS.UPDATE, data);
  }

  deleteMapping(id: string): Observable<any> {
    return this.http.post<any>(this.endpoints.MAPPINGS.DELETE, { id });
  }

  toggleMappingActive(id: string): Observable<{ isActive: boolean }> {
    return this.http.post<{ isActive: boolean }>(this.endpoints.MAPPINGS.TOGGLE_ACTIVE, { id });
  }

  // ─── Credentials ─────────────────────────────────────────────────────────────
  getCredentials(query: any = {}): Observable<PagedResult<IntegrationCredential>> {
    return this.http.post<PagedResult<IntegrationCredential>>(this.endpoints.CREDENTIALS.PAGINATION, query);
  }

  getCredentialById(id: string): Observable<IntegrationCredential> {
    return this.http.post<IntegrationCredential>(this.endpoints.CREDENTIALS.DETAIL, { id });
  }

  upsertCredential(data: any): Observable<IntegrationCredential> {
    return this.http.post<IntegrationCredential>(this.endpoints.CREDENTIALS.UPSERT, data);
  }

  createCredential(data: any): Observable<IntegrationCredential> {
    return this.http.post<IntegrationCredential>(this.endpoints.CREDENTIALS.CREATE, data);
  }

  updateCredential(data: any): Observable<IntegrationCredential> {
    return this.http.post<IntegrationCredential>(this.endpoints.CREDENTIALS.UPDATE, data);
  }

  deleteCredential(id: string): Observable<any> {
    return this.http.post<any>(this.endpoints.CREDENTIALS.DELETE, { id });
  }

  // ─── Sync Logs ───────────────────────────────────────────────────────────────
  getSyncLogs(query: any = {}): Observable<PagedResult<SyncLog>> {
    return this.http.post<PagedResult<SyncLog>>(this.endpoints.SYNC_LOGS.PAGINATION, query);
  }

  getSyncLogById(id: string): Observable<SyncLog> {
    return this.http.post<SyncLog>(this.endpoints.SYNC_LOGS.DETAIL, { id });
  }

  retrySync(logId: string): Observable<any> {
    return this.http.post<any>(this.endpoints.SYNC_LOGS.RETRY, { logId });
  }

  // ─── Webhook Logs ────────────────────────────────────────────────────────────
  getWebhookLogs(query: any = {}): Observable<PagedResult<WebhookLog>> {
    return this.http.post<PagedResult<WebhookLog>>(this.endpoints.WEBHOOK_LOGS.PAGINATION, query);
  }

  getWebhookLogById(id: string): Observable<WebhookLog> {
    return this.http.post<WebhookLog>(this.endpoints.WEBHOOK_LOGS.DETAIL, { id });
  }

  // ─── Adapters ────────────────────────────────────────────────────────────────
  getAdapters(): Observable<AdapterInfo[]> {
    return this.http.post<AdapterInfo[]>(this.endpoints.ADAPTERS.LIST, {});
  }

  testAdapter(data: any): Observable<any> {
    return this.http.post<any>(this.endpoints.ADAPTERS.TEST, data);
  }

  // ─── Outbound Event Publish ──────────────────────────────────────────────────
  publishEvent(data: any): Observable<any> {
    return this.http.post<any>(this.endpoints.SYNC.PUBLISH, data);
  }
}

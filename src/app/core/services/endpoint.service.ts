import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  private readonly baseUrl = environment.apiUrl;
  private readonly authBaseUrl = environment.authApiUrl;

  AUTH = {
    LOGIN: `${this.authBaseUrl}/admin/auth/login`,
    REFRESH: `${this.authBaseUrl}/admin/auth/refresh`,
    CHANGE_PASSWORD: `${this.authBaseUrl}/admin/auth/change-password`,
    FORGOT_PASSWORD: `${this.authBaseUrl}/admin/auth/forgot-password`,
    RESET_PASSWORD: `${this.authBaseUrl}/admin/auth/reset-password`,
    RESET_PASSWORD_WITH_OTP: `${this.authBaseUrl}/admin/auth/reset-password`,
    ME: `${this.authBaseUrl}/admin/auth/me`,
    PROFILE: `${this.authBaseUrl}/admin/auth/profile`,
    TWO_FA_SETUP: `${this.authBaseUrl}/admin/auth/2fa/setup`,
    TWO_FA_ENABLE: `${this.authBaseUrl}/admin/auth/2fa/enable`,
    TWO_FA_DISABLE: `${this.authBaseUrl}/admin/auth/2fa/disable`,
    TWO_FA_VERIFY: `${this.authBaseUrl}/admin/auth/2fa/verify`,
    SSO_STATUS: `${this.authBaseUrl}/admin/auth/sso/status`,
    SESSIONS_LIST: `${this.authBaseUrl}/admin/auth/sessions/list`,
    SESSIONS_REVOKE: `${this.authBaseUrl}/admin/auth/sessions/revoke`,
  };

  USER = {
    LIST: `${this.authBaseUrl}/admin/users`,
    DETAIL: (id: string) => `${this.authBaseUrl}/admin/users/${id}`,
    CREATE: `${this.authBaseUrl}/admin/users`,
    UPDATE: (id: string) => `${this.authBaseUrl}/admin/users/${id}`,
    DELETE: (id: string) => `${this.authBaseUrl}/admin/users/${id}`,
  };

  ECOSYSTEM_APP = {
    LIST: `${this.authBaseUrl}/admin/apps`,
    DETAIL: (id: string) => `${this.authBaseUrl}/admin/apps/${id}`,
    BY_CLIENT: (clientId: string) => `${this.authBaseUrl}/apps/public/by-client/${clientId}`,
    CREATE: `${this.authBaseUrl}/admin/apps`,
    UPDATE: (id: string) => `${this.authBaseUrl}/admin/apps/${id}`,
    DELETE: (id: string) => `${this.authBaseUrl}/admin/apps/${id}`,
  };

  COMPANY = {
    LIST: `${this.authBaseUrl}/admin/companies`,
    DETAIL: (id: string) => `${this.authBaseUrl}/admin/companies/${id}`,
  };

  ADMINISTRATIVE = {
    PROVINCES: `${this.authBaseUrl}/administrative/provinces`,
    WARDS: `${this.authBaseUrl}/administrative/wards`,
    TREE: `${this.authBaseUrl}/administrative/tree`,
    SEARCH: `${this.authBaseUrl}/administrative/search`,
  };

  LOGS = {
    LIST: `${this.authBaseUrl}/admin/logs`,
  };

  ACTION_LOG = {
    BASE: `${this.authBaseUrl}/admin/logs`,
  };

  NOTIFICATION = {
    PAGINATION: `${this.authBaseUrl}/notification/pagination`,
    UNREAD_COUNT: `${this.authBaseUrl}/notification/unread-count`,
    MARK_READ: `${this.authBaseUrl}/notification/mark-read`,
    MARK_ALL_READ: `${this.authBaseUrl}/notification/mark-all-read`,
    DELETE: `${this.authBaseUrl}/notification/delete`,
    BROADCAST: `${this.authBaseUrl}/notification/broadcast`,
    SETTINGS: `${this.authBaseUrl}/notification/settings`,
  };

  UPLOAD_FILE = {
    UPLOAD_SINGLE: `${this.authBaseUrl}/upload/single-s3`,
    UPLOAD_MULTI: `${this.authBaseUrl}/upload/multi-s3`,
    UPLOAD_IMAGE: `${this.authBaseUrl}/upload/image`,
    UPLOAD_AUDIO: `${this.authBaseUrl}/upload/audio`,
    UPLOAD_DOCUMENT: `${this.authBaseUrl}/upload/document`,
    UPLOAD_CATBOX: `${this.authBaseUrl}/upload/catbox`,
    UPLOAD_CATBOX_URL: `${this.authBaseUrl}/upload/catbox-url`,
    UPLOAD_S3: `${this.authBaseUrl}/upload/s3`,
    UPLOAD_SINGLE_S3: `${this.authBaseUrl}/upload/single-s3`,
    UPLOAD_MULTI_S3: `${this.authBaseUrl}/upload/multi-s3`,
  };

  SECURITY = {
    JWKS: `${this.authBaseUrl}/jwks`,
    WELL_KNOWN_JWKS: `${this.authBaseUrl.replace('/api', '')}/.well-known/jwks.json`,
  };

  MAPPINGS = {
    PAGINATION: `${this.baseUrl}/mappings/pagination`,
    DETAIL: `${this.baseUrl}/mappings/detail`,
    CREATE: `${this.baseUrl}/mappings/create`,
    UPDATE: `${this.baseUrl}/mappings/update`,
    DELETE: `${this.baseUrl}/mappings/delete`,
    TOGGLE_ACTIVE: `${this.baseUrl}/mappings/toggle-active`,
  };

  CREDENTIALS = {
    PAGINATION: `${this.baseUrl}/credentials/pagination`,
    DETAIL: `${this.baseUrl}/credentials/detail`,
    CREATE: `${this.baseUrl}/credentials/create`,
    UPDATE: `${this.baseUrl}/credentials/update`,
    UPSERT: `${this.baseUrl}/credentials/upsert`,
    DELETE: `${this.baseUrl}/credentials/delete`,
  };

  SYNC_LOGS = {
    PAGINATION: `${this.baseUrl}/logs/sync/pagination`,
    DETAIL: `${this.baseUrl}/logs/sync/detail`,
    RETRY: `${this.baseUrl}/logs/sync/retry`,
  };

  WEBHOOK_LOGS = {
    PAGINATION: `${this.baseUrl}/logs/webhooks/pagination`,
    DETAIL: `${this.baseUrl}/logs/webhooks/detail`,
  };

  ADAPTERS = {
    LIST: `${this.baseUrl}/adapters/list`,
    TEST: `${this.baseUrl}/adapters/test`,
  };

  DASHBOARD = {
    STATS: `${this.baseUrl}/dashboard/stats`,
  };

  SYNC = {
    PUBLISH: `${this.baseUrl}/sync/publish`,
  };
}

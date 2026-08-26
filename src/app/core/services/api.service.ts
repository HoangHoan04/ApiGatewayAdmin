import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    private readonly endpoints: EndpointService,
  ) {}

  get AUTH() {
    return this.endpoints.AUTH;
  }
  get USER() {
    return this.endpoints.USER;
  }
  get ECOSYSTEM_APP() {
    return this.endpoints.ECOSYSTEM_APP;
  }
  get COMPANY() {
    return this.endpoints.COMPANY;
  }
  get ADMINISTRATIVE() {
    return this.endpoints.ADMINISTRATIVE;
  }
  get LOGS() {
    return this.endpoints.LOGS;
  }
  get ACTION_LOG() {
    return this.endpoints.ACTION_LOG;
  }
  get NOTIFICATION() {
    return this.endpoints.NOTIFICATION;
  }
  get UPLOAD_FILE() {
    return this.endpoints.UPLOAD_FILE;
  }
  get SECURITY() {
    return this.endpoints.SECURITY;
  }
  get MAPPINGS() {
    return this.endpoints.MAPPINGS;
  }
  get CREDENTIALS() {
    return this.endpoints.CREDENTIALS;
  }
  get SYNC_LOGS() {
    return this.endpoints.SYNC_LOGS;
  }
  get WEBHOOK_LOGS() {
    return this.endpoints.WEBHOOK_LOGS;
  }
  get ADAPTERS() {
    return this.endpoints.ADAPTERS;
  }
  get DASHBOARD() {
    return this.endpoints.DASHBOARD;
  }
  get SYNC() {
    return this.endpoints.SYNC;
  }

  get<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, body: any, params?: Record<string, any>): Observable<T> {
    return this.http.post<T>(url, body, { params });
  }

  put<T>(url: string, body: any, params?: Record<string, any>): Observable<T> {
    return this.http.put<T>(url, body, { params });
  }

  delete<T>(url: string, params?: Record<string, any>): Observable<T> {
    return this.http.delete<T>(url, { params });
  }

  postBlob(url: string, body: any = {}): Observable<HttpResponse<Blob>> {
    return this.http.post(url, body, {
      observe: 'response',
      responseType: 'blob',
    });
  }

  getBlob(url: string, params?: Record<string, any>): Observable<HttpResponse<Blob>> {
    return this.http.get(url, {
      params,
      observe: 'response',
      responseType: 'blob',
    });
  }

  uploadFile<T>(url: string, fileOrFormData: File | FormData): Observable<T> {
    if (fileOrFormData instanceof FormData) {
      return this.http.post<T>(url, fileOrFormData);
    }
    const formData = new FormData();
    formData.append('file', fileOrFormData);
    return this.http.post<T>(url, formData);
  }

  uploadFiles<T>(url: string, files: File[]): Observable<T> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return this.http.post<T>(url, formData);
  }

  uploadFileWithFields<T>(
    url: string,
    file: File,
    fields: Record<string, string> = {},
  ): Observable<T> {
    const formData = new FormData();
    formData.append('file', file);
    if (fields) {
      Object.keys(fields).forEach((key) => formData.append(key, fields[key]));
    }
    return this.http.post<T>(url, formData);
  }

  download(url: string, body?: any): Observable<HttpResponse<Blob>> {
    return this.http.post(url, body, {
      observe: 'response',
      responseType: 'blob',
    });
  }
}

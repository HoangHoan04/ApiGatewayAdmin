import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private readonly KEY_ROLES = 'auth_roles';
  private readonly KEY_PERMISSIONS = 'auth_permissions';
  private readonly KEY_USER_TYPE = 'auth_user_type';

  private readonly permissionsSubject = new BehaviorSubject<string[]>([]);
  private readonly rolesSubject = new BehaviorSubject<string[]>([]);
  private readonly userTypeSubject = new BehaviorSubject<string | null>(null);

  readonly permissions$: Observable<string[]> = this.permissionsSubject.asObservable();
  readonly roles$: Observable<string[]> = this.rolesSubject.asObservable();
  readonly userType$: Observable<string | null> = this.userTypeSubject.asObservable();

  constructor() {
    this.hydrateFromStorage();
  }

  get permissions(): string[] {
    return this.permissionsSubject.value;
  }

  get roles(): string[] {
    return this.rolesSubject.value;
  }

  get userType(): string | null {
    return this.userTypeSubject.value;
  }

  hydrateFromStorage(): void {
    this.permissionsSubject.next(this.readJsonArray(this.KEY_PERMISSIONS));
    this.rolesSubject.next(this.readJsonArray(this.KEY_ROLES));
    this.userTypeSubject.next(sessionStorage.getItem(this.KEY_USER_TYPE));
  }

  setAuthContext(options: {
    roles?: string[] | null;
    permissions?: string[] | null;
    type?: string | null;
  }): void {
    const roles = options.roles ?? [];
    const permissions = options.permissions ?? [];
    const type = options.type ?? null;

    sessionStorage.setItem(this.KEY_ROLES, JSON.stringify(roles));
    sessionStorage.setItem(this.KEY_PERMISSIONS, JSON.stringify(permissions));
    if (type) {
      sessionStorage.setItem(this.KEY_USER_TYPE, type);
    } else {
      sessionStorage.removeItem(this.KEY_USER_TYPE);
    }

    this.rolesSubject.next(roles);
    this.permissionsSubject.next(permissions);
    this.userTypeSubject.next(type);
  }

  clear(): void {
    sessionStorage.removeItem(this.KEY_ROLES);
    sessionStorage.removeItem(this.KEY_PERMISSIONS);
    sessionStorage.removeItem(this.KEY_USER_TYPE);
    this.rolesSubject.next([]);
    this.permissionsSubject.next([]);
    this.userTypeSubject.next(null);
  }

  has(code: string): boolean {
    if (!code) return true;
    if (this.isAdmin()) return true;
    return this.permissions.includes(code);
  }

  hasAny(...codes: string[]): boolean {
    if (!codes.length) return true;
    if (this.isAdmin()) return true;
    return codes.some((code) => this.permissions.includes(code));
  }

  can(code: string): boolean {
    return this.has(code);
  }

  isAdmin(): boolean {
    const type = (this.userType || '').toUpperCase();
    if (type === 'ADMIN') return true;
    return this.roles.some((r) => (r || '').toUpperCase() === 'ADMIN');
  }

  private readJsonArray(key: string): string[] {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
      return [];
    }
  }
}

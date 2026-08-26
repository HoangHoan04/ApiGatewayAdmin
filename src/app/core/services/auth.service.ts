import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY_USER = 'auth_user';
  private readonly KEY_EMAIL = 'auth_email';
  private readonly KEY_TOKEN = 'auth_token';
  private readonly KEY_REFRESH_TOKEN = 'auth_refresh_token';
  private readonly KEY_TEMP_2FA = 'auth_2fa_temp';

  constructor(
    private readonly apiService: ApiService,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
  ) {}

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.KEY_TOKEN);
  }

  get currentUser(): string | null {
    return sessionStorage.getItem(this.KEY_USER);
  }

  get currentEmail(): string | null {
    return sessionStorage.getItem(this.KEY_EMAIL);
  }

  get token(): string | null {
    return sessionStorage.getItem(this.KEY_TOKEN);
  }

  get refreshToken(): string | null {
    return sessionStorage.getItem(this.KEY_REFRESH_TOKEN);
  }

  get twoFactorTempToken(): string | null {
    return sessionStorage.getItem(this.KEY_TEMP_2FA);
  }

  login(username: string, password: string): Observable<any> {
    return this.apiService
      .post<any>(this.apiService.AUTH.LOGIN, { username, password })
      .pipe(tap((res) => this.applyLoginResponse(res)));
  }

  verifyTwoFactor(tempToken: string, code: string): Observable<any> {
    return this.apiService
      .post<any>(this.apiService.AUTH.TWO_FA_VERIFY, { tempToken, code })
      .pipe(tap((res) => this.applyLoginResponse(res)));
  }

  setupTwoFactor(): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.TWO_FA_SETUP, {});
  }

  enableTwoFactor(code: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.TWO_FA_ENABLE, { code });
  }

  disableTwoFactor(code: string, password?: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.TWO_FA_DISABLE, { code, password });
  }

  getSsoStatus(): Observable<any> {
    return this.apiService.get<any>(this.apiService.AUTH.SSO_STATUS);
  }

  listSessions(body: { includeRevoked?: boolean; allUsers?: boolean } = {}): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.SESSIONS_LIST, body);
  }

  revokeSession(id: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.SESSIONS_REVOKE, { id });
  }

  logout(): void {
    sessionStorage.removeItem(this.KEY_TOKEN);
    sessionStorage.removeItem(this.KEY_REFRESH_TOKEN);
    sessionStorage.removeItem(this.KEY_USER);
    sessionStorage.removeItem(this.KEY_EMAIL);
    sessionStorage.removeItem(this.KEY_TEMP_2FA);
    localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_REFRESH_TOKEN);
    this.permissionService.clear();
    this.router.navigate(['/auth/login']);
  }

  refreshTokens(refreshToken: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.REFRESH, { refreshToken }).pipe(
      tap((res) => {
        if (res && res.token) {
          sessionStorage.setItem(this.KEY_TOKEN, res.token);
          sessionStorage.setItem(this.KEY_REFRESH_TOKEN, res.refreshToken);
          if (res.username) sessionStorage.setItem(this.KEY_USER, res.username);
          if (res.email) sessionStorage.setItem(this.KEY_EMAIL, res.email);
          if (Array.isArray(res.roles) || Array.isArray(res.permissions) || res.type) {
            this.permissionService.setAuthContext({
              roles: Array.isArray(res.roles) ? res.roles : this.permissionService.roles,
              permissions: Array.isArray(res.permissions)
                ? res.permissions
                : this.permissionService.permissions,
              type: res.type ?? this.permissionService.userType,
            });
          }
        }
      }),
    );
  }

  changePassword(body: any): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.CHANGE_PASSWORD, body);
  }

  forgotPassword(email: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.FORGOT_PASSWORD, { email });
  }

  resetPasswordWithOtp(body: any): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.RESET_PASSWORD_WITH_OTP, body);
  }

  getInfoUser(): Observable<any> {
    return this.apiService.get<any>(this.apiService.AUTH.ME).pipe(
      tap((user) => {
        if (!user) return;
        if (user.username) sessionStorage.setItem(this.KEY_USER, user.username);
        if (user.email) sessionStorage.setItem(this.KEY_EMAIL, user.email);
        if (Array.isArray(user.roles) || Array.isArray(user.permissions) || user.type) {
          this.permissionService.setAuthContext({
            roles: Array.isArray(user.roles) ? user.roles : this.permissionService.roles,
            permissions: Array.isArray(user.permissions)
              ? user.permissions
              : this.permissionService.permissions,
            type: user.type ?? this.permissionService.userType,
          });
        }
      }),
    );
  }

  private applyLoginResponse(res: any): void {
    if (!res) return;
    if (res.requiresTwoFactor && res.tempToken) {
      sessionStorage.setItem(this.KEY_TEMP_2FA, res.tempToken);
      if (res.username) sessionStorage.setItem(this.KEY_USER, res.username);
      return;
    }
    if (res.token) {
      sessionStorage.removeItem(this.KEY_TEMP_2FA);
      sessionStorage.setItem(this.KEY_TOKEN, res.token);
      sessionStorage.setItem(this.KEY_REFRESH_TOKEN, res.refreshToken);
      sessionStorage.setItem(this.KEY_USER, res.username);
      if (res.email) sessionStorage.setItem(this.KEY_EMAIL, res.email);
      this.permissionService.setAuthContext({
        roles: Array.isArray(res.roles) ? res.roles : [],
        permissions: Array.isArray(res.permissions) ? res.permissions : [],
        type: res.type ?? null,
      });
    }
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';
import { PermissionService } from './permission.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly KEY_USER = 'auth_user';
  private readonly KEY_EMAIL = 'auth_email';
  private readonly KEY_TOKEN = 'auth_token';
  private readonly KEY_REFRESH_TOKEN = 'auth_refresh_token';
  private readonly KEY_TEMP_2FA = 'auth_2fa_temp';
  private readonly KEY_PKCE_VERIFIER = 'pkce_verifier';
  private readonly KEY_PKCE_STATE = 'pkce_state';

  constructor(
    private readonly apiService: ApiService,
    private readonly permissionService: PermissionService,
    private readonly router: Router,
    private readonly http: HttpClient,
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
    sessionStorage.removeItem(this.KEY_PKCE_VERIFIER);
    sessionStorage.removeItem(this.KEY_PKCE_STATE);
    localStorage.removeItem(this.KEY_TOKEN);
    localStorage.removeItem(this.KEY_REFRESH_TOKEN);
    this.permissionService.clear();
    this.router.navigate(['/auth/login']);
  }

  async beginPkceLogin(ssoLoginUrl: string, clientId: string, redirectUri: string): Promise<string> {
    const verifier = this.randomUrlSafe(32);
    const state = this.randomUrlSafe(16);
    const challenge = await this.sha256Base64Url(verifier);
    sessionStorage.setItem(this.KEY_PKCE_VERIFIER, verifier);
    sessionStorage.setItem(this.KEY_PKCE_STATE, state);
    const targetUrl = new URL(ssoLoginUrl);
    targetUrl.searchParams.set('clientId', clientId);
    targetUrl.searchParams.set('client_id', clientId);
    targetUrl.searchParams.set('returnUrl', redirectUri);
    targetUrl.searchParams.set('redirectUri', redirectUri);
    targetUrl.searchParams.set('redirect_uri', redirectUri);
    targetUrl.searchParams.set('state', state);
    targetUrl.searchParams.set('code_challenge', challenge);
    targetUrl.searchParams.set('code_challenge_method', 'S256');
    targetUrl.searchParams.set('scope', 'openid profile email');
    return targetUrl.toString();
  }

  exchangeAuthorizationCode(code: string, state: string, redirectUri: string, clientId: string): Observable<any> {
    const expected = sessionStorage.getItem(this.KEY_PKCE_STATE);
    const verifier = sessionStorage.getItem(this.KEY_PKCE_VERIFIER);
    if (!verifier || !expected || expected !== state) {
      throw new Error('PKCE state không khớp. Vui lòng đăng nhập lại.');
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      code_verifier: verifier,
    });
    const tokenUrl = `${environment.apiUrl}/oauth/token`;
    return this.http
      .post<any>(tokenUrl, body.toString(), {
        headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      })
      .pipe(
        tap((res) => {
          sessionStorage.removeItem(this.KEY_PKCE_VERIFIER);
          sessionStorage.removeItem(this.KEY_PKCE_STATE);
          this.applyOauthToken(res);
        }),
        switchMap(() => this.getInfoUser()),
      );
  }

  refreshTokens(refreshToken: string): Observable<any> {
    return this.apiService.post<any>(this.apiService.AUTH.REFRESH, { refreshToken }).pipe(
      tap((res) => this.applyLoginResponse(res)),
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
        if (user.fullName) sessionStorage.setItem(this.KEY_USER, user.fullName);
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

  applyOauthToken(res: any): void {
    const access = res?.access_token || res?.accessToken || res?.token;
    const refresh = res?.refresh_token || res?.refreshToken;
    if (access) {
      sessionStorage.setItem(this.KEY_TOKEN, access);
    }
    if (refresh) {
      sessionStorage.setItem(this.KEY_REFRESH_TOKEN, refresh);
    }
  }

  private applyLoginResponse(res: any): void {
    if (!res) return;
    if (res.requiresTwoFactor && res.tempToken) {
      sessionStorage.setItem(this.KEY_TEMP_2FA, res.tempToken);
      if (res.username) sessionStorage.setItem(this.KEY_USER, res.username);
      return;
    }
    const token = res.token || res.accessToken || res.access_token;
    if (token) {
      sessionStorage.removeItem(this.KEY_TEMP_2FA);
      sessionStorage.setItem(this.KEY_TOKEN, token);
      const refresh = res.refreshToken || res.refresh_token;
      if (refresh) sessionStorage.setItem(this.KEY_REFRESH_TOKEN, refresh);
      if (res.username) sessionStorage.setItem(this.KEY_USER, res.username);
      if (res.email) sessionStorage.setItem(this.KEY_EMAIL, res.email);
      this.permissionService.setAuthContext({
        roles: Array.isArray(res.roles) ? res.roles : [],
        permissions: Array.isArray(res.permissions) ? res.permissions : [],
        type: res.type ?? null,
      });
    }
  }

  private randomUrlSafe(bytes: number): string {
    const raw = new Uint8Array(bytes);
    crypto.getRandomValues(raw);
    return this.base64Url(raw);
  }

  private async sha256Base64Url(value: string): Promise<string> {
    const data = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return this.base64Url(new Uint8Array(hash));
  }

  private base64Url(bytes: Uint8Array): string {
    let str = '';
    bytes.forEach((b) => (str += String.fromCharCode(b)));
    return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }
}

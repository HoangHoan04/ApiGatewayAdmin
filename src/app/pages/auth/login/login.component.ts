import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  ssoLoginUrl = environment.ssoLoginUrl || 'http://localhost:4300/auth/sso';
  clientId = environment.clientId || 'api-gateway';
  redirectUri = `${window.location.origin}/auth/callback`;
  redirecting = false;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigateByUrl('/');
      return;
    }
    const q = this.route.snapshot.queryParams;
    if (q['auto_sso'] === 'true' || q['sso'] === 'true') {
      this.redirectToSso();
    }
  }

  async redirectToSso(): Promise<void> {
    this.redirecting = true;
    this.error = '';
    try {
      const url = await this.auth.beginPkceLogin(this.ssoLoginUrl, this.clientId, this.redirectUri);
      window.location.href = url;
    } catch {
      this.redirecting = false;
      this.error = 'Không khởi tạo được PKCE. Thử lại.';
    }
  }
}

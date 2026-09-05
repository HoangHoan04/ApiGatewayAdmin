import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-sso-callback',
  templateUrl: './sso-callback.component.html',
  styleUrls: ['./sso-callback.component.scss'],
})
export class SsoCallbackComponent implements OnInit {
  loading = true;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const params = this.route.snapshot.queryParams;
    const error = params['error'] || params['message'];
    if (error) {
      this.loading = false;
      this.errorMessage = error;
      this.cdr.detectChanges();
      return;
    }

    const code = params['code'];
    const state = params['state'] || '';
    if (!code) {
      if (this.authService.isLoggedIn) {
        this.router.navigateByUrl('/');
        return;
      }
      this.loading = false;
      this.errorMessage = 'Thiếu authorization code từ Auth. Không nhận token trên URL. Bạn vừa mở trực tiếp trang callback thay vì đăng nhập qua cổng Auth.';
      this.cdr.detectChanges();
      return;
    }

    try {
      this.authService
        .exchangeAuthorizationCode(
          code,
          state,
          `${window.location.origin}/auth/callback`,
          environment.clientId || 'api-gateway',
        )
        .subscribe({
          next: (user) => {
            this.loading = false;
            this.message.success(`Đăng nhập thành công! Chào mừng ${user?.fullName || user?.email || 'bạn'}.`);
            this.router.navigateByUrl('/');
          },
          error: (err) => {
            this.loading = false;
            this.errorMessage = err?.error?.message || err?.message || 'Đổi code lấy token thất bại.';
            this.cdr.detectChanges();
          },
        });
    } catch (err: any) {
      this.loading = false;
      this.errorMessage = err?.message || 'PKCE không hợp lệ.';
      this.cdr.detectChanges();
    }
  }

  retryLogin(): void {
    this.router.navigate(['/auth/login'], { queryParams: { auto_sso: 'true' } });
  }
}

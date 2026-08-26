import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
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
    setTimeout(() => {
      this.processSsoToken();
    }, 0);
  }

  private processSsoToken(): void {
    const params = this.route.snapshot.queryParams;
    const token = params['sso_token'] || params['token'] || params['accessToken'] || params['access_token'];
    const refreshToken = params['refresh_token'] || params['refreshToken'];
    const error = params['error'] || params['message'];

    if (error) {
      this.loading = false;
      this.errorMessage = error || 'Xác thực qua Cổng SSO thất bại hoặc đã bị hủy.';
      this.cdr.detectChanges();
      return;
    }

    if (token) {
      sessionStorage.setItem('auth_token', token);
      if (refreshToken) {
        sessionStorage.setItem('auth_refresh_token', refreshToken);
      }

      this.authService.getInfoUser().subscribe({
        next: (user) => {
          this.loading = false;
          this.cdr.detectChanges();
          this.message.success(`Đăng nhập thành công! Chào mừng ${user?.fullName || user?.email || 'bạn'}.`);
          this.router.navigateByUrl('/');
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
          this.message.success('Đăng nhập SSO thành công!');
          this.router.navigateByUrl('/');
        },
      });
    } else {
      this.loading = false;
      this.errorMessage = 'Không tìm thấy Token phản hồi từ Cổng Xác thực Tập trung. Vui lòng đăng nhập lại.';
      this.cdr.detectChanges();
    }
  }

  retryLogin(): void {
    this.router.navigateByUrl('/auth/login');
  }
}

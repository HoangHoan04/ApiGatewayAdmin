import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: false,
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  loading = false;
  error = '';

  constructor(
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly message: NzMessageService,
  ) {}

  onSubmit(): void {
    this.error = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.error = 'Vui lòng điền đầy đủ các trường';
      return;
    }

    if (this.newPassword.length < 6) {
      this.error = 'Mật khẩu mới phải có ít nhất 6 ký tự';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.error = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.loading = true;
    this.authService
      .changePassword({
        oldPassword: this.oldPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.message.success('Cập nhật mật khẩu thành công');
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.loading = false;
          this.error =
            typeof err.error === 'string'
              ? err.error
              : err.error?.message || 'Failed to change password';
        },
      });
  }

  goBack(): void {
    this.router.navigateByUrl('/');
  }
}

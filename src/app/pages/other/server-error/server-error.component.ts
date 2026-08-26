import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-server-error',
  template: `
    <div class="se-container">
      <div class="se-code">500</div>
      <h1 class="se-title">Lỗi máy chủ nội bộ</h1>
      <p class="se-desc">Đã có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau giây lát.</p>
      <div class="se-actions">
        <button nz-button nzType="primary" (click)="retry()">
          Thử lại
        </button>
        <button nz-button nzType="default" (click)="router.navigateByUrl('/')">
          Về trang chủ
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .se-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--background, #f3f4f6);
        padding: 24px;
        text-align: center;
      }
      .se-code {
        font-size: 120px;
        font-weight: 900;
        line-height: 1;
        color: #ef4444;
        opacity: 0.3;
      }
      .se-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--foreground, #1f2937);
        margin: 16px 0 8px;
      }
      .se-desc {
        font-size: 14px;
        color: var(--muted-foreground, #6b7280);
        max-width: 400px;
        margin-bottom: 24px;
      }
      .se-actions {
        display: flex;
        gap: 12px;
      }
      html.dark .se-container {
        background: var(--background, #0f172a);
      }
    `,
  ],
})
export class ServerErrorComponent {
  constructor(public router: Router) {}

  retry(): void {
    window.location.reload();
  }
}

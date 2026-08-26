import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-not-found',
  template: `
    <div class="nf-container">
      <div class="nf-code">404</div>
      <h1 class="nf-title">Không tìm thấy trang</h1>
      <p class="nf-desc">Đường dẫn bạn yêu cầu không tồn tại hoặc đã được di chuyển.</p>
      <div class="nf-actions">
        <button nz-button nzType="default" (click)="router.navigateByUrl('/')">
          Về trang chủ
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .nf-container {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: var(--background, #f3f4f6);
        padding: 24px;
        text-align: center;
      }
      .nf-code {
        font-size: 120px;
        font-weight: 900;
        line-height: 1;
        color: var(--primary, #3b82f6);
        opacity: 0.3;
      }
      .nf-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--foreground, #1f2937);
        margin: 16px 0 8px;
      }
      .nf-desc {
        font-size: 14px;
        color: var(--muted-foreground, #6b7280);
        max-width: 400px;
        margin-bottom: 24px;
      }
      html.dark .nf-container {
        background: var(--background, #0f172a);
      }
    `,
  ],
})
export class NotFoundComponent {
  constructor(public router: Router) {}
}

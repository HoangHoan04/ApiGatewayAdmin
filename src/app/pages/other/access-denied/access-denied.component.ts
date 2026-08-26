import {
  convertRoutesToMenuItems,
  filterMenuByPermission,
  RouteConfig,
  ROUTES_CONFIG,
  SidebarMenuItem,
} from '@/app/core/constants/common';
import { PermissionService } from '@/app/core/services/permission.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-access-denied',
  template: `
    <div class="ad-container">
      <div class="ad-code">403</div>
      <h1 class="ad-title">Không có quyền truy cập</h1>
      <p class="ad-desc">Bạn không có quyền truy cập vào phân hệ hoặc tài nguyên này.</p>
      @if (fromPath) {
        <p class="ad-path">{{ fromPath }}</p>
      }
      <div class="ad-actions">
        <button nz-button nzType="default" (click)="goBack()">
          Quay lại
        </button>
        <button nz-button nzType="primary" (click)="goHome()">
          Về trang chủ
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .ad-container {
        min-height: calc(100vh - 220px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 32px 24px;
        text-align: center;
      }
      .ad-code {
        font-size: 108px;
        font-weight: 900;
        line-height: 1;
        color: var(--warning, #d97706);
        opacity: 0.35;
      }
      .ad-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--foreground, #1f2937);
        margin: 16px 0 8px;
      }
      .ad-desc {
        font-size: 14px;
        color: var(--muted-foreground, #6b7280);
        max-width: 420px;
        margin: 0 0 12px;
      }
      .ad-path {
        font-size: 12px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        color: var(--muted-foreground, #6b7280);
        background: color-mix(in srgb, var(--muted, #f3f4f6) 80%, transparent);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 8px;
        padding: 6px 10px;
        margin: 0 0 24px;
        max-width: 100%;
        overflow-wrap: anywhere;
      }
      .ad-actions {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        justify-content: center;
      }
    `,
  ],
})
export class AccessDeniedComponent {
  fromPath = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly permissions: PermissionService,
  ) {
    this.fromPath = this.route.snapshot.queryParamMap.get('from') || '';
  }

  goHome(): void {
    this.router.navigateByUrl(this.firstAllowedPath());
  }

  goBack(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    this.goHome();
  }

  private firstAllowedPath(): string {
    const menu = filterMenuByPermission(
      convertRoutesToMenuItems(ROUTES_CONFIG as unknown as Record<string, RouteConfig>),
      (permission) => this.permissions.has(permission || ''),
    );
    return this.findFirstLeafPath(menu) || '/';
  }

  private findFirstLeafPath(items: SidebarMenuItem[]): string | null {
    for (const item of items) {
      if (item.children?.length) {
        const nested = this.findFirstLeafPath(item.children);
        if (nested) return nested;
        continue;
      }
      if (item.path) return item.path;
    }
    return null;
  }
}

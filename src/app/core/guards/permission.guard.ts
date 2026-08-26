import { getRouteByPath } from '@/app/core/constants/common';
import { PermissionService } from '@/app/core/services/permission.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

const SKIP_PREFIXES = ['/access-denied', '/auth', '/500', '/coming-soon'];

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate, CanActivateChild {
  constructor(
    private readonly permissions: PermissionService,
    private readonly router: Router,
  ) {}

  canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.check(state.url);
  }

  canActivateChild(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.check(state.url);
  }

  private check(rawUrl: string): boolean | UrlTree {
    const path = this.normalizePath(rawUrl);

    if (this.shouldSkip(path)) {
      return true;
    }

    const routeConfig = getRouteByPath(path || '/');
    if (!routeConfig?.permission) {
      return true;
    }

    if (this.permissions.has(routeConfig.permission)) {
      return true;
    }

    return this.router.createUrlTree(['/access-denied'], {
      queryParams: { from: path || '/' },
    });
  }

  private normalizePath(url: string): string {
    const withoutQuery = (url || '/').split('?')[0].split('#')[0];
    if (!withoutQuery || withoutQuery === '') return '/';
    return withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`;
  }

  private shouldSkip(path: string): boolean {
    return SKIP_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  }
}

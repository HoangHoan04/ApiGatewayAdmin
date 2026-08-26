import { getFirstNavigableRoute, getRouteByPath } from '@/app/core/constants/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';

interface BreadcrumbItem {
  label: string;
  url: string;
  isLast: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: false,
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: BreadcrumbItem[] = [];
  private sub = new Subscription();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.buildBreadcrumbs(this.router.url);

    this.sub.add(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          this.buildBreadcrumbs((event as NavigationEnd).urlAfterRedirects);
        }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private buildBreadcrumbs(url: string): void {
    const list: BreadcrumbItem[] = [];

    const homeRoute = getRouteByPath('/');
    list.push({
      label: homeRoute?.label || 'Trang chủ',
      url: '/',
      isLast: url === '/',
    });

    const cleanUrl = url.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    let currentUrl = '';

    segments.forEach((segment) => {
      currentUrl += `/${segment}`;
      if (currentUrl === '/') return;

      const route = getRouteByPath(currentUrl);
      if (route && route.isShow !== false) {
        const label = route.label;
        const navigableRoute = getFirstNavigableRoute(route);
        const targetUrl = navigableRoute ? navigableRoute.path : route.path;

        const prev = list[list.length - 1];
        if (prev && prev.label === label) {
          prev.url = targetUrl;
          return;
        }

        list.push({
          label,
          url: targetUrl,
          isLast: false,
        });
      }
    });

    if (list.length > 0) {
      list.forEach((item, index) => {
        item.isLast = index === list.length - 1;
      });
    }

    this.breadcrumbs = list;
  }
}

import {
  convertRoutesToMenuItems,
  filterMenuByPermission,
  ROUTES_CONFIG,
  SidebarMenuItem,
} from '@/app/core/constants/common';
import {
  DashboardService,
  DashboardSettings,
  PermissionService,
  SidebarService,
} from '@/app/core/services';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  collapsed = false;
  s: DashboardSettings;
  menuItems: SidebarMenuItem[] = [];
  private readonly allMenuItems = convertRoutesToMenuItems(ROUTES_CONFIG);
  private sub = new Subscription();

  constructor(
    private sidebarService: SidebarService,
    private ds: DashboardService,
    private permissionService: PermissionService,
  ) {
    this.s = ds.snapshot;
    this.sidebarService.collapsed$.subscribe((v) => (this.collapsed = v));
    this.refreshMenu();
  }

  ngOnInit(): void {
    this.sub.add(
      this.ds.settings$.subscribe((settings) => {
        this.s = settings;
        this.sidebarService.setCollapsed(settings.collapseSidebar);
      }),
    );
    this.sub.add(this.permissionService.permissions$.subscribe(() => this.refreshMenu()));
    this.sub.add(this.permissionService.userType$.subscribe(() => this.refreshMenu()));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  get sidebarWidth(): number {
    return this.collapsed ? this.s.sidebarCollapsedWidth : this.s.sidebarWidth;
  }

  get isDark(): boolean {
    return (
      this.s.theme === 'dark' ||
      (this.s.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
  }

  private refreshMenu(): void {
    this.menuItems = filterMenuByPermission(this.allMenuItems, (permission) => {
      if (!permission) return true;
      return this.permissionService.has(permission);
    });
  }
}

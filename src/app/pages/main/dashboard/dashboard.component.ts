import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import {
  GatewayManagementService,
  GatewayMetricsDto,
  HealthCheckAllResponse,
} from '../../../core/services/gateway-management.service';

@Component({
  standalone: false,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  loading = false;
  metrics?: GatewayMetricsDto;
  healthData?: HealthCheckAllResponse;
  routesCount = 0;
  clustersCount = 0;

  private pollSubscription?: Subscription;

  constructor(
    private readonly gatewayService: GatewayServiceWrapper,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refreshAll();
    this.pollSubscription = interval(10000).subscribe(() => {
      this.loadMetrics();
      this.loadHealth();
    });
  }

  ngOnDestroy(): void {
    this.pollSubscription?.unsubscribe();
  }

  refreshAll(): void {
    this.loading = true;
    this.loadMetrics();
    this.loadHealth();
    this.loadRoutes();
  }

  loadMetrics(): void {
    this.gatewayService.getMetrics().subscribe({
      next: (res) => {
        this.metrics = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadHealth(): void {
    this.gatewayService.getServicesHealth().subscribe({
      next: (res) => {
        this.healthData = res;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  loadRoutes(): void {
    this.gatewayService.getRoutes().subscribe({
      next: (res) => {
        this.routesCount = res.totalRoutes || 0;
        this.clustersCount = res.totalClusters || 0;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      },
    });
  }

  get overallStatusColor(): string {
    switch (this.healthData?.overallStatus) {
      case 'HEALTHY':
        return 'success';
      case 'DEGRADED':
        return 'warning';
      default:
        return 'error';
    }
  }

  calcPercent(count?: number): number {
    const total = this.metrics?.totalRequests || 0;
    if (!total || !count) return 0;
    return Math.min(100, Math.round((count / total) * 100));
  }

  formatUptime(seconds?: number): string {
    if (!seconds) return '0s';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }
}

import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class GatewayServiceWrapper extends GatewayManagementService {}

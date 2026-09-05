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
  autoRefresh = true;

  // ECharts options
  throughputOption: any;
  statusDonutOption: any;
  slowRoutesOption: any;

  private pollSubscription?: Subscription;

  constructor(
    private readonly gatewayService: GatewayServiceWrapper,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.refreshAll();
    this.pollSubscription = interval(10000).subscribe(() => {
      if (this.autoRefresh) {
        this.loadMetrics();
        this.loadHealth();
      }
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
        this.buildCharts(res);
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

  private buildCharts(m: GatewayMetricsDto): void {
    const timeline = m.timeline || [];
    const times = timeline.map((t) => t.time);
    const reqCounts = timeline.map((t) => t.requests);
    const latencies = timeline.map((t) => t.avgLatencyMs);

    // 1. Throughput & Latency Dual-Axis Chart
    this.throughputOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc', fontSize: 12 },
      },
      legend: {
        data: ['Lưu lượng (Req/phút)', 'Độ trễ TB (ms)'],
        top: 0,
        textStyle: { color: '#64748b' },
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '3%',
        top: '18%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: times.length ? times : ['15m', '10m', '5m', 'Hiện tại'],
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: { color: '#64748b', fontSize: 11 },
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Requests',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
          axisLabel: { color: '#64748b', fontSize: 11 },
        },
        {
          type: 'value',
          name: 'Latency (ms)',
          splitLine: { show: false },
          axisLabel: { color: '#f59e0b', fontSize: 11 },
        },
      ],
      series: [
        {
          name: 'Lưu lượng (Req/phút)',
          type: 'line',
          smooth: true,
          data: reqCounts.length ? reqCounts : [0, 0, 0, 0],
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.35)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.02)' },
              ],
            },
          },
          itemStyle: { color: '#3b82f6' },
          lineStyle: { width: 3, color: '#3b82f6' },
        },
        {
          name: 'Độ trễ TB (ms)',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: latencies.length ? latencies : [0, 0, 0, 0],
          itemStyle: { color: '#f59e0b' },
          lineStyle: { width: 2, type: 'dashed', color: '#f59e0b' },
        },
      ],
    };

    // 2. HTTP Status Code Distribution Donut
    const dist = m.statusDistribution || {};
    const donutData = [
      { value: dist['2xx'] || 0, name: '2xx Success', itemStyle: { color: '#10b981' } },
      { value: dist['3xx'] || 0, name: '3xx Redirect', itemStyle: { color: '#3b82f6' } },
      { value: dist['4xx'] || 0, name: '4xx Client Err', itemStyle: { color: '#f59e0b' } },
      { value: dist['5xx'] || 0, name: '5xx Gateway Err', itemStyle: { color: '#ef4444' } },
    ].filter((item) => item.value > 0);

    this.statusDonutOption = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
        backgroundColor: 'rgba(15, 23, 42, 0.92)',
        borderColor: '#334155',
        textStyle: { color: '#f8fafc', fontSize: 12 },
      },
      legend: {
        bottom: '0%',
        left: 'center',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: '#64748b', fontSize: 11 },
      },
      series: [
        {
          name: 'HTTP Status',
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#ffffff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
          },
          data: donutData.length > 0 ? donutData : [{ value: 1, name: 'Chưa có dữ liệu', itemStyle: { color: '#e2e8f0' } }],
        },
      ],
    };

    // 3. Top Slow Routes Horizontal Bar Chart
    const slowRoutes = m.topSlowRoutes || [];
    if (slowRoutes.length > 0) {
      const paths = slowRoutes.map((r) => r.path).reverse();
      const p95s = slowRoutes.map((r) => r.p95Ms).reverse();
      const avgs = slowRoutes.map((r) => r.avgMs).reverse();

      this.slowRoutesOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderColor: '#334155',
          textStyle: { color: '#f8fafc', fontSize: 12 },
        },
        legend: {
          data: ['p95 Latency (ms)', 'Avg Latency (ms)'],
          top: 0,
          textStyle: { color: '#64748b', fontSize: 11 },
        },
        grid: {
          left: '3%',
          right: '8%',
          bottom: '3%',
          top: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          name: 'ms',
          splitLine: { lineStyle: { color: '#f1f5f9', type: 'dashed' } },
          axisLabel: { color: '#64748b', fontSize: 11 },
        },
        yAxis: {
          type: 'category',
          data: paths,
          axisLine: { lineStyle: { color: '#e2e8f0' } },
          axisLabel: {
            color: '#334155',
            fontSize: 11,
            formatter: (val: string) => (val.length > 25 ? val.slice(0, 25) + '…' : val),
          },
        },
        series: [
          {
            name: 'p95 Latency (ms)',
            type: 'bar',
            data: p95s,
            itemStyle: { color: '#f97316', borderRadius: [0, 4, 4, 0] },
          },
          {
            name: 'Avg Latency (ms)',
            type: 'bar',
            data: avgs,
            itemStyle: { color: '#3b82f6', borderRadius: [0, 4, 4, 0] },
          },
        ],
      };
    } else {
      this.slowRoutesOption = null;
    }
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

import { enumData } from '@/app/core/constants/enums';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, Subscription } from 'rxjs';
import {
  GatewayManagementService,
  RequestTraceItemDto,
} from '../../../core/services/gateway-management.service';
import {
  CommonFilterActions,
  FilterAction,
  FilterConfig,
  FilterField,
} from '../../../shared/components/filter-custom/filter-custom.types';
import {
  PaginationConfig,
  TableColumn,
  ToolbarConfig,
} from '../../../shared/components/table-custom/table-custom.types';

@Component({
  standalone: false,
  selector: 'app-traffic-logs',
  templateUrl: './traffic-logs.component.html',
  styleUrls: ['./traffic-logs.component.scss'],
})
export class TrafficLogsComponent implements OnInit, OnDestroy {
  loading = false;
  logs: RequestTraceItemDto[] = [];
  autoRefresh = false;

  private pollSub?: Subscription;

  filters: Record<string, any> = {
    keyword: '',
    method: null,
    targetCluster: null,
  };

  filterConfig: FilterConfig = {
    show: true,
    collapsible: true,
    defaultOpen: true,
    title: 'Bộ lọc tìm kiếm Nhật Ký Truy Vết Request',
    actionsAlign: 'center',
  };

  filterFields: FilterField[] = [
    {
      key: 'keyword',
      label: 'Tìm kiếm đường dẫn / Correlation ID / IP',
      type: 'input',
      placeholder: 'Nhập /api/..., correlation id, client IP...',
      col: 8,
      allowClear: true,
    },
    {
      key: 'method',
      label: 'HTTP Method',
      type: 'select',
      placeholder: 'Tất cả phương thức',
      col: 8,
      allowClear: true,
      options: Object.values(enumData.HTTP_METHOD).map((m: any) => ({
        label: m.name,
        value: m.code,
      })),
    },
    {
      key: 'targetCluster',
      label: 'Cụm Đích',
      type: 'select',
      placeholder: 'Tất cả cụm dịch vụ',
      col: 8,
      allowClear: true,
      options: Object.values(enumData.GATEWAY_CLUSTER).map((c: any) => ({
        label: c.name,
        value: c.code,
      })),
    },
  ];

  filterActions: FilterAction[] = [
    CommonFilterActions.search(() => this.loadLogs(), this.loading),
    CommonFilterActions.clear(() => this.resetFilters()),
  ];

  toolbar: ToolbarConfig = {
    show: true,
    showRefreshButton: true,
  };

  pagination: PaginationConfig = {
    current: enumData.PAGE.PAGE_INDEX,
    pageSize: enumData.PAGE.PAGE_SIZE,
    total: enumData.PAGE.TOTAL,
    showTotal: true,
  };

  columns: TableColumn<RequestTraceItemDto>[] = [
    {
      field: 'timestamp',
      header: 'Thời Gian',
      type: 'datetime',
      width: '150px',
    },
    {
      field: 'correlationId',
      header: 'Correlation ID',
      width: '200px',
      render: (v) =>
        `<span style="font-family: monospace; font-size: 11px; background: #f1f5f9; padding: 2px 5px; border-radius: 4px;">${v}</span>`,
    },
    {
      field: 'method',
      header: 'Method',
      type: 'tag',
      render: (v: string) =>
        enumData.HTTP_METHOD[v as keyof typeof enumData.HTTP_METHOD]?.name || v,
      tagSeverity: (v: string) =>
        enumData.HTTP_METHOD[v as keyof typeof enumData.HTTP_METHOD]?.severity || 'secondary',
      width: '95px',
    },
    {
      field: 'path',
      header: 'Đường Dẫn Request',
      width: '260px',
    },
    {
      field: 'statusCode',
      header: 'Status',
      type: 'tag',
      tagSeverity: (v) => {
        if (v >= 200 && v < 300) return 'success';
        if (v >= 300 && v < 400) return 'info';
        if (v >= 400 && v < 500) return 'warning';
        return 'danger';
      },
      width: '90px',
    },
    {
      field: 'durationMs',
      header: 'Độ Trễ',
      render: (v) => `${v} ms`,
      width: '95px',
    },
    {
      field: 'targetCluster',
      header: 'Cụm Cluster',
      type: 'tag',
      render: (v: string) =>
        enumData.GATEWAY_CLUSTER[v as keyof typeof enumData.GATEWAY_CLUSTER]?.name || v,
      tagSeverity: () => 'secondary',
      width: '170px',
    },
    {
      field: 'clientIp',
      header: 'Client IP',
      width: '120px',
    },
  ];

  constructor(
    private readonly gatewayService: GatewayManagementService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadClusters();
    this.loadLogs();
  }

  loadClusters(): void {
    this.gatewayService.getRoutes().subscribe({
      next: (res) => {
        if (res?.clusters?.length) {
          const dynamicOptions = res.clusters.map((c) => {
            const config =
              enumData.GATEWAY_CLUSTER[c.clusterId as keyof typeof enumData.GATEWAY_CLUSTER];
            return {
              label: config ? `${config.name} (${c.clusterId})` : c.clusterId,
              value: c.clusterId,
            };
          });
          const clusterField = this.filterFields.find((f) => f.key === 'targetCluster');
          if (clusterField) {
            clusterField.options = dynamicOptions;
            this.cdr.markForCheck();
          }
        }
      },
      error: () => {},
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  loadLogs(): void {
    this.loading = true;
    this.gatewayService
      .searchLogs({
        keyword: this.filters['keyword'],
        method: this.filters['method'],
        targetCluster: this.filters['targetCluster'],
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
      })
      .subscribe({
        next: (res) => {
          this.logs = res.items || [];
          this.pagination.total = res.totalCount || 0;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onFiltersChange(newFilters: Record<string, any>): void {
    this.filters = { ...newFilters };
    this.pagination.current = 1;
    this.loadLogs();
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.pagination.current = event.page;
    this.pagination.pageSize = event.pageSize;
    this.loadLogs();
  }

  resetFilters(): void {
    this.filters = {
      keyword: '',
      method: null,
      targetCluster: null,
    };
    this.pagination.current = 1;
    this.loadLogs();
  }

  toggleAutoRefresh(enabled: boolean): void {
    if (enabled) {
      this.pollSub = interval(5000).subscribe(() => this.loadLogs());
    } else {
      this.pollSub?.unsubscribe();
    }
  }

  clearLogs(): void {
    this.gatewayService.clearLogs().subscribe({
      next: (res) => {
        this.message.success(res.message);
        this.logs = [];
        this.pagination.total = 0;
        this.cdr.markForCheck();
      },
    });
  }
}

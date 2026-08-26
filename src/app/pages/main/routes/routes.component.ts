import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GatewayClusterDto,
  GatewayManagementService,
  GatewayRouteDto,
} from '../../../core/services/gateway-management.service';
import {
  PaginationConfig,
  TableColumn,
  ToolbarConfig,
} from '../../../shared/components/table-custom/table-custom.types';

@Component({
  standalone: false,
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  loading = false;
  viewMode: 'cards' | 'table' = 'cards';
  selectedTab = 0;

  routes: GatewayRouteDto[] = [];
  filteredRoutes: GatewayRouteDto[] = [];
  paginatedRoutes: GatewayRouteDto[] = [];
  clusters: GatewayClusterDto[] = [];

  searchKeyword = '';
  selectedCluster: string | null = null;
  selectedAuthPolicy: string | null = null;

  pagination: PaginationConfig = {
    current: 1,
    pageSize: 12,
    total: 0,
    showTotal: true,
  };

  toolbar: ToolbarConfig = {
    show: true,
    showRefreshButton: true,
  };

  columns: TableColumn<GatewayRouteDto>[] = [
    {
      field: 'routeId',
      header: 'Mã Route ID',
      width: '180px',
      sortable: true,
    },
    {
      field: 'pathMatch',
      header: 'Đường Dẫn Khớp (Path Match)',
      width: '260px',
    },
    {
      field: 'clusterId',
      header: 'Cụm Đích (Cluster ID)',
      type: 'tag',
      tagSeverity: () => 'primary',
      width: '200px',
    },
    {
      field: 'authorizationPolicy',
      header: 'Chính Sách Xác Thực',
      type: 'tag',
      tagSeverity: (v) => (v === 'Anonymous' ? 'secondary' : 'success'),
      width: '140px',
    },
    {
      field: 'rateLimiterPolicy',
      header: 'Giới Hạn Tần Suất',
      type: 'text',
      width: '140px',
    },
  ];

  constructor(
    private readonly gatewayService: GatewayManagementService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRoutes();
  }

  loadRoutes(): void {
    this.loading = true;
    this.gatewayService.getRoutes().subscribe({
      next: (res) => {
        this.routes = res.routes || [];
        this.clusters = res.clusters || [];
        this.applyFilter();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSearchChange(): void {
    this.pagination.current = 1;
    this.applyFilter();
  }

  setClusterFilter(clusterId: string | null): void {
    this.selectedCluster = clusterId;
    this.pagination.current = 1;
    this.applyFilter();
  }

  setAuthPolicyFilter(policy: string | null): void {
    this.selectedAuthPolicy = policy;
    this.pagination.current = 1;
    this.applyFilter();
  }

  applyFilter(): void {
    let result = [...this.routes];

    if (this.searchKeyword.trim()) {
      const kw = this.searchKeyword.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.routeId.toLowerCase().includes(kw) ||
          r.pathMatch.toLowerCase().includes(kw) ||
          r.clusterId.toLowerCase().includes(kw),
      );
    }

    if (this.selectedCluster) {
      result = result.filter((r) => r.clusterId === this.selectedCluster);
    }

    if (this.selectedAuthPolicy) {
      result = result.filter((r) => r.authorizationPolicy === this.selectedAuthPolicy);
    }

    this.filteredRoutes = result;
    this.pagination.total = result.length;
    this.updatePagination();
    this.cdr.markForCheck();
  }

  updatePagination(): void {
    const startIndex = (this.pagination.current - 1) * this.pagination.pageSize;
    const endIndex = startIndex + this.pagination.pageSize;
    this.paginatedRoutes = this.filteredRoutes.slice(startIndex, endIndex);
  }

  onPageChange(event: { page: number; pageSize: number }): void {
    this.pagination.current = event.page;
    this.pagination.pageSize = event.pageSize;
    this.updatePagination();
    this.cdr.markForCheck();
  }

  copyPath(path: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    navigator.clipboard.writeText(path);
    this.message.success(`Đã sao chép đường dẫn: ${path}`);
  }

  getClusterTheme(clusterId: string): string {
    if (clusterId.includes('auth')) return 'theme-auth';
    if (clusterId.includes('hrm')) return 'theme-hrm';
    if (clusterId.includes('integration') || clusterId.includes('hub')) return 'theme-hub';
    if (clusterId.includes('wms')) return 'theme-wms';
    if (clusterId.includes('ai')) return 'theme-ai';
    if (clusterId.includes('tms')) return 'theme-tms';
    return 'theme-default';
  }

  getClusterDestination(clusterId: string): string {
    const found = this.clusters.find((c) => c.clusterId === clusterId);
    if (found && found.destinations && found.destinations.length > 0) {
      return found.destinations.map((d) => d.address).join(', ');
    }
    return 'Chưa cấu hình destination';
  }
}

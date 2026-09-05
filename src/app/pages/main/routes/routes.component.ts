import { enumData } from '@/app/core/constants/enums';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GatewayClusterDto,
  GatewayManagementService,
  GatewayRouteDto,
  GatewayServiceItemDto,
} from '../../../core/services/gateway-management.service';
import {
  PaginationConfig,
  TableColumn,
  ToolbarConfig,
} from '../../../shared/components/table-custom/table-custom.types';
import { AddOrUpdateServiceModalComponent } from './add-or-update-service/add-or-update-service.component';
import { AddOrUpdateRouteModalComponent } from './add-or-update-route/add-or-update-route.component';

@Component({
  standalone: false,
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  loading = false;
  selectedTab = 0;

  // View modes
  viewMode: 'cards' | 'table' = 'cards';
  serviceViewMode: 'cards' | 'table' = 'cards';

  // Services state
  services: GatewayServiceItemDto[] = [];
  filteredServices: GatewayServiceItemDto[] = [];
  serviceSearchKeyword = '';
  serviceStatusFilter: boolean | null = null;

  // Routes state
  routes: GatewayRouteDto[] = [];
  filteredRoutes: GatewayRouteDto[] = [];
  paginatedRoutes: GatewayRouteDto[] = [];
  searchKeyword = '';
  selectedCluster: string | null = null;
  selectedAuthPolicy: string | null = null;

  // Clusters state
  clusters: GatewayClusterDto[] = [];
  ratePolicies: any[] = [];
  destForm = {
    clusterId: '',
    name: '',
    address: 'http://localhost:5000',
    weight: 1,
  };

  pagination: PaginationConfig = {
    current: enumData.PAGE.PAGE_INDEX,
    pageSize: enumData.PAGE.PAGE_SIZE,
    total: enumData.PAGE.TOTAL,
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
    private readonly drawer: NzDrawerService,
    private readonly modal: NzModalService,
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
        this.services = res.services || [];
        this.routes = res.routes || [];
        this.clusters = res.clusters || [];
        this.ratePolicies = res.ratePolicies || [];

        if (!this.destForm.clusterId && this.clusters.length) {
          this.destForm.clusterId = this.clusters[0].clusterId;
        }

        this.applyServiceFilter();
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

  /* ================= SERVICES LOGIC ================= */
  openCreateService(): void {
    const drawerRef = this.drawer.create({
      nzTitle: 'Thêm Dịch Vụ API Mới (Downstream Microservice)',
      nzContent: AddOrUpdateServiceModalComponent,
      nzData: { isEdit: false },
      nzPlacement: 'right',
      nzWidth: '640px',
    });

    drawerRef.afterClose.subscribe((res) => {
      if (res) {
        this.loadRoutes();
      }
    });
  }

  openEditService(service: GatewayServiceItemDto, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    const drawerRef = this.drawer.create({
      nzTitle: `Chỉnh Sửa Dịch Vụ: ${service.name}`,
      nzContent: AddOrUpdateServiceModalComponent,
      nzData: { isEdit: true, service },
      nzPlacement: 'right',
      nzWidth: '640px',
    });

    drawerRef.afterClose.subscribe((res) => {
      if (res) {
        this.loadRoutes();
      }
    });
  }

  confirmDeleteService(service: GatewayServiceItemDto, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!service.id) return;

    this.modal.confirm({
      nzTitle: `Xác nhận xóa dịch vụ: ${service.name}`,
      nzContent: `Bạn có chắc chắn muốn xóa dịch vụ "${service.name}" (${service.code})? Toàn bộ thiết lập YARP liên quan sẽ được gỡ bỏ an toàn.`,
      nzOkText: 'Xóa ngay',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.deleteService(service);
      },
      nzCancelText: 'Hủy',
    });
  }

  deleteService(service: GatewayServiceItemDto, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!service.id) return;

    this.loading = true;
    this.gatewayService.deleteService(service.id).subscribe({
      next: () => {
        this.loading = false;
        this.message.success(`Đã xóa dịch vụ "${service.name}".`);
        this.loadRoutes();
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err?.error?.message || 'Không thể xóa dịch vụ.');
      },
    });
  }

  toggleServiceStatus(service: GatewayServiceItemDto, newStatus: boolean, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    this.gatewayService
      .upsertService({
        id: service.id,
        code: service.code,
        name: service.name,
        baseUrl: service.baseUrl,
        healthPath: service.healthPath,
        icon: service.icon,
        description: service.description,
        isActive: newStatus,
      })
      .subscribe({
        next: () => {
          service.isActive = newStatus;
          this.message.success(
            `Đã ${newStatus ? 'kích hoạt' : 'tạm dừng'} dịch vụ ${service.name}.`,
          );
          this.cdr.markForCheck();
        },
        error: () => {
          this.message.error('Không thể cập nhật trạng thái dịch vụ.');
        },
      });
  }

  confirmRemoveDestination(id?: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    if (!id) return;

    this.modal.confirm({
      nzTitle: 'Xác nhận xóa Destination',
      nzContent: 'Bạn có chắc chắn muốn xóa địa chỉ máy chủ đích này?',
      nzOkText: 'Xóa ngay',
      nzOkDanger: true,
      nzOnOk: () => this.removeDestination(id),
      nzCancelText: 'Hủy',
    });
  }

  onServiceSearchChange(): void {
    this.applyServiceFilter();
  }

  setServiceStatusFilter(status: boolean | null): void {
    this.serviceStatusFilter = status;
    this.applyServiceFilter();
  }

  applyServiceFilter(): void {
    let list = [...this.services];

    if (this.serviceSearchKeyword.trim()) {
      const kw = this.serviceSearchKeyword.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          s.code.toLowerCase().includes(kw) ||
          s.baseUrl.toLowerCase().includes(kw) ||
          (s.description && s.description.toLowerCase().includes(kw)),
      );
    }

    if (this.serviceStatusFilter !== null) {
      list = list.filter((s) => s.isActive === this.serviceStatusFilter);
    }

    this.filteredServices = list;
    this.cdr.markForCheck();
  }

  getServiceLinkedCluster(serviceCode: string): GatewayClusterDto | undefined {
    return this.clusters.find(
      (c) =>
        c.clusterId.toLowerCase() === `${serviceCode}-cluster`.toLowerCase() ||
        c.clusterId.toLowerCase().includes(serviceCode.toLowerCase()),
    );
  }

  getServiceLinkedRoutes(serviceCode: string): GatewayRouteDto[] {
    const cluster = this.getServiceLinkedCluster(serviceCode);
    if (!cluster) {
      return this.routes.filter(
        (r) =>
          r.routeId.toLowerCase().includes(serviceCode.toLowerCase()) ||
          r.pathMatch.toLowerCase().includes(serviceCode.toLowerCase()),
      );
    }
    return this.routes.filter((r) => r.clusterId === cluster.clusterId);
  }

  /* ================= ROUTES LOGIC ================= */
  openCreateRoute(): void {
    const drawerRef = this.drawer.create({
      nzTitle: 'Thêm Quy Tắc Định Tuyến (YARP Route) Mới',
      nzContent: AddOrUpdateRouteModalComponent,
      nzData: {
        isEdit: false,
        clusters: this.clusters,
        ratePolicies: this.ratePolicies,
      },
      nzPlacement: 'right',
      nzWidth: '640px',
    });

    drawerRef.afterClose.subscribe((res) => {
      if (res) {
        this.loadRoutes();
      }
    });
  }

  openEditRoute(route: GatewayRouteDto, event?: MouseEvent): void {
    if (event) event.stopPropagation();

    const drawerRef = this.drawer.create({
      nzTitle: `Chỉnh Sửa Quy Tắc: ${route.routeId}`,
      nzContent: AddOrUpdateRouteModalComponent,
      nzData: {
        isEdit: true,
        route,
        clusters: this.clusters,
        ratePolicies: this.ratePolicies,
      },
      nzPlacement: 'right',
      nzWidth: '640px',
    });

    drawerRef.afterClose.subscribe((res) => {
      if (res) {
        this.loadRoutes();
      }
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

  copyText(text: string, label: string, event?: MouseEvent): void {
    if (event) event.stopPropagation();
    navigator.clipboard.writeText(text);
    this.message.success(`Đã sao chép ${label}: ${text}`);
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

  /* ================= DESTINATIONS / CLUSTERS LOGIC ================= */
  addDestination(): void {
    if (!this.destForm.clusterId || !this.destForm.address.trim()) {
      this.message.warning('Vui lòng chọn cluster và nhập địa chỉ destination.');
      return;
    }
    this.gatewayService
      .upsertDestination({
        clusterId: this.destForm.clusterId,
        name: this.destForm.name || undefined,
        address: this.destForm.address.trim(),
        weight: this.destForm.weight || 1,
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã thêm destination, YARP đã reload.');
          this.destForm.name = '';
          this.loadRoutes();
        },
        error: (err) =>
          this.message.error(err?.error?.message || 'Không thể lưu destination.'),
      });
  }

  removeDestination(id?: string): void {
    if (!id) return;
    this.gatewayService.deleteDestination(id).subscribe({
      next: () => {
        this.message.success('Đã xóa destination.');
        this.loadRoutes();
      },
    });
  }

  toggleCircuit(cluster: GatewayClusterDto): void {
    this.gatewayService
      .upsertCluster({
        id: cluster.id,
        clusterId: cluster.clusterId,
        serviceId: cluster.serviceId,
        timeoutSeconds: cluster.timeoutSeconds || 30,
        circuitBreakerEnabled: !cluster.circuitBreakerEnabled,
        isActive: cluster.isActive !== false,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã cập nhật circuit breaker.');
          this.loadRoutes();
        },
      });
  }
}

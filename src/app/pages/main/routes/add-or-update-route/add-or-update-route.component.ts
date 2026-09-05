import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GatewayClusterDto,
  GatewayManagementService,
  GatewayRouteDto,
} from '../../../../core/services/gateway-management.service';

interface RouteDrawerData {
  isEdit: boolean;
  route?: GatewayRouteDto;
  clusters: GatewayClusterDto[];
  ratePolicies?: any[];
}

@Component({
  standalone: false,
  selector: 'app-add-or-update-route',
  templateUrl: './add-or-update-route.component.html',
  styleUrls: ['./add-or-update-route.component.scss'],
})
export class AddOrUpdateRouteModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  testing = false;
  isEdit = false;
  route?: GatewayRouteDto;
  clusters: GatewayClusterDto[] = [];
  ratePolicies: any[] = [];

  availableMethods = ['ALL', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

  constructor(
    private readonly fb: FormBuilder,
    private readonly gatewayService: GatewayManagementService,
    private readonly message: NzMessageService,
    private readonly modal: NzModalService,
    @Optional() private readonly drawerRef?: NzDrawerRef,
    @Optional() private readonly modalRef?: NzModalRef,
    @Optional() @Inject(NZ_DRAWER_DATA) private readonly drawerData?: RouteDrawerData,
    @Optional() @Inject(NZ_MODAL_DATA) private readonly modalData?: RouteDrawerData,
  ) {
    const data = this.drawerData || this.modalData || { isEdit: false, clusters: [] };
    this.isEdit = !!data.isEdit;
    this.route = data.route;
    this.clusters = data.clusters || [];
    this.ratePolicies = data.ratePolicies || [];
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const defaultCluster =
      this.route?.clusterId || (this.clusters.length ? this.clusters[0].clusterId : '');

    this.form = this.fb.group({
      routeId: [
        { value: this.route?.routeId || '', disabled: this.isEdit },
        [Validators.required, Validators.maxLength(80)],
      ],
      pathMatch: [
        this.route?.pathMatch || '/api/v1/',
        [Validators.required, Validators.maxLength(255)],
      ],
      clusterId: [defaultCluster, [Validators.required]],
      methods: [this.route?.methods || ['ALL']],
      isPublic: [!!this.route?.isPublic],
      authorizationPolicy: [this.route?.authorizationPolicy || 'Bearer'],
      rateLimiterPolicy: [this.route?.rateLimiterPolicy || 'Default'],
      timeout: [this.route?.timeout || 30, [Validators.min(1), Validators.max(600)]],
      isActive: [this.route?.isActive !== false],
    });

    this.form.get('isPublic')?.valueChanges.subscribe((pub: boolean) => {
      if (pub) {
        this.form.patchValue({ authorizationPolicy: 'Anonymous' });
      } else {
        if (this.form.get('authorizationPolicy')?.value === 'Anonymous') {
          this.form.patchValue({ authorizationPolicy: 'Bearer' });
        }
      }
    });
  }

  testRouteMatch(): void {
    const path = this.form.get('pathMatch')?.value;
    if (!path) {
      this.message.warning('Vui lòng nhập đường dẫn Path Match để kiểm tra.');
      return;
    }

    this.testing = true;
    this.gatewayService.testRoute({ method: 'GET', path }).subscribe({
      next: (res) => {
        this.testing = false;
        if (res.matched) {
          this.message.success(
            `Khớp thành công: ${res.routeId} → ${res.clusterId} (${res.latencyMs}ms)`,
          );
        } else {
          this.message.warning(res.error || 'Đường dẫn không khớp với quy tắc nào');
        }
      },
      error: () => {
        this.testing = false;
        this.message.error('Không thể kiểm tra định tuyến.');
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach((ctrl) => {
        if (ctrl.invalid) {
          ctrl.markAsDirty();
          ctrl.updateValueAndValidity({ onlySelf: true });
        }
      });
      this.message.warning('Vui lòng kiểm tra lại các trường bắt buộc.');
      return;
    }

    const raw = this.form.getRawValue();
    this.loading = true;

    const payload = {
      id: this.route?.id,
      routeId: raw.routeId?.trim(),
      pathMatch: raw.pathMatch?.trim(),
      clusterId: raw.clusterId?.trim(),
      methods: raw.methods,
      isPublic: raw.isPublic,
      authorizationPolicy: raw.isPublic ? 'Anonymous' : raw.authorizationPolicy,
      rateLimiterPolicy: raw.rateLimiterPolicy,
      timeout: raw.timeout,
      isActive: raw.isActive,
    };

    this.gatewayService.upsertRoute(payload).subscribe({
      next: () => {
        this.loading = false;
        this.message.success(
          this.isEdit
            ? `Đã cập nhật quy tắc "${payload.routeId}", YARP đã hot-reload!`
            : `Đã thêm quy tắc "${payload.routeId}", YARP đã hot-reload!`,
        );
        this.closeDrawer(true);
      },
      error: (err) => {
        this.loading = false;
        this.message.error(err?.error?.message || 'Không thể lưu quy tắc định tuyến.');
      },
    });
  }

  deleteRoute(): void {
    if (!this.route?.id) return;
    this.modal.confirm({
      nzTitle: `Xác nhận xóa quy tắc: ${this.route.routeId}`,
      nzContent: `Bạn có chắc chắn muốn xóa quy tắc định tuyến "${this.route.routeId}"?`,
      nzOkText: 'Xóa ngay',
      nzOkDanger: true,
      nzOnOk: () => {
        this.loading = true;
        this.gatewayService.deleteRoute(this.route!.id!).subscribe({
          next: () => {
            this.loading = false;
            this.message.success('Đã xóa quy tắc định tuyến.');
            this.closeDrawer(true);
          },
          error: () => {
            this.loading = false;
            this.message.error('Không thể xóa quy tắc.');
          },
        });
      },
      nzCancelText: 'Hủy',
    });
  }

  onCancel(): void {
    this.closeDrawer(false);
  }

  private closeDrawer(result = false): void {
    if (this.drawerRef) {
      this.drawerRef.close(result);
    } else if (this.modalRef) {
      this.modalRef.close(result);
    }
  }
}

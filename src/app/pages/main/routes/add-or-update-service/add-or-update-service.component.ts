import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NZ_DRAWER_DATA, NzDrawerRef } from 'ng-zorro-antd/drawer';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GatewayManagementService,
  GatewayServiceItemDto,
} from '../../../../core/services/gateway-management.service';

interface ServiceDrawerData {
  isEdit: boolean;
  service?: GatewayServiceItemDto;
}

@Component({
  standalone: false,
  selector: 'app-add-or-update-service',
  templateUrl: './add-or-update-service.component.html',
  styleUrls: ['./add-or-update-service.component.scss'],
})
export class AddOrUpdateServiceModalComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  isEdit = false;
  service?: GatewayServiceItemDto;

  presetIcons = [
    { label: 'API Gateway', value: 'api', icon: 'api' },
    { label: 'AI Service', value: 'robot', icon: 'robot' },
    { label: 'Hạ tầng / Server', value: 'cloud-server', icon: 'cloud-server' },
    { label: 'Bảo mật / Auth', value: 'safety-certificate', icon: 'safety-certificate' },
    { label: 'Phân hệ / App', value: 'appstore', icon: 'appstore' },
    { label: 'Thương mại / Bán hàng', value: 'shopping-cart', icon: 'shopping-cart' },
    { label: 'Nhân sự / Team', value: 'team', icon: 'team' },
    { label: 'Cơ sở Dữ liệu', value: 'database', icon: 'database' },
    { label: 'Tích hợp / Hub', value: 'share-alt', icon: 'share-alt' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly gatewayService: GatewayManagementService,
    private readonly message: NzMessageService,
    @Optional() private readonly drawerRef?: NzDrawerRef,
    @Optional() private readonly modalRef?: NzModalRef,
    @Optional() @Inject(NZ_DRAWER_DATA) private readonly drawerData?: ServiceDrawerData,
    @Optional() @Inject(NZ_MODAL_DATA) private readonly modalData?: ServiceDrawerData,
  ) {
    const data = this.drawerData || this.modalData || { isEdit: false };
    this.isEdit = !!data.isEdit;
    this.service = data.service;
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      code: [
        { value: this.service?.code || '', disabled: this.isEdit },
        [Validators.required, Validators.maxLength(50), Validators.pattern(/^[a-z0-9-]+$/)],
      ],
      name: [this.service?.name || '', [Validators.required, Validators.maxLength(120)]],
      baseUrl: [
        this.service?.baseUrl || 'http://localhost:5000',
        [Validators.required, Validators.maxLength(255)],
      ],
      healthPath: [this.service?.healthPath || '/health', [Validators.required]],
      icon: [this.service?.icon || 'api'],
      description: [this.service?.description || ''],
      isActive: [this.service?.isActive ?? true],

      // YARP Reverse Proxy Automation Options
      autoConfigureYarp: [!this.isEdit],
      clusterId: [this.service?.code ? `${this.service.code}-cluster` : ''],
      routeId: [this.service?.code ? `${this.service.code}-route` : ''],
      pathMatch: [
        this.service?.code ? `/api/v1/${this.service.code}/{**catch-all}` : '',
      ],
      authorizationPolicy: ['Bearer'],
      timeoutSeconds: [30, [Validators.min(5), Validators.max(300)]],
    });

    if (!this.isEdit) {
      this.form.get('code')?.valueChanges.subscribe((rawCode: string) => {
        if (!rawCode) return;
        const clean = rawCode.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-');

        const clusterCtrl = this.form.get('clusterId');
        if (clusterCtrl && (!clusterCtrl.dirty || !clusterCtrl.value)) {
          clusterCtrl.setValue(`${clean}-cluster`);
        }

        const routeCtrl = this.form.get('routeId');
        if (routeCtrl && (!routeCtrl.dirty || !routeCtrl.value)) {
          routeCtrl.setValue(`${clean}-route`);
        }

        const pathCtrl = this.form.get('pathMatch');
        if (pathCtrl && (!pathCtrl.dirty || !pathCtrl.value)) {
          pathCtrl.setValue(`/api/v1/${clean}/{**catch-all}`);
        }
      });
    }
  }

  onCodeInputBlur(): void {
    const ctrl = this.form.get('code');
    if (ctrl && ctrl.value) {
      ctrl.setValue(ctrl.value.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'));
    }
  }

  selectPresetIcon(icon: string): void {
    this.form.patchValue({ icon });
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
      id: this.service?.id || undefined,
      code: raw.code?.toLowerCase()?.trim(),
      name: raw.name?.trim(),
      baseUrl: raw.baseUrl?.trim()?.replace(/\/+$/, ''),
      healthPath: raw.healthPath?.trim() || '/health',
      icon: raw.icon || 'api',
      description: raw.description?.trim() || null,
      isActive: raw.isActive,
    };

    this.gatewayService.upsertService(payload).subscribe({
      next: (savedService) => {
        if (raw.autoConfigureYarp && !this.isEdit) {
          this.configureYarpPipeline(raw, savedService?.id);
        } else {
          this.loading = false;
          this.message.success(
            this.isEdit
              ? `Đã cập nhật dịch vụ "${payload.name}" thành công!`
              : `Đã thêm mới dịch vụ "${payload.name}" thành công!`,
          );
          this.closeDrawer(true);
        }
      },
      error: (err) => {
        this.loading = false;
        this.message.error(
          err?.error?.message || 'Không thể lưu dịch vụ. Vui lòng thử lại!',
        );
      },
    });
  }

  private configureYarpPipeline(raw: any, serviceId?: string): void {
    const clusterPayload = {
      clusterId: raw.clusterId || `${raw.code}-cluster`,
      serviceId: serviceId,
      timeoutSeconds: raw.timeoutSeconds || 30,
      circuitBreakerEnabled: true,
      isActive: raw.isActive,
    };

    this.gatewayService.upsertCluster(clusterPayload).subscribe({
      next: () => {
        const destPayload = {
          clusterId: clusterPayload.clusterId,
          name: `${raw.code}-main`,
          address: raw.baseUrl,
          weight: 1,
          isActive: raw.isActive,
        };

        this.gatewayService.upsertDestination(destPayload).subscribe({
          next: () => {
            const isPublic = raw.authorizationPolicy === 'Anonymous';
            const routePayload = {
              routeId: raw.routeId || `${raw.code}-route`,
              clusterId: clusterPayload.clusterId,
              pathMatch: raw.pathMatch || `/api/v1/${raw.code}/{**catch-all}`,
              authorizationPolicy: raw.authorizationPolicy || 'Bearer',
              isPublic: isPublic,
              isActive: raw.isActive,
              sortOrder: 10,
            };

            this.gatewayService.upsertRoute(routePayload).subscribe({
              next: () => {
                this.loading = false;
                this.message.success(
                  `Đã thêm dịch vụ "${raw.name}" và tự động thiết lập Cluster & Route YARP thành công!`,
                );
                this.closeDrawer(true);
              },
              error: () => {
                this.loading = false;
                this.message.warning(
                  `Đã lưu service & cluster, nhưng route gặp lỗi khi kích hoạt. Bạn có thể cấu hình lại ở tab Routes.`,
                );
                this.closeDrawer(true);
              },
            });
          },
          error: () => {
            this.loading = false;
            this.message.warning(
              `Đã lưu service & cluster, nhưng destination chưa lưu được.`,
            );
            this.closeDrawer(true);
          },
        });
      },
      error: () => {
        this.loading = false;
        this.message.warning(
          `Đã lưu thông tin service, nhưng cluster tự động chưa hoàn tất.`,
        );
        this.closeDrawer(true);
      },
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

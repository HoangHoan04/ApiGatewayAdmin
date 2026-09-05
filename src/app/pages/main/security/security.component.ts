import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GatewayManagementService } from '../../../core/services/gateway-management.service';

@Component({
  standalone: false,
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss'],
})
export class SecurityComponent implements OnInit {
  loading = false;
  status: any = null;
  ipCidr = '';
  ipDescription = '';
  rateName = '';
  rateRpm = 60;
  maintServiceId = '';
  maintMessage = 'Service đang bảo trì.';

  constructor(
    private readonly gateway: GatewayManagementService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.loading = true;
    this.gateway.getSecurityStatus().subscribe({
      next: (res) => {
        this.status = res;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
    this.gateway.getRoutes().subscribe({
      next: (res: any) => {
        this.status = {
          ...this.status,
          ipRules: res.ipRules || [],
          ratePolicies: res.ratePolicies || [],
          services: res.services || [],
          maintenance: res.maintenance || [],
        };
        if (!this.maintServiceId && res.services?.length) {
          this.maintServiceId = res.services[0].id;
        }
        this.cdr.markForCheck();
      },
    });
  }

  addIpDeny(): void {
    if (!this.ipCidr.trim()) {
      this.message.warning('Nhập CIDR hoặc IP.');
      return;
    }
    this.gateway
      .upsertIpRule({
        action: 'Deny',
        cidr: this.ipCidr.trim(),
        description: this.ipDescription,
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã thêm IP deny.');
          this.ipCidr = '';
          this.reload();
        },
        error: (err) => this.message.error(err?.error?.message || 'Không lưu được IP rule'),
      });
  }

  removeIp(id: string): void {
    this.gateway.deleteIpRule(id).subscribe({
      next: () => {
        this.message.success('Đã xóa IP rule.');
        this.reload();
      },
    });
  }

  addRate(): void {
    if (!this.rateName.trim()) {
      return;
    }
    this.gateway
      .upsertRatePolicy({
        name: this.rateName.trim(),
        keyType: 'Ip',
        requestsPerMinute: this.rateRpm,
        burst: 20,
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã lưu rate policy.');
          this.rateName = '';
          this.reload();
        },
        error: (err) => this.message.error(err?.error?.message || 'Không lưu được rate policy'),
      });
  }

  startMaintenance(): void {
    if (!this.maintServiceId) {
      this.message.warning('Chọn service.');
      return;
    }
    this.gateway
      .upsertMaintenance({
        serviceId: this.maintServiceId,
        message: this.maintMessage,
        startsAt: new Date().toISOString(),
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã bật maintenance (503).');
          this.reload();
        },
        error: (err) => this.message.error(err?.error?.message || 'Không lưu maintenance'),
      });
  }
}

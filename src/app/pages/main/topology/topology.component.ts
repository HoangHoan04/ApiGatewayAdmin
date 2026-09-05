import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GatewayManagementService, ServiceHealthDto } from '../../../core/services/gateway-management.service';

@Component({
  standalone: false,
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss'],
})
export class TopologyComponent implements OnInit {
  loading = false;
  services: ServiceHealthDto[] = [];
  serviceForm = {
    code: '',
    name: '',
    baseUrl: 'http://localhost:5000',
    healthPath: '/health',
    description: '',
  };

  constructor(
    private readonly gatewayService: GatewayManagementService,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadHealth();
  }

  loadHealth(): void {
    this.loading = true;
    this.gatewayService.getServicesHealth().subscribe({
      next: (res) => {
        this.services = res.services || [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  saveService(): void {
    if (!this.serviceForm.code.trim() || !this.serviceForm.baseUrl.trim()) {
      this.message.warning('Nhập code và BaseUrl.');
      return;
    }
    this.gatewayService
      .upsertService({
        code: this.serviceForm.code.trim(),
        name: this.serviceForm.name.trim() || this.serviceForm.code.trim(),
        baseUrl: this.serviceForm.baseUrl.trim(),
        healthPath: this.serviceForm.healthPath || '/health',
        description: this.serviceForm.description,
        isActive: true,
      })
      .subscribe({
        next: () => {
          this.message.success('Đã lưu GatewayService.');
          this.serviceForm.code = '';
          this.serviceForm.name = '';
          this.loadHealth();
        },
        error: (err) => this.message.error(err?.error?.message || 'Không lưu được service'),
      });
  }
}

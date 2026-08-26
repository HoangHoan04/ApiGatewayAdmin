import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private readonly gatewayService: GatewayManagementService,
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
}

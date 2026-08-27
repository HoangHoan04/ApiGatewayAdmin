import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  GatewayManagementService,
  SwaggerDocItemDto,
} from '../../../core/services/gateway-management.service';

@Component({
  standalone: false,
  selector: 'app-api-explorer',
  templateUrl: './api-explorer.component.html',
  styleUrls: ['./api-explorer.component.scss'],
})
export class ApiExplorerComponent implements OnInit {
  loading = false;
  services: SwaggerDocItemDto[] = [];
  filteredServices: SwaggerDocItemDto[] = [];
  selectedService?: SwaggerDocItemDto;
  iframeUrl?: SafeResourceUrl;
  searchKeyword = '';

  constructor(
    private readonly gatewayService: GatewayManagementService,
    private readonly sanitizer: DomSanitizer,
    private readonly message: NzMessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDocs();
  }

  loadDocs(): void {
    this.loading = true;
    this.gatewayService.getSwaggerDocs().subscribe({
      next: (docs) => {
        this.services = docs || [];
        this.applyFilter();
        if (this.services.length > 0) {
          const current = this.services.find(
            (s) => s.serviceKey === this.selectedService?.serviceKey,
          );
          this.selectService(current || this.services[0]);
        }
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
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.searchKeyword.trim()) {
      this.filteredServices = [...this.services];
    } else {
      const kw = this.searchKeyword.toLowerCase().trim();
      this.filteredServices = this.services.filter(
        (s) =>
          s.name.toLowerCase().includes(kw) ||
          s.serviceKey.toLowerCase().includes(kw) ||
          s.baseUrl.toLowerCase().includes(kw) ||
          s.description.toLowerCase().includes(kw),
      );
    }
    this.cdr.markForCheck();
  }

  selectService(svc: SwaggerDocItemDto, scrollToFrame = false): void {
    this.selectedService = svc;

    let targetUrl: string;
    if (svc.serviceKey === 'Gateway') {
      targetUrl = `http://localhost:8000/swagger/index.html?urls.primaryName=${encodeURIComponent('0. API Gateway Management (:8000)')}`;
    } else {
      targetUrl = `http://localhost:8000/swagger/index.html?urls.primaryName=${encodeURIComponent(svc.name + ' (' + svc.baseUrl + ')')}`;
    }

    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(targetUrl);
    this.cdr.markForCheck();

    if (scrollToFrame) {
      setTimeout(() => {
        const el = document.getElementById('swagger-viewer-container');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  getServiceSwaggerLink(svc: SwaggerDocItemDto): string {
    if (svc.serviceKey === 'Gateway') {
      return 'http://localhost:8000/swagger';
    }
    return `${svc.baseUrl}/swagger`;
  }

  copyUrl(svc: SwaggerDocItemDto, event: MouseEvent): void {
    event.stopPropagation();
    const url = this.getServiceSwaggerLink(svc);
    navigator.clipboard.writeText(url);
    this.message.success(`Đã sao chép đường dẫn Swagger: ${url}`);
  }

  getPort(url: string): string {
    try {
      const parsed = new URL(url);
      return parsed.port ? `:${parsed.port}` : '';
    } catch {
      return '';
    }
  }

  getHealthyCount(): number {
    return this.services.filter((s) => s.status === 'HEALTHY').length;
  }
}
